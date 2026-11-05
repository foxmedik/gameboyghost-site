---
title: "Batch cookbook"
track: "Operator"
---

In plain English

These are recipes for the batch jobs the project runs: what each is for, how big it is, about how long it takes, and what to check in the report the next morning. Every time is either measured or clearly marked as an estimate.

Most heavy work in GameBoyGhost runs as overnight or background **batches** , called campaigns. This page works like a cookbook. Each card tells you what the batch is for, how big it usually is, roughly how long it takes, and what to look for in the report the next morning.

## How to read the runtimes

Section titled “How to read the runtimes”

Every runtime on this page is one of two kinds:

  * **Measured** : a wall-clock time recorded by an actual run. The report it came from is named.
  * **Estimate** : arithmetic based on the project’s measured speed. Estimates are labeled, and they can be off by a wide margin.

The measured speeds behind the estimates come from one throughput test (Phase 3, Oct 3, 2026):

Setup | Speed per process | Speed in total  
---|---|---  
1 worker, executor loop only | about 2,300–2,450 game frames per second | same  
4 workers, executor loop only | about 2,070–2,250 frames/s each | about 6,760–7,090 frames/s  
Replaying the teacher’s recorded inputs, with full checking | about 1,400 frames/s | not measured  
  
The report itself warns that each timed window was under one second, so these numbers are rough. It recommends a longer test before worker counts are locked. Also, the timed window covers only the executor loop. Starting up and replaying the run’s early part (the **prefix**) take extra time.

what the throughput test actually ran

Each worker process replayed its way to a fixed point in the game, then ran 188 repetitions of the “wait 8 frames” action (1,504 frames). It did this once with the tracker and per-frame fingerprints, and once with the tracker only. The test used 1 and 4 workers. It measured wall-clock time only, not processor time. It did not check byte-identity across worker counts; other runs did that (see the determinism audit card).

The design document had assumed 600 frames per second for planning, and said plainly that no benchmark had been run yet. Measured speeds came out several times higher, but treat that as encouraging, not settled.

## What every morning report contains

Section titled “What every morning report contains”

When a campaign finishes, or is paused partway, the runner writes two files into the campaign folder: `REPORT.md` for people and `morning-report.json` for tools. Think of it as the overnight job summary you read with your coffee.

Section | What it tells you  
---|---  
**Status line** | Complete, paused or partial, and how many shards are done out of how many declared.  
**Variant table** | For each variant in the batch: shards run, checks passed, and primary failures.  
**Shard rows** | One line per shard: owner segment, offset, equivalence result, checks passed, stop reason, decisions used, frames used.  
**Determinism spot-checks** | The repeat runs done during the campaign, and whether they matched.  
**Import proofs** | How many shards have proof files, and how many are clean.  
**Compute and disk** | Worker time, processor time, and the campaign’s size on disk.  
**Interpretation line** | A fixed reminder: descriptive only; no seal, verdict, training, or unseen-panel claim. A campaign report never changes a gate’s verdict.  
the older (legacy) report format

Campaigns in the older format add a variant leaderboard with clear rates. They also list failure clusters from each failing run’s final 200 decisions, “stuck pockets” (places where failing runs stood still), a count of one known back-and-forth room oscillation, and a “suggested next campaign” line, clearly marked as a suggestion only.

* * *

## Segment development campaign

Section titled “Segment development campaign”

**Purpose.** Prove a candidate (an oracle or a student) on a fixed panel of fresh test cases before its gate may be locked. The bar is strict: zero primary failures on at least 200 cases that actually reached the segment’s start.

**Size.** At least 200 earned entries. For S3, the cases come from the development band, offsets 21000–21199. The spare band covers cases lost before the start. Each S3 attempt is capped at 1,600 decisions and 10,000 frames.

