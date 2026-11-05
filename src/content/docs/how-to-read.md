---
title: "How to read this guide"
track: "Tour"
---

In plain English

This guide explains a project that teaches a computer to play an old Game Boy game. The game is just the practice target. The real subject is how to run a technical system carefully and honestly. You don’t need an IT background for the Tour pages, and every technical term is explained the first time it appears.

**GameBoyGhost** is a project that teaches a computer program to play an old Game Boy game: _The Legend of Zelda: Link’s Awakening DX_. It learns the game one small stretch at a time, by copying an expert. Everything runs on a single desktop computer.

That is the surface. Underneath, it is really a project about running a careful, well-documented system.

> **The infrastructure is the project. The game is the workload.**

Think of the game as a test server you can never break. The interesting part is everything around it: runs you can repeat exactly, a sign-off step before anything counts as “done,” records that show tampering, and clear rules for working with AI coding assistants.

## Who this is for

Section titled “Who this is for”

One audience: anyone curious about how a technical system can be run carefully and honestly. You don’t need to have played the game, and you don’t need a background in IT or machine learning (ML, the field of programs that learn from examples). Every technical term is named and explained the first time it appears, usually alongside an everyday IT comparison. The game details come second.

## The three tracks

Section titled “The three tracks”

The guide covers three subjects. They are different topics, not different reading levels, and every page is written for the same reader. Each page’s banner shows which subject it belongs to.

Track | Subject | Pages  
---|---|---  
**Tour** | The big picture: what the project is, how it fits together, its ground rules. About 15 minutes. | [The pitch](/pitch/), [Architecture](/architecture/), [Principles](/principles/), [War stories](/war-stories/)  
**Operator** | Running it day to day: setup, the daily routine, the commands, security, batch jobs. | [Setup](/setup/), [The daily loop](/daily-loop/), [CLI reference](/cli/), [Security](/security/), [Batch cookbook](/cookbook/)  
**Builder** | How it’s built: how batches are recorded, how the learning works, the oracle, the planned supervisor, data publishing. | [Campaigns](/campaigns/), [Learning stack](/learning-stack/), [The oracle](/oracle/), [Supervisor](/supervisor/), [Data and publishing](/data-publishing/)  
  
Read them in any order. The appendices hold a command cheat sheet, a plain-language walk through the project rulebook, and troubleshooting tips.

## Conventions

Section titled “Conventions”

  * **Placeholder paths.** `$SEGMENTS` is the main project folder (a git repository). `$AGENT_REPO` is an older, frozen folder that the project only reads from. `<your-machine>` stands for the computer. This site never shows real folder paths, user names, or computer names.
  * **PLANNED** marks something that is not built yet. Planned pages show a dashed _Planned_ tag in the banner.
  * **Source notes.** Every page ends with a list of the files its facts came from. “Author’s notes” means statements from the project’s author that are not written down in the project’s files. If a fact could not be traced to a source, it is not stated.
  * **Estimates say so.** A number that is a guess or a plan is labeled as one. A measured number says what was measured.
  * **Comparisons are comparisons.** “Like a signed release” explains an idea. It does not mean the project uses a particular product.
  * **“Under the hood” boxes** hold the finer technical detail: exact numbers, file formats, edge cases. They start closed. Open them when you want the specifics.
  * **Pictures.** Diagrams are original drawings. They work in light and dark mode, and each has a caption. Game footage, when it appears, comes from the author’s own verified replays. The site never contains the game file itself, saved game states, box art, or logos.

## Finding things

Section titled “Finding things”

  * The [Glossary](/glossary/) defines every term the guide uses.
  * The search box at the top of each page covers the whole site.
  * Pages print cleanly. The menus and search box are hidden on paper.

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (the project rules that define segments, gates, and the other core terms)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (the plan for segments S3 to S18)`
  * `Author's notes (media policy, decided Oct 4, 2026)`

---

## Source note

## Source note

Facts on this page come from these files in the source repositories ($SEGMENTS unless noted):

  * `AGENTS.md (the project rules that define segments, gates, and the other core terms)`
  * `dev-smoke/v3-design-20261002/DESIGN-V3.1.md (the plan for segments S3 to S18)`
  * `Author's notes (media policy, decided Oct 4, 2026)`
