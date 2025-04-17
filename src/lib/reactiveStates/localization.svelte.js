import {browser} from '$app/environment';
import translations from '$lib/data/translations';

/**
 * Reactive state class for handling localization across the application
 */
export class LocalizationReactiveState {
  locale = $state('en');
  translations = $state(translations);

  constructor(initialValue) {
    if (initialValue) {
      this.locale = initialValue.locale || 'en';

      // Make sure translations is always properly initialized
      if (initialValue.translations) {
        this.translations = initialValue.translations;
      } else if (!this.translations || Object.keys(this.translations).length === 0) {
        this.translations = translations;
      }
    }
  }

  /**
   * Gets the current locale value
   */
  get value() {
    return this.locale;
  }

  /**
   * Sets a new locale value and persists it
   */
  set value(newValue) {
    this.locale = newValue;

    if (browser) {
      localStorage.setItem('app-localization', JSON.stringify(this.locale));
      document.documentElement.lang = this.locale;
      console.log(`Language changed to: ${this.locale}`);
    }
  }

  /**
   * Translates a key into the current locale
   * @param {string} key - The translation key
   * @param {Object} params - Optional parameters for string interpolation
   * @returns {string} The translated string
   */
  t(key, params = {}) {
    if (!key) {
      console.warn('No key provided to t()');
      return '';
    }

    // Ensure translations exist before trying to access them
    if (!this.translations) {
      console.warn('Translations not loaded, returning key:', key);
      return key;
    }

    // Try to get the translation for current locale
    let text = this.translations[this.locale]?.[key];

    // Fallback to English if translation not found
    if (!text && this.locale !== 'en' && this.translations['en']) {
      text = this.translations['en'][key];
    }

    // If still no translation, return the key
    if (!text) {
      console.warn(`Translation not found for ${this.locale}.${key}`);
      return key;
    }

    // Handle parameters in translations
    if (params && Object.keys(params).length) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }

    return text;
  }

  /**
   * Adds or updates translations for a specific locale
   * @param {string} locale - The locale code to update
   * @param {Object} newTranslations - Object with key/value pairs to add or update
   */
  addTranslations(locale, newTranslations) {
    if (!locale || !newTranslations) return;

    this.translations = {
      ...this.translations,
      [locale]: {
        ...this.translations[locale],
        ...newTranslations
      }
    };
  }
}
