---
title: "War stories"
track: "Tour"
---

In plain English

These are seven real problems from the project, written up the way an incident team would: what happened, how it was noticed, how it was fixed, and what was learned. In each case the project’s checks and reviews caught the problem before it affected a sealed result.

A **blameless postmortem** is an incident write-up that asks “what happened and how do we prevent it?” rather than “whose fault was it?” Every story here comes from the project’s own task reports. Where the records don’t say something, this page says so instead of filling the gap.

A few terms used throughout:

  * **Executor:** the code that turns a chosen move into button presses.
  * **Oracle:** the program that supplies the correct move.
  * **Tracker:** the running summary of what has happened in the game.
  * **Phase:** one numbered task in the project’s sequence, such as Phase 4b.

* * *

## 1\. The receipt-clamp saga

Section titled “1. The receipt-clamp saga”

**In one line:** a safety timeout added in the wrong layer turned out to refuse the expert’s own correct route. It took four phases to move it where it belonged.

**What happened.** When the game hands over an item, it runs a multi-step “receipt” sequence. To stop the executor from waiting forever, a **clamp** (a timeout) refused to continue once a receipt step had lasted 600 **frames**. A frame is one screen update, about a sixtieth of a second, so 600 frames is about ten seconds.

  * **Phase 3b-2** found the counter was wrong. It started when the executor was created, not when the wait began, and it counted per step instead of per wait.
  * **Phase 3b-3** stopped (a STOP under the rules). The fix it was asked for needed a tracker value that didn’t exist. The existing receipt age kept counting across steps, which contradicted the design’s “reset each stage.”
  * **Phase 3b-4** fixed the tracker with a two-line change and re-checked every baseline. Then it found the real problem: **four receipt steps in the teacher’s own route last longer than 600 frames.** The longest S3 one was 1,725 frames. Following the expert exactly would have been refused 600 frames after entering the room.
  * **Phase 3b-5** stopped again. The newly decided rule, “consecutive not-ready frames within a step,” couldn’t be computed from existing values. Its audit also showed the teacher’s route would never trip that rule.
  * **Phase 3b-6** **removed the clamp from the executor entirely.** Receipt timeouts became the oracle’s job, as per-step caps in its stage tables.

**How it was detected.** Re-running the teacher’s full recorded route through the new code, the **full-log shadow audit**. Real data exposed what the spec missed.

**The fix.** No receipt logic remains in the executor. Afterward, the audit showed **zero** receipt-related refusals.

**The lesson.** The records don’t state a one-line lesson. The arc suggests one: test a safety limit against known-good production traffic before trusting it, and put a limit in the layer that understands the situation.

* * *

## 2\. A replay that would have passed for the wrong reason

Section titled “2. A replay that would have passed for the wrong reason”

**In one line:** a check proved the right code was _loaded_ , but the code itself read files from the wrong place. A second check caught it.

**What happened.** In Phase 3b, the task was to re-run an old campaign from a clean exported copy of the old code, not from the live working folder. The **import proof** confirmed that all 11 tool modules loaded from the export, and none from the live repository.

**How it was detected.** A different check, the **source membership** check, refused before any worker started. The task report then explained why the import proof’s pass meant nothing. The old code had the live repository’s path written into it. So even code loaded from the export would have checked and used the live folder’s files. In the report’s words, a replay from an export was “indistinguishable from a replay at HEAD.”

**The fix.** None in that phase; it listed three options and stopped. A later task (campaign-v3b) built replays with an explicit root: the worker is pointed at the export. It also added an **open guard** , which fails a shard if it opens any file in the live repository. In that later work, deliberately broken export copies were all caught.

**The lesson.** Proving _where code came from_ is not the same as proving _what it read_. Defense in depth applies to evidence too.

* * *

## 3\. When the design said no

Section titled “3. When the design said no”

**In one line:** a task prompt included a design call that contradicted the written design. The agent stopped and said so, and the call was withdrawn.

**What happened.** In Phase 3b-2, the prompt’s decision “D2” would have allowed medium-length “hold still” moves outside of normal play, such as during screen transitions. The prompt itself said to stop if the design documents restricted those moves to normal play.

**How it was detected.** The agent checked the committed action-schema spec. It says medium moves are eligible only when the game is world-ready (normal play), and that waits during transitions, receipts and menus use the single-frame wait. Applying D2 would also have made the committed spec’s text wrong. The agent noted honestly that no document used the prompt’s exact wording, and asked for a ruling.

**The fix.** D2 was withdrawn. The commit message records it as “design restricts neutral holds to WR; D2 withdrawn.”

**The lesson.** The written design outranks a convenient instruction, and the rulebook backs that up: if a prompt conflicts with the rules or the design, stop and ask. The records do not say who proposed D2.

* * *

