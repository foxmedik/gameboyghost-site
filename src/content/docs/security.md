---
title: "Shell and agent security"
track: "Operator"
---

In plain English

The main risk here isn’t hackers. It’s an AI assistant making an honest mistake. So the project stacks several layers of protection, like a file server with permissions, audit logs and backups. Some layers only discourage mistakes; others reliably catch them. This page explains which is which.

Think about how you protect a file server. You don’t rely on one thing. You have permissions, but you also have audit logs, nightly backups, and someone reviewing changes. If one layer misses something, the next one catches it. That approach is called **defense in depth**.

GameBoyGhost protects its sealed results and its history the same way.

## The threat model: mistakes, not attackers

Section titled “The threat model: mistakes, not attackers”

A **threat model** is a short statement of what you are defending against. Here, it is **an AI coding agent making an honest mistake**. That can mean:

  * editing a file it shouldn’t;
  * running a command with a side effect it didn’t intend;
  * leaving a file out of its commit list;
  * misreading a rule;
  * “fixing” something that should have been reported instead.

The model does _not_ assume a determined attacker on the machine. That choice matters. Several layers below would stop a careless agent but not a hostile one, and this page says which.

## The layers

Section titled “The layers”

Concentric rings around a core labeled sealed results and history. From the outside in: the AGENTS.md rulebook; deny rules on commands and file edits; each task writes only to its own folder; protected-file fingerprints before and after; the commit completeness check and the 20 MiB size guard; human-only commits. Outside the rings, a separate panel lists recovery: git history, the external backup, and correction folders.sealed resultsand history1\. AGENTS.md rulebook2\. deny rules (guardrail)3\. task-only folders4\. protected fingerprints5\. completeness + size guard6\. human-only commitsRecoverygit historyexternal backup (rsync)correction folders,never in-place editsreplay againstfingerprinted evidenceDefense in depth. Each ring catches some mistakes the ring outside it missed. The core is what must never change silently. Recovery sits outside the rings, for when something gets through anyway. Layer | What it does | Detect, contain, or recover? | Wall or guardrail?  
---|---|---|---  
**1\. The rulebook (`AGENTS.md`)** | Tells every agent what it may and may not do, and when to stop. | Prevention | Guardrail: it only works if the agent follows it.  
**2\. Deny rules** | Claude Code refuses certain commands and file edits before they run. | Containment | Guardrail (explained below).  
**3\. Task-only folders** | Each task writes only into its own dated folder, plus paths the prompt allows. | Containment | Guardrail, made checkable by layer 4.  
**4\. Protected-file fingerprints** | SHA-256 hashes of every protected file, taken before and after each task. Any unexpected change means STOP. | Detection | Strong detection. It doesn’t care _how_ a file changed.  
**5\. Completeness check and size guard** | The commit list must match `git status` exactly, in both directions. Nothing over 20 MiB gets committed. | Detection | Strong detection at commit time.  
**6\. Human-only commits** | Only the owner commits, after reading the report. | Containment | The real control point. Nothing becomes history without a human.  
**Separate OS user (PLANNED)** | Unattended runs would use their own operating-system account, with read-only access to git history and sealed files. | Containment | A real wall: the operating system enforces it.  
**Secrets kept out of the repositories** | Credentials stay in a secure secret store, never in files. | Containment | Policy. See the open question in the source note.  
**Hooks (an option)** | Claude Code can run a check script before or after each tool use. None are configured today. | Detection or containment | Depends on the script.  
  
## Why deny rules are a guardrail, not a security boundary

Section titled “Why deny rules are a guardrail, not a security boundary”

Deny rules sound like a firewall. They are closer to a “Do not enter” sign that most people respect.

The project’s rules block:

  * commands that write to git;
  * package installs;
  * privilege escalation (running as administrator);
  * edits to sealed and frozen files, the rule files themselves, and the frozen repository.

That is useful. It stops the most common accidents before they happen.

But a rule for a command matches the **text** of the command. The same action can be spelled in many ways:

  * **A different spelling.** A rule shaped like “deny `tool commit …`” matches commands that _start_ that way. Put an option between the tool name and `commit`, and the text no longer matches. The effect is the same.
  * **A wrapper.** The same command run from a script, an alias, or from inside a Python program never appears as matching text.
  * **A different tool.** A rule that blocks the editor tool from changing a file does not stop a shell command or a Python script that writes the same file.

