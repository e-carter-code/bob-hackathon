# git-workflow-rules.md — Git Branch, Commit, and PR Rules for IBM Bob

## Purpose

This file defines the required Git workflow for all changes made by IBM Bob in this repository.

Bob must follow these rules before editing files, after editing files, and before finishing any task.

The goal is to keep the repository clean, reviewable, and professional.

---

## 1. Branch Strategy

This repository uses two permanent branches:

```txt
main
staging
```

### Branch meaning

```txt
main
Production-ready branch.
Only stable, reviewed work should be promoted here.

staging
Integration branch.
All feature/fix/chore branches must be created from staging.
```

### Required rule

For every new task, Bob must create a new branch from `staging`.

Never create new work directly from `main`.
Never commit directly to `main`.
Never commit directly to `staging` unless explicitly instructed.

---

## 2. Required Workflow For Every New Task

Before making any file changes, Bob must run or instruct the user to run:

```bash
git status
git checkout staging
git pull origin staging
git checkout -b <branch-name>
```

Then Bob can make changes.

After changes:

```bash
git status
git diff
npm run build
npm run lint
npm test
```

If this project does not have lint/test/build commands yet, Bob must say which commands were unavailable and run the closest available verification command.

Then commit:

```bash
git add .
git commit -m "<commit-message>"
git push -u origin <branch-name>
```

Then create PR:

```bash
gh pr create --base staging --head <branch-name> --title "<PR title>" --body "<PR body>"
```

The PR base must be `staging`, not `main`.

---

## 3. Branch Naming Rules

Branch names must be professional, short, lowercase, and kebab-case.

Allowed prefixes:

```txt
feat/
fix/
refactor/
chore/
docs/
test/
style/
```

### Use `feat/` for new product functionality

Examples:

```txt
feat/add-upload-page
feat/add-analysis-dashboard
feat/add-visual-editor
feat/add-rule-editor
feat/add-visual-test-runner
feat/add-report-downloads
```

### Use `fix/` for bug fixes

Examples:

```txt
fix/upload-navigation
fix/graph-node-selection
fix/report-download-error
fix/test-runner-state
```

### Use `refactor/` for internal code cleanup

Examples:

```txt
refactor/extract-flow-state
refactor/simplify-report-components
refactor/organize-editor-layout
```

### Use `chore/` for setup and tooling

Examples:

```txt
chore/setup-vite-tailwind
chore/add-react-flow
chore/add-project-docs
```

### Use `docs/` for documentation-only changes

Examples:

```txt
docs/add-frontend-spec
docs/add-bob-rules
docs/update-demo-script
```

### Use `test/` for test-only changes

Examples:

```txt
test/add-rule-editor-tests
test/add-report-export-tests
```

### Use `style/` for visual-only styling changes

Examples:

```txt
style/polish-homepage
style/update-dark-theme
style/improve-graph-nodes
```

---

## 4. Commit Message Rules

Commit messages must be short and professional.

Use Conventional Commit style:

```txt
<type>(optional-scope): <short description>
```

Allowed types:

```txt
feat
fix
refactor
chore
docs
test
style
```

### Examples

```txt
feat(upload): add sample project upload flow
feat(editor): add nested visual graph
feat(report): add markdown export

fix(editor): correct selected node state
fix(report): handle empty changed rules
fix(upload): keep analysis button disabled before project load

refactor(editor): split rule inspector components
refactor(state): centralize project mock data

chore(deps): add react-flow
chore(setup): configure tailwind

docs: add frontend implementation rules
style(editor): polish graph node colors
test(editor): add rule edit state tests
```

### Do not use vague messages

Bad:

```txt
update
changes
fix stuff
work
final
frontend
```

Good:

```txt
feat(editor): add visual test runner shell
fix(upload): persist selected sample project
refactor(report): split visual summary cards
```

---

## 5. PR Rules

Every branch should have a pull request into `staging`.

The PR title should follow the same style as commit messages.

Examples:

```txt
feat(editor): add nested visual logic editor
fix(report): correct markdown download output
style(home): polish landing page hero
```

