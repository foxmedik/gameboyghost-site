---
title: "Appendix B: AGENTS.md explained"
track: "Operator"
---

In plain English

The project’s rulebook for AI assistants, rule by rule, in plain words, with the reason behind each rule.

`AGENTS.md` is the standing rulebook that every AI agent task in the main repository follows. Think of it as the standard operating procedure that comes before any individual ticket. A task prompt adds the specific job on top. This appendix walks through it section by section. It paraphrases rather than copies, and leaves out machine-specific details.

## The preamble: who decides

Section titled “The preamble: who decides”

The rules apply to every agent task. A prompt adds the task, its pins and any special permissions. **If a prompt conflicts with the rulebook, the agent stops and asks.** Neither side silently wins.

The human owner is the only one who commits, locks or runs gates, changes frozen files, or chooses pass thresholds.

_Why:_ a clear chain of authority. Agents do the work; the human owns the decisions.

## 1\. Environment

Section titled “1. Environment”

This section names the two repositories and says the older one is frozen and read-only. It names the one pinned Python interpreter (3.11.16). Always run it with `-B`, never install packages into it, and stop if a dependency is missing. It also asks for all fingerprints to be computed in Python, gives a plotting-library housekeeping rule, and describes the hardware: four workers by default, more only when allowed and still byte-identical.

_Why:_ everyone uses the same tools, so results are comparable and repeatable.

## 2\. Git

Section titled “2. Git”

Agents never run git commands that change anything: no add, commit, checkout, reset, push and so on. Read-only commands like status, log and diff are fine. The only exception is throwaway test repositories in a temporary folder. Every task ends with an exact list of paths for the human to commit.

_Why:_ history changes only through a human, after review. It is separation of duties.

## 3\. Pins

Section titled “3. Pins”

Before anything else, the agent checks the pins given in the prompt: the expected commits and a clean starting state. Any mismatch is a STOP, with no workarounds.

_Why:_ you can’t trust results produced against the wrong version.

## 4\. Frozen and sealed artifacts

Section titled “4. Frozen and sealed artifacts”

Sealed gate folders, sealed models and policies, old formats and code, the start point, the game file, and anything else the prompt calls frozen are never modified, moved, deleted, regenerated or “fixed.” Every task fingerprints all protected files before and after, and any difference is a STOP. Sealed gates are never re-run, and sealed verdicts are never reinterpreted. Corrections go into a new folder. Older segments’ behavior stays exactly the same; new work branches by version instead of editing old code.

_Why:_ this is the change freeze. A sealed result has to stay exactly as it was signed off.

## 5\. Game-state rules

Section titled “5. Game-state rules”

  * **R13:** load the starting point once per run, then only press buttons. No saves, copies, restores or cached memory.
  * **R6:** refusals never become training labels.
  * Observation add-ons are read-only: they never write memory, press buttons, or advance the game. That is proven by byte-identical traces.
  * Teacher labels must depend only on what the student sees. Identical views with different labels stop production. Label mode never holds a live game. Records without their phase tables loaded refuse.
  * **Missing data is never zero.** Unknown values get explicit markers and cause refusals.

_Why:_ the data has to be honest. A student that learned from shortcuts or invented values would be learning the wrong thing.

## 6\. Offsets and seeds

Section titled “6. Offsets and seeds”

One registry file is the authority for which test-case numbers (offsets) and random seeds belong to whom. The gate ranges for S1 and S2 are never touched outside their own gate. Each job uses numbers from its owner’s reserved range, after a collision check against everything used, reserved, failed or canceled. Used numbers are never recycled as “unseen.” Every task records the numbers it actually used.

_Why:_ a test case can only be “unseen” once. It is the same reason you never reuse an exam question bank.

## 7\. Execution and determinism

Section titled “7. Execution and determinism”

Only separate processes, never the thread-based path that caused mismatches in the past. Results must not depend on worker count or order. Every job’s settings are fixed before it runs. When determinism is requested, repeat in a separate process and require byte-identical output. Write files atomically, and keep append-only logs append-only.

_Why:_ reproducibility is the foundation every other check stands on.

## 8\. Gates

Section titled “8. Gates”

Agents never lock or run a gate unless the prompt explicitly authorizes that exact action. Rehearsals and `--check-only` also need permission. The standing pass rule is at least 97% of N (rounded up), with zero integrity exceptions and matching determinism checks. The final chain test is 300 runs from power-on, with at least 291 needed. Before any new segment’s gate can be locked, it needs zero primary failures on at least 200 development cases. Locks are content-bound. `--check-only` must pass after the human commits. A gate runs once and is never re-run or re-graded. Thresholds are human decisions.

_Why:_ the release gate only means something if it can’t be gamed.

## 9\. STOP conditions and the repair rule

Section titled “9. STOP conditions and the repair rule”

This section lists exactly when to stop and report:

  * a pin mismatch;
  * a protected-fingerprint change;
  * an R13 or R6 violation;
  * a determinism mismatch;
  * a label conflict;
  * any content, logic or evidence failure;
  * an unclear or contradictory spec;
  * a conflict between prompt and rulebook;
  * a need to write outside allowed paths.

The **repair rule** allows fixing a provable bug in the agent’s own checking or reporting code, or a wiring bug in code it wrote in the same task, once per bug, logged. Content, logic, fingerprint, R13 and R6 failures are never “repaired.”

_Why:_ small self-made bugs can be fixed quickly. Real problems always reach a human.

## 10\. Honesty rules

Section titled “10. Honesty rules”

Never weaken a check to make something pass, and never add special-case guards to force a match. Report true results, including failures. Never claim more than the evidence shows. Say plainly what wasn’t run or checked.

_Why:_ a report you can’t trust is worse than no report.

## 11\. Outputs and reports

Section titled “11. Outputs and reports”

Write only to the task’s own folder, plus explicitly allowed paths. Every task produces a `REPORT.md` covering:

  * the pins checked;
  * the protected-file results;
  * what ran and what didn’t;
  * results, including failures;
  * repairs;
  * the numbers used;
  * exact commit paths.

The human’s commit guard refuses anything over 20 MiB. Large reproducible files are kept out of git but fingerprinted in a committed list. Agents may propose new ignore rules but not edit them. No cache files. Plain, factual prose.

_Why:_ the report is the change ticket. It must be complete and readable.

## 12\. Key references

Section titled “12. Key references”

The last section points to the results log, the current design document and its amendments, the student-view definition, the route evidence, and the segment plan (S3 to S18, ending at the Tail Cave boss door).

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (all sections; paraphrased)`
  * `CLAUDE.md (imports AGENTS.md)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (all sections; paraphrased)`
  * `CLAUDE.md (imports AGENTS.md)`