**Runtime.**

  * _Measured, one attempt:_ the first full oracle run of S3, as a one-shard campaign, took **22.0 s** of worker time. That run started from the teacher’s recorded inputs, not from the sealed earlier segments.
  * _Estimate, a 200-case panel:_ each real attempt first replays sealed segments S0–S2 from power-on. At the measured replay speed of about 1,400 frames/s, a prefix of roughly 30,000–35,000 frames takes about 25 s per attempt. 200 attempts over 4 workers is about 50 rounds of about 25 s, so **roughly 20–25 minutes**. This is an estimate.
  * _In progress:_ a 100-case S3 measurement campaign (`oracle-v5-4c`) is running. Its numbers will be added when its report lands.

**The morning report shows:**

  * each shard’s offset, its stop reason (for example, finished, or out of decisions), its decision count and its frame count;
  * primary failures counted per variant;
  * the determinism spot-check result and the import-proof count;
  * worker time and processor time.

Under the development rules, cases that never reach the segment’s start stay visible in the count and are never dropped.

## Determinism audit

Section titled “Determinism audit”

**Purpose.** Prove that results don’t depend on how many workers ran or in what order. It is the reproducible-build check.

**Size.** Either a full campaign run twice with different worker counts, or a handful of repeat runs in fresh processes. Gates use 5 repeats.

**Runtime (measured).** The first v3 campaign of 33 test fixtures took **340 s on 4 workers** and **1,140 s on 1 worker**. Every output file was byte-identical between the two.

**The morning report shows:** a yes/no “files identical” result. If anything differs, it shows the first differing field. A mismatch is a STOP.

## Replay audit

Section titled “Replay audit”

**Purpose.** Re-run finished shards and compare them byte for byte with the saved, fingerprinted evidence. The replay runs from a clean exported copy of the code (`--root`), so it cannot quietly use files from the live working folder.

**Size.** Any finished campaign, or a sample of it.

**Runtime (measured).** A 33-shard replay from a clean export took **5 min 21 s on 4 workers**.

**The morning report shows:**

  * MATCH counts (33/33 in that run);
  * the **import proof** (every piece of code loaded came from the export: CLEAN);
  * the **open guard** (zero files opened in the live repository);
  * results of deliberately broken copies. In that run, all four broken copies were caught: an extra file, a modified file, a linked-in module, and a linked-in input.

## Shadow-audit regression

Section titled “Shadow-audit regression”

**Purpose.** Replay the teacher’s entire recorded run through the current executor, and confirm that nothing has changed. It works like a regression test against production logs.

**Size.** One full recorded run, played twice in separate processes: 48,730 checked frames.

**Runtime (measured).** About **42–45 s per process**.

**The morning report shows:**

  * the frame-log fingerprint compared with the previous baseline (byte-identical in Phase 4b);
  * counts of refused moments. In Phase 4b these were 1,511 + 100, both in groups known to be allowed;
  * confirmation that the two processes matched.

## Moldorm practice range (PLANNED)

Section titled “Moldorm practice range (PLANNED)”

**Purpose.** Moldorm is the boss of Tail Cave. The practice range would give the boss-fight work lots of varied attempts overnight, without replaying the whole learned chain each time. Each attempt would replay the teacher’s recorded inputs up to the boss door, then add a different number of idle frames at the start for variety.

**Size.** Not decided.

**Runtime (estimate).** The boss door is at about frame 48,700 of the teacher’s run. At the measured replay speed of about 1,400 frames/s, that is roughly **35 s of prefix per attempt** before the fight starts. A batch of 200 attempts on 4 workers would be roughly half an hour plus fight time. This is an estimate for a planned batch.

**The morning report would show:** attempts, outcomes, and failure reasons. This is not built yet.

## Characterization run

Section titled “Characterization run”

**Purpose.** Measure behavior without a pass/fail verdict. For example: how does a sealed student cope with deliberate disruptions? The S2 robustness arms are the main example. They were used as the pilot workload for the campaign system (`s2-robustness-characterization`).

**Size.** Varies with the arms being measured.

**Runtime (measured, per shard).** S2 robustness shards replayed in **about 6 s to 18 s each** , depending on the arm.

