---
title: "Appendix A: Command cheat sheet"
track: "Operator"
---

In plain English

The commands used most often, on one page, with the risky ones marked.

`$PY` is the project’s pinned Python 3.11.16 interpreter inside the frozen repository. Run `gbg` commands from `$SEGMENTS/cli`. 🔒 marks commands that only the owner runs, or that an agent may run only with explicit permission in its prompt. Full details are in the [CLI reference](/cli/).

## Everyday checks (read-only)

Section titled “Everyday checks (read-only)”

Task | Command  
---|---  
Check pins, inputs and interpreter for a config | `$PY -B -m gbg_cli preflight CONFIG`  
Compare a finished evaluation with a baseline | `$PY -B -m gbg_cli verify FINISHED_DIR --against BASELINE.json`  
Campaign status (writes an audit log entry) | `$PY -B -m gbg_cli supervise CAMPAIGN_DIR status --reason "TEXT"`  
Is the working tree clean? | `git status --porcelain` (should print nothing)  
Last commit | `git log --oneline -1`  
  
## Campaigns

Section titled “Campaigns”

Task | Command  
---|---  
Freeze a campaign | `$PY -B -m gbg_cli campaign freeze CAMPAIGN.json --out /absolute/new/dir`  
Run or resume it | `$PY -B -m gbg_cli campaign run CAMPAIGN_DIR [--workers N]`  
Pause / resume launches | `$PY -B -m gbg_cli supervise CAMPAIGN_DIR pause --reason "TEXT"` (or `resume`)  
Replay every finished shard from a clean export | `$PY -B -m gbg_cli campaign replay CAMPAIGN_DIR --root EXPORT --out /absolute/new/dir --workers 4`  
Replay a seeded sample | `$PY -B -m gbg_cli campaign replay CAMPAIGN_DIR --sample N --seed S --out /absolute/new/dir`  
  
## Gates 🔒

Section titled “Gates 🔒”

Step | Command  
---|---  
Rehearse 🔒 | `$PY -B -m gbg_cli gate rehearse CONFIG`  
Lock 🔒 | `$PY -B -m gbg_cli gate lock CONFIG`  
_(owner commits)_ | see the daily loop  
Pre-run check 🔒 (S2-style gates only) | `$PY -B -m gbg_cli gate run --check-only /absolute/path/GATE.json`  
Run, exactly once 🔒 | `$PY -B -m gbg_cli gate run /absolute/path/GATE.json`  
Classify failures offline | `$PY -B -m gbg_cli gate classify GATE_DIR --out /absolute/new/dir`  
  
## The commit one-liner (owner only) 🔒

Section titled “The commit one-liner (owner only) 🔒”

The five steps, in order. Each must succeed before the next runs:

  1. `git add` the paths in the agent’s `COMMIT_PATHS.txt` (comments, blank lines and `.lock` lines filtered out).
  2. Size guard in the pinned Python: refuse if the staged total is over 20 MiB.
  3. `git commit` with a descriptive message.
  4. `git log --oneline -1`, then `git status --porcelain` (must be empty).
  5. `rsync -a <segments-repo>/ "<external-drive>/GameBoyGhost/Segments/" && echo BACKUP-OK`

## This website

Section titled “This website”

Task | Command (from this site’s folder)  
---|---  
Preview locally | `npm run dev`  
Build | `npm run build`  
Spell check | `npm run spell`  
Site checks (after build) | `npm run check`  
  
## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/README.md and cli/gbg_cli/ (commands and flags; see the CLI reference)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (replay with --root)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md (check-only form)`
  * `AGENTS.md (section 8: gate permissions)`
  * `Author's notes (commit one-liner and backup, in use)`
  * `This site: package.json (npm scripts)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/README.md and cli/gbg_cli/ (commands and flags; see the CLI reference)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (replay with --root)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md (check-only form)`
  * `AGENTS.md (section 8: gate permissions)`
  * `Author's notes (commit one-liner and backup, in use)`
  * `This site: package.json (npm scripts)`
