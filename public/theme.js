// A URL makes each proposal directly shareable without cookies or browser storage.
const selectedTheme = new URLSearchParams(location.search).get('stil');
document.documentElement.dataset.theme = ['studio', 'nord', 'signal'].includes(selectedTheme) ? selectedTheme : 'studio';
