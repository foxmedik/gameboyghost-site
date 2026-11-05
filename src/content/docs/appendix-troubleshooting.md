---
title: "Appendix C: Troubleshooting"
track: "Operator"
---

In plain English

Quick fixes for common snags at the terminal and with git, the version-control tool that keeps the project’s history.

These are everyday snags, not project failures. Most come from how terminals and git behave in general. Where a fix ties into a project rule, the rule is named.

## Strange `[200~` or `~` characters around pasted text

Section titled “Strange [200~ or ~ characters around pasted text”

**Symptom.** You paste a command into a terminal and see something like `[200~git status~` or `^[[200~`, and the command fails.

**Why.** Modern terminals use **bracketed paste** : they wrap pasted text in invisible markers, so the shell knows it was pasted rather than typed. If a program doesn’t understand the markers, they show up as literal characters. This can happen in a shell that’s in an unusual mode, inside some remote sessions, or when pasting into a prompt that isn’t a normal shell.

**Fix.**

  * Clear the line (Ctrl+C) and paste again into a normal shell prompt.
  * If it keeps happening, type the command, or paste it into a plain text editor first and copy it back.
  * Never run a command that came out mangled. Re-enter it cleanly.

## A pasted pattern ran as a command

Section titled “A pasted pattern ran as a command”

**Symptom.** You meant to paste a file pattern such as `dev-smoke/**/mpl-cache/` into a file or a message. Instead it landed at the shell prompt, and the shell tried to run it, or expanded it into a list of matching file names.

**Why.** At a shell prompt, the first word of whatever you paste is treated as a command. Patterns with `*` or `**` are **globs** : the shell expands them into matching paths before running anything.

**Fix.**

  * Read the error. Usually it just says “command not found” or “permission denied”, and no harm is done.
  * If the first word happened to be a real command, check what it did. For example, check `git status --porcelain` in the repository: it should still print nothing unless you expected changes.
  * To paste text that isn’t a command, paste it into an editor, not the terminal.

## `git add` fails on an ignored path

Section titled “git add fails on an ignored path”

**Symptom.** Staging the agent’s commit list fails with a message saying a path is ignored by one of your `.gitignore` files.

**Why.** The project deliberately ignores large or temporary files: run traces, decision logs, campaign outputs, ledgers, frame logs and lock files. Git refuses to stage an ignored path unless you force it. Those big files are meant to stay out of git and be **fingerprinted** in a committed list instead.

**Fix.**

  * Don’t force it. An ignored path in `COMMIT_PATHS.txt` means the list is wrong, not the ignore rules.
  * The standard commit one-liner filters out comment lines, blank lines and lines ending in `.lock` before staging. Lock files are among the ignored campaign files, which is the likely reason for that filter.
  * Ask the agent to regenerate the list. Its completeness check compares the list against `git status`, and git never lists ignored files, so ignored paths don’t belong there.
  * Agents may _propose_ a new ignore rule in their report, but only the owner edits `.gitignore`.

## Where to start a session

Section titled “Where to start a session”

**Symptom.** An AI agent session doesn’t seem to know the project rules, or relative paths don’t resolve.

**Why.** Claude Code reads `CLAUDE.md` from the folder where the session starts. In the main repository, `CLAUDE.md` imports `AGENTS.md`. Start somewhere else and the rulebook may never load.

**Fix.**

  * Start each new agent session at the **root of the main repository**.
  * Start a **fresh session per task**.
  * Gate commands recorded in the project begin with `cd` into the repository root. Campaign replays run from inside `cli/`.
  * Exports for replays are made in a folder _outside_ both repositories.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (section 11: ignore conventions, proposing ignore rules; section 3: clean starting state)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and finalize.py ("git does not list ignored files"; completeness check)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md (recorded commands start with cd into the repository root)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (work outside both repositories; run replays from cli/)`
  * `Author's notes (commit one-liner filters comments, blanks and .lock lines)`
  * `General terminal and git behavior (bracketed paste, globbing, ignored paths): not from project records; the project reports contain no incidents of these`
  * `Session start at the repository root: from the author's chapter brief (open question in REVIEW.md)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (section 11: ignore conventions, proposing ignore rules; section 3: clean starting state)`
  * `CLAUDE.md (imports AGENTS.md)`
  * `dev-smoke/oracle-v5-4b-20261004/REPORT.md and finalize.py ("git does not list ignored files"; completeness check)`
  * `dev-smoke/s2-gaterelock-20261001/REPORT.md (recorded commands start with cd into the repository root)`
  * `dev-smoke/campaign-v3b-20261004/REPLAY.md (work outside both repositories; run replays from cli/)`
  * `Author's notes (commit one-liner filters comments, blanks and .lock lines)`
  * `General terminal and git behavior (bracketed paste, globbing, ignored paths): not from project records; the project reports contain no incidents of these`
  * `Session start at the repository root: from the author's chapter brief (open question in REVIEW.md)`
