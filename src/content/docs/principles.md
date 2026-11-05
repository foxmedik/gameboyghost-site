---
title: "Principles, translated"
track: "Tour"
---

In plain English

The project runs on eight house rules. Most are things a well-run IT shop already does. Make results repeatable. Freeze what’s been signed off. Keep a chain of custody. Let anyone stop the line when something looks wrong. Write up failures honestly.

GameBoyGhost runs on a short written rulebook, the file `AGENTS.md`. Every AI agent task and every human step follows it. Nearly every rule has a familiar IT counterpart. If you know the counterpart, you already get the rule.

## The eight core principles at a glance

Section titled “The eight core principles at a glance”

GameBoyGhost principle | Familiar IT practice  
---|---  
Determinism | Reproducible builds  
One start-up load, button presses only (rule R13) | Rebuild servers, never restore snapshots  
Sealed gates | Change freeze and release sign-off  
Content-bound locks | Signed release packages  
Hash binding | Chain of custody  
The STOP rule | The “stop the line” cord in a factory  
Honesty rules | Blameless postmortems  
Refusals never become training examples (rule R6) | Never learn from your own error messages  
  
Each one is explained below.

## Determinism ↔ reproducible builds

Section titled “Determinism ↔ reproducible builds”

**Like:** a build server that gives you the identical file every time you build the same code.

**In practice:** every game run happens in its own separate **process** (a separately running program) on the computer. The results must not change based on how many runs happen at once, or in what order. Every run’s settings are written into a job list _before_ it starts. When a check calls for it, the run is repeated in a fresh process, and the output must match byte for byte.

## One start-up load, button presses only (R13) ↔ rebuild, don’t restore

Section titled “One start-up load, button presses only (R13) ↔ rebuild, don’t restore”

**Like:** rebuilding a server from a script instead of restoring a snapshot. You know exactly how it got to its current state.

**In practice:** every run loads the game’s starting point exactly once. After that, the game only moves forward by pressing buttons. There is no saving and reloading, no copying a running game, and no shortcut back to the middle, for any reason. Every state is _earned_ , never restored.

## Sealed gates ↔ change freeze and release sign-off

Section titled “Sealed gates ↔ change freeze and release sign-off”

**Like:** a signed-off release. Once it ships, you don’t edit the shipped package. You issue a new version or a written correction.

**In practice:** a **gate** is a one-time pass/fail test for a segment. Once it passes, the gate’s folder, the student model, and its settings are frozen. They are never edited, moved, rebuilt, or “fixed.” If a mistake turns up later, the correction goes into a new, dated folder, and the sealed files stay untouched.

## Content-bound locks ↔ signed release packages

Section titled “Content-bound locks ↔ signed release packages”

**Like:** a release package with a checksum. If any file changes, the check fails.

**In practice:** before a gate runs, it is **locked**. The lock records fingerprints of every file the test depends on. After the owner **commits** (saves the change into the project’s history), a dry-run check (`--check-only`) must pass. Only then does the real test run, exactly once. A failed gate is never re-run, never given a lower bar, and never re-counted.

why “content-bound” and not “commit-bound”

An earlier lock design pinned the exact git commit (the HEAD). That would have broken on any later commit, even one that touched unrelated files. So locks now bind to the _contents_ of the files that matter, and the `--check-only` step proves those contents are unchanged right before the run.

## Hash binding ↔ chain of custody

Section titled “Hash binding ↔ chain of custody”

**Like:** evidence bags with signed seals. Anyone can check that nothing was swapped.

**In practice:** every task takes SHA-256 fingerprints (short codes computed from file contents) of all protected files, before and after. Any difference means stop. Big files that are too large for git, like detailed run logs, stay out of version control. Their fingerprints go into a committed list, so they can be checked later.

## The STOP rule ↔ “stop the line”

Section titled “The STOP rule ↔ “stop the line””

**Like:** the cord on a factory line that any worker can pull to halt production when something looks wrong. Some factories call it an andon cord.

