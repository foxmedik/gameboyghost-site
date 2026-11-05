---
title: "The learning stack"
track: "Builder"
---

In plain English

The game is split into short stretches called segments. For each one, an expert program shows the right moves, a smaller program learns by copying them, and a one-time test decides whether it learned well enough. Three segments are done; the rest are planned.

Think of training a new helpdesk hire. You don’t throw them the whole job at once. You break it into tasks, show them how an expert handles each one, let them try, review the tickets they actually got wrong, and only sign them off on a task once they pass a test you agreed on in advance.

GameBoyGhost trains its game-playing program the same way.

## The route, segment by segment

Section titled “The route, segment by segment”

The journey is cut into **segments** : short stretches, each with an exact start test, an exact finish test, and step limits. The map below is an abstract graph of those segments, not a map of the game world.

An abstract chain of 22 numbered nodes in four rows, read left to right then snaking. Row 1: S0 sword, S1 to the woods, S2 through the woods (all three sealed), S3 mushroom (in development), S4 back to the witch, S5 powder exchange. Row 2: S6 raccoon and Tail Key, S7 open Tail Cave, S8 first key, S9 switch and second key, S10 north lock, S11 block and beetles. Row 3: S12 Feather, S13 back to the junction, S14 third key, S15 Nightmare Key, S16 final lock, S17 Rolling Bones. Row 4: S18 open the boss door, then three dashed planned nodes: Moldorm, Heart Container, Full Moon Cello. A legend shows sealed, in development, designed, and planned later.S0swordS1to the woodsS2through the woodsS3mushroomS4back to the witchS5powder exchangeS6raccoon, Tail KeyS7open Tail CaveS8first keyS9switch, second keyS10north lockS11block, beetlesS12FeatherS13back to junctionS14third keyS15Nightmare KeyS16final lockS17Rolling BonesS18open boss doorPLANNEDMoldormPLANNEDHeart ContainerPLANNEDFull Moon Cellosealedin developmentdesignedplanned laterThe segment chain as an abstract graph. S0–S2 are sealed. S3 is in development. S4–S18 are designed (DESIGN-V3.1). The last three are PLANNED: they will be designed later, toward the premiere. Segment | Start → finish (plain words) | Status  
---|---|---  
**S0** | From the house, before the sword, to picking up the sword. | Sealed. 96 of 100 on the final test, 98 of 100 on confirmation (bar: 90).  
**S1** | With the sword, to the entrance screen of the Mysterious Woods. | Sealed. 299 of 300 primary (bar: 291).  
**S2** | Through the Mysterious Woods to a settled arrival on the far side. | Sealed. 294 of 294 primary (bar: 286).  
**S3** | From the S2 exit through a short cave to picking up a mushroom. | Oracle in development.  
**S4–S18** | The rest of the way into Tail Cave, ending with the boss door open, while standing outside the boss room. | Designed, not built.  
**Moldorm, Heart Container, Full Moon Cello** | The boss fight and the items after it, up to the premiere goal. | PLANNED. To be designed later.  
  
