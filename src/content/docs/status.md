---
title: Status
description: Current state of the GameBoyGhost project — the three layers and where each stands.
---

# Status

GameBoyGhost is one system at **three layers**:

> **B decides and accounts, C gates and seals, A proposes learned behaviour.**

| Layer | What it does | Where it lives |
|---|---|---|
| **B — the appliance** | governance, one-shot controlled execution, the local-model runtime | Studio (`GameBoyGhost-Lab`) |
| **C — the segments** | sealed gates, the oracle, the learned student, the card loop | `segments` repo — **this site documents C** |
| **A — learned behaviour** | imitation/RL policies, navigation, the trajectory dataset | `github.com/foxmedik/GameBoyGhost` |

## Current state

| Piece | Status |
|---|---|
| S1 gate | **SEALED** — 294/294 |
| S2 gate | **SEALED** — 294/294 |
| S3 oracle | **certified 250/250** (6 prefix-failure residues excluded: 59, 87, 106, 116, 139, 213) |
| S3 student | **certified 250/250** — trained on 186 residues, held out 64, 6 prefix-failures excluded |
| Card loop | live and honestly gated (`mbcard` deliverable gate + `verifier_set` + judge) |

The learned S3 student is a faithful, independently-verified reproduction of the
oracle's S3 behaviour: it reaches `DONE:E3` on all 250 qualified residues, with the
same 6 prefix-failures the oracle itself had. It is a distillation of the oracle,
not a novel capability — later segments (S4+) are where the interesting research
question (exceeding the oracle) lives.

## How the work happens

Each unit of work is a **card** that runs through the Mother Base loop: a worker
executes, verifiers check repo integrity, a blind judge accepts or rejects, and only
then does a human commit the deliverables. Sealed offsets (`3000–3299`, `4000–4299`)
are never touched. See [the daily loop](/daily-loop/) and [the campaign system](/campaigns/).
