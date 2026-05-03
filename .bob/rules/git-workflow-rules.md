# git-workflow-rules.md — Git Branch, Commit, Push, and Manual PR Rules for IBM Bob

## Purpose

This file defines the required Git workflow for all changes made by IBM Bob in this repository.

Bob must follow these rules before editing files, after editing files, and before finishing any task.

The goal is to keep the repository clean, reviewable, and professional while avoiding failed GitHub CLI commands.

Important:

GitHub CLI is not available or not reliable in this project workflow.

Bob must not run:

```bash
gh pr create
```

Instead, Bob must provide manual pull request details so the user can create the PR in the GitHub web UI.

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

Bob must never create new work directly from `main`.

Bob must never commit directly to `main`.

Bob must never commit directly to `staging` unless explicitly instructed.

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

After changes, Bob must run verification commands.

Recommended commands:

```bash
git status
git diff
npm run build
npm run lint
npm test
```

If this project does not have lint/test/build commands yet, Bob must say which commands were unavailable and run the closest available verification command.

For frontend tasks, use the closest available commands, usually:

```bash
cd frontend
npm install
npx tsc --noEmit
npm run build
```

For backend tasks, use the closest available commands, usually:

```bash
cd backend
pip install -r requirements.txt
python -m compileall app
```

Then commit and push:

```bash
git add .
git commit -m "<commit-message>"
git push -u origin <branch-name>
```

Then prepare manual PR details.

Bob must not run:

```bash
gh pr create
```

Instead, Bob must provide:

```txt
PR URL:
https://github.com/e-carter-code/bob-hackathon/pull/new/<branch-name>

Base:
staging

Compare:
<branch-name>

PR Title:
<Conventional Commit style title>

PR Body:
<copyable markdown PR body>
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
feat/add-backend-mock-api
```

### Use `fix/` for bug fixes

Examples:

```txt
fix/upload-navigation
fix/graph-node-selection
fix/report-download-error
fix/test-runner-state
fix/backend-health-check
```

### Use `refactor/` for internal code cleanup

Examples:

```txt
refactor/extract-flow-state
refactor/simplify-report-components
refactor/organize-editor-layout
refactor/backend-routes
```

### Use `chore/` for setup and tooling

Examples:

```txt
chore/setup-vite-tailwind
chore/add-react-flow
chore/add-project-docs
chore/setup-fastapi-backend
```

### Use `docs/` for documentation-only changes

Examples:

```txt
docs/add-frontend-spec
docs/add-bob-rules
docs/update-demo-script
docs/update-git-workflow
```

### Use `test/` for test-only changes

Examples:

```txt
test/add-rule-editor-tests
test/add-report-export-tests
test/add-backend-health-tests
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
feat(backend): add JSON session storage

fix(editor): correct selected node state
fix(report): handle empty changed rules
fix(upload): keep analysis button disabled before project load
fix(backend): correct health response

refactor(editor): split rule inspector components
refactor(state): centralize project mock data
refactor(backend): split storage helpers

chore(deps): add react-flow
chore(setup): configure tailwind
chore(backend): add FastAPI dependencies

docs: add frontend implementation rules
docs: update git workflow rules

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
backend
```

Good:

```txt
feat(editor): add visual test runner shell
fix(upload): persist selected sample project
refactor(report): split visual summary cards
feat(backend): add sample project endpoint
```

---

## 5. Pull Request Rules

Every branch should have a pull request into `staging`.

The PR title should follow the same style as commit messages.

Examples:

```txt
feat(editor): add nested visual logic editor
fix(report): correct markdown download output
style(home): polish landing page hero
feat(backend): add sample project endpoint
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

### Manual PR Creation Rule

Bob must not use GitHub CLI for PR creation.

Bob must not run:

```bash
gh pr create
```

Bob must only provide manual PR details for the user to paste into GitHub.

Required output:

```txt
PR URL:
https://github.com/e-carter-code/bob-hackathon/pull/new/<branch-name>

Base:
staging

Compare:
<branch-name>

