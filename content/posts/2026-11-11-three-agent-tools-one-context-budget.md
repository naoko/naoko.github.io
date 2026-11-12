---
title: "Three Agent Tools, One Context Budget: TokenEconomizer, Trail-Code, humanlayer/skills"
date: 2026-11-11
description: "Three tools landed in my feed inside a week, all pitched as though the job was to pick one. They sit on three different layers, and two of them reach for the same context budget from opposite ends without knowing the other exists. Plus what happened when I pointed one of them at this blog's own CLAUDE.md."
tags: ["ai", "agents", "claude", "coding-agents", "tokens", "context", "knowledge-graph", "mcp"]
categories: ["tech"]
---

Three tools showed up in my feed inside about a week, each with a tidy one-line pitch, and all three arrived framed as though the job was to pick one of them. TokenEconomizer stops your agent burning money on tool definitions it never uses. Trail-Code gives every agent on your team a shared memory. humanlayer/skills turns open-ended chatting into repeatable workflows.

I went and read all three properly, partly because I've [written about this problem before]({{< relref "2026-06-28-cheaper-ai-coding-rtk-codegraph.md" >}}) and partly because the three descriptions didn't sound like they were describing the same *kind* of thing at all.

They aren't. They sit on three different layers, and the thing worth knowing is that two of them are reaching for the same resource from opposite ends.

> ⚠️ **Snapshot warning.** All three repos are young and moving fast. Star counts, thresholds and benchmark numbers below are as of mid-November 2026 and will drift. The usual squint applies to self-published benchmarks, with one wrinkle I'll come back to.

## The three layers

