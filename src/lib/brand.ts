/**
 * Single source of truth for the prototype's department brand name.
 *
 * The prototype is deliberately department-agnostic so it can be shown to
 * any government department, not just Services Australia. Changing the
 * brand is a one-line edit here — every chrome surface and body "tell"
 * reads from this constant.
 *
 * Note: uses a typographic apostrophe (’) to match the codebase
 * convention. Program names (Centrelink, myGov, Medicare, DVA, PRODA)
 * are intentionally NOT brand-scoped — they remain real-world references.
 */
export const BRAND_NAME = "Citizens’ Services";
