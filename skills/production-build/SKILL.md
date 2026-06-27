---
name: production-build
description: Outline the best way to find and fix production build errors in a Next.js app.
---

# Production Build

## Overview

This skill guides the agent through a reliable workflow for diagnosing and fixing production build errors, especially in Next.js and similar React-based apps. It focuses on capturing the full error set from a single build run, grouping related failures, and making targeted corrections to reduce edit/build cycles.

## When to use

- The user asks to fix production build or CI build failures.
- The user reports a `next build`, `npm run build`, or production compilation error.
- The user wants a faster or more efficient debugging workflow for build issues.

## Instructions

1. **Run one full production build first**
   - Execute `npm run build` or `next build` in the repository root.
   - Capture the complete set of build errors and warnings from that single run.
   - Do not fix one error and rebuild immediately unless the build output is already stable.

2. **Analyze errors in batches**
   - Group build failures by type: syntax, typescript, missing import, undefined reference, runtime-only import in server code, route mismatch, or asset issue.
   - Prioritize errors that block the build and avoid chasing unrelated warnings first.
   - If the build output references multiple files, inspect each relevant file before editing.

3. **Fix root causes, not symptoms**
   - Resolve the earliest or root compile error in each group first.
   - Check for repeated patterns across files (e.g., missing `use client`, bad import paths, wrong component export).
   - When a fix is applied, keep the change local and minimal but sufficient to address the underlying build failure.

4. **Validate with targeted checks**
   - After a batch of fixes, re-run `npm run build` once.
   - If the build still fails, use the returned errors to narrow down any remaining issues.
   - Do not perform a full rebuild after every small change unless the change is isolated and simple.

5. **Use project-specific conventions**
   - For Next.js App Router apps, verify `server` vs `client` component rules and ensure imported browser-only code is only used in client components.
   - Check `next.config.ts`, route file names, and file extension conventions if the build fails on routing or page rendering.
   - Use TypeScript errors as a guide for missing types, wrong props, or implicit `any` problems.

6. **Document and communicate clearly**
   - Summarize the changes made and why they were required.
   - If certain build failures depend on missing environment variables, note that separately from code fixes.
   - Prefer concise, actionable explanations.

7. **Focus on the exact failure**
   - Read the user-provided error, code snippet, or chat content carefully.
   - Identify the smallest change that resolves the issue.

 8. **Check for exact failure in other parts of the code**
   - Search the code for that specific error or issue.
   - Fix any other instances of the same error
   .

9. **Minimize changes**
   - Prefer a one-line or small localized patch.
   - Do not rewrite unrelated code or add new features.
   - Keep the existing structure, variable names, and formatting unless the error requires a targeted fix.

10. **Minimize tokens**
   - Use concise output and avoid verbose explanations.
   - When showing code, return only the changed lines or the smallest complete snippet needed to understand the fix.
   - Avoid duplicate or redundant text.

11. **Be direct**
   - If a short fix is enough, provide it without a long preamble.
   - If an explanation is needed, keep it brief and targeted to the cause and fix.

12. **Ask only if necessary**
   - If the bug cannot be fixed safely without more context, ask a focused clarifying question.
   - Do not ask broad or open-ended questions.

## Output format

- Provide a step-by-step remediation plan when the user asks for a debugging strategy.
- If code changes are required, show only the affected snippets or patches.
- When describing the workflow, emphasize one full build pass, error grouping, and batch validation.

## Examples

- If a `next build` run returns multiple TypeScript errors, identify the first error in each file and fix those before rerunning the build.
- If a missing import or wrong file path appears in several pages, search for the pattern and correct all occurrences together.
- If a component is using browser APIs in a server component, move the import or add `use client` as needed rather than changing individual lines blindly.

## Notes

- This skill is designed to reduce build/fix cycles by encouraging a single build pass and focused batch fixes.
- It is not intended to replace CI debugging entirely, but to make local production build troubleshooting faster and more reliable.
