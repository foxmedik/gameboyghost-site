---
title: "The campaign system"
track: "Builder"
---

In plain English

A campaign is a big batch of game runs, planned in full before it starts. Every finished run is written into a log where each entry is chained to the one before, so any tampering shows. Any run can be replayed later to prove it comes out exactly the same.

A **campaign** is GameBoyGhost’s batch job. Think of a print queue crossed with an accounting ledger. You decide the whole job list up front, the system works through it, and every finished piece goes into a tamper-evident book. Anyone can later re-run any piece and check that it comes out the same.

## The lifecycle

Section titled “The lifecycle”

Five stages left to right: declare a campaign config; freeze it into an unchangeable manifest; run it, with workers producing shards; record each shard in the hash-chained ledger and summary.json; replay any shard later and compare. A morning report comes out of the run stage.1\. Declarejobs, owner,offsets, seeds2\. Freezemanifest.json,write-once3\. Runworkers, oneshard each4\. Recordledger chain +summary.json5\. Replayre-run andcompare bytesmorning reportA campaign's life. Once frozen, the job list never changes. Running only adds ledger entries. Replaying never writes into the campaign at all.

## Manifests and shards

Section titled “Manifests and shards”

**Freezing** turns a campaign declaration into `manifest.json`, the job list. It is like a lockfile for a batch. It fixes:

  * every job and every shard;
  * the exact offset (test-case number) and seeds for each shard;
  * the owner segment and the deadline;
  * the maximum number of workers (default 4, at most 28);
  * fingerprints of every file the run depends on, including the interpreter itself.

The manifest is written with a method that refuses to overwrite an existing file. After freezing, it never changes.

A **shard** is one unit of work: one fresh worker process playing one run with fixed settings. In the current (version 3) format, each shard produces a compressed output summary plus four detail files:

  * the frame-by-frame log;
  * the decisions;
  * the typed refusal and interruption records;
  * a result file.

what the manifest binds, in detail

  * **Two kinds of source files.** _Execution_ sources are the code that plays the game. _Orchestration_ sources are the scheduling and replay code. A run requires every fingerprint to match. A replay lets only orchestration files differ, so newer scheduling code can re-run old work.
  * **Version 3 paths** are written relative to a named root, `segments:` or `agent:`, instead of as absolute paths. That is what makes replays from a clean exported copy possible.
  * **Version 3 also records** the offset check, the derived occupancy (below), and the worker interface, `explicit-roots-v1`.

## The ledger: a hash chain

Section titled “The ledger: a hash chain”

Three ledger records in a row and a head file. Each record holds a sequence number, the shard name, the output file's fingerprint, and the previous record's fingerprint. Arrows show each record's fingerprint flowing into the next record's 'previous' field. The first record's previous field is sixty-four zeros. The head file holds the count and the last record's fingerprint.Record 0previous: 000…000shard + output fingerprintfingerprint ARecord 1previous: Ashard + output fingerprintfingerprint BRecord 2previous: Bshard + output fingerprintfingerprint CHeadcount 3last: CThe ledger as a hash chain. Change any old record and its fingerprint changes, which breaks every later 'previous' link and the head.

Every finished shard gets one ledger record. Each record carries a sequence number, the shard’s name, its output file’s fingerprint, and **the previous record’s fingerprint**. The first record points to sixty-four zeros. A small **head** file holds the count and the latest fingerprint.

This is how tamper-evident audit logs work. Delete, reorder or edit any record and verification fails, with errors like “sequence gap”, “hash chain mismatch” or “head hash mismatch.”

### summary.json

Section titled “summary.json”

The ledger and the big output files are not committed to git. They are too many and too large. Instead, the committed **`summary.json`** lists every finished shard with its output fingerprint and its ledger-record fingerprint. That is enough to rebuild every ledger record and recompute the chain up to the committed head. So a small committed file vouches for a large uncommitted pile.

