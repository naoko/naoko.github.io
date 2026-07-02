---
title: "Two Ways to Stop Your Coding Agent Burning Tokens: RTK and CodeGraph"
date: 2026-06-28
description: "Two open-source tools both hit ~60k GitHub stars in five months by attacking the same problem from opposite ends: AI coding agents spend most of their tokens on plumbing, not thinking. RTK compresses the output; CodeGraph eliminates the discovery."
tags: ["ai", "agents", "claude", "coding-agents", "tokens", "rust", "knowledge-graph", "mcp"]
categories: ["tech"]
---

I keep a few Claude Code and Cursor sessions running through the day, and at some point I started actually watching the token counter instead of ignoring it. The thing that struck me wasn't how *much* it climbed. It was *what* it climbed on. Most of the budget wasn't going on the model reasoning about my problem. It was going on plumbing: `ls`, `grep`, reading the same file three times to rebuild a call path, scrolling a 400-line `cargo test` dump to find the one assertion that failed.

That's the dirty secret of agentic coding. The expensive part isn't the thinking. It's the *finding out*, plus the *noise on the way back*.

Two open-source projects went semi-viral this spring solving exactly this, and they're interesting precisely because they attack opposite ends of the same pipe. Both went from a first commit earlier this year to north of 50,000 GitHub stars apiece by June — the READMEs embed star-history charts if you want to see the curve. That's not nothing, so I went and read both.

> ⚠️ **Snapshot warning.** Both repos are weeks old and moving fast. Star counts, benchmark numbers, and supported-tool lists below are as of late June 2026 and will drift. Both projects publish their own benchmarks, so always read those with a healthy squint (vendor benchmarks measure the case the vendor optimized for). Re-check before you make a decision on either.

## The two ends of the pipe

