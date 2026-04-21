export function bookPalette(id: string) {
  const hues = [250, 340, 195, 160, 25, 350, 215]; // Indigo, Pink, Sky, Teal, Orange, Rose, Blue
  let idx = 0;
  for (let i = 0; i < id.length; i += 1) {
    idx = (idx + id.charCodeAt(i)) % hues.length;
  }
  const h = hues[idx];

  return {
    h,
    coverMain: `hsl(${h}, 70%, 55%)`,
    coverDark: `hsl(${h}, 75%, 45%)`,
    coverLight: `hsl(${h}, 80%, 75%)`,
    paper: '#ffffff',
    paperLine: '#f1f5f9',
  };
}

/** Total pixel height of the Bento CSS block (72px + 20px offset) */
export const BOOK_STACK_DISPLAY_HEIGHT_PX = 92;
/** Visible portion of the book when stacked (to reveal thickness and label) */
export const BOOK_STACK_STEP_PX = 36;