ledger and summary formats

  * **Record body:** `{sequence, previous, shard, output, output_sha256}`. The older format also stores seconds and CPU seconds. Version 3 deliberately stores **no timing** , so the ledger doesn’t depend on how fast the machine was.
  * **Stored file:** `{"record": body, "sha256": sha256(canonical JSON of body)}`. Canonical JSON means sorted keys, compact separators, and no NaN values.
  * **Summary columns:** version 3 uses `[shard, output_sha256, record_sha256]`. The older format adds `seconds, cpu_seconds`.
  * **Write method:** write a temporary file, flush it to disk, then hard-link it into place. A hard link refuses if the target exists, which makes records write-once.

### The event log, compressed the same way every time

Section titled “The event log, compressed the same way every time”

The runner also keeps an event log: launches, completions, timings. It is committed in compressed form. Normally, gzip stamps the current time and the file name into its header. That would make the compressed file differ on every run. The project compresses with a **fixed level (9), a zero timestamp, and no file name** , so the same log always produces the same bytes, and therefore the same fingerprint.

## What gets committed and what doesn’t

Section titled “What gets committed and what doesn’t”

Committed (small, reviewable) | Kept out of git (large), fingerprinted  
---|---  
manifest, manifest fingerprint, ledger head | per-shard outputs  
`summary.json`, morning report, `REPORT.md`, status | ledger record files  
compressed event log, import proofs | detail files (frame logs, decisions, records)  
replay requests and comparisons | worker scratch space, the raw event log, lock files  
  
The large files stay on disk and on the backup drive. For scale: a pilot measurement estimated about 7.4 MB committed and about 14.5 MB of uncommitted data per 10,000 shards. The raw event log alone would have crossed the 20 MiB commit guard at about 27,000 shards. That is why it is now committed compressed.

## Crash safety and resume

Section titled “Crash safety and resume”

What happens if the computer loses power mid-batch?

  * **One runner at a time.** The runner takes a lock. A second runner refuses: “campaign already has a runner.”
  * **No orphans.** On resume, if a worker from the previous run is still alive, the runner refuses, rather than risk two workers on the same shard.
  * **Half-finished work is discarded.** An output without a ledger record counts as incomplete. Incomplete shards start over from power-on (there is no saved game state to resume from, by rule R13).
  * **Tested.** The test killed the runner with 12 shards committed and 4 in flight, then resumed. The final result was identical, byte for byte, to a run that was never interrupted.

## Worker-count invariance

Section titled “Worker-count invariance”

Results must not depend on how many workers ran. Two design choices make that true:

  1. **Commit in job-list order.** A shard that finishes early waits in a buffer until every shard before it is done. So the ledger order is always the manifest order.
  2. **No timing in the ledger.** Wall-clock times go only into the event log.

**Proof:** the same 33-shard campaign run on 1 worker and on 4 workers produced identical bytes in every output, ledger record, head and summary. After each run, the runner also repeats 2 shards in fresh processes and requires identical bytes. The shards are chosen by a random generator seeded from the manifest’s fingerprint, so the choice itself is repeatable.

## The three replay paths

Section titled “The three replay paths”

A **replay** re-runs finished shards and compares the results with the committed evidence, byte for byte, or by fingerprint when the large files aren’t present. A replay never writes into the committed campaign, and it fingerprints the campaign before and after to prove that.

Three columns, one per replay path. Path A, default root: replay from the live repository; works only while every execution file still matches its frozen fingerprint. Path B, export root: git archive the freeze commit outside the repository, copy in untracked bound inputs, replay with --root; protected by the import proof and the open guard. Path C, legacy in-place checkout: for old version 1 campaigns, temporarily check out the old commit, replay, then switch back.A. Default rootreplay from the liverepository (version 3)works only while everyexecution file still matchesits frozen fingerprintrefuses after any laterchange to that codeB. Export root (–root)git archive the freeze committo a folder outside the repocopy in untracked boundinputs (never symlinks)replay with –rootguarded by the import proofand the open guardC. Legacy checkoutfor old version 1 campaignstemporarily check out theold commit (owner only)replay with output outsidethe repositoryswitch back; confirm aclean statusThree ways to re-run old work. Path B is the strongest: the replay can prove it never touched the live repository.

**A. Default root.** Replay straight from the live repository. Fast and simple. It refuses as soon as any execution file has changed since the freeze, for example: “frozen file hash mismatch.”

