// General reactive states here
export class SettingsReactiveState {
  language = $state('en');
  theme = $state('dark');
  pageSize = $state({h: 0, w: 0});
  showToast = $state(() => {});

  constructor(initialValue) {
    if (initialValue) {
      this.language = initialValue.language;
      this.theme = initialValue.theme;
      this.pageSize = initialValue.pageSize;
      this.showToast = initialValue.showToast;
    }
  }
}