So deny rules reduce accidents, but they cannot prove a file wasn’t changed. **That job belongs to detection** (layer 4, fingerprints). It catches a change no matter which tool or spelling made it. The final say belongs to **human-only commits** (layer 6).

The author’s notes say it directly: the command-text deny rules are a guardrail, not a security boundary.

how the protected-file check works

Each task carries a small script with two modes: `snapshot` and `check`.

  * **Snapshot** walks every protected folder. That includes sealed gates, old oracles, frozen models, every earlier task folder, the tool code, and the rule files. It also covers the whole frozen repository and the interpreter program itself. Files git ignores are included. Each file is fingerprinted with SHA-256. A missing file is recorded as `MISSING`. The path list only ever grows: each task starts from the previous task’s list.
  * **Check** compares the before and after snapshots. It sorts each difference into one of four groups: “authorized by this prompt”, “allowed only under the repair rule”, “authorized new file”, or “protected”. The result is PASS only when the protected group is empty. Otherwise it is STOP.
  * In Phase 4b, the check covered **27,239 paths** before and **27,240** after (one authorized new test file), with zero protected changes.

The full snapshots stay in an ignored data folder. A committed summary records the snapshots’ own fingerprints and the details of every authorized change.

how the completeness check works

The agent runs `git status --porcelain --untracked-files=all` and compares the result with `COMMIT_PATHS.txt`:

  1. Every changed or new path git reports must be in the list.
  2. Every listed path must exist.
  3. Every listed path must actually appear in git status. Nothing gets listed that didn’t change.

The result is PASS or a list of exceptions. Exceptions are never dropped. In Phase 4b: 185 paths on each side, zero exceptions.

## Thinking in detection, containment and recovery

Section titled “Thinking in detection, containment and recovery”

Phase | Question | GameBoyGhost answer  
---|---|---  
**Detection** | Would we notice? | Protected fingerprints, the completeness check, empty `git status` after commit, replays compared byte for byte against fingerprinted evidence.  
**Containment** | How far can a mistake spread? | Task-only folders, deny rules, human-only commits, and (PLANNED) a separate OS user for unattended runs.  
**Recovery** | How do we get back? | Git history, the external backup, and correction folders. Sealed files are never edited in place, so the original is always there.  
  
## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 2, 4, 9, 11: git rules, protected snapshots, STOP, output folders, 20 MiB guard)`
  * `.claude/settings.json (deny-rule structure and categories only; the literal list is deliberately not published)`
  * `dev-smoke/oracle-v5-4b-20261004/protected_snapshot.py and protected-check.json (snapshot and check modes; 27,239/27,240 paths)`
  * `dev-smoke/oracle-v5-4b-20261004/finalize.py and commit-completeness.json (completeness check; 185/185)`
  * `$AGENT_REPO/docs/WIPE_READINESS.md (policy: credentials in a secure secret store)`
  * `Author's notes (separate OS user before unattended runs, PLANNED; deny rules are a guardrail; 20 MiB size guard in the commit one-liner)`
  * `Open question: the brief mentions secrets in the macOS keychain; no source confirms the keychain specifically (see REVIEW.md)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 2, 4, 9, 11: git rules, protected snapshots, STOP, output folders, 20 MiB guard)`
  * `.claude/settings.json (deny-rule structure and categories only; the literal list is deliberately not published)`
  * `dev-smoke/oracle-v5-4b-20261004/protected_snapshot.py and protected-check.json (snapshot and check modes; 27,239/27,240 paths)`
  * `dev-smoke/oracle-v5-4b-20261004/finalize.py and commit-completeness.json (completeness check; 185/185)`
  * `$AGENT_REPO/docs/WIPE_READINESS.md (policy: credentials in a secure secret store)`
  * `Author's notes (separate OS user before unattended runs, PLANNED; deny rules are a guardrail; 20 MiB size guard in the commit one-liner)`
  * `Open question: the brief mentions secrets in the macOS keychain; no source confirms the keychain specifically (see REVIEW.md)`
