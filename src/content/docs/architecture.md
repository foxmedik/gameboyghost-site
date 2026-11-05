---
title: "Architecture"
track: "Tour"
---

In plain English

One person is in charge. AI assistants do the hands-on work, but they can only suggest changes; the person reviews and approves everything. The game runs on one computer, several copies at once, and every result goes into a log that makes tampering obvious. A backup drive holds a second copy.

GameBoyGhost runs on one desktop computer. There is no cluster and no cloud service involved. Instead of fancy hardware, it relies on a clear split of permissions, much like a well-run IT team:

  * who may **suggest** changes,
  * who may **write** files,
  * who may **run** the important tests,
  * who may **approve** the results.

Layered diagram with three zones. Top zone, human authority: the owner who commits changes, the only one who starts locks and gate runs, and the only one who sets pass thresholds. Middle zone, AI agent sessions: a task prompt plus standing rules goes to a coding agent, which produces a report and a list of files to commit. Bottom zone, execution: a campaign runner starts worker processes, which write shards and a hash-chained ledger. Below that sit read-only frozen sources, a backup copy on an external drive, and a dashed box for the planned supervisor.HUMAN AUTHORITYHuman ownerreviews, then commitsLocks and gate runsonly the human starts themPass thresholdsagents propose, never chooseAI AGENT SESSIONS (rules, not walls)Task prompt\+ standing rules (AGENTS.md)Coding agentwrites only to its task folderReport + commit listfingerprints, results, failuresEXECUTION (one computer)Campaign runnertakes a frozen job listWorker processesone emulator per processShards + ledgerappend-only, hash-chainedFrozen sourcesread-only, never changedBackup copyexternal drive, every commitSupervisor (PLANNED)allowlisted actions onlyWho does what. Authority flows down from the human. Evidence flows back up as reports and fingerprints. A dashed outline means planned, not built yet.

## The parts, one by one

Section titled “The parts, one by one”

**The human owner.** Picture the person who holds the production keys and also chairs the change-approval board. Only the owner may **commit** changes (save them permanently into the project’s history), lock or run a gate (the one-time pass/fail test), change anything frozen, or decide what score counts as a pass.

**AI coding agents.** These are AI assistants that write code and run experiments. Each one works like a contractor with a ticket. It gets a task prompt plus a standing rulebook (a file called `AGENTS.md`). It writes only into its own dated task folder. When done, it hands back a report and an exact list of files for the owner to commit.

**The main repository (`$SEGMENTS`).** A **repository** (repo) is a folder tracked by git, the version-control tool. This one holds the segment definitions, the project’s command-line tool (`gbg`), the oracle and data code, every task report, and a running results log.

**The frozen repository (`$AGENT_REPO`).** This holds the project’s older game-playing code, the game file, the starting point for every run, and the exact Python setup the project uses. It is pinned to one version and is never written to. Think of it as a vendor’s locked installer that you never patch.

**Worker processes.** Each game run happens in its own separate program, a **process** in operating-system terms. That keeps runs from affecting each other, like isolated build agents. Four workers is the default. More are allowed only after checks show the results stay byte-for-byte identical.

**The campaign runner.** A **campaign** is a batch job: a frozen list of runs to do. The runner splits it into units of work called **shards** , runs them, and records everything. [The campaign system](/campaigns/) covers it in depth.

**The ledger.** An append-only log of what ran and what it produced. Each entry includes a fingerprint of the previous entry. That makes it a **hash chain** : change any old entry and every later fingerprint stops matching.

**Backups.** After every commit, the owner copies the repository to an external drive with `rsync`, a standard file-copy tool. That drive is the only second copy of the large files that git does not track, such as batch outputs, ledgers and frame logs. Every one of those files is fingerprinted in a committed list, so the backup can be checked. There is no off-site copy yet. A private GitHub copy is PLANNED, after a check that nothing sensitive would be uploaded.

**The supervisor (PLANNED).** A future local AI that would watch overnight batches. It could only use a short, fixed menu of actions. That menu already exists today as the `gbg supervise` command: status, pause, resume, cancel, requeue, prune, and note. Every use is logged. [The supervisor (“foreman”)](/supervisor/) describes how it would earn trust step by step.

what “fingerprint” means here

A fingerprint is a **SHA-256 hash** : a short code computed from a file’s exact contents. Change one byte and the code changes completely. The project uses SHA-256 hashes everywhere: to prove a file wasn’t changed, to tie large untracked files to committed lists, and to chain ledger entries together.

## The computer

Section titled “The computer”

The target machine is a single Apple Silicon desktop (Apple M3 Ultra class, with 32 processor cores and 256 GB of memory). The standing default is four workers. Correctness never depends on the machine, because results must come out the same no matter how many workers run or in what order.

## Trust boundaries

Section titled “Trust boundaries”

A **trust boundary** is a line where one party hands work to another, and you have to decide what to check. There are four here. This page explains the idea, not the exact list of protected files. That list is deliberately not published.

  1. **Human and agent.** Agents cannot commit, lock, run gates, or choose pass thresholds. In the real repositories they may only use read-only git commands, such as viewing status or history. The owner reviews the report and the file list, then commits.
  2. **Agent and frozen files.** The frozen repository is read-only. In the main repository, sealed gates, sealed models and old formats are protected by fingerprints. These are taken before and after every task. A changed fingerprint means the agent must stop.
  3. **Agent and execution.** Agents propose; the owner authorizes. A task prompt says exactly which gate actions, if any, the agent may run. Without that permission, they are off-limits.
  4. **Execution and evidence.** Workers write results, and the ledger chains them together. Later, a replay re-runs the work and compares bytes against the saved evidence. A result is never trusted just because a file exists.

[Shell and agent security](/security/) covers how these boundaries are enforced. It also covers which ones are only guardrails, not real security walls.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 1, 2, 4, 7, 8, 11: environment, git rules, sealed files, separate processes, gate authority, outputs)`
  * `cli/gbg_cli/supervise.py (allowlisted, logged campaign controls)`
  * `cli/gbg_cli/campaign.py and cli/gbg_cli/campaign_store.py (campaign freeze/run/replay; hash-chained ledger)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: separate processes, four-worker default, hardware class)`
  * `Author's notes (backup practice, in use; supervisor PLANNED)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 1, 2, 4, 7, 8, 11: environment, git rules, sealed files, separate processes, gate authority, outputs)`
  * `cli/gbg_cli/supervise.py (allowlisted, logged campaign controls)`
  * `cli/gbg_cli/campaign.py and cli/gbg_cli/campaign_store.py (campaign freeze/run/replay; hash-chained ledger)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (Part 8: separate processes, four-worker default, hardware class)`
  * `Author's notes (backup practice, in use; supervisor PLANNED)`