The PR body must include:

```md
## Summary
- What changed

## Why
- Why this change was needed

## How to test
- Commands run
- Manual testing steps

## Notes
- Any known limitations
```

Example PR body:

```md
## Summary
- Added the Visual Editor layout with left rule tree, center graph, right inspector, and bottom test runner.
- Added mock flow data for nested business logic.

## Why
- This is the core product screen for exploring and editing legacy business logic.

## How to test
- npm install
- npm run dev
- Open /editor
- Confirm the editor layout renders correctly.

## Notes
- Rule editing and test path highlighting will be implemented in follow-up branches.
```

---

## 6. Conflict Rules

Before creating or updating a PR, Bob must check if the branch is behind staging.

Recommended commands:

```bash
git fetch origin
git checkout <branch-name>
git merge origin/staging
```

If conflicts happen:

1. Stop and report the conflicted files.
2. Do not guess blindly.
3. Resolve only if the fix is obvious and safe.
4. Run verification again.
5. Commit the conflict resolution.

Example conflict resolution commit:

```bash
git commit -m "fix(git): resolve staging merge conflicts"
```

---

## 7. Merge Rules

Bob should not merge PRs automatically unless the user explicitly asks.

When the user asks to merge:

1. Ensure PR targets `staging`.
2. Ensure branch is up to date with `staging`.
3. Ensure checks/build pass.
4. Merge PR.
5. Delete branch after merge if safe.

Recommended command:

```bash
gh pr merge --squash --delete-branch
```

If promoting `staging` to `main`, that must be a separate PR:

```txt
staging → main
```

Do not merge feature branches directly into `main`.

---

## 8. Bob Behavior Rules

Before starting a task, Bob must say:

```txt
I will create a new branch from staging for this task.
```

Then Bob must choose a professional branch name.

Before editing files, Bob must confirm the branch.

At the end of each task, Bob must provide:

```txt
Branch:
Commit:
PR:
Commands run:
Status:
```

Example:

```txt
Branch:
feat/add-analysis-dashboard

Commit:
feat(analysis): add nested logic dashboard

PR:
feat(analysis): add nested logic dashboard

Commands run:
npm run build

Status:
Ready for review
```

---

## 9. Small Change Rule

Even small changes should still be committed professionally.

For tiny fixes, use:

```txt
fix(...)
refactor(...)
style(...)
docs(...)
```

Examples:

```txt
fix(editor): correct breadcrumb label
style(upload): improve dropzone spacing
docs: update Bob workflow rules
refactor(report): simplify download helper
```

Small change does not mean sloppy commit.

---

## 10. Safety Rules

Bob must not:

- commit secrets
- commit `.env`
- commit API keys
- commit passwords
- commit local machine paths
- commit node_modules
- commit build artifacts unless required
- commit Bob private credentials
- commit IBM Cloud credentials

Before committing, Bob must check:

```bash
git status
git diff --staged
```

If secrets are detected, stop and warn the user.

---

## 11. Recommended First Setup Task

Use this branch:

```txt
chore/add-bob-git-workflow
```

Commit:

```txt
docs: add Bob git workflow rules
```

PR title:

```txt
docs: add Bob git workflow rules
```

PR base:

```txt
staging
```

---

## 12. First Prompt To Bob

Use this first:

```txt
Read docs/git-workflow-rules.md and summarize the required Git workflow.

Do not change files yet.

Return:
1. permanent branches
2. branch creation rule
3. branch naming convention
4. commit message convention
5. PR target branch
6. merge/conflict rules
7. what you must report after each task
```

---

## 13. Standard Prompt Before Every Task

Use this prompt before asking Bob to implement a task:

```txt
Before making changes, follow docs/git-workflow-rules.md.

Create a new branch from staging using a professional branch name.

Task:
<describe task>

After implementation:
1. run verification commands
2. commit with a Conventional Commit message
3. push branch
4. create a PR into staging
5. summarize branch, commit, PR, commands run, and status
```