**In practice:** an agent must stop and report, not work around, when it finds:

  * a version that doesn’t match what it was told to expect;
  * a changed fingerprint on a protected file;
  * a broken game rule (R13 or R6);
  * a repeat run that doesn’t match;
  * conflicting labels;
  * instructions that are unclear or contradict each other;
  * a need to write somewhere it isn’t allowed.

## Honesty rules ↔ blameless postmortems

Section titled “Honesty rules ↔ blameless postmortems”

**Like:** an incident review that focuses on what happened and what to fix, not on who looks bad.

**In practice:**

  * Never weaken a check to make something pass.
  * Report true results, including failures.
  * Never claim more than the evidence shows.
  * Say plainly what was not run or not checked.

The reports are written so a human can learn from them.

## Refusals never become training examples (R6) ↔ don’t learn from error messages

Section titled “Refusals never become training examples (R6) ↔ don’t learn from error messages”

**Like:** you wouldn’t train a new helpdesk hire by showing them “Error: unable to answer” as if it were the right answer.

**In practice:** the **oracle** is the program that supplies correct answers for the student to learn from. Sometimes it says “I can’t answer this.” That reply is recorded as a refusal. It is never turned into a training example.

## Supporting rules

Section titled “Supporting rules”

Rule | Familiar IT practice | What it means  
---|---|---  
**Pins** | Pinned dependency versions; ticket preconditions | Every task first checks that the code versions and starting state are exactly what the prompt says. A mismatch means stop.  
**Only the human commits, locks, and runs gates** | Separation of duties | Agents may _suggest_ a pass threshold, with evidence. Only the owner decides.  
**Repair rule** | Limited hotfix authority | An agent may fix a provable bug in its own checking or reporting code, once per bug, and must log it. Problems with game content, logic, fingerprints, or the R13/R6 rules are never patched. They stop the task.  
**Missing data is never zero** | Null is not 0 | Missing values get an explicit “unknown” marker and cause a refusal. Nothing is made up.  
**Labels depend only on what the student sees** | A pure function of its inputs | The oracle sees only the student’s limited view. If two identical views ever get different answers, production of training data stops.  
**Safe writes, append-only logs** | Write-then-rename; append-only audit logs | Files are written to a temporary name and then renamed. Ledgers are only ever added to.  
**Each task writes only to its own folder** | Least privilege | Every task gets its own dated folder and ends with an exact list of files for the owner to commit.  
  
## Two short examples

Section titled “Two short examples”

**A gate can be canceled before it counts.** The first two attempts at the S1 gate were canceled _before any S1 test run happened_. Pre-run checks found that the recorder captured the wrong moment of a multi-step action (attempt 1). They also found that the test driver was not yet covered by the lock (attempt 2). The third attempt ran and passed. Because the lock covers the whole toolchain, “we caught it before it counted” is the normal path.

**A bug found after sealing doesn’t rewrite the seal.** After the S2 gate passed, a review found that one diagnostic flag was wrong. The segment’s exit room was missing from a list of rooms on the route. The sealed result stayed untouched. A new correction folder recalculated the flag offline. The owner explicitly accepted the reasoning. The lesson carried into the next segment’s design: every route list must include the start and exit rooms.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 2–5 and 7–11: git rules, pins, frozen and sealed files, R13/R6, determinism, gates, STOP and repair rules, honesty rules, outputs)`
  * `gbg-data/RESULTS.md (S1 sealed gate: attempts 1 and 2 canceled before any test run; S2 correction after sealing, and its lessons)`
  * `Author's notes (why locks became content-bound)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (sections 2–5 and 7–11: git rules, pins, frozen and sealed files, R13/R6, determinism, gates, STOP and repair rules, honesty rules, outputs)`
  * `gbg-data/RESULTS.md (S1 sealed gate: attempts 1 and 2 canceled before any test run; S2 correction after sealing, and its lessons)`
  * `Author's notes (why locks became content-bound)`
