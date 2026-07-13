# CLAUDE.md

# LaptopCheck Project Instructions

This document defines the permanent development rules for this project.
Unless the user explicitly overrides a rule during the current conversation, these instructions always apply.

---

# Project Mission

This project is a browser-based laptop diagnostics platform that allows users to verify laptop hardware and functionality through interactive browser-based tests.

Primary priorities:

1. Security
2. Reliability
3. Accuracy
4. User Trust
5. Performance
6. Maintainability

Never sacrifice these priorities for convenience.

---

# General Development Rules

Always understand the existing implementation before making changes.

Never rewrite working code unless explicitly requested.

Prefer improving existing code over replacing it.

Keep modifications as small and isolated as possible.

Avoid unnecessary refactoring.

Never introduce breaking changes unless requested.

If uncertain, ask instead of guessing.

**Never change business logic unless explicitly requested.**

If fixing a bug requires changing existing behavior, explain the reason before implementing it.

---

# SEO PROTECTION (CRITICAL)

SEO is considered a protected area of this project.

DO NOT modify ANY of the following unless the user explicitly requests SEO work:

- Meta titles
- Meta descriptions
- Canonical URLs
- Robots.txt
- Sitemap
- Structured data
- Open Graph tags
- Twitter Cards
- Heading hierarchy
- URL structure
- Internal linking
- Schema.org markup
- Keywords
- Indexing configuration
- Analytics
- Search Console verification
- Favicons
- Manifest settings

Never rewrite existing SEO content.

Never optimize SEO automatically.

Never remove SEO tags.

Never replace metadata.

Never change page titles.

Never touch anything related to SEO unless the request specifically asks for SEO changes.

---

# UI / UX RULES

Never redesign pages unless requested.

Never change:

- Color palette
- Typography
- Branding
- Icons
- Layout
- Navigation
- Animations

unless explicitly instructed.

Only modify the specific component requested.

---

# COMPONENT BOUNDARIES

Work only inside the requested feature.

Never modify unrelated components.

Never introduce side effects into unrelated pages.

If a change requires touching another module, explain why before doing it.

---

# SECURITY RULES

Security takes priority over convenience.

Always:

- Validate inputs
- Sanitize outputs
- Prevent XSS
- Prevent injection attacks
- Prevent insecure browser API usage
- Remove debug code
- Remove unnecessary console logs
- Remove temporary development code
- Never expose secrets
- Never expose API keys
- Never expose tokens
- Never expose environment variables

Never weaken security to satisfy a feature request.

---

# PRIVACY RULES

LaptopCheck is privacy-first.

Never collect user data unless explicitly requested.

Never upload:

- Camera streams
- Microphone data
- Device information
- Test results

unless the feature specifically requires it.

All diagnostics should run locally whenever possible.

---

# PERFORMANCE RULES

Never introduce unnecessary dependencies.

Before installing a new dependency:

- Check whether the same functionality can be achieved using native browser APIs.
- Reuse existing project dependencies whenever possible.
- Avoid duplicate libraries.
- Keep bundle size as small as possible.

Optimize rendering.

Avoid unnecessary re-renders.

---

# CODE STYLE

Follow existing project architecture.

Maintain naming conventions.

Prefer readable code over clever code.

Avoid duplicate logic.

Keep components modular.

Keep functions focused.

---

# PUBLIC API STABILITY

Do not rename or remove existing public interfaces unless explicitly instructed.

This includes:

- Exported functions
- Public components
- Component props
- Routes
- URLs
- API endpoints
- Shared utilities
- Public TypeScript interfaces
- Event names

Maintain backward compatibility whenever possible.

If changing a public interface is unavoidable, clearly explain why before making the change.

---

# TESTING

Before considering a task complete:

- Check for runtime errors
- Check TypeScript errors
- Check console errors
- Check build errors

Do not introduce warnings if avoidable.

---

# BUG FIX POLICY

Fix only the root cause.

Do not add temporary hacks.

Do not silence errors without understanding them.

---

# DIAGNOSTIC TESTS

Laptop tests should be trustworthy.

Never fake results.

Never simulate successful hardware detection.

If browser limitations prevent testing:

Clearly inform the user.

Never report unsupported hardware as "working."

---

# ACCESSIBILITY

Maintain keyboard navigation.

Maintain ARIA labels.

Maintain contrast.

Do not reduce accessibility.

---

# GIT & FILE SAFETY

Never rename files unless required.

Never delete files unless requested.

Never move folders without permission.

Never overwrite large sections of code unnecessarily.

Preserve project structure.

---

# WHEN MAKING CHANGES

Always follow this workflow:

1. Understand the existing implementation.
2. Analyze the impact of the requested change.
3. Modify only the necessary files.
4. Verify that no unrelated functionality has been affected.
5. Test for runtime, build, and console errors.
6. Confirm the requested feature works as expected.

---

# IF A REQUEST CONFLICTS WITH THESE RULES

Follow the user's explicit request for that task only.

Do not permanently override these rules.
