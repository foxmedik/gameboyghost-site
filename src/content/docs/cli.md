---
title: "CLI reference"
track: "Operator"
---

In plain English

The project has one command-line tool, `gbg`. It does everything from running batches of games to the one-time pass/fail tests. This page lists every command and option, straight from the tool’s code. Commands that are dangerous or can’t be undone are marked.

`gbg` is the project’s **command-line interface** (CLI): one tool with subcommands, like `git commit` or `git status`. This page lists every subcommand and flag. They were read from the tool’s argument definitions in the source code, not from memory and not by running it.

Read this first

Several commands here are irreversible or protected. Locking or running a gate is the owner’s decision only. AI agents may run a gate rehearsal or `--check-only` only when their prompt explicitly allows it. When in doubt, don’t run it.

## How to run it

Section titled “How to run it”

There is no installed `gbg` program. The tool is a Python package, run in **module form** with the project’s one pinned interpreter. In the examples below, `$PY` stands for that interpreter, the Python 3.11.16 inside the frozen repository:

Terminal window
[code]
    cd $SEGMENTS/cli
    
    $PY -B -m gbg_cli <subcommand> [arguments]
[/code]

  * **`-B`** tells Python not to write `.pyc` cache files.
  * The tool **refuses to run on any other interpreter**. It checks both the interpreter’s location and that the version is exactly 3.11.16. The one exception is `verify --against`, which only reads files.
  * Gate commands also appear in the project’s records in a second form, run from the repository root with `PYTHONPATH=cli`. A locked gate’s file records the exact command line to use.
  * **Exit codes:** any refusal prints a message starting with `refuse` or `REFUSE`, and exits with status 1. Most successful commands print `PASS <path>`.
  * **macOS only:** `campaign run` and `campaign replay` restart themselves under macOS’s `caffeinate` tool, so the computer doesn’t sleep mid-batch. They refuse if it is missing.

### Rules shared by most commands

Section titled “Rules shared by most commands”

Most commands take a **JSON config file** : a settings file that declares the output folder, the input files with their SHA-256 fingerprints, and the repository pins. Before doing anything, the tool:

  1. checks the interpreter;
  2. checks every input file’s fingerprint;
  3. checks the repository pins (more on these below);
  4. **refuses if the output folder already exists** , so nothing gets overwritten;
  5. creates the folder and writes `resolved_config.json`, a record of exactly what it was asked to do.

`--out /absolute/folder` overrides the config’s output folder. It must be an absolute path.

**Pins** come in two kinds. `exact` requires a specific commit and a clean working tree. `record` allows uncommitted changes, but writes them down along with fingerprints of the changed files. The frozen repository must always be `exact`, and gate commands accept only `exact`.

* * *

## Data and evaluation commands

Section titled “Data and evaluation commands”

These all take a positional `CONFIG` and an optional `--out ABS`.

Command | What it does | Runs the emulator? | Writes  
---|---|---|---  
`coverage CONFIG` | Maps recorded examples onto a grid of room, position and progress cells, to show where training data is thin. | No | New output folder  
`build CONFIG` | Builds a training dataset from collected labels. Stops on conflicting labels. | No | New output folder  
`train CONFIG` | Checks the dataset against its manifest, fits a deterministic model, and records agreement on held-out examples. | No | New output folder  
`collect CONFIG` | Collects new labels by playing. Refuses unless the config contains the coverage-check verdict that allows collection. | **Yes** | New output folder  
`qualify CONFIG` | Replays the frozen earlier segments from power-on for a list of offsets, and records which reached the next segment’s start. | **Yes** | `qualification.json` and metadata  
`eval CONFIG` | Evaluates a model over a declared panel of cases with process workers. | **Yes** | Results and `REPORT.md`  
`verify CONFIG` | Checks a finished run’s fingerprints, and replays named runs from power-on to confirm them. | **Yes** | `verify.json`, `REPORT.md`  
`verify DIR --against BASELINE` | Read-only comparison of a finished evaluation against a baseline. Prints up to 10 differences. Refuses `--out`. | No | Nothing  
`log CONFIG` | Appends a section of text to a target file, then writes a proof that it only appended. | No | Appends to the target, writes a proof  
`preflight CONFIG` | Checks the interpreter, input fingerprints and pins. Writes nothing. | No | Nothing  
  
