---
title: "The Coding-Agent Adoption Ladder (and How to Climb It)"
date: 2026-07-18
description: "Most of us aren't at a clean 'level' with AI coding agents; we're wedged between two. A field guide to the rungs and what actually changes as you climb: from pasting snippets into a chat box to running isolated, reviewed, token-lean agents you delegate from Slack."
tags: ["ai", "agents", "claude", "coding-agents", "adoption", "skills", "claude-tag", "worktree", "tokens"]
categories: ["tech"]
---

Boris Cherny, who built Claude Code, published [Steps of AI Adoption](https://x.com/bcherny/status/2077929379661844559) this week: five steps he keeps watching teams climb. I did what everyone does with a maturity ladder and tried to find myself on it. The answer was messy: partially step 2, partially step 3, one foot on each. (The rung names below are my own gloss on his five steps.)

That's the norm. Most devs I know sit somewhere across rungs 1 to 3, rarely on one clean step. So here's the ladder, and what actually changes as you climb, with most of the attention on the 2-to-3 jump where the leverage is.

> ⚠️ **Snapshot warning.** Names and dates move fast here. Claude Tag's rollout date below is as of July 2026 and will drift. Re-check before deciding anything specific.

## The ladder, in one table

| Rung | What you're doing | What's driving | The tell |
| --- | --- | --- | --- |
| **0: Autocomplete** | Tab-completion, paste snippets into a chat | You, entirely | The agent has no idea what your repo is |
| **1: Single-shot agent** | One task, one repo, one session; you paste in context | You drive, it edits | You're still copy-pasting file contents into the prompt |
| **2: Configured agent** | It pulls its own context (files, docs, Jira); you use plan mode and custom commands | Shared: you steer, it fetches | You wrote a `CLAUDE.md` and wired up MCP |
| **3: Engineered workflow** | Parallel isolated sessions, token-lean context, automatic review gates | The *harness* drives; you supervise | You stopped watching it type and started watching the PR |
| **4: Fleet** | Many agents unattended, orchestrated, with failure budgets | Orchestration; you set policy | You measure PRs-per-week, not sessions |

The interesting boundary, the one I was straddling and suspect you are too, is **between 2 and 3**: where it stops being a smarter autocomplete you babysit and becomes a thing you hand work to and verify. Most of this post lives there.

## Rungs 0 and 1 are last year

Autocomplete, chat, one babysat session, pasting file contents into a prompt so the model can "see" them. If that's still your daily loop in mid-2026, take this as the nudge: the leverage has moved on. Wire up a `CLAUDE.md`, let the agent pull its own context, and get yourself to rung 2. Everything interesting happens above it.

## Rung 2: it fetches its own context

The jump to 2 is when you stop being the context courier. Two things flip:

- **The agent pulls its own context:** it reads the files it needs, and via MCP pulls in the surrounding material (design docs, a Jira ticket, the linked PR). You give it a task and a pointer, not a pre-digested packet.
- **You've configured it:** a `CLAUDE.md`, some custom commands, plan mode so it decomposes a goal before touching code.

Plenty of productive people are parked here, comfortably. If you let agents pull docs and tickets and use plan mode to break work down (even without a literal `/goal` command; that decomposition is just what good models do now), you're solidly at 2.

## Rung 3: the harness starts doing the work

Level 3 is where it stops being about the model and starts being about the *engineering around* it: the harness, which I [wrote about earlier this year]({{< relref "2026-04-28-harness-engineering-overview.md" >}}). Four practices mark the rung, in any order.

### Worktree isolation

Each agent gets its **own git worktree**: a separate branch checked out on disk, sharing one repo history. Run five sessions in parallel and they stop clobbering each other's files. It's the biggest quality-of-life win here, and the one people reach for first because the pain it kills (sessions trampling each other) is so loud.

### Token-lean context: break up your CLAUDE.md into lazy skills

The least glamorous practice, and the one most people skip. **Everything in `CLAUDE.md` loads on every session, every turn.** It always grows, and it silently taxes every conversation; people have measured theirs eating tens of thousands of tokens before the agent reads a line of code.

Two moves fix it:

1. **Slim `CLAUDE.md`** to what's needed ~80% of the time: package manager, test/build commands, repo layout, core constraints, forbidden patterns, naming.
2. **Move the rest into "lazy" [Skills](https://code.claude.com/docs/en/skills).** A skill loads lazily: at session start only its name and one-line description sit in context (30 to 100 tokens); the full `SKILL.md` loads only when the agent judges it relevant.

Documented refactors cut always-loaded overhead from ~42k tokens to ~2k (about 94%). Same bet as [RTK and CodeGraph]({{< relref "2026-06-28-cheaper-ai-coding-rtk-codegraph.md" >}}): trim what you always send, not the model size.

There's even a package-manager layer forming for this: [`find-skills`](https://www.skills.sh/vercel-labs/skills/find-skills) lets an agent discover and `npx skills add` community skills. Handy, but vet what you install; a skill is instructions your agent will run.

### Automatic code and security review

At level 2 you review the diff yourself. At level 3 the harness reviews first, in a fresh session with no attachment to the code it just wrote. Wire it at the **PR boundary**, not as a CLAUDE.md instruction the agent may skip: a GitHub Action ([`claude-code-security-review`](https://github.com/anthropics/claude-code-security-review)) or Cursor's [Bugbot](https://cursor.com/bugbot) runs on every PR and leaves inline comments. A gate only works if it doesn't depend on the agent remembering.

### Delegation surfaces

The last marker is *where you launch work from*. Instead of starting every task in your terminal, you `@mention` an agent in a Slack thread; it spins up an isolated background run, reads the thread for context, writes code, and opens a PR. Two branded versions of the same primitive:

- **Claude Tag** (`@Claude`) spins up a Claude Code session against your repo and opens a PR via the GitHub app. From **August 3, 2026** it becomes a *shared org identity*, admin-configured, so the whole team steers one agent instead of everyone running under their own account.
- **Cursor in Slack** (`@Cursor`) launches a background agent in an isolated VM, reads the thread, and opens a PR the same way.

It matters because it moves the launch point from *your terminal* to *where the team already talks*. You delegate rather than drive. That's level 3 in one feature, and it's vendor-agnostic: pick your agent.

## Rung 4: fleets

Many agents running unattended, orchestrated, with failure budgets and required proof-of-work: Stripe's ~1,300 unattended PRs a week, OpenAI's Symphony spawning a run per ticket ([more here]({{< relref "2026-04-28-harness-engineering-overview.md" >}})). It's an organizational investment, not a habit you pick up on a Tuesday. If you're an individual dev wondering whether you're at 4, you're not, and that's fine.

## A habit worth dropping: reading the thinking

A rung-1 comfort habit that quietly holds people back (I had it too): you watch the *thinking* stream by because it helps you see what's being built and sometimes catch things. It feels like diligence. But the thinking is a scratchpad the model writes to reach a better answer, **not a faithful account of why it did what it did.** Anthropic [tested this](https://www.anthropic.com/research/reasoning-models-dont-say-think): they slipped a model a hint, watched it use the hint, then checked whether the trace admitted it. Claude owned up only ~41% of the time. So a clean trace is false reassurance and a messy one is a false alarm. You're auditing a story, not the computation.

What can't mislead you that way: the plan (plan mode is the place to understand and intervene *before* the build) and the diff, tests, and review *after* (the diff simply **is** what the agent did). Reading a token stream also doesn't scale to rung 3: it's O(n) on your attention across parallel sessions, and if "I read the thinking" is your quality control, you can't delegate. Keep the trace as a *debugging* tool for when a run surprises you; drop it as a reflex on healthy work.

## So where are you, really?

Don't claim one number. Run the checklist:

- Still pasting file contents into prompts? Unfinished business at **rung 1**. Free leverage.
- Agent pulls its own docs and tickets, you use plan mode? **Rung 2**, solidly.
- Worktree isolation, review gates, delegating from Slack? Reaching into **rung 3**.
- Lean `CLAUDE.md` and lazy skills? That's the rung-3 practice almost everyone skips, and the cheapest win on the table.

The pattern I keep seeing (myself included): the *visible* level-3 practices get adopted first (worktree isolation, because the pain is loud) and the *invisible* one gets skipped (token-lean context, because nobody's yelling about it). That's backwards; the invisible one pays out on every turn.

Find which rung each habit is on, then go do the one boring thing you've been avoiding. Mine was breaking up a very fat `CLAUDE.md`. 🥂