**B. Export root.** The owner exports the code exactly as it was at freeze time (`git archive`), into a folder outside both repositories. They copy in any fingerprinted files git doesn’t track, such as the large frame log. Then they replay with `--root`. Each worker runs from the export, and two guards prove it:

  * the **import proof** , which records where every loaded module came from (any module from outside the export means FAIL);
  * the **open guard** , a hook that fails the shard if it opens any file inside the live repository.

In testing: 33 of 33 shards matched, 33 proofs were clean, and zero live-repository files were opened. Four deliberately broken copies were all caught: an extra file, a modified file, a linked-in module, and a linked-in input.

**C. Legacy checkout.** Old version 1 campaigns predate the explicit-root design, so `--root` refuses them. The owner temporarily checks out the old commit in place, replays, and switches back. One such replay matched 18 of 18 shards.

[War stories](/war-stories/) tells two stories that shaped these paths: a replay that would have passed for the wrong reason, and the frame log that `git archive` leaves out.

## Offset and seed bands, and derived occupancy

Section titled “Offset and seed bands, and derived occupancy”

**Offsets** (idle frames at the start, which make each case different) and **seeds** (numbers behind random choices) are reserved in **bands** , like IP address blocks. Each segment owns development, evaluation, gate and spare bands. For S3 these are 21000–21199, 21200–21399, 21400–21699 and 21700–21999.

At freeze time, every shard’s offset must sit inside one of its owner’s non-gate bands. It must not land in any sealed or gate band (the S1 and S2 gate ranges, 3000–3299 and 4000–4299, always refuse), and it must not collide with anything already used.

**Derived occupancy** answers “what’s already used?” by scanning the registry, every task’s recorded `offsets-used.json`, and every frozen manifest on disk. It takes the union of all of them. In the code’s own words, it “can only add refusals: nothing here frees a registry range.” Freezing the same offset twice is refused the second time.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/campaign.py (freeze, version 1 and 3 manifests, bound files)`
  * `cli/gbg_cli/campaign_store.py (ledger records, hash chain, head, write-once files, verification errors)`
  * `cli/gbg_cli/campaign_runner.py (deterministic gzip: level 9, mtime 0, no file name; runner lock; orphan check; manifest-order commits; spot-checks)`
  * `cli/gbg_cli/campaign_replay.py (summary.json columns, chain rebuild, retention, replay paths, import proof, open guard)`
  * `cli/gbg_cli/campaign_schema.py and occupancy.py (bands, collision checks, derived occupancy)`
  * `cli/gbg_cli/campaign_worker.py (shard outputs)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md and size-estimate.json (retention, size per 10,000 shards, 20 MiB crossing)`
  * `dev-smoke/campaign-v3a-20261004/REPORT.md (crash test, 1 vs 4 workers)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (export replay, broken-copy tests, untracked inputs, gzip header check)`
  * `dev-smoke/old-campaign-replay-20261004/RECORD.md (legacy replay 18/18)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: S3 bands)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/campaign.py (freeze, version 1 and 3 manifests, bound files)`
  * `cli/gbg_cli/campaign_store.py (ledger records, hash chain, head, write-once files, verification errors)`
  * `cli/gbg_cli/campaign_runner.py (deterministic gzip: level 9, mtime 0, no file name; runner lock; orphan check; manifest-order commits; spot-checks)`
  * `cli/gbg_cli/campaign_replay.py (summary.json columns, chain rebuild, retention, replay paths, import proof, open guard)`
  * `cli/gbg_cli/campaign_schema.py and occupancy.py (bands, collision checks, derived occupancy)`
  * `cli/gbg_cli/campaign_worker.py (shard outputs)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md and size-estimate.json (retention, size per 10,000 shards, 20 MiB crossing)`
  * `dev-smoke/campaign-v3a-20261004/REPORT.md (crash test, 1 vs 4 workers)`
  * `dev-smoke/campaign-v3b-20261004/REPORT.md and REPLAY.md (export replay, broken-copy tests, untracked inputs, gzip header check)`
  * `dev-smoke/old-campaign-replay-20261004/RECORD.md (legacy replay 18/18)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: S3 bands)`
