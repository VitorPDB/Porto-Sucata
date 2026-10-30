const paths = {
  anchor: '<path d="M12 7v14M5 12H2a10 10 0 0 0 20 0h-3M7 10h10"/><circle cx="12" cy="4" r="3"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  book: '<path d="M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v16h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3Z M12 6v16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  bulb: '<path d="M9 18h6M9 21h6M9 15a6 6 0 1 1 6 0v1H9Z"/>',
  wrench: '<path d="m14 5 5-3a6 6 0 0 1-7 9L5 20a2 2 0 0 1-3-3l9-7a6 6 0 0 1 3-8Z"/>',
  radio: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="m5 8 13-6M7 13h6M7 17h4"/><circle cx="17" cy="15" r="2"/>',
  undo: '<path d="m9 5-5 5 5 5M4 10h9a6 6 0 0 1 6 6v3"/>',
  notebook: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M2 7h6M2 12h6M2 17h6M12 8h4M12 12h4"/>',
};
export function icon(name) { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.anchor}</svg>`; }
