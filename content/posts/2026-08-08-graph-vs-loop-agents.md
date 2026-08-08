---
title: "Graph vs. Loop: Not a Fight, Two Different Layers"
date: 2026-08-08
description: "The 'goodbye loops, hello graphs' posts made me wonder whether graph engineering replaces the orchestrator/planner/coder/reviewer setup I'd already written about. It doesn't. One says who does the work, the other says how control and state move between them."
tags: ["ai", "agents", "claude", "coding-agents", "harness", "langgraph", "orchestration"]
categories: ["tech"]
---

A "graph engineering just changed how AI agents work — goodbye loops" post landed in my feed, and my first reaction was suspicion of the useful kind: *wait, is this different from the orchestrator/planner/coder/reviewer setup I already wrote about in the [harness cheat sheet]({{< relref "2026-04-28-harness-engineering-overview.md" >}})?*

Short answer: it's not a competing architecture. It's a different layer.

- **Orchestrator–worker** (planner, coder, reviewer) answers **who does the work** — the role topology.
- **Graph engineering** answers **how control and state move between them** — the execution model.

You can run planner/coder/reviewer as an unconstrained loop, or as a graph. Same cast, different wiring. Nobody has to lose.

> ⚠️ **Snapshot warning.** This one is barely three weeks old as I write, and the terminology is still being argued over. Take the vocabulary as of early August 2026 and expect it to drift.

## Where the term came from (this part is funny)

Not a paper. Not a launch. On July 18, 2026, Peter Steinberger — who built OpenClaw, and who had posted the *loop* engineering take back in June — [asked out loud](https://x.com/sairahul1/status/2078543826013081939): "Are we still talking loops or did we shift to graphs yet?"

It was a joke about how fast this field renames things. It did 2.6 million views, and by the end of the week "graph engineering" had a dozen explainers and a Medium think-piece declaring loops dead.

So the honest framing is: the *word* is new, the *thing* is not. Zach Tratar's [reply](https://x.com/zachtratar/status/2081530269044298084) — "it's just a workflow, this has been the design of all AI workflow builders for the past ~2 years" — is basically correct, and worth holding onto while you read anything with "changed everything" in the title.

But a joke goes viral when it points at something real, and this one does.

## What's actually underneath

The naive setup is one orchestrator LLM in a `while True`, reading the coder's and the reviewer's output and deciding what happens next by vibes. It works for short tasks and fails the same three ways at scale: it ping-pongs forever when coder and reviewer disagree, the history bloats until the model drifts, and there's no place to stand when you want to say *stop* or *roll back*.

The graph version makes the control flow a declared object instead of an emergent one. Nodes are steps, edges are conditions, state is a typed schema everything reads and writes:

```text
[ input ] → Planner → Coder → Test ──pass──→ [ output ]
               ↑         ↑       │
               │         └──fail─┘
               │                 │
               └──── rejected ×3 ┴──→ [ human ]
```

The bit that matters isn't the picture. It's the `×3`.

| | Orchestrator–worker | Graph engineering |
| --- | --- | --- |
| **Answers** | Who does the work | How control and state move |
| **Next step decided by** | An LLM, in prose | An edge condition, in code |
| **On failure** | Orchestrator notices (maybe) and re-prompts | Routes to fallback or human by rule |
| **Concurrency** | Sequential by construction | Fan out, then join |
| **Layer** | Org chart | Execution engine |

## Three corrections to how it usually gets explained

**It's not a DAG.** Half the explainers say "directed *acyclic* graph," which would mean no retries at all. [LangGraph](https://langchain-ai.github.io/langgraph/) — the reference implementation everyone points at — explicitly supports cycles. The point was never to remove the loop. It's to make the loop an edge with a counter on it instead of an LLM's judgment call.

**"Goodbye loops" is the wrong headline.** Loops don't die, they get a budget. Which is exactly what the production harnesses were already doing before the word existed: Stripe caps Minions at two pushes before handing back to a human, Symphony caps turns. Same idea, older name.

**The under-sold win is concurrency, not guardrails.** Every explainer leads with determinism, but the thing a loop structurally *cannot* do is fan out. A loop reviews sequentially — security, then performance, then style. A graph dispatches three reviewers at once and joins. Wall-clock time collapses from three cycles to one. That's a real capability difference, not a discipline difference, and it's the argument I'd actually lead with.

## Do you need one?

Mostly, no — and it's the same test as everything else on this blog.

If your agent's job is one task with a verifier attached — write code, run tests, fix, repeat — a bounded loop with a hard retry cap is the right shape, and adding a graph framework buys you ceremony. That covers most coding-agent work.

Reach for an explicit graph when you have **branching that isn't just retry** (different failure classes routing to different handlers), **parallel work to join**, **state worth persisting** across a crash or an approval pause, or **a human gate** in the middle. Those are the four things a `while` loop makes you hand-roll badly.

Which means for me, today: still loops, with caps. My five sessions aren't a graph problem yet. But I now have a cleaner way to say what the harness patterns were always about — the interesting decision was never *loop or graph*, it's **which nodes get to be non-deterministic, and how much rope they get before something yanks them back**.

The rest is renaming, and we're very fast at that. 🥂
