/**
 * Developer-only features (AI Studio drawer, prompt templates, teleprompter scripts).
 * Hidden from staff and clients unless VITE_SHOW_DEV_TOOLS=true is set at build time.
 */
export const SHOW_DEV_TOOLS: boolean = import.meta.env.VITE_SHOW_DEV_TOOLS === 'true';
