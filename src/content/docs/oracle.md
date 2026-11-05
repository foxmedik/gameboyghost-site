---
title: "The oracle up close"
track: "Builder"
---

In plain English

The oracle is the expert that supplies the right answer for every situation the learning program might face. It follows strict rules. It only looks at the same information the learner sees. It always gives the same answer to the same situation. When it isn’t sure, it says so instead of guessing.

The **oracle** is the program that supplies the right answer for the student to learn from. Think of a very strict runbook that’s been turned into code. Given what’s on the screen right now, it says exactly what to do next. If the situation isn’t covered, it says “I can’t answer” instead of guessing.

The current oracle is **oracle v5** , built for segment S3 first.

## How one decision flows

Section titled “How one decision flows”

Data flow for one decision, left to right. A read-only capture of game memory produces the record of 4,413 values. The tracker folds it into a running summary, using the phase tables. The student view selects 909 values. decide() takes the view and the frozen config and returns Action, Done or Refuse. In drive mode the Action goes to the executor, which presses buttons; in label mode the answer is only recorded as a label while the student's own move is executed.Captureread-only, noticks or pressesRecord4,413 valuesTrackerrunning summary +phase tablesStudent view909 valuesdecide()view + frozen configDrive modeexecutor presses theoracle’s moveLabel modeanswer recorded only;student’s move runsAction(class, reason, forced)Done(E3, evidence)Refuse(reason, fields)One decision. The oracle never sees raw memory, the emulator, a clock or randomness: only the 909-value student view and its frozen settings.

## decide(): a pure function

Section titled “decide(): a pure function”

The heart of the oracle is one function:
[code] 
    decide(student_view, frozen_config) -> Action | Done | Refuse
[/code]

**Pure** means the same input always gives the same output, with no side effects. The code may not use the emulator, random numbers, the clock, file reading, global variables, or any memory between calls. An automated test fails the build if the oracle’s code even _imports_ the emulator, randomness, time, the operating system, or the campaign tools. Only the config loader reads files, once, and the config fingerprint binds both route tables and the student-view definition.

The three possible answers:

Answer | Fields | Meaning  
---|---|---  
**Action** | move class, reason code, forced flag | “Do this next.”  
**Done** | which finish test (for S3: `E3`), evidence | “The segment’s finish test is met.” The runner checks that the shared finish test agrees.  
**Refuse** | reason code, fields | “I can’t answer this view.” Never a training label (rule R6).  
  
Every Action is double-checked against the skill’s allowed moves and the executor’s eligibility rules before it’s returned.

## The skill priority stack

Section titled “The skill priority stack”

The oracle is built from **skills** : small behaviors, each with an entry condition, allowed moves, and a way to know it’s done. They are checked in priority order, and the first one that applies decides. It works like firewall rules, where the first match wins.

A vertical stack of eight bars, top to bottom in the order decide() checks them: integrity checks (refuse on bad data); receipt timeout; settlement (wait out transitions, dialogue, menus); terminal confirmation and pickup wait; recovery (try a safe sideways move when stuck); combat (attack only a hostile in range); push (blocks); navigation (move toward the next target). A side note says safety is not a separate bar but shapes every movement choice.1\. Integrity: refuse on missing or inconsistent data2\. Receipt timeout: refuse if an item hand-over runs too long3\. Settlement: wait out transitions, dialogue, menus4\. Terminal: confirm the finish; wait for a pickup5\. Recovery: try a safe sideways move when stuck6\. Combat: attack only a hostile within range7\. Push: line up and push a block8\. Navigation: move toward the next targetSafetyshapes every move:smaller steps near enemies,no long moves oncrumbling floorThe order decide() actually checks, from top to bottom. Safety isn't a separate step: it limits how every movement is made. the skills as implemented, vs the design

The S3 phase table defines skills with these IDs: 0 integrity, 1 settlement, 2 safety, 4 minimal combat, 5 navigation, 6 recovery, 8 push, 9 terminal.

  * The design’s priority 3 (equipment and interaction) and priority 7 (health recovery) are not used in S3. S3 has “no menu, door, switch or chest”, and no proven reachable healing source.
  * Skill 9 (terminal confirmation) is new.
  * **Safety** works as a modifier inside movement selection, not as its own branch: a hostile within 24 pixels forces single-frame moves, within 32 pixels it blocks 8-frame moves, crumbling floor forbids medium moves, and it picks shield variants.
  * **Tie-breaks** go by entity slot, then direction (up, down, left, right). The oracle never iterates over an unordered set.
  * A small documentation mismatch: the code’s header comment lists combat before recovery, but the code checks recovery first.

