import {browser} from '$app/environment';
import {SettingsReactiveState} from '$lib/reactiveStates/settings.svelte.js';
import {LocalizationReactiveState} from '$lib/reactiveStates/localization.svelte.js';
import {ThemeReactiveState} from '$lib/reactiveStates/theme.svelte.js';
import translations from '$lib/data/translations';

export const load = async () => {
  // Initialize general settings
  const s = new SettingsReactiveState({
    pageSize: {h: 0, w: 0},
    showToast: () => {}
  });

  // Get saved locale from localStorage if available
  const savedLocale = browser && localStorage.getItem('app-localization');
  const initialLocale = savedLocale ? JSON.parse(savedLocale) : 'en';

  // Create the localization instance
  const l10n = new LocalizationReactiveState({
    locale: initialLocale,
    translations: translations
  });

  // Get saved theme from localStorage
  const savedTheme = browser && localStorage.getItem('app-theme');
  const isDark = savedTheme ? JSON.parse(savedTheme) : true;

  // Create the theme instance
  const theme = new ThemeReactiveState({
    isDark: isDark
  });

  return {s, l10n, theme};
};

// +layout.js with "prerender = true" to make all routes static
// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;
export const trailingSlash = 'always';
