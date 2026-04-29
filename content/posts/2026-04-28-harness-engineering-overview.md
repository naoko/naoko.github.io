---
title: "The Harness Engineering Cheat Sheet"
date: 2026-04-28
description: "A quick comparative tour through how OpenAI, Anthropic, Google, Microsoft, Shopify, and Stripe each approach the same problem: keeping coding agents on the rails."
tags: ["ai", "agents", "claude", "coding-agents", "harness", "infrastructure", "agentops"]
categories: ["software"]
cover:
  image: "/images/2026-04-28/cover.png"
  alt: "Decision tree: ship code with AI agents vs. build an agent application — branching into Claude Code, Codex, Cursor, OpenAI Symphony, Stripe Minions, Shopify Roast, Google ADK, Microsoft Agent Framework, and AgentOS"
  relative: false
---

# The Harness Engineering Cheat Sheet

I have a Cursor problem. Or maybe an "agent session" problem more generally — I keep five or six chats open, each with its own slice of context, each in a slightly different state. We have nice skills. We have nice tools to fetch the right context. We have a code-review skill that drops inline comments on a PR. But I still lose track of which window is doing what, and occasionally paste the wrong thing into the wrong session.

Then I read OpenAI's [Symphony post](https://openai.com/index/open-source-codex-orchestration-symphony/) and the words for it clicked: this is a *harness* problem, not a model problem. So I went and read what everyone else is shipping. These are my notes.

> ⚠️ **Snapshot warning.** This space is moving fast enough that anything written here is probably wrong somewhere by next month. [Microsoft Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) went GA on April 3, 2026. [OpenAI Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) was open-sourced in early March 2026. Stripe published [Part 2 of the Minions writeup](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) in February 2026. If you're reading this more than a few months out, double-check the current state before making decisions.

## What's a "harness"?

A harness is the scaffolding around an LLM that turns it from an interesting demo into a production tool — the workspace setup, the tool permissions, the test loops, the issue‑tracker integration, the proof‑of‑work validation. OpenAI's Symphony docs put the bar concretely: your codebase needs hermetic testing, machine‑readable docs, and a modular architecture before agents can do confident work.

It's the boring infrastructure question hiding under all the agentic AI hype. And honestly, anyone who has built a Step Functions pipeline already has the right instincts: figure out the deterministic parts, figure out the non‑deterministic parts, and design the handoff.

## TL;DR — which one should I care about?

The cover image up top is the short answer. The real fork is whether you're shipping code *with* AI agents, or building an agent application that does something else entirely. Coding agents are a different problem than general agent apps, and the tooling has split accordingly. Once you know which side you're on, the rest is mostly stack preference.

## The current landscape

