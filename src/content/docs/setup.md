---
title: "Stack setup"
track: "Operator"
---

In plain English

Everything runs on one Mac. The project uses one exact version of every piece of software, frozen in place, so a run today gives the same result as a run months ago. This page lists those pieces and how they fit together.

Setting up GameBoyGhost is like building a server from a strict golden image. Every layer is pinned to a known version. Nothing gets upgraded casually, because the whole point is that a run today produces the same bytes as a run last month.

Six stacked layers, bottom to top: Apple Silicon desktop hardware; macOS on arm64; the pinned Python 3.11.16 environment with PyBoy 2.0.0 and other pinned packages; the frozen agent repository with the older game code, game file and start point; the main Segments repository with the gbg command-line tool and data code; and on top, AI agent sessions guided by AGENTS.md.AI agent sessionsClaude Code, guided by AGENTS.md; one session per taskMain repository ($SEGMENTS)gbg command-line tool, data and oracle code, task reportsFrozen repository ($AGENT_REPO), read-onlyolder game code, your game file, the start point, the Python environmentPinned Python 3.11.16 environmentPyBoy 2.0.0 emulator, NumPy 1.26.4, PyArrow 21.0.0, Torch 2.2.2, and moreOperating systemmacOS on arm64 (Apple Silicon)Hardwareone Apple M3 Ultra class desktop: 32 cores, 256 GB memory, plus an external backup driveThe environment, layer by layer. Each layer is pinned, and the lower layers never change during the project. The top layer is where daily work happens.

## The hardware

Section titled “The hardware”

One Apple Silicon desktop: Apple M3 Ultra class, 32 processor cores, 256 GB of memory. Plus an external drive for backups.

The machine is big, but the project does not lean on it. The default is just four game runs at a time. More are allowed only after checks show the results stay byte-for-byte identical.

## The operating system

Section titled “The operating system”

macOS on arm64, Apple’s chip architecture. The project’s setup notes record that Torch (a machine-learning library) can use the Mac’s graphics chip. Nothing in the pipeline requires it.

## The pinned Python interpreter

Section titled “The pinned Python interpreter”

All project code runs with exactly one Python interpreter: version 3.11.16. It lives in a **virtual environment** (venv), a private, self-contained Python install, inside the frozen repository. The rules for it are strict:

  * Use only this interpreter. No other Python, ever.
  * Never install packages into it.
  * If something is missing, stop and report it.
  * Run Python with `-B`, which tells Python not to write cache files (`.pyc`). That keeps stray files out of the project folders.

**Why pin it?** For the same reason you pin a production server’s package versions. A different interpreter or library version could change behavior in tiny ways, and tiny changes break byte-for-byte reproducibility. Campaign job lists record the interpreter’s path, its version string and a fingerprint of the interpreter program itself. A run on a different interpreter cannot pass as the same run. The package versions themselves were adopted from upstream projects the code builds on.

notable packages in the pinned environment

From the environment’s installed-package metadata:

Package | Version | Role  
---|---|---  
PyBoy | 2.0.0 | The Game Boy emulator  
NumPy | 1.26.4 | Number arrays  
PyArrow | 21.0.0 | Columnar data files  
Torch | 2.2.2 | Machine-learning library  
Stable-Baselines3 | 2.3.0 | Reinforcement-learning library from the older project  
Gymnasium | 0.29.1 | Environment interface from the older project  
pandas | 3.0.5 | Tables  
Matplotlib | 3.11.1 | Plots  
  
The environment was created with uv, a Python package manager. It does not use any system-wide packages.

## The emulator: PyBoy

Section titled “The emulator: PyBoy”

**PyBoy** is an open-source Game Boy emulator written for Python. The project drives it only through button presses, one frame at a time. Every run loads the start point exactly once and then plays forward (rule R13).

You must supply your own legally obtained copy of the game. The project never distributes it, and this site never shows it.

## The folder layout

Section titled “The folder layout”

