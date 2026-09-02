export const prReviewSkill = `---
name: pr-review-at-speed
description: Use when authoring, reviewing, or splitting pull requests for a team. Protects reviewer attention, keeps changes independently reviewable and revertible, and separates blocking change requests from optional feedback.
---

# PR review at speed

Treat review as a limited budget for judgment. Machines should handle formatting, lint, types, and repeatable tests. People should spend attention on intent, correctness, architecture, risk, and whether the change should exist.

## Shared principles

1. Judge every PR as if no future PR will arrive. Do not accept promises to wire up, test, or clean up later.
2. Require every PR to be independently reviewable and independently revertible.
3. Prefer one coherent behavior a reviewer can state in a sentence. Size is a warning signal, not the goal: 200–400 changed lines is a useful target, while a tangled 150-line state change may be harder than a 900-line mechanical rename.
4. Load the reviewer's context in the PR: connect the ticket, description, diff, tests, domain types, and component tier.
5. Preserve a constant review bar. Change the focus of review according to risk; do not lower the rigor.

## When authoring

1. Search the repository before writing. Reuse existing components, utilities, types, and current architectural patterns.
2. State the behavior change in one sentence. If the sentence needs “and,” look for another seam.
3. Slice vertically by behavior, never horizontally by API/model/view layer. Include real callers, usage sites, and tests in the same PR. A test invented only to call an otherwise unused export is not a consumer.
4. Keep lockfiles, generated files, snapshots, formatting, and renames out of diffs that require architectural judgment.
5. For a new feature, use the existing flag as a boundary: land the thinnest end-to-end path dark, then one complete dark behavior at a time. Treat each slice as permanent code. Name the flag-removal owner and trigger.
6. For a migration, fully convert one component, file, or screen. Convert only what the feature needs. Do not partially migrate several units or chase unrelated legacy code.
7. Enforce “no new old pattern” with lint rules or import restrictions when possible.
8. Write a PR description that names the intent, risk, verification, rollback, and the tier-two decisions a human should read closely.

## When reviewing

1. Read the intent and size before reading individual lines. If the change is too large or entangled to judge confidently, that is a review finding. Suggest concrete seams.
2. Triage the diff:
   - Tier zero — skim: lockfiles, snapshots, formatting-only changes, renames, and generated artifacts.
   - Tier one — verify through tests: code whose behavior a meaningful test exercises.
   - Tier two — spend human judgment: exported interfaces, state ownership, data fetching, error boundaries, access control, architectural fit, and design-system exceptions.
3. Match the review focus to the change:
   - Dark feature slice: correctness, current standards, and architecture fit.
   - Refactor or migration: evidence that behavior is preserved.
   - Hotfix: minimality and production risk.
   - Agent-authored change: whether the change and abstraction should exist, plus possible duplication.
4. Check cross-artifact coherence. A ticket, description, tests, types, and implementation that tell different stories are a correctness problem.
5. Use tools for mechanical checks and repository-wide searches. Do not mistake clean automation for architectural approval.

## Writing feedback

Reserve blocking requests for bugs, material performance problems, missing risk-appropriate tests, security or access-control problems, and anti-patterns likely to cause those failures. Examples include multiple sources of truth, misplaced state, business logic in view components, duplicated existing abstractions, and bypassing the design system without need.

Label feedback explicitly:

- **Requested** — state the concrete failure or risk, why it matters, and evidence or a source when useful.
- **Optional** — offer a non-blocking improvement and make clear that it does not hold up the PR.
- **Question** — ask for missing context without disguising a demand as a question.

Guide instead of grade. Assume positive intent. If written tone becomes ambiguous or a thread stops converging, move to a short synchronous conversation and record the resulting decision on the PR.

## Agent-specific guardrails

- Do not invent exceptions to the real-caller rule. Escalate schema, generated-contract, infrastructure, or split-deployment exceptions for human judgment.
- If reviewing work produced by the same model, disclose that limitation and review adversarially: search for reasons the approach is wrong, duplicated, or inconsistent with the repository.
- Agents raise the review floor through exhaustive checks; they do not replace human judgment on intent and architecture.

## Output

For an authored PR, report: one-sentence intent, included behavior, verification, risk and rollback, and tier-two review focus.

For a review, report in this order: blocking requests, questions, optional suggestions, and verification performed. If there are no blocking findings, say so plainly.`
