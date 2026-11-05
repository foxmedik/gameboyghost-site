---
title: "Data and publishing"
track: "Builder"
---

In plain English

The plan is to publish the project’s data so others can check it and learn from it. Before anything goes out, it gets scrubbed: no copy of the game, no raw game memory, and no screen recordings beyond short verified clips. The dataset is not built yet. The short clips on this site are, and the last section explains how each one is checked.

PLANNED

No public dataset has been published yet, and the export format is not built. This page describes the author’s plan and what the existing files would need for it.

Publishing data from GameBoyGhost is like publishing logs from a production system. They are valuable, but you scrub them first. You keep what helps others verify and learn. You remove what you don’t have the right to share, or what nobody needs.

## The planned pipeline

Section titled “The planned pipeline”

Four stages left to right: a finished campaign; an export step that keeps features, labels, actions, outcomes, manifests, ledger hashes and replay proofs while dropping raw game memory and frames; a validator that checks fingerprints and exclusions; and an upload to public hosting such as Hugging Face and GitHub. All four boxes are dashed to mark them as planned.Campaignfinished, ledgerchain verifiedExportkeep: features, labels,actions, outcomes, proofsdrop: raw memory, framesValidatorfingerprints match;nothing excluded presentUploadHugging Face,GitHubThe PLANNED path from a campaign to a public dataset. The validator is the gate: nothing uploads unless every fingerprint checks out and nothing excluded slipped through.

## What a public shard would contain (PLANNED)

Section titled “What a public shard would contain (PLANNED)”

According to the author’s notes, public shard exports would include:

Part | What it is  
---|---  
**Features** | The values the student saw at each decision, meaning its fixed 909-value view.  
**Labels** | The oracle’s answer for each of those views.  
**Actions** | What was actually done (the move class) and how it went.  
**Outcomes** | How each run ended: success, budget exhausted, refusal, and so on.  
**Manifests** | The frozen job list, with machine-specific details removed.  
**Ledger hashes** | The fingerprint chain, so anyone can check the data matches what was recorded.  
**Replay proofs** | Evidence that the runs reproduce, such as import proofs and comparison results.  
  
Hugging Face (a popular host for machine-learning datasets) and GitHub are the planned destinations.

## What is left out, and why

Section titled “What is left out, and why”

The author’s notes state _what_ is excluded. The “why” column is an editorial reading based on the project’s own rules, not a quote.

Left out | Why (editorial)  
---|---  
**Raw game memory** | The student learns only from its fixed 909-value view. That view is the documented subset that matters for the data. Raw memory is the game’s own internal state.  
**Screen frames** | Not needed to learn from the data. Short, verified clips on this site are the exception: chosen moments only, from the author’s capture pipeline.  
**The game file, saved states, the start point** | Never shared, anywhere. The project rules treat them as private files that never enter git or any upload.  
what the existing files contain, and what an exporter must strip

From the current campaign format, each shard’s detail files include:

  * **Frame log:** one row per game frame, with the move, button masks, modes and fingerprints. It also includes a small `peek` of raw memory bytes at a few fixed addresses, which an export must remove.
  * **Decisions:** the move class, status, reason, frames used and observations, plus the oracle’s labels for oracle runs. This is the natural source of actions, labels and outcomes.
  * **Records:** typed refusals, interruptions and failures. These are never training labels (rule R6).
  * **Result file:** checks, outcome, counts and fingerprints.

Some bound inputs must never be exported. The large route-scoping frame log contains full raw memory dumps. Manifests bind the game file and the start point. Older manifests and some replay notes contain machine-specific absolute paths that would need scrubbing.

## How the footage is made

Section titled “How the footage is made”

This section describes the clips and stills that are on the site now. It is not a plan.

Every clip and still on this site is rebuilt from a recorded run and checked as it is rebuilt. Think of a chain of custody for evidence. A copy is not trusted on its own; it is checked, piece by piece, against the original case log.

  1. **One boot.** The **emulator** (software that imitates the Game Boy hardware) loads the project’s fixed starting point once. No saved game positions are loaded after that.
  2. **Replay the recorded inputs.** The emulator is fed the exact button presses recorded during the original run. Nothing new is decided; the program that made the run is not asked again.
  3. **Compare on every frame.** A **frame** is one still picture of the game; the Game Boy draws about 60 a second. After each frame, a **hash** of the game’s state is compared with the hash recorded during the original run. A hash is a short fingerprint computed from data: change one byte and the fingerprint changes completely.
  4. **Any mismatch means no clip.** A mismatch stops the render before any picture is written, so a failed check produces no footage at all.

The **“Verified replay” badge** under each clip or still means that all four steps passed for every frame from the start of the run to the last frame shown.

**One clip has a second badge level, “Physically verified replay.”** It is the “before” clip of the crumbling-floor fall in [War stories](/war-stories/), recorded with an older version of the oracle. Every frame matched the recorded run’s game-state checksums, so the game did exactly what the recording says. Part of that older oracle’s internal bookkeeping can no longer be recomputed with today’s code, so it was not re-checked. Its “after” clip is fully verified, bookkeeping included.

