---
trigger: always_on
---

---
trigger: always_on
glob: "**/*"
description: "Global rules for Mobile First, Clean Code, and Error Checking"
---

# Antigravity Global Rules

## 📱 Mobile First Strategy
1.  **Mobile Default**: Always write CSS/layout code assuming a mobile viewport first. Use media queries (e.g., `md:`, `lg:`) only to enhance the layout for larger screens.
2.  **Responsiveness**: Ensure no content overflows or breaks on small screens (minimum 375px width).
3.  **Touch Targets**: Interactive elements must be easily tappable on touch devices.
4.  **Padding**: All page containers must have horizontal padding (`px-4` or similar) to prevent content from touching screen edges.

## 🧹 Clean Code & Best Practices
1.  **Modularity**: Break down complex components into smaller, reusable sub-components.
2.  **Type Safety**: Use strict TypeScript types. Avoid `any` unless absolutely necessary.
3.  **Self-Documenting**: Write clear variable/function names. Add comments only for complex logic, not for describing *what* code does.
4.  **Consistency**: Follow the existing project structure and naming conventions.
5.  **No Mock Data**: Avoid leaving hardcoded mock data in final implementations unless explicitly requested for prototyping.

## ✅ Error Checking & Verification
1.  **Fix Before Finish**: Never mark a task as complete if there are known linting errors, console warnings, or logical bugs.
2.  **Console Check**: proactive check for console errors (like Recharts `width(-1)`) during verification.
3.  **Component Validation**: Verify that props and dependencies are correctly handled to prevent runtime crashes.
4.  **Auto-Recovery**: Implement error boundaries or fallbacks for critical components where possible.