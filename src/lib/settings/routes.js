/**
 * Central routes configuration for Dagaz
 * This file defines all navigation items for consistent use across the application
 */

// Main navigation routes (internal pages)
export const mainRoutes = [
  {path: '/manifesto', label: 'Manifesto', translate: false},
  {path: '/blog', label: 'blog', translate: true},
  {path: '/contact', label: 'Contact', translate: true}
];

// Footer-specific additional links
export const footerRoutes = [
  {path: '/manifesto', label: 'Manifesto', translate: false},
  {path: '/blog', label: 'blog', translate: true},
  {path: '/contact', label: 'Contact', translate: true}
];

// External links configuration
export const externalRoutes = [
  {key: 'github', translate: false},
  {key: 'codeberg', translate: false}
];
