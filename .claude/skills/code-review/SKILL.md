---
name: code-review
description: Comprehensive code review using 5 parallel agents checking React/Next.js best practices, web design guidelines, CLAUDE.md compliance, bugs, and SEO/accessibility. Run on staged or recent changes.
metadata:
  author: local
  version: "1.0.0"
  argument-hint: [branch-or-commit]
---

# Code Review Skill

Automated code review using 5 parallel Sonnet agents, each specializing in a different aspect of code quality. Uses confidence-based scoring to filter false positives.

## How It Works

1. Get changed files via `git diff`
2. Launch 5 parallel Sonnet agents to independently review changes
3. Score each issue for confidence (0-100)
4. Filter issues with score < 80
5. Return consolidated summary to main agent

## Usage

```
/code-review              # Review uncommitted changes (staged + unstaged)
/code-review HEAD~3       # Review last 3 commits
/code-review main         # Review changes vs main branch
```

## Instructions

When this skill is invoked, follow these steps precisely:

### Step 1: Get Changed Files

Run `git diff` to identify changed files. Use the argument if provided, otherwise default to uncommitted changes:

```bash
# If no argument: review uncommitted changes
git diff --name-only HEAD

# If argument provided (e.g., "main"): review vs that ref
git diff --name-only <ref>
```

If no files changed, report "No changes to review" and stop.

### Step 2: Read the Changed Files

Read the full diff to understand what changed:

```bash
git diff HEAD           # or git diff <ref> if argument provided
```

### Step 3: Launch 5 Parallel Review Agents

Launch these 5 Sonnet agents IN PARALLEL using the Task tool. Each agent receives:
- The list of changed files
- The full diff content
- Their specific review focus

**Agent #1: React/Next.js Performance Review**
- Read the vercel-react-best-practices skill at `.claude/skills/vercel-react-best-practices/AGENTS.md`
- Check all changes against those performance rules
- Focus on: waterfalls, bundle size, server performance, re-renders, rendering patterns
- Return: List of issues with rule name, file, line, and explanation

**Agent #2: Web Design Guidelines Review**
- Fetch guidelines from: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- Check UI components against web interface best practices
- Focus on: interaction patterns, visual design, responsive design, component patterns
- Return: List of issues with guideline reference, file, line, and explanation

**Agent #3: CLAUDE.md Compliance Review**
- Read the root CLAUDE.md file (if exists)
- Read any CLAUDE.md files in directories containing changed files
- Check all changes against project-specific guidelines
- Return: List of issues with CLAUDE.md quote, file, line, and explanation

**Agent #4: Bug Detection Review**
- Scan changes for obvious bugs WITHOUT reading extra context
- Focus ONLY on the diff, not surrounding code
- Look for: logic errors, null/undefined issues, race conditions, security issues, off-by-one errors
- Ignore: style issues, potential improvements, pre-existing code
- Return: List of bugs with severity, file, line, and explanation

**Agent #5: SEO & Accessibility Review**
- Check for accessibility issues (WCAG compliance)
- Check for SEO issues (meta tags, semantic HTML, heading structure)
- Focus on: alt text, ARIA labels, color contrast, keyboard navigation, meta descriptions, Open Graph tags
- Return: List of issues with standard reference, file, line, and explanation

### Step 4: Score Each Issue

For EACH issue returned by the agents, evaluate confidence on this scale:

- **0**: False positive. Doesn't hold up to scrutiny, or is pre-existing.
- **25**: Might be real, but couldn't verify. Stylistic issues not in CLAUDE.md.
- **50**: Real but minor. Nitpick or won't happen often.
- **75**: Very likely real. Will impact functionality. Directly mentioned in guidelines.
- **100**: Definitely real. Will happen frequently. Evidence confirms it.

For CLAUDE.md issues: verify the guideline EXPLICITLY mentions the issue.
For guideline issues: verify the rule actually applies to this code.

### Step 5: Filter and Format Results

Filter out issues with score < 75.

Format the summary as:

```
## Code Review Summary

**Files Reviewed:** <count>
**Issues Found:** <count> (filtered from <total> potential issues)

### High-Confidence Issues

#### 1. [Category] Issue Title
- **File:** path/to/file.tsx
- **Line:** 42
- **Score:** 85
- **Source:** <guideline name or CLAUDE.md quote>
- **Issue:** Brief description of the problem
- **Suggestion:** How to fix it

#### 2. ...

### Review Coverage
- React/Next.js Performance: <issues found>/<total checked>
- Web Design Guidelines: <issues found>/<total checked>
- CLAUDE.md Compliance: <issues found>/<total checked>
- Bug Detection: <issues found>/<total checked>
- SEO & Accessibility: <issues found>/<total checked>
```

If no issues score >= 80, return:

```
## Code Review Summary

**Files Reviewed:** <count>
**Issues Found:** 0

No high-confidence issues found. Changes look good.

### Review Coverage
- React/Next.js Performance: checked
- Web Design Guidelines: checked
- CLAUDE.md Compliance: checked
- Bug Detection: checked
- SEO & Accessibility: checked
```

## False Positive Examples (Do Not Flag)

- Pre-existing issues not introduced in this diff
- Code that looks like a bug but isn't
- Pedantic nitpicks a senior engineer wouldn't mention
- Issues linters/typecheckers would catch (imports, types, formatting)
- General quality issues unless explicitly in CLAUDE.md
- Issues with lint-ignore comments
- Intentional functionality changes related to the broader change
- Issues on lines not modified in this diff

## Notes

- Do NOT attempt to build or run tests - those run separately in CI
- Focus on issues in the DIFF, not the whole codebase
- Be concise - developers appreciate brevity
- Link to specific guidelines when possible