## 4\. The files that weren’t on the list

Section titled “4. The files that weren’t on the list”

**In one line:** a commit list left out three changed files. (A **commit** saves a set of changes into the project’s history. The commit list is the agent’s list of exactly which files to include.) A two-way check against `git status` now makes that impossible to miss.

**What happened.** In Phase 4b, the agent’s first `COMMIT_PATHS.txt` omitted three files it had legitimately changed under the repair rule: the oracle’s decision code and two route tables. The protected-file check had already classified them correctly. They were just missing from a hand-maintained list in the finishing script.

**How it was detected.** The owner, reviewing the first report. It was raised as a follow-up before commit.

**The fix.** The files were added. The finishing script also gained a **completeness check** : every path git reports as changed must be on the list, every listed path must exist, and every listed path must actually be changed. Exceptions are listed, never silently dropped. The final result was 185 paths on each side, PASS. Every later task runs this check.

**The lesson.** Don’t rely on a hand-kept list when the system can tell you the truth. Compare against `git status`, in both directions.

* * *

## 5\. Stuck at the cave door

Section titled “5. Stuck at the cave door”

**In one line:** the oracle’s first real run of S3 pressed against a cave door for 1,500 decisions. The cause was a 4-pixel alignment tolerance.

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/iter0-stuck.gif)Play

