import {browser} from '$app/environment';
import miozuDark from '$lib/themes/miozuDark';
import miozuLight from '$lib/themes/miozuLight';

/**
 * Reactive state class for handling theme switching
 */
export class ThemeReactiveState {
  // Theme state with initial dark mode (true = dark, false = light)
  _themeState = $state(true);

  constructor(initialValue) {
    if (initialValue) {
      // Use stored theme or fallback to system preference
      if (initialValue.isDark !== undefined) {
        this._themeState = initialValue.isDark;
      } else if (browser && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this._themeState = false;
      }

      this.applyTheme();
    }
  }

  /**
   * Boolean indicating if dark theme is active
   */
  get isDark() {
    return this._themeState;
  }
  /**
   * Get the current theme colors
   */
  get current() {
    return this._themeState ? miozuDark : miozuLight;
  }
  /**
   * Gets current theme state (true = dark, false = light)
   */
  get value() {
    return this._themeState;
  }
  /**
   * Set theme (true = dark, false = light)
   */
  set value(isDark) {
    this._themeState = Boolean(isDark);
    this.applyTheme();

    localStorage.setItem('app-theme', JSON.stringify(this._themeState));
  }

  /**
   * Apply the current theme to the document
   */
  applyTheme() {
    // Get active theme colors
    const theme = this._themeState ? miozuDark : miozuLight;

    if (browser)
      Object.entries(theme.colors).forEach(([prop, value]) => {
        // Apply CSS variables
        document.documentElement.style.setProperty(`--color-${prop}`, value);
      });
  }

  toggle() {
    this.value = !this._themeState;
    return this.value;
  }
}
