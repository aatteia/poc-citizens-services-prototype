# Accessibility implementation

WCAG 2.1 AA standard applied throughout. This document consolidates every accessibility decision made in the prototype — semantic choices, ARIA usage, focus management, keyboard behaviour, and visual patterns.

---

## Semantic HTML

**Radio groups use `<fieldset>` + `<legend>`**
Every question in the eligibility flow wraps its options in a `<fieldset>`. The question text is the `<legend>`. This is the only correct pattern for grouped inputs — screen readers announce the legend before each option so the user always hears the question and the option together, not just "Single" or "Yes" in isolation.

**Breadcrumb uses `<nav aria-label>`**
The breadcrumb is wrapped in a `<nav>` element with a distinct `aria-label` (not "navigation", which would conflict with the site header's `<nav>`). The current page is the last item: it is not a link and carries `aria-current="page"`.

**Status and alert roles on banners**
`role="status"` is used for positive or neutral outcomes (eligible result, info banner, progress summary bar, completion banner). `role="alert"` is used for negative or urgent outcomes (ineligible result, warning banner, inline errors). The distinction matters: `alert` interrupts the user immediately via assistive technology; `status` waits for an idle moment. Using `alert` for a positive result is a common mistake that causes unnecessary interruptions.

**Skip-to-content link**
The first focusable element in the document on every page. Visually hidden until focused (`clip`-based hide, not `display: none`), then reveals as a navy button anchored to `#main`. Keyboard users who tab into the page see it before any navigation.

---

## ARIA

**Inline errors are linked to their inputs**
The error message component (`InlineError`) accepts an `id` prop. The radio group it describes uses `aria-describedby` pointing to that id. This means a screen reader user who tabs to the group hears both the question (from the `<legend>`) and the error message, not just one or the other.

**Progress summary bar uses `aria-live="polite"`**
The progress bar has `role="status"` and `aria-live="polite"`. When a section becomes ready and the count updates ("2 of 4 sections ready"), assistive technology announces the change at the next idle moment — not mid-sentence. `aria-live="assertive"` would be intrusive here because the update is not urgent.

**Progress indicator step labels**
The segmented progress indicator includes visible step labels on desktop and a text "Step N of 6" on mobile. Both are part of the document, not aria-only — they do not rely on `aria-label` replacements for their content.

**Checklist item toggles are keyboard-accessible**
The "Why do I need this?" collapsible uses Base UI's Collapsible primitive, which manages `aria-expanded` and keyboard activation automatically. The toggle button is fully keyboard-reachable.

---

## Focus management

**Result pages move focus to `<h1>` on mount**
Both the eligible and ineligible result pages call `headingRef.current?.focus()` in a `useEffect` on mount. The heading has `tabIndex={-1}` to allow programmatic focus without placing it in the tab order. Without this, a keyboard or screen reader user who reaches the result page after answering question 6 would have their focus stranded at the Continue button from the previous page.

**Inline error focus**
If the user clicks Continue without selecting an answer, the inline error appears and focus is moved to the radio group (or the error itself via `aria-describedby`). The user does not need to hunt for why the Continue button did nothing.

---

## Keyboard navigation

All interactive elements are reachable and operable by keyboard:
- Radio cards: standard `<input type="radio">` wrapped in styled labels. Tab moves between radio groups; arrow keys move between options within a group.
- Continue and Back buttons: standard `<button>` elements.
- Checklist items: standard `<input type="checkbox">` with styled labels.
- Collapsible helpers: Base UI Collapsible — Enter or Space activates.
- Mobile menu: opens and closes with Enter/Space, traps focus while open.
- myGov dropdown: keyboard-accessible via Base UI Menu primitive.

---

## Visual patterns

**No strikethrough on checked checklist items**
Checked items shift their label colour to `--muted` (mid-grey). Strikethrough on completed items is a common pattern but reduces text readability for low-vision users at the moment they may want to re-read what they have gathered. The navy checkbox fill provides sufficient checked signal without degrading the label.

**Colour is never the sole signal**
Status banners use both colour (green/red/blue/amber border) and a `role` attribute. The print stylesheet uses a ■ glyph before checked item labels rather than a green checkbox fill — the signal survives black-and-white printing and meets colour-contrast requirements in all contexts.

**4px left border on banners and fact boxes**
The accent border provides a visual grouping cue that does not depend on colour alone. A colourblind user still perceives the left border as a distinct container boundary.

**Touch targets**
Radio cards have a minimum height of 48px. All interactive elements meet the WCAG 2.5.5 target size advisory (44×44px minimum). The mobile hamburger icon meets this threshold.

---

## Testing guidance

**Keyboard-only test**
Open the site and tab through it without touching the mouse. Verify:
- The skip-to-content link appears on first Tab press
- Every interactive element is reachable in logical order
- The eligibility flow can be completed entirely by keyboard
- The checklist items can be ticked and helpers opened by keyboard

**Screen reader test (macOS VoiceOver)**
Enable VoiceOver (`Cmd+F5`). Navigate the eligibility flow. Verify:
- Each question announces the legend (question) before the option label
- Error messages are announced when the flow fails to advance
- The result page heading is announced on arrival
- The progress bar updates are announced non-intrusively

**Axe or Lighthouse**
Run `npx axe http://localhost:3000` or open Chrome DevTools → Lighthouse → Accessibility. The prototype should score 95+ on Lighthouse accessibility. Known tolerable deductions: colour contrast of placeholder text in the search input (illustrative element, not functional).

**Colour contrast**
Primary text on white background: `--foreground` (`#1a1a1a`) on `--background` (`#ffffff`) — exceeds 7:1 (AAA). Navy primary on white: `#1B4F72` on white — 7.2:1 (AAA). Action blue links: checked against backgrounds on each page type.