6× speed[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

Iteration 0, the run this postmortem is about. The oracle's first S3 attempt reached the cave door and then kept stepping back and forth beneath it until its 1,600-decision budget ran out, shown at 6× speed.Provenance

Item
    `iter0-stuck`: War story: stuck at the cave door
Source run
    Phase 4b oracle drive, iteration 0 (4a tables), repeat-1: FAILURE, DECISION_BUDGET_EXHAUSTED at f15668
Range
    frames 13059–15668 (2,610 frames), drive ticks 143–2752
Playback
    6×: one of every 6 emulator frames, played at 59.7275 frames per second; 7.283 s
Verification
    Re-rendered from one boot-state load by input replay only; all 15,662 emulator frames from frame 7 to frame 15668 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `c9a79030609dbba9d0823170246bc43da5ac2951c461473830db28d855cdd646`
Files (SHA-256)
    

  * `iter0-stuck.webm`, 191,250 bytes: `3f6080b73de63317645a6d4b5910a3bfded2d735b474e1fb4acc07ab6805623e`
  * `iter0-stuck-poster.png`, 9,016 bytes: `0922adaad4a79e49951c867c353a406868fa9ad3b4fa808aa545453194afeca0`
  * `iter0-stuck.gif`, 272,575 bytes: `8b1cd1e85c5c49fe8b001c6457f78ec998d48a15e62d3c58a7fd129173d4d246`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

**What happened.** In Phase 4b, iteration 0, the oracle reached the cave door at decision 88. Then it made no progress for 1,512 decisions, until the 1,600-decision budget ran out.

**How it was detected.** The budget failure, followed by a decision-by-decision analysis. The mechanism ran in two stages:

  1. At 4 pixels off the door’s center (inside the allowed 4-pixel tolerance), pressing up was blocked by the wall. Recovery never kicked in, because recovery only turned on when the character was _not_ at the door position.
  2. Later, standing exactly in line, the character stepped into the door tile itself. The tracker then said “not at the door position.” The oracle walked 8 pixels back down to line up again, and the cycle repeated: 1,308 press decisions and 137 walking decisions.

**The fix.** The tolerance went from 4 pixels to 0. Doors now carry their exact center pixel, the door tile counts as a valid pressing position, and the oracle steers to the exact pixel. The executor, the finish tests and the budgets were not changed.

**Result.** Iteration 1 succeeded: S3 done in 1,043 decisions and 1,660 frames, with full health and zero refusals. It was byte-identical across two processes, and it replayed cleanly as a one-shard campaign.

**The lesson.** The records don’t state one. The data shows a classic edge case: a tolerance that seems harmless can create a state that no rule handles.

* * *

## 6\. The file `git archive` leaves behind

Section titled “6. The file git archive leaves behind”

**In one line:** clean code exports don’t include large files git ignores, so a replay from an export needs them supplied separately, by copy and never by link.

**What happened.** Campaigns fingerprint a large frame log from the route-scoping work. That file is ignored by git, so `git archive` doesn’t include it in an export.

**How it was detected.** Before any code was written. The agent raised it as the first of four questions at the start of campaign-v3b. No incident happened.

**The fix.** The replay procedure gained a step: copy every untracked bound input into the export, with its fingerprint checked. If the step is skipped, the replay refuses with a clear “frozen file missing” message. A symbolic link instead of a copy trips the open guard. Both behaviors were tested: the copied frame log gave 33/33 matches, and the linked one failed before any frozen code ran.

**The lesson.** “Everything is in git” is never quite true. List what isn’t, and make the tooling refuse when it’s missing.

* * *

## 7\. The S2 gate re-lock: 99% to 97%, commit-bound to content-bound

Section titled “7. The S2 gate re-lock: 99% to 97%, commit-bound to content-bound”

**In one line:** the first S2 gate lock had both the wrong bar and a brittle binding. It was replaced before it ever ran.

**What happened.** The first S2 lock set a 99% bar (292 of 294). According to the author’s notes, that bar came from an advisor error: S1 had actually used 97%. The lock also pinned exact repository commits. That would have broken on any later commit.

**How it was detected.** By review before the gate ran. The 99% lock was never run as a gate; only its rehearsal ran.

**The fix.**

  * By the owner’s decision, the S2 gate was re-locked at the standing 97% rule (at least 286 of 294).
  * The new lock is **content-bound**. The locked base commit must be an ancestor of the current one, any changed files must be inside the gate’s own folders or match their locked bytes, and the tree must be clean.
  * A new `gate run --check-only` mode runs every check without executing anything. Before the commit, it correctly refused, with “repository is dirty” as the only reason. After the commit it must pass before the real run.
  * The S2 gate then ran and passed: 294 of 294 primary.

**The lesson.** Choose the threshold from the record, not from memory. Bind a lock to what matters (file contents), not to something that changes for unrelated reasons (the latest commit ID). A later, unrelated bug in a diagnostic flag was corrected in a separate folder, and the sealed verdict stayed unchanged.

* * *

## The crumbling-floor fall, before and after

Section titled “The crumbling-floor fall, before and after”

**In one line:** in one S3 run, the oracle let Link fall through a crumbling floor. A change to when it raises the shield fixed it.

**The setting.** Cave room C:BD has a crumbling floor: its cells give way if Link stays on them too long. The only way through the room is along a line of these cells, up the left side and then across the top.

The two clips below show the same run, run 21039 of segment S3 (one short stretch of the game). Both start at the same moment, when Link reaches the last solid cell before the crumbling floor, and everything before that moment is identical in both runs. Both play at normal speed.

This browser cannot play the video. [Open the GIF version](/media/2026-10-05/s3-21039-before-4c.gif)Play

[Physically verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

Before the fix (4c oracle). Link keeps his shield raised on the crumbling floor. A Keese, a cave bat, flies into him on the top row, and the raised shield pushes him back along the crumbling cells instead of letting him through. This happens twice. One cell gives way and he falls. The clip ends where the recorded run ends, about 1.7 seconds after the fall begins.

This browser cannot play the video. [Open the GIF version](/media/2026-10-05/s3-21039-after-4d.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

After the fix (4d oracle). Same start, same room. Link keeps his shield down while he stands on crumbling cells, walks across without stopping, and leaves through the top exit. This run goes on to finish the segment.

Run 21039 with the old oracle and with the fixed one. Both clips start at the same moment: Link on the last solid cell before the crumbling floor.Provenance

Item
    `s3-21039-before-4c`: Before the fix: the 21039 fall
Source run
    Phase 4d Part B: 4c-oracle re-run of offset 21039
Range
    frames 32432–32752 (321 frames)
Playback
    real time (59.7275 frames per second); 5.375 s
Verification
    Re-rendered from one boot-state load by input replay only; all 32,752 emulator frames from frame 1 to frame 32752 matched the recorded run's per-frame physical digests. Physically verified: the 4c oracle's table-dependent tracker digests were reproduced only up to frame 32431 (today's code cannot fold the 4c table past the crumbling-run gate cell), and its label records and views were not rebuilt. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `1efcfec01f01448d4998bf57c211816f5fe671a99f52b32121efcd61325f6823`
Files (SHA-256)
    

  * `s3-21039-before-4c.webm`, 283,441 bytes: `97f57935a08dbc6f00b37a6ab5c9b2aadb2406e30bd18d4d66eedf32638ed1f4`
  * `s3-21039-before-4c-poster.png`, 12,653 bytes: `308ac304c9abd46ddc45061498f69998c99da77a31e766e53589e21a9f477c8b`
  * `s3-21039-before-4c.gif`, 196,462 bytes: `5f714bf9c6ff46b91da74824524146296ae4a2599cf8cf37cd7d8d6f4ed3a167`

Item
    `s3-21039-after-4d`: After the fix: the same start crosses
Source run
    Phase 4d regression campaign s3-4d-regression, shard e21039
Range
    frames 32432–32715 (284 frames)
Playback
    real time (59.7275 frames per second); 4.755 s
Verification
    Re-rendered from one boot-state load by input replay only; all 33,692 emulator frames from frame 1 to frame 33692 matched the recorded run's per-frame digests, and every tracker, record and view digest of the recorded run was reproduced. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `009cad8f434b0ddfcea450d75c10f291fac5688c759bd9dedfb6a9ed4fc92fa5`
Files (SHA-256)
    

  * `s3-21039-after-4d.webm`, 238,939 bytes: `c91178b68d7f55fa139562ab46e6321894834a4f9a824765dde2de8dd107d98d`
  * `s3-21039-after-4d-poster.png`, 12,789 bytes: `bfcd9f77495193b0426c3646b99dfc6204e4764dd81f1e28bf70c93b005449c8`
  * `s3-21039-after-4d.gif`, 741,612 bytes: `cf5f679443e846bec77aff96d4f8359e71150363a68594184b6542147cdb8acf`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

**What happened.** With the 4c version of the oracle, Link walked onto the crumbling floor with his shield raised the whole time. On the top row a Keese (a cave bat) flew into him twice, and each time the raised shield pushed him back along the crumbling cells. He stayed too long on two of them, one gave way, and he fell. He reappeared at the room’s entrance and took damage from the fall. The cell that collapsed was on the only route out, so the oracle reported that no path was left, and the run ended as a failure.

**The fix.** The oracle no longer raises Link’s shield while he stands on a crumbling floor cell. A Keese contact then costs a little health instead of pushing him back onto cells that are about to give way.

**The result.** With the 4c oracle, 96 of 97 S3 runs succeeded, and run 21039 was the one failure. With the fixed 4d oracle, the same 97 runs all succeeded, including 21039. So did 90 of 90 runs from new starting points that had been held back and were run only once, after the fix was final. None of these runs had a fall or a collapsed cell.

**The cost.** With the shield down, a Keese sometimes hits Link while he is on the crumbling floor. That happened 7 times in those 187 runs. None of the hits was fatal, and none caused a fall.

why the two clips carry different badges, and the shield in detail

  * Both clips were re-rendered by replaying the recorded button presses from a single starting save, with no other saves or loads and no changes to game memory.
  * **After (4d): “Verified replay.”** Every frame of the replay matched the recorded run’s checksums (fingerprints of the recorded data), including the oracle’s internal bookkeeping.
  * **Before (4c): “Physically verified replay.”** Every frame matched the recorded run’s game-state checksums, so the game itself did exactly what the recording says. But part of the old 4c oracle’s internal bookkeeping can no longer be recomputed with today’s code, so that part was not re-checked.
  * The shield is Link’s B-button item in these runs. In the before run, B is held on every one of the 153 recorded steps (ticks) Link spends on crumbling cells. In the after run, B is held on 1 of 147: the single step from the last solid cell onto the first crumbling one, which was chosen while Link still stood on the solid cell. On every later step on the crumbling floor, B is released.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `CAPTIONS.md and media-manifest.json from the author's media export of Oct 5, 2026, task media-21039-20261005 (the crumbling-floor section: every claim, number and the two verification levels)`
  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `dev-smoke/v3-executor-p3b2-20261003, p3b3, p3b4, p3b5, p3b6 REPORT.md files (stories 1 and 3)`
  * `dev-smoke/v3-executor-p3b-20261003/REPORT.md (story 2: source-membership refusal; import proof passed)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (stories 2 and 6: explicit roots, open guard, untracked bound inputs)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and finalize.py (stories 4 and 5)`
  * `dev-smoke/s2-gateprep-20261001/REPORT.md, dev-smoke/s2-gaterelock-20261001/REPORT.md, s2-gate-20261001/SUPERSEDED.md, s2-gate-20261001b/CRITERIA.md (story 7)`
  * `gbg-data/RESULTS.md (S2 sealed result and correction)`
  * `Author's notes (S2 gate history: the 99% advisor error; why exact-commit pinning was replaced)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `CAPTIONS.md and media-manifest.json from the author's media export of Oct 5, 2026, task media-21039-20261005 (the crumbling-floor section: every claim, number and the two verification levels)`
  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `dev-smoke/v3-executor-p3b2-20261003, p3b3, p3b4, p3b5, p3b6 REPORT.md files (stories 1 and 3)`
  * `dev-smoke/v3-executor-p3b-20261003/REPORT.md (story 2: source-membership refusal; import proof passed)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (stories 2 and 6: explicit roots, open guard, untracked bound inputs)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and finalize.py (stories 4 and 5)`
  * `dev-smoke/s2-gateprep-20261001/REPORT.md, dev-smoke/s2-gaterelock-20261001/REPORT.md, s2-gate-20261001/SUPERSEDED.md, s2-gate-20261001b/CRITERIA.md (story 7)`
  * `gbg-data/RESULTS.md (S2 sealed result and correction)`
  * `Author's notes (S2 gate history: the 99% advisor error; why exact-commit pinning was replaced)`