## Route phases and tables

Section titled “Route phases and tables”

The oracle knows where it is in the segment through **route phases** : named stages such as approaching the cave, climbing, pushing blocks, and leaving. They are stored in two frozen tables:

  * the **phase table** : phase list, skills, thresholds, receipt caps, refusal codes;
  * the **region graph** : each room’s next target, like an edge to walk through, a door, a block to push, an item, or a wait.

S3 has 11 route phases, plus an off-route return phase and a recovery overlay.

# | Phase | # | Phase  
---|---|---|---  
1 | FOREST_52_SOUTH | 7 | CAVE_AB_EXIT  
2 | FOREST_62_CAVE | 8 | OW50_APPROACH  
3 | CAVE_BD_CLIMB | 9 | OW50_PICKUP  
4 | CAVE_AC_WEST | 10 | OW50_SETTLE  
5 | CAVE_AB_PUSH_1 | 11 | OW50_CONFIRM  
6 | CAVE_AB_PUSH_2 | 13 | OFF_ROUTE_RETURN  
  
The phase is computed by the **tracker** , not the oracle. It is worked out from the previous summary plus _one_ new observation, and never from a proposed answer. A key test proves that “a hypothetical teacher action never advances phase.” Once a segment’s tables are loaded, a **goal lock** fingerprints them. The tracker refuses if anything tries to swap tables mid-run.

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/s3-block-pushes.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

Route phases 5 and 6 in action. In cave room C:AB the oracle pushes one rock left and a second rock down to clear the way to the exit, at normal speed.Provenance

Item
    `s3-block-pushes`: Two rock pushes in the cave
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frames 13676–13972 (297 frames), drive ticks 760–1056
Playback
    real time (59.7275 frames per second); 4.973 s
Verification
    Re-rendered from one boot-state load by input replay only; all 13,966 emulator frames from frame 7 to frame 13972 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `b815a2639857f97bec22625d777ee7f2cd439cf75231e90e560fc7cb184fa612`
Files (SHA-256)
    

  * `s3-block-pushes.webm`, 422,731 bytes: `af1b4380186e2394ec82e7c20d053585b096b585cfe189ebd9ad6f707fd8ff58`
  * `s3-block-pushes-poster.png`, 11,355 bytes: `f9ae9a594f956b3cf454b637b3a1c602b0457f28f94c140349a8d3de5817dcf7`
  * `s3-block-pushes.gif`, 1,030,231 bytes: `c8ffa9fe737c8104345702879ed2c7d986fa39ca35ab4a9e3c740fd63082cc5f`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/s3-crumbling-climb.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

Route phase 3 in action. In cave room C:BD the oracle walks Link around the room and across the crumbling floor to the top exit without any floor tile collapsing, at normal speed. The safety rule forbids long moves here, and the oracle never stands still on a crumbling tile.Provenance

Item
    `s3-crumbling-climb`: Crossing the crumbling floor
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frames 13246–13488 (243 frames), drive ticks 330–572
Playback
    real time (59.7275 frames per second); 4.069 s
Verification
    Re-rendered from one boot-state load by input replay only; all 13,482 emulator frames from frame 7 to frame 13488 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `f5d7c58d01be7cbf093eead888a533f06bb0b0c321f6299704beee7e603b29f1`
Files (SHA-256)
    

  * `s3-crumbling-climb.webm`, 392,210 bytes: `e95449d35555a762e6840b24b172c289f8c90b1428c167f79edfba48aa3bbb54`
  * `s3-crumbling-climb-poster.png`, 12,662 bytes: `f64f2ba6f1a1f2243838d769cd827db499c9765b086bf77d749d833e0b77a293`
  * `s3-crumbling-climb.gif`, 330,244 bytes: `401d6c2d6f323c85bffa46a5f7bbb2e67b4d75d070674fb592956d17c91da3d6`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/s3-toadstool.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

Route phases 9 to 11: the pickup, waiting out the item hand-over (the receipt), and confirming the finish. In the forest the oracle walks Link to the Sleepy Toadstool, picks it up and waits through the message until the game records the item, at normal speed.Provenance

Item
    `s3-toadstool`: Picking up the Sleepy Toadstool
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frames 14100–14576 (477 frames), drive ticks 1184–1660
Playback
    real time (59.7275 frames per second); 7.987 s