**The morning report shows:** descriptive counts per arm. The campaign runner also suggests which recurring trouble spots to look into next. Characterization results never change a gate’s verdict.

## Throughput benchmark

Section titled “Throughput benchmark”

**Purpose.** Measure speed per process and in total, to choose a worker count.

**Size.** Small. The Phase 3 test used 5 runs from power-on, with 1 and 4 workers.

**Runtime.** Minutes. The timed windows themselves were under 1 s each.

**The morning report shows:** frames per second for each process and in total, per setup. The project’s design says the worker count may go above 4 only if a benchmark shows a real speedup _and_ repeat runs stay byte-identical.

## Supervisor exam (PLANNED)

Section titled “Supervisor exam (PLANNED)”

**Purpose.** The first rung of the planned supervisor’s trust ladder. The candidate supervisor is graded on past reports where the correct decision is already known.

**Size, runtime, report:** not designed yet.

## Dataset export run (PLANNED)

Section titled “Dataset export run (PLANNED)”

**Purpose.** Turn finished campaigns into public data files. Each file would contain the inputs the student saw, the labels, the actions, the outcomes, and fingerprints. Raw game memory and screen frames would be left out.

**Size, runtime, report:** not designed yet. [Data and publishing](/data-publishing/) describes the planned format.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/v3-executor-p3-20261003/throughput.json, throughput.py and REPORT.md (measured throughput; "rough" warning; longer test recommended)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: 600 frames/s planning assumption; development target; band 21000–21199; S3 budgets 1,600/10,000; worker policy)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and campaigns/s3-oracle-drive/morning-report.json (22.04 s one-shard campaign; shadow audit 1,511 + 100)`
  * `dev-smoke/oracle-v5-4b-20261004/data/shadow-audit metrics (about 45 s per process)`
  * `dev-smoke/v3-executor-p3b6-20261003/REPORT.md (full-log shadow audit, 48,730 frames)`
  * `dev-smoke/campaign-v3a-20261004/REPORT.md and workers-1-vs-4.json (340 s vs 1,140 s, files identical)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (5 min 21 s replay, import proof, open guard, broken-copy tests)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md and summary.json (S2 robustness shard times)`
  * `cli/gbg_cli/campaign_runner.py (morning report contents, both formats; suggested next campaign)`
  * `cli/configs/campaign-s2-pilot.json (characterization campaign name)`
  * `dev-smoke/route-scoping-20261001 via DESIGN-V3.1 Part 3 (boss door near frame 48,737)`
  * `Author's notes (Moldorm practice range, supervisor exam, dataset exports: all PLANNED)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/v3-executor-p3-20261003/throughput.json, throughput.py and REPORT.md (measured throughput; "rough" warning; longer test recommended)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: 600 frames/s planning assumption; development target; band 21000–21199; S3 budgets 1,600/10,000; worker policy)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and campaigns/s3-oracle-drive/morning-report.json (22.04 s one-shard campaign; shadow audit 1,511 + 100)`
  * `dev-smoke/oracle-v5-4b-20261004/data/shadow-audit metrics (about 45 s per process)`
  * `dev-smoke/v3-executor-p3b6-20261003/REPORT.md (full-log shadow audit, 48,730 frames)`
  * `dev-smoke/campaign-v3a-20261004/REPORT.md and workers-1-vs-4.json (340 s vs 1,140 s, files identical)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (5 min 21 s replay, import proof, open guard, broken-copy tests)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md and summary.json (S2 robustness shard times)`
  * `cli/gbg_cli/campaign_runner.py (morning report contents, both formats; suggested next campaign)`
  * `cli/configs/campaign-s2-pilot.json (characterization campaign name)`
  * `dev-smoke/route-scoping-20261001 via DESIGN-V3.1 Part 3 (boss door near frame 48,737)`
  * `Author's notes (Moldorm practice range, supervisor exam, dataset exports: all PLANNED)`