| Organization | Harness / Framework | Primary Language | Philosophy |
| --- | --- | --- | --- |
| OpenAI | [Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) | Elixir (BEAM), spec‑driven | Fault‑tolerant orchestration; every issue tracker ticket becomes an isolated implementation run. |
| Shopify | [Roast](https://github.com/Shopify/roast) | Ruby DSL (was YAML pre‑1.0) | Convention over configuration; interleave deterministic steps with agentic ones. |
| Google | [Agent Development Kit (ADK)](https://google.github.io/adk-docs/) | Python, TypeScript, Go, Java | Code‑first, model‑agnostic, Vertex / Agent Platform–integrated. Strong context management. |
| Anthropic | [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | TypeScript / Node | High‑precision iterative reasoning loops; SKILL.md, CLAUDE.md, hooks, MCP. |
| Microsoft | [Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) | .NET, Python | Successor to AutoGen + Semantic Kernel; standardized patterns including Magentic‑One. |
| Stripe | [Minions](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) | Fork of [Block's Goose](https://github.com/block/goose) | Blueprint workflows mixing deterministic and agentic nodes; ~1,300 unattended PRs/week. |

## A few observations

**Symphony is unusual in its language choice and unusual in its scope.** Picking Elixir/BEAM for the reference implementation is a flex — OpenAI is explicitly saying *we want supervision trees, fault tolerance, and process isolation as a language feature, not something you reimplement in Python*. They also cleverly punted on lock‑in: the actual product is `SPEC.md`. They had Codex implement Symphony in TypeScript, Go, Rust, Java, and Python to stress‑test the spec.

**Roast and Symphony point at the same idea from opposite ends.** Roast says: define a deterministic workflow, hand off to Claude Code when you need agentic flexibility. Symphony says: let the agent run, but isolate the work, watch the proof, and supervise the process. Both are admitting that pure agentic autonomy is brittle and pure determinism is too narrow.

**Stripe Minions is the production case study everyone cites.** ~1,300 unattended PRs per week, on top of a Ruby/Sorbet codebase that moves over $1T in payments. The interesting design decisions are the constraints: a hard cap on retries, curated tool subsets per task, blueprint workflows that explicitly separate deterministic nodes from agentic ones, and one‑shot agents over multi‑turn loops for well‑defined work. Notably, it's a fork of Block's Goose, customized for Stripe's stack — a reminder that even at this scale, "build vs. fork" can land on fork.

**Microsoft and Google are playing the enterprise long game.** Both ADK and Agent Framework 1.0 emphasize multi‑language SDKs, observability, governance hooks, and protocol interop (MCP for tools, A2A for agent‑to‑agent). If you're an enterprise architect being told to "have a strategy for AI agents," these are the boxes that get checked. Microsoft's framework consolidated AutoGen and Semantic Kernel into one production‑ready 1.0 earlier this month; Google's ADK plugs straight into Vertex / Agent Platform with managed runtime, sessions, and a Memory Bank.

**Claude Code is the harness that's also a building block.** It shows up *inside* other harnesses. Roast's CodingAgent tool is `claude` under the hood. Symphony works fine with Claude Code as the agent. ADK's tutorials list it as an option alongside Gemini CLI and Codex. That's a different distribution strategy: be the inner loop everyone else builds around.

## The patterns that keep showing up

If you squint at all six, the same primitives recur.

**1. Isolated workspaces.** Per‑task git checkouts, sandboxed filesystems, ephemeral environments. Symphony spawns a workspace per ticket. Minions gives each agent its own cloud machine in under ten seconds. The agent‑friendly version of "make your build hermetic."

**2. Deterministic + agentic interleaving.** Roast's Ruby DSL steps. Minions' blueprints. Microsoft's graph workflows mixing rule‑based nodes with agent calls. Nobody trusts pure LLM loops; everybody wants the option to drop into deterministic code at any node.

**3. Proof of work before merge.** Tests, lint, type check, CI, sometimes a screen‑recording walkthrough (Symphony actually requires this). The agent can't claim done — the harness verifies it.

**4. Hard failure budgets.** Stripe caps Minions at two pushes before handing back to a human. Symphony caps turns. The harness knows when to give up; the model on its own doesn't.

## Where does AgentOS fit?

A harness is the scaffolding around *one agent doing one task well*. AgentOS is the platform for *running fleets of agents as production services*. Same way a state machine definition isn't the same thing as the runtime that hosts it.

The term is getting overloaded in 2026. Two things actually go by the name:

- **[Agno's AgentOS](https://github.com/agno-agi/agno)** — a stateless FastAPI runtime that exposes agents, teams, and workflows as APIs, with per-user/per-session isolation and a control plane UI. It also exposes itself as an MCP server, so other agents can use its agents as tools. ~39k GitHub stars.
- **The academic angle** — the [1st Workshop on Operating Systems Design for AI Agents](https://os-for-agent.github.io/) ran at ASPLOS 2026 in Pittsburgh in March. That's the long-horizon "what if Linux had first-class agent processes" research direction.

**The mental model that probably maps to your Step Functions / SageMaker instincts:** harness ≈ a state machine definition for one ML pipeline run. AgentOS ≈ the SageMaker / EKS that hosts many of those as services, with multi-tenancy, observability, and a control plane. You reach for a harness when you're *building the agent*. You reach for an AgentOS when you're *operating a portfolio of agents*.

## The takeaway

What's fun about this list is that it makes harness engineering feel like a *real discipline* now, not a vibe. Pick any of these six, look at what they have in common, and you basically have a checklist for building your own internal one.

If you're already comfortable thinking in Step Functions, Airflow DAGs, or any other workflow orchestrator, the muscle memory transfers cleanly. The new part isn't the orchestration — it's deciding which nodes get to be non‑deterministic, and how much rope you give them before the harness yanks them back.

As for my five Cursor windows: still five Cursor windows. But I now know what I'm actually missing.