Verification
    Re-rendered from one boot-state load by input replay only; all 14,570 emulator frames from frame 7 to frame 14576 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `38be2b0171f776ba52d8b0b0975d79c365f1cef749a5dcba97b22622aae68c33`
Files (SHA-256)
    

  * `s3-toadstool.webm`, 171,751 bytes: `920ecd5497e922ae5fee411f3610218338958e168664ec1a485badecba2b234d`
  * `s3-toadstool-poster.png`, 11,177 bytes: `7583006fa730d302e039f346fa7270bb8745d97ce8c28fb2ad446bbfc8da91fd`
  * `s3-toadstool.gif`, 111,573 bytes: `b0d7e9edb0a5cdf6b3cc0031ecc91f450d868900c6730b5a09a02d597aeba9ea`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

## Forced decisions

Section titled “Forced decisions”

Sometimes the only legal move is “wait”: during a screen transition, while held buttons settle, while health changes finish, on room entry, or while confirming the finish. Those answers are marked **forced**. The rule is exact: an Action is forced when the active skill’s allowed moves are just the single wait move.

Forced rows are **tagged, not dropped**. In the first successful S3 run, 387 of 1,043 decisions were forced. Whether to train on them is a separate decision; for now, no training rule is applied.

## Receipt caps

Section titled “Receipt caps”

An item hand-over (a **receipt**) can legitimately take a while. The oracle allows each receipt step a cap based on the teacher’s evidence: **twice the longest the teacher took, and at least 600 frames.** For S3 that means 600, 3,450 and 600 frames for the three steps. The teacher took 1,725 frames on the long one. Past the cap, the oracle refuses with `RECEIPT_TIMEOUT`.

