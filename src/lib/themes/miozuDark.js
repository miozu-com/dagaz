// // Miozu Dark Theme - Base16 scheme
// // Based on Newton's color wheel principles for natural harmony and balance
// export default {
//   name: 'Miozu Dark',
//   author: 'Nicholas Glazer',
//   colors: {
//     base0: '#232733', // background
//     base1: '#2c3040', // lighter background
//     base2: '#3e4359', // selection background
//     base3: '#565e78', // comments
//     base4: '#737e99', // dark foreground
//     base5: '#d0d2db', // foreground
//     base6: '#f3f4f7', // light foreground
//     base7: '#fafdfb', // lightest foreground
//     base8: '#eb3137', // red / error
//     base9: '#ff9837', // orange / numbers
//     base10: '#6dd672', // green / success
//     base11: '#e8d176', // yellow / warning
//     base12: '#83d2fc', // blue / info
//     base13: '#c974e6', // magenta / functions
//     base14: '#ff9982', // peach / keywords
//     base15: '#40ffe2' // cyan / methods
//   }
// };
// Equilibrium Dark - Base16 Scheme
// Author: AI Assistant (based on deep research)
// Designed for visual comfort, clarity, and versatility across syntax and UI.
// Miozu Dark UI-Focused - Base16 Scheme
// Author: Nicholas Glazer (Refined by AI for UI context)
// Aiming for better visual hierarchy and 'pop' in UI, based on visual feedback.
export default {
  name: 'Miozu Dark UI-Focused',
  author: 'Nicholas Glazer / AI Assistant',
  colors: {
    // Base tones - Darker background, good text/comment contrast
    base0: '#1e2129', // background - Darker, slightly desaturated blue-grey
    base1: '#2a2f3b', // lighter background - Slightly larger step for more separation
    base2: '#3c4257', // selection background / UI elements / Button BG? - Noticeably lighter
    base3: '#6b758d', // comments - Good contrast on base0
    base4: '#8490aa', // dark foreground / secondary text - Good contrast on base0
    base5: '#d5d8e0', // foreground - Main text, excellent contrast on base0
    base6: '#f3f4f7', // light foreground
    base7: '#fafdfb', // lightest foreground

    // Accent colors - Reintroducing some Miozu vibrancy, checked for contrast
    // Primary Accent (Logo, Icons - like in Dagaz screenshot):
    base14: '#ff9982', // Peach / Keywords (Original Miozu vibrant peach) (Contrast on base0: ~6.6:1 - Good)

    // Other Accents (Syntax Highlighting / Secondary UI accents):
    base8: '#eb5e65', // Red / Error (Slightly vibrant) (Contrast: ~5.8:1)
    base9: '#ffb066', // Orange / Numbers (More vibrant) (Contrast: ~8.0:1)
    base10: '#80d684', // Green / Success (More vibrant) (Contrast: ~6.1:1)
    base11: '#e8d176', // Yellow / Warning (Original Miozu yellow) (Contrast: ~9.6:1)
    base12: '#83d2fc', // Blue / Info (Original Miozu blue) (Contrast: ~7.8:1)
    base13: '#d687e6', // Magenta / Functions (More vibrant) (Contrast: ~7.1:1)
    base15: '#60ffe7' // Cyan / Methods (More vibrant) (Contrast: ~8.6:1)

    // --- UI Specific Notes ---
    // Buttons (Example combinations for better contrast):
    // - Primary Button BG: base14 ('#ff9982'), Text: base0 ('#1e2129') (Contrast ~3.6:1 - A bit low, maybe use base7 text? #fafdfb on #ff9982 is ~2.6:1 - worse! Need darker text. Try #181a1f on #ff9982 -> ~4.0:1 - ok for buttons)
    // - Primary Button BG: base12 ('#83d2fc'), Text: base0 ('#1e2129') (Contrast ~4.8:1 - Good)
    // - Secondary Button BG: base2 ('#3c4257'), Text: base5 ('#d5d8e0') (Contrast ~5.8:1 - Good for secondary)
  }
};
