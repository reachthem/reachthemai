---
name: minimal-edit error correction
description: Use this skill to fix user-submitted chat errors with the smallest safe code or text change and minimal token usage.
---

# Minimal-Edit Error Correction

## Overview

This skill instructs the agent to correct errors submitted by the user in chat while making as few changes as possible and using as few tokens as possible.

## When to use

- The user submits an error message, failed code, or asks to correct a bug.
- The user asks to fix or debug code, configuration, prompt text, or output.
- The user expects a concise correction rather than a broad refactor or extended explanation.

## Instructions

1. **Focus on the exact failure**
   - Read the user-provided error, code snippet, or chat content carefully.
   - Identify the smallest change that resolves the issue.

2. **Minimize changes**
   - Prefer a one-line or small localized patch.
   - Do not rewrite unrelated code or add new features.
   - Keep the existing structure, variable names, and formatting unless the error requires a targeted fix.

3. **Minimize tokens**
   - Use concise output and avoid verbose explanations.
   - When showing code, return only the changed lines or the smallest complete snippet needed to understand the fix.
   - Avoid duplicate or redundant text.

4. **Be direct**
   - If a short fix is enough, provide it without a long preamble.
   - If an explanation is needed, keep it brief and targeted to the cause and fix.

5. **Ask only if necessary**
   - If the bug cannot be fixed safely without more context, ask a focused clarifying question.
   - Do not ask broad or open-ended questions.

## Output format

- Prefer a concise patch-style response or minimal snippet.
- If a full file change is required, show only the affected section.
- Avoid adding unrelated code or commentary.

## Examples

- If the error is a missing import, add just the import line.
- If the error is a typo in a variable name, replace only the misspelled identifier.
- If the user asks to correct a prompt or chat response, change the wording minimally while preserving meaning.
