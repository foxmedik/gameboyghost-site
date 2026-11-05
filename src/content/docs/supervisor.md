---
title: "The supervisor (\"foreman\")"
track: "Builder"
---

In plain English

This is a planned AI helper that would watch overnight batch jobs. It could only use a few pre-approved controls, like pause or resume, and every use would be logged. It would earn more freedom step by step, the way a new night-shift hire does.

PLANNED

Nothing on this page beyond the existing `gbg supervise` command is built. The trust ladder and the supervisor itself are the author’s plan, not a running system.

Picture a new night-shift operator. On day one, you don’t hand them root access. You start by having them talk through old incidents. Then they shadow the day shift. Then they get a short runbook and someone checking their work. Only after all that do they work nights alone.

The planned supervisor, nicknamed the **foreman** , follows the same path. It would be a **local LLM** (large language model: an AI text model running on the same computer, not a cloud service). Its job would be watching overnight batches.

## What exists today: a fixed menu of actions

Section titled “What exists today: a fixed menu of actions”

The supervisor would not get a shell. It would act only through `gbg supervise`, which already exists and offers exactly seven actions:

Action | What it does  
---|---  
`status` | Report the campaign’s state.  
`pause` / `resume` | Stop or restart launching new shards.  
`cancel` | Skip a job’s remaining shards.  
`requeue` | Run one shard again.  
`prune` | Drop a variant, but only if the job list declared that rule _and_ its condition is already met.  
`note` | Add a note to the log.  
  
Every call needs a reason (1–2,000 characters). Every call is written to a hash-chained audit log, including refused calls and plain `status` checks. The command cannot run arbitrary code. It doesn’t even signal processes itself: the campaign runner reads the log and acts.

This **allowlist** (a list of the only things permitted, where everything else is denied) is the most important safety feature. It means the worst a confused supervisor can do is pause, skip or repeat work, and every step leaves a trace.

## The trust ladder

Section titled “The trust ladder”

A four-step staircase rising left to right. Step 1, Exam: graded on past reports with known answers. Step 2, Shadow: reads real morning reports and proposes actions; the human compares. Step 3, Limited: carries out allowlisted actions while the human reviews. Step 4, Unattended: runs overnight. A note under step 4 says it runs as a separate OS user with read-only access to git history and sealed files.1\. Examgraded on past reportswith known answers2\. Shadowproposes actions on realreports; human compares3\. Limitedacts from the allowlist,human reviews4\. Unattendedovernight runson its ownbefore step 4: a separateOS user, read-only accessto git history and sealed filesThe planned trust ladder. Each step is earned by doing well on the one before. The whole ladder is PLANNED.

  1. **Exam.** The candidate is graded on past morning reports where the correct decision is already known. It is like a certification test built from your own incident history.
  2. **Shadow.** It reads real morning reports and proposes actions, but doesn’t take them. The owner compares its proposals with their own decisions.
  3. **Limited.** It carries out actions from the allowlist, and the owner reviews what it did.
  4. **Unattended.** It runs overnight on its own.

## The safety wall

Section titled “The safety wall”

Before step 4, the supervisor would run as a **separate OS user** : its own login account on the computer. That account would have read-only access to the git history and to sealed files.

That matters because it is a real wall. The operating system enforces file permissions no matter how a command is spelled. Compare that with the project’s command-text deny rules, which the author calls a guardrail, not a security boundary (see [Shell and agent security](/security/)). The plan stacks both: the allowlist limits what the supervisor _asks_ for, and the OS account limits what it _can_ do.

## The audit chain

Section titled “The audit chain”

Every supervise call is appended to a log in which each entry carries a fingerprint of the previous one. If anyone edits or removes an entry, every later fingerprint stops matching. So a morning review can trust that the log shows everything the supervisor did, in order.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/supervise.py (the seven allowlisted actions, reason length, audit logging)`
  * `cli/gbg_cli/campaign_store.py (hash-chained audit records)`
  * `cli/gbg_cli/campaign_runner.py (the runner reads the control log)`
  * `Author's notes (supervisor PLANNED: local LLM, the four-step trust ladder, separate OS user before step 4, deny rules as a guardrail)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `cli/gbg_cli/supervise.py (the seven allowlisted actions, reason length, audit logging)`
  * `cli/gbg_cli/campaign_store.py (hash-chained audit records)`
  * `cli/gbg_cli/campaign_runner.py (the runner reads the control log)`
  * `Author's notes (supervisor PLANNED: local LLM, the four-step trust ladder, separate OS user before step 4, deny rules as a guardrail)`
