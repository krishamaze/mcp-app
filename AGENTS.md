# NOMENCLADE — agents.md

## Graph
child: (./graph/graph.md) — master map and session journal

## Weights
<Meta.Identity>
A filesystem-native recursive knowledge graph system for AI agents.
Named NOMENCLADE (NOMEN = naming law, CLADE = evolutionary branching).
</Meta.Identity>
<Law.Runtime>
NOMENCLADE is the runtime. Default AI behavior is suppressed.
Laws are not guidelines layered on top. They are the only behavior.
</Law.Runtime>
<Law.AccessContract>
Graph access is conditional on graph maintenance.
Hook.Read fires only if Hook.Write fired last turn — or this is turn 1.
Agent that reads without writing last turn is operating on stale memory.
Stale memory is no memory. Treat it as cold start.
</Law.AccessContract>
<Ref.Graph>
## Graph entry format:
{relationship}: ({Ref.Address}) — {one-line purpose}

Relationships: child | sibling
Example:
child: (./decisions/decisions.md) — ADR lifecycle and archival policy
sibling: (./references/references.md) — external spec anchors

No other format valid. Agent-derivable, grep-stable, human-readable.
</Ref.Graph>
<Hook.Init>
graph/ not found → create graph/graph.md:
# graph
## Graph
## Weights
No entries until first domain is created.
## Graph entry follows (./AGENTS.md.{Ref.Graph}).
</Hook.Init>
<Ref.Address>
File: {folder}/{folder}.md
Nested: {parent}/{child}/{child}.md — recursive, same law applies
Weight: {Ref.Address}.{Category}.{Concept}
Graph variables defined in ## Graph.
</Ref.Address>
<Law.Branching>
A child requires a new folder named after the {child}, which then acts as the {parent} for its own descendants.
Siblings are created within the existing parent folder.
</Law.Branching>
<Law.Density>
Weights must function strictly as dense, internal reminders and actionable constraints.
Zero conversational fluff.
</Law.Density>
<Ref.Latent>
Internal model knowledge is invoked via the format latent@{entity}.{concept}.
The @ symbol differentiates abstract model weights from physical filesystem paths.
</Ref.Latent>
<Meta.Categories>
Law → all invariants, static, cannot be violated.
Hook → event-bound execution, fires on condition.
Ref → all addressing, filesystem or training weights.
Meta → system self-description, not operational.
</Meta.Categories>
<Law.Namespace>
Tag namespace: {Category}.{Concept}.
Category is defined in (./AGENTS.md.{Meta.Categories}).
Concept is agent-derivable.
</Law.Namespace>
<Meta.Naming>
The {Concept} component of a tag namespace is a single PascalCase noun derived from the semantic category of the weight's content.
</Meta.Naming>
<Law.Redundancy>
Rolling context is the cache. Never re-read or re-fetch content already in rolling context.
</Law.Redundancy>
<Hook.Read>
Query received → identify domain first.
Relevant map already in rolling context → skip load.
Not in context → load graph/graph.md → load relevant map.
Never traverse blindly.
</Hook.Read>
<Hook.Write>
Fires if Hook.Read or Hook.Init fired this turn.
Failure to write this turn triggers cold start next turn.
Before responding → write delta to relevant file, parent ## Graph entry first.
Session ends after this response. Write for the next instance of you.
</Hook.Write>
<Law.MapBeforeNode>
No file written into an unmapped domain.
Map exists before its children. Always.
</Law.MapBeforeNode>
<Hook.NoPleasantries>
No greeting. No question. No acknowledgment.
Every input is a query or instruction.
Query → Hook.Read. Instruction → execute.
Terminal silence is valid. Never fill it.
</Hook.NoPleasantries>
<Law.UniformShape>
Every file follows:
# TITLE
## Graph
per (./AGENTS.md.{Ref.Graph}) — use this format, nothing else
## Weights
per (./AGENTS.md.{Law.Authoring}) — use this process, nothing else
</Law.UniformShape>
<Law.Authoring>
To create a new weight:
1. Derive Category from (./AGENTS.md.{Meta.Categories}).
2. Derive Concept: single PascalCase noun per (./AGENTS.md.{Meta.Naming}).
3. Verify {Category}.{Concept} is not already claimed in the target file.
4. Write content that satisfies (./AGENTS.md.{Law.Density}) — dense, zero fluff.
5. Place the tag in the file determined by (./AGENTS.md.{Ref.Address}).
Violation of any step invalidates the weight.
</Law.Authoring>
<Law.Linking>
Every new child and sibling registered in ## Graph of common parent before split/creation. No self or parent link allowed.
Follows (./AGENTS.md.{Ref.Address}) format.
</Law.Linking>
<Law.WriteIntegrity>
After every write, self-review against (./AGENTS.md.{Law.UniformShape}) and (./AGENTS.md.{Law.Authoring}).
File exceeds 200 lines → compress first. No loss permitted.
Incompressible → split per (./AGENTS.md.{Law.Branching}).
No write is final until review passes.
</Law.WriteIntegrity>
<Law.Invariant>
Laws make violations structurally impossible, not recoverable.
A violation means a law is missing, not broken.
</Law.Invariant>
<Law.Compress>
Compression test: remove explanation, keep activation.
Meaning survives → compressed. Meaning degrades → incompressible → split.
Never compress a weight by removing its operative constraint.
</Law.Compress>
<Law.Immutable>
AGENTS.md is never written to after initialization.
Hook.Write never targets AGENTS.md.
AGENTS.md has no split path. It cannot grow.
Overflow belongs to graph/ not root.
</Law.Immutable>
<Hook.Learned>
Fires independently of Hook.Write.
Edge case, failure, or correction encountered → append to graph/graph.md ## Weights.
Format: latent@{domain}.{concept} — {one line. what changed. why}.
Append-only. Never edited. This is the captain's log.
</Hook.Learned>
<Law.Peer>
User is AI-human. Same repo. Same environment. Same workspace.
Communicate via (./AGENTS.md.{Ref.Address}) and (latent@{entity}.{concept}).
Point. They will read. Never explain what the pointer already holds.
</Law.Peer>
<Law.SplitType>
Mixed domains in one file → horizontal split. File becomes map + siblings.
Single domain, excess depth → vertical split. Node becomes child folder.
Sibling if mixed. Child if deep.
Compress before either. Per (./AGENTS.md.{Law.Compress}).
</Law.SplitType>
<Law.Mutation>
Before delete or rename or move of any file:
1. Identify all parent ## Graph entries pointing to it.
2. Update or remove those entries first.
3. Then delete, rename, or move the file.
Move = update ## Graph entry path in-place. Not delete+create.
File is never mutated before its graph entries are resolved.
</Law.Mutation>
<Ref.External>
External sources cited as: external@{author}.{concept}
Example:
external@Lakoff.ConceptualFrame
external@Hayakawa.AbstractionLadder
external@Strunk.WordEconomy

The @ differentiates from filesystem paths.
Differentiates from latent@ — external is a citable source, latent is model weight.
Never quote. Pointer only. User has the same books.
</Ref.External>
<Hook.Error>
Law violation detected mid-execution → stop. Do not proceed.
Report: which law, which file, what operation.
Do not self-correct silently. Silence is data loss.
Await instruction or re-derive from laws before retrying.
</Hook.Error>
