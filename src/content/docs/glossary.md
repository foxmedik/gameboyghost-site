---
title: "Glossary"
track: "Tour"
---

In plain English

Every term the guide uses, in one place. Each has a plain definition, and most have an everyday IT comparison.

Each definition matches how the project uses the term. “Like” introduces a comparison, not a claim that the project uses that product. **PLANNED** means not built yet.

## Roles and learning

Section titled “Roles and learning”

Term | Definition | Like  
---|---|---  
**Segment** | One short stretch of the game with a defined start, finish, and step limit. S0, S1 and S2 are done; S3 to S18 are planned. | A stage in a pipeline.  
**Teacher** | An expert game-playing program from the project’s earlier work. Its recorded runs serve as evidence, and the oracle reuses parts of its logic. | The senior admin’s old runbook.  
**Oracle** | A program that looks at what the student sees and returns the correct next move, “done,” or “I can’t answer.” Version 5 is the one being built for S3 and later. | An answer key.  
**Student** | The small learning program. It sees only a limited view of the game and learns by copying the oracle’s answers. | A new hire learning from the runbook.  
**Student view** | The fixed list of 909 values the student (and therefore the oracle) is allowed to look at. | A read-only report with only approved fields.  
**Imitation learning** | Teaching a program by showing it expert answers to copy. | Shadowing an experienced colleague.  
**Behavior cloning** | The first round of imitation learning: copy the expert on clean, successful runs. | Learning from the golden path.  
**DAgger** | A repeat loop: let the student play, have the oracle label the spots the student actually reached, add those labels, retrain, test again. Short for “Dataset Aggregation.” | Reviewing the tickets you actually got, not just the textbook ones.  
**Label** | The oracle’s answer for one student view. It must depend only on that view. | The expected output in a test case.  
**Action class** | One entry in the fixed menu of 90 possible moves (button combinations held for set times). Entries 0 to 61 never change. | A fixed list of allowed commands.  
**Executor** | The code that turns a chosen move into actual button presses, one game frame at a time. It never edits game memory. | A deploy tool that only uses the public interface.  
**Drive mode** | The oracle picks each move and the executor carries it out. | The expert at the keyboard.  
**Label mode** | The student’s own move is carried out. The oracle only records what it _would_ have done. | Shadow mode.  
**Forced decision** | A move the oracle must make, usually “wait,” while the game finishes something (like a screen transition). | A mandatory cool-down.  
**Refusal** | The oracle’s explicit “I can’t answer this.” It ends a test run as a failure and never becomes a training example. | An error code, not a wrong answer.  
**Decline** | The older (S1-era) name for a refusal. | Same.  
  
## Game state and observation

Section titled “Game state and observation”

Term | Definition | Like  
---|---|---  
**Emulator** | Software that pretends to be the Game Boy hardware. The project uses PyBoy. | A virtual machine.  
**Frame** | One screen update of the game, the smallest step of game time. | A clock tick.  
**Record** | A fixed snapshot of 4,413 whole-number values read from game memory at a decision point. | A full monitoring snapshot.  
**Tracker** | Code that keeps a running summary of what has happened, using only what was observed and the buttons actually pressed. | A metrics aggregator.  
**Phase table** | A frozen lookup table for one segment that the tracker uses to note which stage of the segment it is in. | A versioned config file.  
**WR (world-ready)** | An exact test that the game is in normal play, not in the middle of a transition. | A readiness check passing.  
**Q (quiet)** | A stricter test: world-ready, alive, no dialogue on screen, not moving, nothing pending. | System idle, queues drained.  
**Receipt** | The game’s multi-step “you got an item” sequence. It counts as done only when the sequence has finished, not just when the item appears in the inventory. | A confirmed write, not just a sent one.  
**Prefix** | Replaying the already-finished segments from power-on to reach a segment’s starting point. Never loaded from a save. | Rebuilding from scratch, not restoring.  
**Handoff** | The moment one segment passes the game to the next. | A shift handover.  
**Entry / exit test** | The exact conditions for a segment’s start and finish (the exit test is also called the **finish test**). The finish conditions are named E3 to E18. | Acceptance criteria written as code.  
**Start point (boot state)** | The single fixed game state every run loads once, at power-on. Never shared, never in git. | A golden image.  
**R13** | The rule: load the starting point once per run, then only press buttons. | Rebuild, never restore.  
**R6** | The rule: refusals never become training examples. | Don’t learn from error messages.  
  
## Gates and governance

Section titled “Gates and governance”

Term | Definition | Like  
---|---|---  
**Gate** | A pass/fail test, written in advance and run exactly once, that decides whether a segment is finished. | A release gate.  
**Seal** | After a gate passes, its folder, model and settings are frozen forever. Corrections go in a new folder. | A change freeze.  
**Lock** | Recording fingerprints of everything a gate depends on, before it runs. | A signed manifest.  
**`--check-only`** | A dry run that must pass after the owner commits and before the one real gate run. | A pre-flight check.  
**Composition gate** | The final whole-chain test: 300 runs from power-on, at least 291 must succeed. | An end-to-end acceptance test.  
**SHA-256 hash** | A short code computed from a file’s exact contents. Any change produces a different code. | A checksum.  
**Protected snapshot** | Fingerprints of all protected files, taken before and after every task. Any change means stop. | File-integrity monitoring.  
**Pin** | An exact version or state that a task checks before it starts. | A pinned dependency.  
**STOP** | The mandatory “halt and report” when a rule breaks or instructions are unclear. | A stop-the-line cord.  
**Repair rule** | Limited permission to fix a provable bug in one’s own checking code, once per bug, logged. | Limited hotfix authority.  
**Determinism check** | Running the same job again in a fresh process and requiring identical output. | Verifying a reproducible build.  
**Honesty rules** | Never weaken a check, always report failures, never claim more than the evidence shows. | Blameless-postmortem culture.  
  