| | [TokenEconomizer](https://github.com/microsoft/TokenEconomizer) | [Trail-Code](https://github.com/trailhq/Trail-Code) | [humanlayer/skills](https://github.com/humanlayer/skills) |
| --- | --- | --- | --- |
| **What it does to context** | Takes things out | Puts things in | Doesn't touch it |
| **Mechanism** | Prunes tool definitions that go unused, optionally injects learned repo facts, redirects stuck turns | tree-sitter map of your code, plus "learnings" committed as markdown and reviewed in the PR | Seven installable skills — research-plan-implement, diagrams, CLAUDE.md rewriting, agentic control loops |
| **Runs** | Local, Python standard library only | Local, no server | Local skill files |
| **License** | Apache-2.0 | MIT | — |
| **Stars (Nov 2026)** | ~5.7k | ~11k | — |

If you read the [graph vs. loop post]({{< relref "2026-08-08-graph-vs-loop-agents.md" >}}), this is the same move I made there. The interesting question about two tools is usually not which one wins, it's whether they're answering the same question at all. Here, two of the three are, and the third is somewhere else entirely — humanlayer/skills shapes which work happens before any context gets assembled, so it can't collide with either of the others.

## Where the pitches are a bit off

**TokenEconomizer is not a pure subtraction layer.** Its micro-skills feature *adds* learned repository facts to your context — a build step that has to run first, a command spelling that actually works — once three sessions have confirmed them. That's off by default, because the thing proposing those facts costs model calls. So the plugin spends model calls on a judge and a proposer in order to save tokens elsewhere. Worth knowing it's a trade rather than a free lunch.

**`/rpi` doesn't force anything.** The pitch I saw made it sound like a rigid pipeline: research, then a PRD, then implementation. It actually offers four paths and you can jump straight to any step. More to the point, `/rpi` is the least interesting thing in that repo. The two skills nobody mentioned — `design-control-loop` and `build-iterated-agentic-loop` — build a repo-local skill plus a scheduled GitHub Actions workflow, framed as sensor, controller and actuator. That's a different way of working rather than a cheaper version of the current one, and it's the only thing in this batch I haven't seen an equivalent of anywhere.

**"Fully local" is true of Trail-Code's map and learnings, and not of its install.** `trail init` writes user-level config — hooks into `~/.claude/settings.json`, MCP config into `~/.claude.json`, plus `~/.codex/`, `~/.pi/` and `~/.gemini/`. Those follow you into every repo you open with that agent, not just the one you ran it in. It also *replaces* the agent selection rather than adding to it, so re-running it with a different `--agents` list quietly strips wiring from the ones you left out.

## The two that pull against each other

Trail-Code installs an MCP server exposing six tools. TokenEconomizer prunes any tool definition that goes unused across ten prompts spanning two sessions, or five sessions of any length, and writes the result as deny rules after an hour of repo idle. Trail-Code also injects its pointers through hooks, which means the agent may rarely need to call those six tools directly — and that's exactly the condition that gets them pruned.

I want to be careful here, because I had this filed as a confident finding until I pushed on it and it got smaller. A deny rule blocks *invocation*. Whether it also drops the definition out of the context window is what decides both the saving and the harm, and I couldn't settle that from the README. A restore command exists and restored tools don't get pruned again, so nothing here is permanent.

What keeps it interesting is which Trail-Code mode is exposed. Its headline 32% cost figure comes from *push* mode, which injects a bundle up front. *Pull* mode is the one that uses those six MCP tools, and it traded away most of the speed to reach 98% correctness — the better accuracy result of the two. So the mode most exposed to pruning is also the mode with the best correctness.

Settling it properly is an afternoon: install both on a scratch repo, run six trivial sessions, wait out the idle timer, then read the settings file and check whether the definitions are still going over the wire. I haven't done it. Until someone does, it's a question rather than a finding, and I'd rather say that than leave a tidy claim standing on nothing.

## About those benchmarks

I've said before that vendor benchmarks measure the case the vendor optimized for, and that still holds. But the two sets here aren't equally thin, and the difference is instructive.

TokenEconomizer's numbers come from an [arXiv preprint](https://arxiv.org/abs/2610.22732): 277 SWE-Bench tasks, six repositories, five agent-and-model combinations, mean cost down 18.4% to 30.9%. Two things make me take it more seriously than usual. The reported costs include the plugin's own judge and proposer calls, so the overhead sits inside the headline rather than beside it. And the authors published a cell that undercuts them: Claude Code with Opus 4.8 came out 30.9% cheaper and scored a point *worse*.

That's mild evidence of good faith rather than proof of anything. One adverse cell out of thirty is also what you report when twenty-nine are favourable, and a one-point delta over 277 tasks is inside noise. And the wrinkle I promised: Microsoft Research and Microsoft Security evaluating a Microsoft plugin is still a vendor evaluation, however many university co-authors are on it. Same squint, applied evenly.

The most useful number in the whole pile is the one that looks worst. On security-auditing benchmarks, where every task starts in a *fresh* repository, the savings fall to between 6% and 20%. That's the mechanism working exactly as advertised: the value comes from repetition inside one codebase. If your days are spent hopping between a dozen services, plan for the bottom of every range anyone quotes you.

## The one I actually ran

`improve-claude-md` rewrites your CLAUDE.md using `<important if="...">` blocks, on the theory that an agent ignores the parts of that file it judges irrelevant, so you should mark which parts apply when. That seemed sensible and cheap, so I pointed it at this blog's CLAUDE.md.

The restructure was good. The gates it produced were not, in a way I'd have missed if I hadn't read them one at a time.

Two of the six conditions gated an unconditional rule behind a trigger that presupposes the rule. The build-before-committing instruction ended up inside `if="you need to build or check the site before committing"` — so an agent that doesn't already know it should build will never open the block that tells it to. The same thing happened to "read these two posts before drafting," which is the single most valuable line in my file: it went behind `if="you are drafting a post and need to match Naoko's voice"`, which only fires if the agent already knows it needs to match my voice.

Both are circular, both look completely reasonable in a diff, and neither is the tool being broken exactly — the skill's own instructions also tell it to delete style guidelines as "linter territory," which would have gutted the entire writing-style section of a blog repo if I'd let it. That rule makes sense for a code repo. It makes none here.

So: useful tool, and its output needs a condition-by-condition read before it lands. Which is a sentence I could probably write about most of this category.

## So what would I adopt?

For a one-person blog repo, none of it urgently. The savings scale with repetition in a codebase and my repetition lives in a different kind of work.

For a team, roughly in this order. `improve-claude-md` first, because it's a file in git you can revert and it takes ten minutes — with the gate review above. TokenEconomizer next, on defaults, on whichever repo you live in most, since that's where pruning has anything to prune. Trail-Code third and in personal mode, with the narrow question of whether its call-edge map beats whatever graph you already have — mine is [graphify]({{< relref "2026-07-30-coding-agent-memory-graphify-okf.md" >}}), and the honest answer is that a deterministic call graph and an LLM-built knowledge graph overlap without being the same artifact, so that one wants a test rather than an argument. The control-loop skills as a separate experiment with a separate owner, because they're the only thing here that changes the shape of the work.

And the thing I'd skip is adopting two process layers at once. If you already have a workflow setup your team knows, a second one doesn't add capability, it adds a coin flip about which to invoke.

What I keep noticing across all three is the same bet, and it's the one I've been circling [all year]({{< relref "2026-07-18-coding-agent-adoption-ladder.md" >}}): the expensive thing was never the thinking, it's that every session starts from nothing. All three are selling some version of persistence. The evidence says that's worth real money — as long as you keep coming back to the same codebase, which is a condition the pitches tend to leave out.

Thanks to whoever keeps sending me these before I have time to read them properly. Cheers to tools that survive being read twice. 🥂
