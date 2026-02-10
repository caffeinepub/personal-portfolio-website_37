# Specification

## Summary
**Goal:** Let users paste resume text in the “Fill My Details” dialog to generate and safely apply an auto-filled draft to the existing portfolio form data, entirely client-side.

**Planned changes:**
- Add an “Import from Resume” section within the existing “Fill My Details” dialog with a multiline resume text input, inline empty-state validation, and a “Generate Draft” action.
- Implement a deterministic, in-browser resume text parser that maps common resume fields into the existing `PortfolioContent` form state (e.g., hero, about, skills, experience, projects, contact email, social links) without clearing fields that can’t be confidently extracted.
- Add a preview/confirmation step showing what would change (key fields and counts), with explicit Apply and Discard actions; Apply updates the editable form state, Discard leaves it unchanged.
- Ensure the final saved result continues to use the existing client-side localStorage override mechanism when the user clicks Save.

**User-visible outcome:** In “Fill My Details,” the user can paste resume text, generate a draft, review a preview of extracted portfolio details, and choose to apply or discard the changes before saving.