This cap used to live in the executor. The “receipt-clamp saga” in [War stories](/war-stories/#1-the-receipt-clamp-saga) explains why it moved here.

other oracle thresholds

From the S3 phase table: up to 3 recovery attempts of 32 frames each; a stall is 24 decisions without progress; push attempts are 64 frames with an 8-frame retreat, up to 3 attempts; an off-route depth cap of 3; a 24-frame sword cooldown. The alignment tolerance for presses is **0 pixels**. It used to be 4; see “Stuck at the cave door” in [War stories](/war-stories/#5-stuck-at-the-cave-door).

## Drive mode and label mode

Section titled “Drive mode and label mode”

  * **Drive mode:** the oracle plays. At each decision the system takes a read-only capture, builds the record and view, and asks `decide()`. The executor carries out the answer, and only what actually happened is folded into the tracker. `Done` counts as success only if the shared finish test agrees. A refusal ends the run as a failure.
  * **Label mode:** the _student_ plays, and the oracle only records what it would have done. Its answer is never applied. This is how DAgger labels a student’s own runs.

**Consistency check.** The first successful S3 drive took 1,043 decisions. Replaying those exact moves in label mode produced oracle labels equal to the drive’s actions at **all 1,043 decisions** , with identical views and records and zero refusals. Same view, same answer, in both modes.

## The full-log shadow audit

Section titled “The full-log shadow audit”

The **shadow audit** replays the teacher’s entire recorded run from power-on, twice, in separate processes. At every frame it asks the executor: would you have allowed this? Nothing is pressed by the audit itself. It is a regression test against known-good production traffic.

The latest result covered 48,730 frames, 47,119 of them admitted. The refusals fell only into two groups known to be allowed (1,511 and 100). Both processes were byte-identical, and so was the result against the previous baseline.

## The executor

Section titled “The executor”

The **executor** turns a move class into actual button presses.

  * **90 move classes.** Classes 0–29 are the older “ready-frame” moves, kept exactly as the sealed segments used them. Classes 30–89 press a listed button mask for exactly one frame each, with no hidden extra releases.
  * **Medium moves** (classes 62–89) hold a direction or button for 4 or 8 frames. They are allowed only during normal play.
  * **Menus** have dedicated classes: open the menu, move the cursor right, assign to A, assign to B. Each is allowed only on the right screen. The executor logs whether an assignment was verified.
  * **Jumps** have no special class. A jump is a press of the B button with the Feather item equipped. The executor’s rules require a B-free frame before a new jump, so held buttons can’t silently re-trigger one.
  * **Typed records** cover refusals, interruptions, failures and declines. They are kept as evidence and are never training labels.

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/menu-assign.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

What the executor's menu classes have to reproduce. Inside the witch's hut the recorded teacher run opens the inventory, puts the Sleepy Toadstool on the A button and closes the menu again, at normal speed. No oracle run has reached a menu yet, so this clip comes from the teacher's recorded run. The clip itself is a replay of recorded button presses only, with zero memory writes.Provenance

Item
    `menu-assign`: Assigning an item in the menu
Source run
    house-to-boss-door-v1 frozen teacher run (the recorded teacher trajectory; frame log from route-scoping-20261001)
Range
    frames 19384–19500 (117 frames)
Playback
    real time (59.7275 frames per second); 1.959 s
Verification
    Re-rendered from one boot-state load by input replay only; all 19,494 emulator frames from frame 7 to frame 19500 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `e4f8ffc33d53b5b4767c21f807f32084ec4c3b141444597750f9f274b0b71051`
Screen-off frames shown white
    19468, 19469, 19470, 19471, 19478, 19479, 19480
Files (SHA-256)
    

  * `menu-assign.webm`, 306,099 bytes: `55dca669d2b8d294f173f59bc7e96460fd359ff4e98084d75a6e4a76e5a722d2`
  * `menu-assign-poster.png`, 3,496 bytes: `1dbdc6ea6b1038a540391c31414599c52bd21bb097c8d9a7f8126b12d3249ffe`
  * `menu-assign.gif`, 582,541 bytes: `49d660e129a1d566b37982585cdf7ef0847ecb8ead12e0656b9bdc9839db20dd`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/feather-jump.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

What a jump looks like. In Tail Cave the recorded teacher run jumps over a pit with the Roc's Feather, lands on the far side and leaves the room, at normal speed. Also from the teacher's recorded run. For the executor, a jump is a B press with the Feather equipped, after a frame with B released.Provenance

Item
    `feather-jump`: Feather jump
Source run
    house-to-boss-door-v1 frozen teacher run (the recorded teacher trajectory; frame log from route-scoping-20261001)
Range
    frames 47130–47260 (131 frames)
Playback
    real time (59.7275 frames per second); 2.194 s
Verification
    Re-rendered from one boot-state load by input replay only; all 47,254 emulator frames from frame 7 to frame 47260 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `3268e4618c8ad734b5220254ccb8e90a700fcaae22ed44a54f39568f62907d8d`
Files (SHA-256)
    

  * `feather-jump.webm`, 155,719 bytes: `a1579eceba75612b7e7420ba2043d2e4bf46a4697da7dba7a09c46a11b481cc3`
  * `feather-jump-poster.png`, 9,521 bytes: `2e3bcd7bba9c414dc74b7ffdfae9afd9402b6c7687f26714dde347ebb8a07534`
  * `feather-jump.gif`, 883,281 bytes: `facbf49ec3775139ea2cd436c50bfd071611052c7e851580ed101891c2c1f22c`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `gbg-data/gbg_data/oracle_v5/ (decide.py, phase.py, types.py, config.py, __init__.py; tables/s3_phase_table.json and s3_region_graph.json)`
  * `gbg-data/gbg_data/tracker_v3.py (goal lock; phase fold)`
  * `gbg-data/gbg_data/harness_v3.py (drive and label policies)`
  * `gbg-data/gbg_data/executor_v3_1.py and action_schema_v3_1.json (class split, medium classes, menu classes, B-press rearm rule, typed records)`
  * `dev-smoke/oracle-v5-4a-20261004/REPORT.md and ORACLE-V5-S3-PLAN.md (skill design, purity test, forced rule)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (first drive, 387 forced of 1,043, drive/label consistency, shadow audit regression)`
  * `dev-smoke/v3-executor-p3b6-20261003/REPORT.md (full-log shadow audit)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 7: oracle interface and design priorities)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `gbg-data/gbg_data/oracle_v5/ (decide.py, phase.py, types.py, config.py, __init__.py; tables/s3_phase_table.json and s3_region_graph.json)`
  * `gbg-data/gbg_data/tracker_v3.py (goal lock; phase fold)`
  * `gbg-data/gbg_data/harness_v3.py (drive and label policies)`
  * `gbg-data/gbg_data/executor_v3_1.py and action_schema_v3_1.json (class split, medium classes, menu classes, B-press rearm rule, typed records)`
  * `dev-smoke/oracle-v5-4a-20261004/REPORT.md and ORACLE-V5-S3-PLAN.md (skill design, purity test, forced rule)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (first drive, 387 forced of 1,043, drive/label consistency, shadow audit regression)`
  * `dev-smoke/v3-executor-p3b6-20261003/REPORT.md (full-log shadow audit)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 7: oracle interface and design priorities)`