**Examples** (from the tool’s README):

Terminal window
[code]
    $PY -B -m gbg_cli preflight configs/s1-d3-eval-repro.json
    
    $PY -B -m gbg_cli eval configs/s1-d3-eval-repro.json
    
    $PY -B -m gbg_cli coverage configs/phase3-coverage-reproduction.json
[/code]

safety notes for the data commands

  * **`build`, `train`, `collect` and `eval` switch behavior on the config’s `mode` field.** With `mode: dagger_v2` they use the S2 implementations. With `mode: s2_robustness`, only `eval` is allowed. Any other mode means the S1-era implementations.
  * **`log` writes outside its output folder.** It appends to whatever file the config names as its target. Check that target before running it.
  * **`verify --against`** reinterprets its first argument as a finished evaluation folder. It expects S1-era result rows.
  * **`qualify`** applies `--out` through an internal setting rather than as a normal argument. The effect is the same.
  * **`preflight`** on a gate folder that has already run reports `historical: run complete`. It then only checks the config fingerprint stored in the gate’s lock file.

* * *

## Gate commands

Section titled “Gate commands”

A **gate** is the one-time pass/fail test for a segment (see [Principles, translated](/principles/)). These commands are the most protected in the tool.

Command | Argument | Flags | What it does  
---|---|---|---  
`gate rehearse` | a config file | `--out ABS` | A full dress rehearsal on development cases only. It never touches the real test cases.  
`gate lock` | a config file | `--out ABS` | Requires a passing rehearsal, then writes `GATE.json`, which fingerprints everything the gate depends on. Refuses if a `GATE.json` already exists.  
`gate run` | a `GATE.json` file | `--check-only`, `--out ABS` | Runs the gate, exactly once.  
`gate run --check-only` | a `GATE.json` file | (no `--out`) | Runs every pre-run check and writes nothing. **S2 gates only.**  
`gate classify` | a gate folder | `--out ABS` (required) | Classifies a finished gate’s failures offline, without the emulator. Writes only to the new output folder.  
  
**Examples** (README and the records from the S2 re-lock):

Terminal window
[code]
    $PY -B -m gbg_cli gate rehearse configs/phase2-gate-reproduction.json
    
    $PY -B -m gbg_cli gate lock configs/phase2-gate-reproduction.json
    
    $PY -B -m gbg_cli gate run /absolute/path/to/GATE.json
[/code]

### The gate lifecycle

Section titled “The gate lifecycle”

State diagram for a gate. Config, then rehearse (run twice and compared), then lock, which writes GATE.json. Next the human commits. Then check-only must pass. Then run, which creates the run-once marker. The run ends in PASS, which is sealed, or FAIL, which is final and never re-run. Check-only before the commit refuses because the tree is dirty.Configcriteria fixedRehearsetwice, comparedLockwrites GATE.jsonHuman committree now clean–check-onlymust PASSRunoncePASSsealed foreverFAILfinal, no re-runcheck-only before the commitrefuses: “repository is dirty”RUNNING.json marker: created exclusively at the start of the run;any marker or results file blocks every later runThe gate lifecycle as the code implements it (S2). Only the human commits, locks and runs. The run-once marker means a gate can never run twice, not even after an interrupted run.

  1. **Rehearse.** A dress rehearsal on development cases. When the S2 gate was re-locked, the rehearsal was run twice, and a separate comparison proved the two rehearsals byte-identical. That comparison file is made by a task script, not by `gbg`.
  2. **Lock.** `gate lock` re-checks the rehearsal against the current code and interpreter, requires the comparison file, and writes `GATE.json`. The lock is **content-bound** : it records fingerprints of files, not just a commit ID.
  3. **Human commit.** Only the owner does this.
  4. **`--check-only`.** The same checks as a real run, but nothing executes and nothing is written. Before the commit, it correctly refuses because the working tree isn’t clean. After the commit, it must print `PASS`.
  5. **Run.** `gate run` repeats every check. It then creates a `RUNNING.json` marker in a way that fails if the marker already exists, plays all the test cases, runs 5 determinism repeats, and writes `results.json` and `REPORT.md`. A FAIL is final.