## Batches and data

Section titled “Batches and data”

Term | Definition | Like  
---|---|---  
**Campaign** | A batch of runs, frozen in advance and recorded as one unit. | A batch job.  
**Manifest** | The frozen file listing a campaign’s jobs, settings, and file fingerprints. | A lockfile.  
**Shard** | One unit of campaign work: one fresh process playing one run with fixed settings. | A work item.  
**Worker** | A separate process that runs one shard at a time. | An isolated build agent.  
**Ledger** | An append-only log with one entry per finished shard; each entry includes the previous entry’s fingerprint. | A tamper-evident audit log.  
**Hash chain** | A list where every entry carries the previous entry’s fingerprint, so any edit breaks every later link. | Numbered, sealed evidence bags.  
**`summary.json`** | The committed summary listing every finished shard with its fingerprints, enough to rebuild and check the ledger. | A signed release summary.  
**Replay** | Re-running finished shards and comparing the output to the saved evidence. | Rebuild and compare.  
**Import proof** | A per-shard record proving that every piece of code a replay loaded came from the intended copy, not the live working folder. | Proof of where the software came from.  
**Open guard** | A check inside a replay worker that fails the shard if it opens any file in the live repository. | A sandbox rule.  
**Offset** | The number of idle frames at the start of a run. It makes each test case slightly different and identifies it. | A test-case number.  
**Seed** | A reserved number that drives a random choice, so it can be repeated exactly. | A fixed random seed.  
**Band** | A reserved range of offsets or seeds set aside for one purpose. | A reserved block of IP addresses.  
**Occupancy** | The list of offsets and seeds already used, reserved, failed or canceled. | An address-allocation table.  
**Morning report** | The summary a campaign writes when it finishes or pauses: shards done, failures, determinism spot-checks, compute time. Descriptive only; it never changes a gate’s verdict. | The overnight job report.  
**Characterization run** | A batch that measures behavior without a pass/fail verdict, such as the S2 robustness arms. | Baseline profiling.  
**Practice range (PLANNED)** | A planned batch setup for the boss fight: replay the teacher’s inputs to the boss door, then vary the idle frames. | A staging environment for one hard task.  
**Allowlist** | A list of the only actions permitted; everything else is denied. | A firewall default-deny rule set.  
**Shadow audit** | Replaying the teacher’s full recorded run through the new code, twice, to prove the new code reproduces the old behavior. | A regression test against production logs.  
**Supervisor / “foreman” (PLANNED)** | A future local AI that would manage overnight batches using only the fixed actions of `gbg supervise`. | A job scheduler with a runbook.  
  
## Oracle internals

Section titled “Oracle internals”

Term | Definition  
---|---  
**Skill** | One of the oracle’s ranked behaviors, such as staying safe, waiting for the game to settle, fighting, or moving along the route.  
**Priority stack** | The order in which skills are checked; the highest-ranked skill that applies decides.  
**Action / Done / Refuse** | The three kinds of answer the oracle can give.  
**Receipt cap** | The longest the oracle waits for one step of an item hand-over: twice the teacher’s longest, at least 600 frames. Past it, the oracle refuses.  
**Goal lock** | A fingerprint of a segment’s loaded phase tables; the tracker refuses if the tables change mid-run.  
**Route phase** | A named stage along a segment’s route, such as approaching a cave, climbing, pushing a block, or leaving.  
**Route-room set** | The list of rooms a segment’s route may visit. It must include the start and exit rooms.  
  
## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (R13, R6, STOP, repair rule, gate rules, protected snapshots, bands)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (record, tracker, WR/Q/receipt tests, segment plan, composition gate, oracle skills, bands)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value student view)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (import proof, open guard)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (route phases, forced decisions, drive and label modes)`
  * `gbg-data/gbg_data/oracle_v5/tables/s3_phase_table.json (receipt caps)`
  * `cli/gbg_cli/campaign_runner.py (morning report)`
  * `cli/configs/campaign-s2-pilot.json (characterization campaign)`
  * `data-architecture/spec.md (DAgger loop, behavior cloning, declines)`
  * `cli/gbg_cli/ (supervise.py, occupancy.py, campaign_store.py, campaign_worker.py)`
  * `gbg-data/gbg_data/ (executor_v3_1.py, action_schema_v3_1.json, tracker_v3.py, oracle_v5/)`
  * `$AGENT_REPO Python environment metadata (PyBoy package)`
  * `Author's notes (supervisor and practice range, PLANNED)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (R13, R6, STOP, repair rule, gate rules, protected snapshots, bands)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (record, tracker, WR/Q/receipt tests, segment plan, composition gate, oracle skills, bands)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value student view)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (import proof, open guard)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (route phases, forced decisions, drive and label modes)`
  * `gbg-data/gbg_data/oracle_v5/tables/s3_phase_table.json (receipt caps)`
  * `cli/gbg_cli/campaign_runner.py (morning report)`
  * `cli/configs/campaign-s2-pilot.json (characterization campaign)`
  * `data-architecture/spec.md (DAgger loop, behavior cloning, declines)`
  * `cli/gbg_cli/ (supervise.py, occupancy.py, campaign_store.py, campaign_worker.py)`
  * `gbg-data/gbg_data/ (executor_v3_1.py, action_schema_v3_1.json, tracker_v3.py, oracle_v5/)`
  * `$AGENT_REPO Python environment metadata (PyBoy package)`
  * `Author's notes (supervisor and practice range, PLANNED)`
