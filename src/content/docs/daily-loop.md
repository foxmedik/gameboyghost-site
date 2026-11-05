---
title: "The daily loop"
track: "Operator"
---

In plain English

Work happens like a ticket queue. The owner writes a task. An AI assistant does it and writes a report. The owner checks the report carefully, then saves the changes and makes a backup. The AI never saves anything to the project’s history itself.

Day to day, GameBoyGhost works like a small, strict ticket queue. The owner writes a ticket. An AI coding agent does the work and writes up what happened. The owner reviews the write-up the way a change-approval board reviews a change. Only then does anything get committed, and right after that, backed up.

Flowchart of six steps left to right: write the prompt, agent does the task, agent writes the report and commit list, human reviews skeptically, human runs the commit one-liner, backup to external drive. From the review step, a return arrow labeled 'questions or STOP' goes back to the prompt step.1\. Prompttask, pins,permissions2\. Agentchecks pins,does the task3\. ReportREPORT.md +commit list4\. Reviewhuman readsskeptically5\. Committhe one-liner,run by human6\. Backuprsync to anexternal drivequestions or STOP: back to a new promptAGENTHUMAN ONLYOne unit of work. Only the human acts in the last three steps. A review that finds a problem sends the work back as a new prompt. It never gets patched quietly.

## 1\. The prompt (the ticket)

Section titled “1. The prompt (the ticket)”

Every task starts with a written prompt. A prompt adds three things on top of the standing rulebook, `AGENTS.md`:

  * **the task** itself;
  * **the pins** : the exact code versions the agent should find when it starts;
  * **task-specific permissions** : for example, which files it may edit, or whether it may run a particular check.

If the prompt and the rulebook disagree, the agent must stop and ask. Neither one silently wins.

## 2\. The agent does the work

Section titled “2. The agent does the work”

The agent’s first job is to check the pins:

  * the main repository’s latest commit and its parent;
  * the frozen repository’s commit;
  * a clean starting state, meaning no uncommitted changes.

Any mismatch is a STOP. The agent reports what it found and does not work around it.

Then the agent does the task, inside its own dated output folder, named like `dev-smoke/<task-name>-<YYYYMMDD>/`. It never runs git commands that change anything. It takes fingerprints (SHA-256 hashes) of every protected file before it starts and again when it finishes.

## 3\. The report and the commit list

Section titled “3. The report and the commit list”

Every task ends with a `REPORT.md` that covers:

  * the pins it checked;
  * the before-and-after fingerprint results for protected files;
  * what ran, and what did not;
  * the results, including failures;
  * every repair it made under the repair rule;
  * the offsets and seeds it used (the numbers that identify each test case);
  * the exact list of paths for the human to commit, in `COMMIT_PATHS.txt` and in the report.

## 4\. The skeptical review

Section titled “4. The skeptical review”

This is the most important human step. Read the report the way you would read a change request from a contractor you don’t know yet.

Check | Why  
---|---  
Did the pins match? | Work done against the wrong version is not the work you asked for.  
Is the protected-file check a PASS, with zero unexpected changes? | It proves nothing sealed was touched.  
Does “what didn’t run” match what you expected? | Agents must say plainly what they skipped. Silence is a red flag.  
Are failures reported as failures? | The honesty rules forbid weakening a check to make it pass.  
Is every repair small and logged? | Repairs are allowed only in the agent’s own checking or reporting code, once per bug.  
Does the agent claim more than its evidence shows? | Estimates, and work that was not run, must be labeled.  
Are there decisions waiting for you? | Agents may propose; thresholds and design calls belong to the owner.  
  
If something is wrong, the fix is a new prompt, not a quiet edit.

## 5\. The commit one-liner

Section titled “5. The commit one-liner”

Only the owner commits. They run one standard command line from the repository root. It chains five steps, so a failure at any step stops everything after it.

  1. **Stage exactly the agent’s list.** `git add` the paths in `COMMIT_PATHS.txt`. Comment lines, blank lines and lines ending in `.lock` are filtered out first. _Why:_ the commit contains exactly what was reviewed, nothing more.
  2. **Size guard.** A short script in the project’s pinned Python adds up the size of everything staged and refuses if it is over 20 MiB (mebibytes). _Why:_ huge files belong outside git, tied in by fingerprints.
  3. **Commit** with a descriptive message.
  4. **Status check.** `git log --oneline -1` shows the new commit. `git status --porcelain` must print nothing. _Why:_ an empty status proves nothing was left behind or forgotten.
  5. **Backup.** `rsync -a <segments-repo>/ "<external-drive>/GameBoyGhost/Segments/" && echo BACKUP-OK`. _Why:_ the external drive is the only second copy of the large untracked files.

the completeness check (since Phase 4b)

Step 4 catches files that were _left out_ of a commit, but only after the commit has happened. Since Phase 4b, each agent also checks before handing over that `COMMIT_PATHS.txt` and `git status` agree in both directions. Every changed file must be in the list, and every listed file must actually be changed. The check was added after a task’s commit list left out three files that the task had changed ([War stories](/war-stories/) tells that story).

## 6\. The backup

Section titled “6. The backup”

The `rsync` step copies the whole repository, including files git ignores, to an external drive. Because every large file is fingerprinted in a committed list, the backup can be checked against those fingerprints later.

There is no off-site copy yet. A private GitHub copy is PLANNED, after a pre-upload check that no game file, saved state or secret would be pushed.

## Session hygiene

Section titled “Session hygiene”

  * **A new agent session for each task.** A fresh session starts with only the rulebook and the prompt. It carries no leftover assumptions from the previous task.
  * **Open the session at the repository root.** The agent then picks up the rulebook files from the root folder (`AGENTS.md`, and `CLAUDE.md`, which simply points to `AGENTS.md`). It also uses the root as the starting point for every relative path.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (prompt vs rulebook conflicts; pins; git rules; protected snapshots; output folders; REPORT.md contents; COMMIT_PATHS.txt; 20 MiB guard)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (Phase 4b: commit-list fix and completeness check)`
  * `Author's notes (standard commit one-liner and backup, both in use; private remote PLANNED)`
  * `Session hygiene: from the author's chapter brief; not yet recorded in the author's notes (open question in REVIEW.md)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (prompt vs rulebook conflicts; pins; git rules; protected snapshots; output folders; REPORT.md contents; COMMIT_PATHS.txt; 20 MiB guard)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md (Phase 4b: commit-list fix and completeness check)`
  * `Author's notes (standard commit one-liner and backup, both in use; private remote PLANNED)`
  * `Session hygiene: from the author's chapter brief; not yet recorded in the author's notes (open question in REVIEW.md)`