| | [CodeGraph](https://github.com/colbymchenry/codegraph) | [RTK](https://github.com/rtk-ai/rtk) |
| --- | --- | --- |
| **What it trims** | The *input* side (discovery) | The *output* side (command noise) |
| **Mechanism** | Pre-built knowledge graph of your code, served over MCP | CLI proxy that compresses command output before it hits context |
| **The agent stops…** | crawling files to figure out structure | drowning in raw `git`/test/`ls` output |
| **Built in** | TypeScript, SQLite + tree-sitter | Rust, single zero-dependency binary |
| **Runs** | 100% local, MCP server | 100% local, bash hook / plugin |
| **License** | MIT | Apache-2.0 |
| **Stars (Jun 2026)** | ~56k | ~67k |

The key thing: **these are not competitors.** One shrinks what the agent has to read to *understand* your codebase. The other shrinks what comes *back* when it runs a command. You can run both, and probably should.

## CodeGraph: stop the agent crawling files

When an agent needs to understand code to answer a question or make a change, it discovers structure the slow way: `grep`, `glob`, `Read`, one file at a time, rebuilding call paths and dependencies by hand. That's a pile of tool calls and round-trips *before it even starts the real work*.

CodeGraph pre-builds the map. The pipeline is refreshingly un-magical:

1. **Extract.** Tree-sitter parses your source into ASTs; language-specific queries pull out symbols (functions, classes, methods) and edges (calls, imports, inheritance). It ships grammars for 20+ languages — TS/JS, Python, Go, Rust, Java, C#, Swift, Kotlin, Ruby, C/C++, and more — so this isn't a two-language toy.
2. **Store.** Everything lands in a local SQLite database with FTS5 full-text search, in a `.codegraph/` directory in your project.
3. **Resolve & sync.** A post-pass wires up cross-file references and class hierarchies, and a native file watcher (FSEvents/inotify) does debounced incremental updates as you type.

Then it exposes a single MCP tool *by default*, `codegraph_explore`, that hands the agent the exact code it asked for in a single call: the relevant source grouped by file, the call paths between symbols *including dynamic-dispatch hops that grep can't follow*, and the blast radius of a change. Surgical context instead of a file-by-file search. (Seven finer-grained tools — `codegraph_search`, `codegraph_callers`, `codegraph_callees`, `codegraph_impact`, `codegraph_node`, `codegraph_files`, `codegraph_status` — ship alongside it but stay hidden unless you set `CODEGRAPH_MCP_TOOLS`, on the maintainer's theory that one strong tool steers an agent better than a menu of narrow ones. It's a deliberate design choice, not a missing feature.)

The benchmark (their methodology: `claude -p` on Claude Opus 4.8, headless, with vs. without the MCP server, 4 runs per arm, median reported):

| Codebase | Language | Tool calls | File reads | Tokens | Cost |
| --- | --- | --- | --- | --- | --- |
| VS Code | TS · ~10k files | 81% fewer | 0 vs 9 | 64% fewer | 18% cheaper |
| Django | Python · ~3k | 77% fewer | 0 vs 9 | 60% fewer | 8% cheaper |
| Alamofire | Swift · ~110 | 58% fewer | 0 vs 9 | 64% fewer | 40% cheaper |
| Tokio | Rust · ~790 | 57% fewer | 0 vs 8 | 38% fewer | even |
| OkHttp | Java · ~645 | 50% fewer | 0 vs 4 | 54% fewer | 25% cheaper |
| Gin | Go · ~110 | 44% fewer | 1 vs 6 | 23% fewer | 19% cheaper |
| Excalidraw | TS · ~640 | 40% fewer | 0 vs 7 | 25% fewer | even |

The fair read on this, and to their credit the project says so itself, is that the **reliable** win is the left side of the table: fewer tool calls, near-zero file reads, faster answers, on every repo regardless of size. The **token and dollar** savings on the right are real but *scale-dependent*. On a 500-file project they're small and noisy run-to-run; they only compound into a real line item once you're at monorepo scale multiplied by a whole team's daily usage. So: adopt it for the speed and precision now, and the cost savings show up when the codebase (and the team) gets big.

Two more things to hold in mind reading that table. First, it's *one architecture-comprehension question per repo* — a narrow task family, not a spread of real edit-and-test work. Second, and more interesting: the maintainer notes these Opus 4.8 numbers came in *lower* than the earlier Opus 4.7 run. That's not a CodeGraph regression — it's a stronger baseline. Opus 4.8 greps and reads efficiently on the main thread instead of fanning out into big discovery sweeps, so it needed the graph less. Which means the gap this tool closes will keep *shrinking* as the models themselves get better at discovery — a genuinely double-edged wrinkle for a tool whose whole pitch is discovery, and one that says more about where this is all heading than any single row in the table.

Setup is quick. Install the CLI — the headline path is now a no-Node.js installer (`curl -fsSL …/install.sh | sh`), or `npm i -g @colbymchenry/codegraph` if you'd rather — then `codegraph install` to wire up your agent and `codegraph init` per project to build the graph. After that it's transparent: the agent uses the tools whenever a `.codegraph/` exists. (That directory is a rebuildable local index, so `.gitignore` it.)

## RTK: stop the agent drowning in output

RTK, short for "Rust Token Killer," comes at it from the other side. It doesn't care how the agent finds things; it cares about the *wall of text* that comes back when it runs a command. A raw `git status`, a full `cargo test` run, an `ls -la` of a fat directory: these are mostly noise, and every byte of that noise is a token.

It's a single Rust binary that sits as a proxy in front of common dev commands and compresses their output before it reaches the model, using four tactics: smart filtering (strip comments/whitespace/boilerplate), grouping (aggregate files by directory, errors by type), truncation (keep the relevant bit, drop the rest), and deduplication (collapse repeated log lines to a count).

The clever bit is delivery. An **auto-rewrite hook** transparently rewrites the agent's bash calls, so `git status` silently becomes `rtk git status` and you don't change how you work. And a "tee" feature stashes the full unfiltered output when a command *fails*, so the agent can pull the complete error context without re-running anything.

Their self-reported savings for a 30-minute Claude Code session:

| Operation | Standard | RTK | Savings |
| --- | --- | --- | --- |
| `git add/commit/push` | 1,600 | 120 | −92% |
| `cargo test` / `npm test` | 25,000 | 2,500 | −90% |
| `pytest` / `go test` | 8,000 / 6,000 | 800 / 600 | −90% |
| `ls` / `tree` | 2,000 | 400 | −80% |
| `grep` / `rg` | 16,000 | 3,200 | −80% |
| `git status` / `git log` | 3,000 / 2,500 | 600 / 500 | −80% |
| `cat` / `read` | 40,000 | 12,000 | −70% |
| **Total** | **~118,000** | **~23,900** | **−80%** |

Take the total with the usual salt. It's an estimate on a medium TypeScript/Rust project, and your command mix will differ. But the *shape* is right. Test runners and verbose `git` plumbing are pure noise to a model that just wants the one failing assertion, and that's exactly where the cuts are deepest.

There's one caveat that matters more than the salt on the total, and it's the single most important thing to know before you install RTK: **the hook only rewrites `Bash` tool calls.** Claude Code's native `Read`, `Grep`, and `Glob` tools don't pass through it, so they're never auto-compressed. That's a big deal, because two of the fattest lines in that table — `cat`/`read` (−70%) and `grep` (−80%) — only materialize when the agent reaches for the *shell* versions rather than its built-in tools (or when you call `rtk read` / `rtk grep` / `rtk find` explicitly). Since Claude Code leans hard on native Read/Grep, real-world savings land meaningfully below the headline unless your agent is shell-heavy. Worth watching your own counter rather than trusting the total.

It ships specialized filters for 100+ commands (test runners, linters, Docker/k8s, AWS CLI, package managers), claims sub-10ms overhead, passes unrecognized commands through untouched, and has `rtk gain` / `rtk discover` to show you what you're saving and what you're missing. Install via Homebrew (`brew install rtk`), the install script, or `cargo install --git https://github.com/rtk-ai/rtk` — note the `--git`, because a *different* project called `rtk` (Rust Type Kit) squats the name on crates.io, and a plain `cargo install rtk` fetches the wrong binary. Then `rtk init -g` wires up the Claude Code hook.

## Why both of these caught fire

Step back and the two projects are making the same bet, and it's a bet I think is correct: **the next round of cost savings in AI coding isn't a smarter model, it's better engineering around the model.** We spent 2025 assuming the answer to everything was a bigger context window and a more capable model. These tools are the counter-argument: most of the context an agent consumes is *self-inflicted*, whether that's discovery it didn't need to redo or output it didn't need to see in full.

There's a nice symmetry in *where* they intervene:

- **CodeGraph** is a deterministic index. It replaces probabilistic file-crawling with an exact lookup, so call graphs are answers, not leads. Its cost is an upfront build and a `.codegraph/` directory to keep in sync.
- **RTK** is a deterministic filter. It replaces "dump everything and let the model sift" with "show the model the part that matters." Its cost is trusting the filter not to drop the line you needed, which the tee-on-failure escape hatch is there to mitigate.

Both are 100% local, which matters more than it sounds. Plenty of "code intelligence" products want to ship your source to a cloud index. Both of these keep everything on your machine: no API keys, no source egress. The one asterisk: RTK ships an opt-in telemetry system — off by default, and it asks for explicit consent during `rtk init` — so the precise framing is "no telemetry unless you say yes," not "none at all." (Its tee-on-failure output also lands on local disk, not a server.) For anyone working in a codebase they can't send to a third party, both still clear the bar that matters.

## So which one?

If I had to pick an order: **CodeGraph first if you work in a big, tangled codebase** and your agent visibly thrashes around discovering structure, because that's the thrash it kills. **RTK first if your workflow is command-heavy** (lots of test runs, builds, git churn), because that's where the output noise piles up. And really, they compose cleanly enough that on a serious project I'd just run both: one trims what goes in, the other trims what comes back.

The caveat for both is the same: they're young, the benchmarks are self-published, and a filter or an index is only as good as its coverage of *your* stack. Try them on a real task, watch your own token counter, and trust that over anyone's table, mine included.

One adoption note worth keeping your eyes open on: both projects are quietly commercializing. CodeGraph has a hosted platform in beta at [getcodegraph.com](https://getcodegraph.com), and RTK teases a cloud tier. The open-source cores are genuinely useful and genuinely free — they're also the on-ramp to paid products, which is worth knowing before a whole team builds a workflow on top of either.

What I like most is what they represent. For a year the entire conversation was "which model is smartest." These two repos, well over 100k stars between them, are a quiet vote for a different question: *how little can we make the smart model read?* Turns out the answer is "a lot less than it currently does."

Cheers to leaner, cheaper, AI-assisted coding! 🥂