PR Title:
<PR title>

PR Body:
<copyable markdown body>
```

The user will create the PR manually in the browser.

---

## 6. Conflict Rules

Before preparing PR details, Bob must check if the branch is behind staging.

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
4. Tell the user to merge manually in GitHub web UI unless explicitly instructed otherwise.
5. Delete the branch after merge only if safe and explicitly requested.

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
PR URL:
Base:
Compare:
PR Title:
PR Body:
Commands run:
Status:
```

Example:

```txt
Branch:
feat/add-analysis-dashboard

Commit:
feat(analysis): add nested logic dashboard

PR URL:
https://github.com/e-carter-code/bob-hackathon/pull/new/feat/add-analysis-dashboard

Base:
staging

Compare:
feat/add-analysis-dashboard

PR Title:
feat(analysis): add nested logic dashboard

PR Body:
## Summary
- Added the Analysis Dashboard with nested business logic hierarchy.

## Why
- This provides the first visual overview of the legacy business logic.

## How to test
- cd frontend
- npm run build
- Open /analysis

## Notes
- Mock data only.

Commands run:
npm run build

Status:
Ready for manual PR creation
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
fix(backend): correct CORS origin list
```

Small change does not mean sloppy commit.

---

## 10. Safety Rules

Bob must not commit:

- secrets
- `.env`
- API keys
- passwords
- local machine paths
- `node_modules`
- build artifacts unless required
- Bob private credentials
- IBM Cloud credentials

Before committing, Bob must check:

```bash
git status
git diff --staged
```

If secrets are detected, Bob must stop and warn the user.

---

## 11. If Git Actions Are Unavailable

If Bob cannot run Git commands, push, or access the repository state, Bob must not pretend the Git workflow is complete.

Instead, Bob must output the exact manual commands for the user:

```bash
git status
git checkout staging
git pull origin staging
git checkout -b <branch-name>
git add <changed-files>
git commit -m "<commit-message>"
git push -u origin <branch-name>
```

Bob must also provide:

```txt
PR URL:
https://github.com/e-carter-code/bob-hackathon/pull/new/<branch-name>

Base:
staging

Compare:
<branch-name>

PR Title:
<PR title>

PR Body:
<copyable markdown body>
```

Status must say:

```txt
Ready for manual Git/PR steps
```

not:

```txt
PR created
```

---

## 12. Recommended First Setup Task

Use this branch:

```txt
docs/update-git-workflow
```

Commit:

```txt
docs: update git workflow rules
```

PR title:

```txt
docs: update git workflow rules
```

PR base:

```txt
staging
```

Manual PR URL:

```txt
https://github.com/e-carter-code/bob-hackathon/pull/new/docs/update-git-workflow
```

---

## 13. First Prompt To Bob

Use this first:

```txt
Read .bob/rules/git-workflow-rules.md and summarize the required Git workflow.

Do not change files yet.

Return:
1. permanent branches
2. branch creation rule
3. branch naming convention
4. commit message convention
5. PR target branch
6. manual PR creation rule
7. merge/conflict rules
8. what you must report after each task
```

---

## 14. Standard Prompt Before Every Task

Use this prompt before asking Bob to implement a task:

```txt
Before making changes, follow .bob/rules/git-workflow-rules.md.

Create a new branch from staging using a professional branch name.

Task:
<describe task>

After implementation:
1. run verification commands
2. commit with a Conventional Commit message
3. push branch
4. do not run gh pr create
5. provide manual PR URL, base, compare branch, PR title, and copyable PR body for a PR into staging
6. summarize branch, commit, PR URL, commands run, and status
```

---

## 15. Low Bobcoin Prompt Pattern

For small tasks, use this shorter prompt:

```txt
Read the relevant task file and .bob/rules/git-workflow-rules.md only.

Task:
<short task>

Follow Git workflow.
Do not use gh pr create.
Provide manual PR details only.

Answer only:
Branch:
Commit:
PR URL:
PR Title:
Commands run:
Status:
```