**The badge certifies the game state, not individual pixels.** The pictures are then encoded into WebM, a compressed video format for the web. Compression shifts colors very slightly: in the capture report, no color value in any decoded clip was more than 12 steps away (out of 255) from the emulator’s own picture. The pixel art is enlarged 4 times by copying pixels, never by blending them.

**Screen-off frames are shown white.** During some room transitions the Game Boy switches its screen off for a few frames. The emulator draws those frames black. On real Game Boy Color hardware a switched-off screen is blank white, so the site shows them white. This also avoids rapid black flashes. Only the picture changes; the game state check is unaffected. The clips with such frames are:

  * The oracle plays S3 on its own (`hero-s3-full`): 7 frames
  * The oracle plays S3 (real time) (`hero-s3-realtime`): 9 frames
  * Assigning an item in the menu (`menu-assign`): 7 frames

**Each item has a “Provenance” detail.** Open it under any clip or still to see the source run, the exact frame range, the playback speed, and the item’s **verified range digest** : one fingerprint that covers the per-frame records of exactly the frames in that item. It also lists the SHA-256 fingerprint of every file, so a downloaded copy can be checked against it. (SHA-256 is a standard hash.)

**Playback speed.** Most clips play in real time. Two long stretches are sped up by skipping frames: at 3× speed the clip shows every third frame, and at 6× every sixth. The speed is shown next to the badge whenever it isn’t 1×.

the exact verification rules

  * Every render loads the start point once and makes zero memory writes and zero saved-state loads. A read-only wrapper around the emulator refuses a second load and any save.
  * Frames 1 to 6 are settle frames after the start-up load. The recorded log starts at frame 7, so they cannot be checked, and no clip includes them. The earliest frame shown anywhere is 12917.
  * Frames from a teacher run (the teacher is the project’s earlier expert program) are compared with its frozen frame log, row by row. Frames from an oracle run (the oracle is the newer expert program built for S3) are compared with the recorded ticks, one record per frame: the frame number, the record’s fingerprint, 15 bytes read from game memory, and the fingerprint after the tracker (the running summary of the game) was updated.
  * Verified range digest: the SHA-256 of one line per frame in the range, each line being the frame number and that frame’s recorded digest.
  * Picture: enlarged 4 times by nearest neighbor (each pixel copied into a 4 by 4 block) to 640 by 576, encoded as VP9 video in WebM at 59.7275 frames per second. The site then shows it at 3 or 2 times the native 160 by 144 size, with pixel blending turned off.
  * The first frame after the screen comes back on has its top line of pixels black (1 of 144 lines). It is left as the emulator drew it.
  * The first clip was rendered and encoded twice, in separate processes. The two video files are byte-identical.

## The premiere plan (decided Oct 4, 2026)

Section titled “The premiere plan (decided Oct 4, 2026)”

The public **premiere** is a full chain: from power-on, through the dungeon Tail Cave, to collecting an item called the Full Moon Cello.

  * The current design runs to the boss door (segment S18).
  * Segments for the boss (Moldorm), the Heart Container and the Cello will be designed later. Moldorm is planned as a dedicated effort, possibly with a “practice range” for overnight batches (see the cookbook).
  * Datasets and this website will be published **incrementally** , before the premiere, not all at once at the end.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (how the footage is made: one boot, input replay, per-frame checks, screen-off frames, verified range digests)`
  * `CAPTIONS.md from the author's media export of Oct 5, 2026 (the two badge levels)`
  * `Author's notes (dataset contents and exclusions, Hugging Face and GitHub, premiere plan decided Oct 4, 2026: all PLANNED)`
  * `gbg-data/gbg_data/harness_v3.py and executor_v3_1.py (current shard detail files, the peek bytes, refusal records)`
  * `cli/gbg_cli/campaign.py (manifests bind the game file and start point)`
  * `data-architecture/spec.md (earlier data layout; raw perception bytes; framebuffer and save states excluded)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value student view)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `dev-smoke/media-capture-20261004/REPORT.md and media-manifest.json (how the footage is made: one boot, input replay, per-frame checks, screen-off frames, verified range digests)`
  * `CAPTIONS.md from the author's media export of Oct 5, 2026 (the two badge levels)`
  * `Author's notes (dataset contents and exclusions, Hugging Face and GitHub, premiere plan decided Oct 4, 2026: all PLANNED)`
  * `gbg-data/gbg_data/harness_v3.py and executor_v3_1.py (current shard detail files, the peek bytes, refusal records)`
  * `cli/gbg_cli/campaign.py (manifests bind the game file and start point)`
  * `data-architecture/spec.md (earlier data layout; raw perception bytes; framebuffer and save states excluded)`
  * `dev-smoke/v3-foundation-p1-20261002/AMENDMENT-A1.md (909-value student view)`