what the S2 checks include

Among other things:

  * the lock’s base commit must be an ancestor of the current commit;
  * every file changed since then must be inside the gate’s own output folders, or be bound with matching bytes;
  * every bound file must exist, must not be a symbolic link, and must match its fingerprint;
  * `git status --porcelain` must be empty;
  * the code, config and interpreter version must match the lock exactly;
  * the panels, budget, criteria and seed ranges must match;
  * the rehearsal records must match.

The pass rule in the code is: primary clears of at least `ceil(0.97 × n)`.

S1-era differences and other caveats

  * S1 gates use rehearse, then lock, then run. They have **no`--check-only`**: the tool refuses `--check-only` for anything but S2. Their run-once marker is not created exclusively.
  * The policy that `--check-only` must pass before the run is enforced by the rulebook and by the owner, not by code. `gate run` repeats the same checks itself.
  * Some S2 gate settings, like its output folders and reserved seed ranges, are written into the code for that one gate. A new segment’s gate needs new, generic tooling.

* * *

## Campaign commands

Section titled “Campaign commands”

A **campaign** is a frozen batch of runs (see [The campaign system](/campaigns/)).

### `campaign freeze CONFIG --out DIR`

Section titled “campaign freeze CONFIG --out DIR”

Freezes a declared campaign into an unchangeable job list (`manifest.json`).

Argument | Notes  
---|---  
`CONFIG` | The campaign declaration. Version 3 is the current format.  
`--out DIR` | Required. Must be absolute and must not exist.  
  
**Safety:** it checks every input fingerprint, the test-case registry, and the already-used numbers. It refuses the sealed gate test-case ranges (3000–3299 and 4000–4299). Manifest files are created so they can’t be overwritten.

Terminal window
[code]
    $PY -B -m gbg_cli campaign freeze CAMPAIGN.json --out /absolute/new/campaign-directory
[/code]

### `campaign run DIRECTORY [--workers N]`

Section titled “campaign run DIRECTORY [--workers N]”

Runs a frozen campaign, or resumes one.

Argument | Notes  
---|---  
`DIRECTORY` | The frozen campaign folder.  
`--workers N` | Whole number from 1 to 28. Defaults to the manifest’s own setting, which is 4 when frozen with defaults.  
  
**Safety:**

  * It re-checks all bound fingerprints, and checks them again before each launch.
  * Only one runner can work on a campaign at a time. It also refuses to resume while a previous runner’s process is still alive.
  * Each shard has a 30-minute hard limit.
  * Any integrity or execution failure stops everything.
  * It does at least two determinism spot-checks at the end.
  * It writes a partial report every 2 hours.

Terminal window
[code]
    $PY -B -m gbg_cli campaign run /absolute/campaign-directory
[/code]

### `campaign replay DIRECTORY --out DIR [options]`

Section titled “campaign replay DIRECTORY --out DIR [options]”

Re-runs finished shards and compares them with the committed evidence.

Argument | Notes  
---|---  
`DIRECTORY` | The committed campaign folder.  
`--out DIR` | Required. Absolute, new, and outside the campaign folder.  
`--shards IDS` | Comma-separated list of finished shard IDs. Can’t be combined with `--sample` or `--seed`.  
`--sample N` | Seeded random sample of N shards, spread evenly across variants. Requires `--seed`.  
`--seed S` | Seed for `--sample`. Requires `--sample`.  
`--workers N` | 1 to 28. Default 4.  
`--root R` | Version 3 manifests only: run the replay from a clean exported copy of the code at `R`.  
  