![Still frame: a forest screen with a yellow flower bed. Link is at the bottom, and two blue Moblins are nearby.](/media/2026-10-04/still-ow52.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

1\. Overworld screen 0x52. The oracle crossing the first forest screen of S3, with two Moblins nearby.

![Still frame: a forest screen with a signpost in the middle. Link is next to the sign, a Moblin is below, and the cave door is at the top right.](/media/2026-10-04/still-ow62.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

2\. Overworld screen 0x62. The oracle on the forest screen with the cave door at the top.

![Still frame: an orange cave room with dark pits, blue crystals and a yellow block with a face in the middle. Link is on the left edge.](/media/2026-10-04/still-cbd.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

3\. Cave room C:BD. The oracle working its way around the first cave room, which has the crumbling floor.

![Still frame: Link in a narrow orange cave passage that turns a corner.](/media/2026-10-04/still-cac.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

4\. Cave room C:AC. The oracle in the narrow cave passage on the way west.

![Still frame: a cave room scattered with dark round rocks and two green skull shapes. Link, on the right, pushes a rock to the left.](/media/2026-10-04/still-cab.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

5\. Cave room C:AB. The oracle pushing the first rock to the left in the rock-push room.

![Still frame: Link on a forest screen, holding a red mushroom overhead.](/media/2026-10-04/still-ow50.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

6\. Overworld screen 0x50. The oracle holding up the Sleepy Toadstool, the goal of S3.

Segment S3, one still per room in route order: from the forest where S2 ends, through three cave rooms, out to the forest screen where the oracle picks up the mushroom (the game calls it the Sleepy Toadstool).Provenance

Item
    `still-ow52`: S3 route: overworld screen 0x52
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 12981, drive tick 65
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `820619e80156403dc0781a665b14ce33a75b9dd31bc656f9fa2aa80ecefb9ed0`
Files (SHA-256)
    

  * `still-ow52.png`, 11,578 bytes: `4f83ccab74ad8529ecb769879f8b89f8776c7c4b65c3bb62d844d50058fddf29`

Item
    `still-ow62`: S3 route: overworld screen 0x62
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 13120, drive tick 204
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `db06ec248d40f685d7dbe5113798ba4293d893f5d01d6087487a855f319487d8`
Files (SHA-256)
    

  * `still-ow62.png`, 9,193 bytes: `2cf5663ac7596a547d76f4a21f2e1b1653dfb505036680daca60d3f34a32238e`

Item
    `still-cbd`: S3 route: cave room C:BD
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 13404, drive tick 488
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `b0a630e865bc9ce8c40f4fb281252ef5bae6adc64c501b1410c385b8c8182b07`
Files (SHA-256)
    

  * `still-cbd.png`, 12,662 bytes: `f64f2ba6f1a1f2243838d769cd827db499c9765b086bf77d749d833e0b77a293`

Item
    `still-cac`: S3 route: cave room C:AC
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 13589, drive tick 673
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `5902f948c9c9aa4e190065748ec64789c75d69d6b941874363aac288db7e28f2`
Files (SHA-256)
    

  * `still-cac.png`, 11,048 bytes: `5c8e085f94362259fbaca288001f015e2fc230739af711daabf67ba2d2123bc1`

Item
    `still-cab`: S3 route: cave room C:AB
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 13820, drive tick 904
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `a9470867d0ef119caafe9801beabaf6f4ba1ef21514dacfd515231ac23483208`
Files (SHA-256)
    

  * `still-cab.png`, 11,355 bytes: `f9ae9a594f956b3cf454b637b3a1c602b0457f28f94c140349a8d3de5817dcf7`

Item
    `still-ow50`: S3 route: overworld screen 0x50
Source run
    Phase 4b oracle drive, iteration 1 (s3-oracle-drive-v1 after fix 1), repeat-1: SUCCESS, Done:E3 at f14576
Range
    frame 14236, drive tick 1320
Verification
    Re-rendered from one boot-state load by input replay only; all 14,230 emulator frames from frame 7 to frame 14236 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `37b553c8c58c79ce245d3f488d96c6f20c3e30fdfd6de5dc022316a6963313a7`
Files (SHA-256)
    

  * `still-ow50.png`, 11,177 bytes: `7583006fa730d302e039f346fa7270bb8745d97ce8c28fb2ad446bbfc8da91fd`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

![Still frame: Link stands at the top doorway of a blue-floored dungeon room, the door to the Tail Cave boss.](/media/2026-10-04/boss-door-still.png)

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

The final frame of the recorded teacher run, with Link at the Tail Cave boss door.

This browser cannot play the video. [Open the GIF version](/media/2026-10-04/boss-door.gif)Play

[Verified replay: game state hash-checked every frame](/data-publishing/#how-the-footage-is-made)

The last five seconds of the recorded teacher run, as Link walks up to the boss door of Tail Cave, at normal speed.

Where this is heading: the boss door of Tail Cave, where the current design ends (S18). The teacher, the project's earlier expert program, already reaches it in its recorded run.Provenance

Item
    `boss-door-still`: At the Tail Cave boss door
Source run
    house-to-boss-door-v1 frozen teacher run (the recorded teacher trajectory; frame log from route-scoping-20261001)
Range
    frame 48737
Verification
    Re-rendered from one boot-state load by input replay only; all 48,731 emulator frames from frame 7 to frame 48737 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `20288c34eaf2ff9f5056fa0e62211e64d8afcb240bf26441cac7c3d9327301ed`
Files (SHA-256)
    

  * `boss-door-still.png`, 9,945 bytes: `cd6b763f80cc93878a7f64166c1173f4918823a1d6d5396d33610d9619b7a0ed`

Item
    `boss-door`: Arrival at the Tail Cave boss door
Source run
    house-to-boss-door-v1 frozen teacher run (the recorded teacher trajectory; frame log from route-scoping-20261001)
Range
    frames 48440–48737 (298 frames)
Playback
    real time (59.7275 frames per second); 4.99 s
Verification
    Re-rendered from one boot-state load by input replay only; all 48,731 emulator frames from frame 7 to frame 48737 matched the recorded run's per-frame digests. Start-up loads: 1. Other saved-state loads: 0. Memory writes: 0.
Verified range digest
    `722bba942fd59333522e6d89a7ce7831432ce326bcdd1ba3347207317aecbf75`
Files (SHA-256)
    

  * `boss-door.webm`, 201,297 bytes: `69dda11bdf6f86b3b0dd039c9c7e51de0903cec98d777a178a7cc45e0c4c1bf6`
  * `boss-door-poster.png`, 9,945 bytes: `cd6b763f80cc93878a7f64166c1173f4918823a1d6d5396d33610d9619b7a0ed`
  * `boss-door.gif`, 251,890 bytes: `3c72d4bad12e8f25a738a9db79e8d2dadc4c7edcb60d2acec68e8a14385c7004`

[How the footage is made](/data-publishing/#how-the-footage-is-made)

## Teacher, oracle, student

Section titled “Teacher, oracle, student”

Three roles, three different jobs:

  * **Teacher:** the project’s earlier expert program. Its recorded runs are _evidence_ : a known-good route to compare against and borrow logic from. It is not used to produce new training labels for S3 and later.
  * **Oracle:** a rewritten expert, built so it can answer correctly from _exactly what the student sees_. It is a pure function: give it the student’s view and its frozen settings, and it returns a move, “done,” or “I can’t answer.”
  * **Student:** the small program that actually plays in the end. It learns by copying the oracle’s answers.

Pipeline diagram. The teacher's recorded run feeds into the oracle as evidence and logic to adapt. The oracle answers on student views to produce labels. Labels feed behavior cloning, which produces the student. The student plays new runs, and the oracle labels the student's own situations offline: the DAgger loop back into the labels. The student finally goes to the gate: pass and sealed, or fail and back to development.Teacher runsevidence onlyOracledecide(student view)Labelsrefusals never includedTrainingbehavior cloningStudentplays new runsGaterun once: seal or notDAgger:oracle labelsthe student’sown runsFrom expert to signed-off student. The DAgger loop adds the situations the student actually gets into, not just the expert's clean path.

## Labels depend only on what the student sees

Section titled “Labels depend only on what the student sees”

**Like:** a fair exam. If the answer key uses information the student was never given, no amount of studying lets them match it.

The rulebook makes this a hard rule. Every label must be a **pure function of the student view** : the fixed list of 909 values the student receives. If two identical views ever get different labels, production of training data stops (a STOP). Label mode never holds a live game. Records without their phase tables loaded refuse.

This rule came from experience. In S2, two training rounds under an earlier observation format produced hundreds of label conflicts (235, then 295), which a majority-vote build had to smooth over. The retrained S2 student used a new observation format and a rule to refuse on _any_ conflict. It had zero conflicts, and it is the one that passed the gate.

## Behavior cloning, then DAgger

Section titled “Behavior cloning, then DAgger”

  1. **Behavior cloning** (round 0): train the student on the oracle’s answers along clean runs.
  2. **DAgger** (round 1 and later): let the student play. It will wander into situations the clean runs never showed. The oracle labels those situations _after the fact_ (never steering), refusals are dropped, the new labels join the pile, and the student is retrained. Repeat until a stopping rule is met.

the student models so far Segment | Model | Inputs | Moves  
---|---|---|---  
S0 | One deterministic decision tree (81 leaves, depth 12) | 89-value features, of which it uses 6 | 11 move classes  
S1 | “D3”: a decision-tree controller, after several DAgger rounds (the largest round collected 573,029 labeled pairs) | 62-value encoding | 15 move labels  
S2 | A deterministic classification tree (508 leaves, depth 23), trained on 686,081 labels with zero conflicts | 97-value observation (format v2.2) | 30 move classes  
S3+ | Not trained yet; the oracle comes first | 909-value student view | 90 move classes  
  
All are deterministic: the same training data always produces the same model.

## Gates and thresholds

Section titled “Gates and thresholds”

A **gate** is decided in advance and run once.

  * **Segment gates:** pass only if primary successes are at least `ceil(0.97 × N)`. For N = 294, that is at least 286. There must also be zero integrity, tracker or execution exceptions, and all determinism repeats must match. (S0’s earlier gate used a fixed bar of 90 of 100.)
  * **Development target before any new gate can be locked:** zero primary failures on at least 200 cases that actually reached the segment’s start. The design calls it “an engineering eligibility bar, not a statistical proof.”

## The composition gate

Section titled “The composition gate”

The final test plays the **whole chain** from power-on: 300 independent attempts, at least 291 must succeed. Any failure anywhere in the chain counts: earlier segments, deaths, running out of time.

Why the strict per-segment development target? Chains multiply risk. Assuming S0–S2 succeed 99.5% of the time (a stated planning assumption), hitting 97% end to end across sixteen new segments needs each new segment at about **99.84%**. Sixteen segments at exactly 97% would compose to only about 61%.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `segments/segment_s1_v1.json and segment_s2_v1.json (S1, S2 start and finish)`
  * `phase3/RESULTS.md and phase4/RESULTS.md (S0 model, 96/100 and 98/100 against 90)`
  * `s1-recon/FINDINGS.md (S1 finish screen as the Woods entrance)`
  * `gbg-data/RESULTS.md (S1 gate 299/300; S2 gate 294/294; S1 DAgger rounds)`
  * `dev-smoke/s1-d3-20260928/model_d3.json (S1 model)`
  * `dev-smoke/s2-v22-20261001/REPORT.md and round0/train/model_s2.json (S2 model, zero conflicts)`
  * `dev-smoke/s2-dagger-r1-20261001 (earlier S2 conflict counts)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 3 segment plan S3–S18; Part 6 label purity; Part 8 development target, composition math)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value view)`
  * `AGENTS.md (sections 5 and 8: label rules, gate rules)`
  * `data-architecture/spec.md (DAgger loop)`
  * `Author's notes (premiere goal and the later segments, decided Oct 4, 2026)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (footage: captions, speeds, frame ranges, verification)`
  * `segments/segment_s1_v1.json and segment_s2_v1.json (S1, S2 start and finish)`
  * `phase3/RESULTS.md and phase4/RESULTS.md (S0 model, 96/100 and 98/100 against 90)`
  * `s1-recon/FINDINGS.md (S1 finish screen as the Woods entrance)`
  * `gbg-data/RESULTS.md (S1 gate 299/300; S2 gate 294/294; S1 DAgger rounds)`
  * `dev-smoke/s1-d3-20260928/model_d3.json (S1 model)`
  * `dev-smoke/s2-v22-20261001/REPORT.md and round0/train/model_s2.json (S2 model, zero conflicts)`
  * `dev-smoke/s2-dagger-r1-20261001 (earlier S2 conflict counts)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 3 segment plan S3–S18; Part 6 label purity; Part 8 development target, composition math)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value view)`
  * `AGENTS.md (sections 5 and 8: label rules, gate rules)`
  * `data-architecture/spec.md (DAgger loop)`
  * `Author's notes (premiere goal and the later segments, decided Oct 4, 2026)`