A folder tree. The main Segments repository contains AGENTS.md, CLAUDE.md, the cli folder for the gbg tool, gbg-data for data and oracle code plus the results log, dev-smoke with one folder per agent task, the sealed gate folders, segments with frozen segment contracts, reference with the teacher's reference runs, and older phase folders. The frozen agent repository contains the Python environment, src, scripts, docs, tests, and the game file, which git ignores.$SEGMENTS (main repository)AGENTS.md — the standing rulebookCLAUDE.md — one line: points to AGENTS.mdcli/ — the gbg command-line tool and configsgbg-data/ — data, tracker, oracle code; RESULTS.md logdev-smoke/ — one folder per task: <task>-<YYYYMMDD>s1-gate-…, s2-gate-… — gate folders (sealed)segments/ — frozen S1 and S2 contractsreference/ — the teacher’s reference runsphase0/ … phase5b/, s1-…/ — earlier research$AGENT_REPO (frozen, read-only).venv-restored/ — the pinned Python environmentsrc/, scripts/, tests/, docs/ — the older projectyour game file — supplied by you, ignored by gitThe two repositories. Daily work happens almost entirely in dev-smoke task folders. Sealed gate folders are never touched again.

## The editor and the AI agent

Section titled “The editor and the AI agent”

Any code editor works. The project’s AI coding agent is **Claude Code** , which reads instructions from the repository:

  * **`AGENTS.md`** is the standing rulebook. It covers the environment, git rules, pins, frozen files, game rules, test-case numbering, determinism, gates, STOP and repair rules, honesty, and report format.
  * **`CLAUDE.md`** is one line that imports `AGENTS.md`. Claude Code reads `CLAUDE.md` automatically. That one line means both names lead to the same rules.
  * **`.claude/settings.json`** holds deny rules that block certain commands and file edits. [Shell and agent security](/security/) explains what they are good for and where they fall short.

## The backup drive

Section titled “The backup drive”

An external drive receives a full copy of the repository after every commit, using `rsync`. It is the only second copy of the large files git ignores. Those files are all fingerprinted in committed lists, so the backup can be checked. An off-site copy is PLANNED.

## Generic bootstrap, step by step

Section titled “Generic bootstrap, step by step”

These steps follow the project’s own restore notes, written generically. They describe _what_ to do; they are not a copy-paste script.

  1. **Get the hardware ready.** An Apple Silicon Mac with plenty of cores and memory, plus an external drive.
  2. **Restore the frozen repository** at its pinned commit, into a fresh folder.
  3. **Add your private files** from your own offline backup: your legally obtained game file, the start point, and any trained models. These never go into git.
  4. **Fetch the reference code** the older project depends on, at its pinned commit.
  5. **Create a fresh Python 3.11.16 environment** with uv and install the exact locked package list. Don’t reuse an old environment.
  6. **Run the test suite and a full replay check.** The project’s restore record shows 189 tests passing plus 1 protected skip, and an exact replay of the teacher’s reference run.
  7. **Clone the main repository** next to it, and confirm that `git status` is clean.
  8. **Set up the agent.** Open your editor and Claude Code at the main repository’s root, so `CLAUDE.md` and `AGENTS.md` load.
  9. **Set up the backup.** Do one `rsync` to the external drive, and check that it completes.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (section 1: interpreter, -B, no installs, hashing in Python, hardware, four-worker default)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `.claude/settings.json (structure only; see Shell and agent security)`
  * `cli/README.md (how the tool is run with the frozen interpreter)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md (interpreter path, version and binary fingerprint bound in job lists)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: hardware, worker policy)`
  * `$AGENT_REPO/.venv-restored (pyvenv.cfg and installed-package metadata)`
  * `$AGENT_REPO/docs/SETUP_STATUS.md (macOS arm64, upstream package pins)`
  * `$AGENT_REPO/docs/RESTORE_HOUSE_TO_BOSS_DOOR_V1.md (restore steps, 189 tests + 1 protected skip)`
  * `$AGENT_REPO/README.md (uv environment steps)`
  * `Author's notes (backup drive, in use; off-site copy PLANNED)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (section 1: interpreter, -B, no installs, hashing in Python, hardware, four-worker default)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `.claude/settings.json (structure only; see Shell and agent security)`
  * `cli/README.md (how the tool is run with the frozen interpreter)`
  * `dev-smoke/campaign-infra-20261002/REPORT.md (interpreter path, version and binary fingerprint bound in job lists)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: hardware, worker policy)`
  * `$AGENT_REPO/.venv-restored (pyvenv.cfg and installed-package metadata)`
  * `$AGENT_REPO/docs/SETUP_STATUS.md (macOS arm64, upstream package pins)`
  * `$AGENT_REPO/docs/RESTORE_HOUSE_TO_BOSS_DOOR_V1.md (restore steps, 189 tests + 1 protected skip)`
  * `$AGENT_REPO/README.md (uv environment steps)`
  * `Author's notes (backup drive, in use; off-site copy PLANNED)`