**Safety:** a replay never writes to the committed campaign. It fingerprints the campaign before and after to prove it. Anything but PASS is a refusal.

Terminal window
[code]
    $PY -B -m gbg_cli campaign replay $CAMPAIGN --root $X --out <dir> --workers 4
[/code]

* * *

## `supervise DIRECTORY ACTION [TARGET] [--reason TEXT]`

Section titled “supervise DIRECTORY ACTION [TARGET] [--reason TEXT]”

Controls a running campaign from a short, fixed menu of actions. It cannot run arbitrary code or shell commands.

Action | Target | Effect  
---|---|---  
`status` | none | Report state.  
`pause` | none | Stop launching new shards.  
`resume` | none | Start launching again.  
`cancel` | a job ID | Skip that job’s remaining shards.  
`requeue` | a shard ID | Run that shard again.  
`prune` | a variant | Only if the manifest declared a prune rule _and_ its condition is already met.  
`note` | text (1–4,000 characters) | Add a note to the log.  
  
`--reason` is free text, 1–2,000 characters. The default is “user requested control”.

**Safety:** every call is recorded in a hash-chained audit log, including `status` and refused calls. So even `status` writes a log entry. The command never signals processes directly. The runner reads the log and acts on it. `cancel` and `prune` permanently skip work for the rest of that campaign.

Terminal window
[code]
    $PY -B -m gbg_cli supervise /absolute/campaign-directory pause --reason "Pause future launches"
[/code]

## Helper modules outside `gbg`

Section titled “Helper modules outside gbg”

A few task-specific modules have their own entry points, such as S2 audit and diagnostic tools, and the internal worker and replay-worker programs. They are not `gbg` subcommands, and day-to-day operation doesn’t use them.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/__main__.py (command tree, shared --out rule, --check-only definition, dispatch, exit behavior)`
  * `cli/gbg_cli/core.py (interpreter check, prepare steps, pins, preflight, log)`
  * `cli/gbg_cli/gate.py, gate_s2.py, gate_s2_binding.py, gate_posthoc.py (gate rehearse/lock/run/classify; S2 checks; run-once marker)`
  * `cli/gbg_cli/campaign.py, campaign_runner.py, campaign_replay.py, campaign_store.py, campaign_schema.py (campaign freeze/run/replay)`
  * `cli/gbg_cli/supervise.py (allowlisted actions, audit log)`
  * `cli/gbg_cli/coverage.py, build.py, train.py, collect.py, qualify.py, eval.py, verify.py`
  * `cli/README.md (examples; read-only verify --against; run-once note)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md and commands.jsonl (S2 rehearse/lock/check-only records; dirty-tree refusal)`
  * `dev-smoke/campaign-runner-20261002/REPORT.md (campaign and supervise examples)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (replay with --root example)`
  * `AGENTS.md (section 8: who may lock and run gates)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/__main__.py (command tree, shared --out rule, --check-only definition, dispatch, exit behavior)`
  * `cli/gbg_cli/core.py (interpreter check, prepare steps, pins, preflight, log)`
  * `cli/gbg_cli/gate.py, gate_s2.py, gate_s2_binding.py, gate_posthoc.py (gate rehearse/lock/run/classify; S2 checks; run-once marker)`
  * `cli/gbg_cli/campaign.py, campaign_runner.py, campaign_replay.py, campaign_store.py, campaign_schema.py (campaign freeze/run/replay)`
  * `cli/gbg_cli/supervise.py (allowlisted actions, audit log)`
  * `cli/gbg_cli/coverage.py, build.py, train.py, collect.py, qualify.py, eval.py, verify.py`
  * `cli/README.md (examples; read-only verify --against; run-once note)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md and commands.jsonl (S2 rehearse/lock/check-only records; dirty-tree refusal)`
  * `dev-smoke/campaign-runner-20261002/REPORT.md (campaign and supervise examples)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (replay with --root example)`
  * `AGENTS.md (section 8: who may lock and run gates)`
