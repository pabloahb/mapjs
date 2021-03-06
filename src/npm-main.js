/*global module, require */

require('./browser/dom-map-widget');
require('./browser/link-edit-widget');
require('./browser/map-toolbar-widget');

module.exports = {
	MemoryClipboard: require('./browser/clipboard'),
	MapModel: require('./core/map-model'),
	content: require('./core/content/content'),
	observable: require('./core/util/observable'),
	DomMapController: require('./browser/dom-map-controller'),
	ThemeProcessor: require('./core/theme/theme-processor'),
	Theme: require('./core/theme/theme'),
	defaultTheme: require('./core/theme/default-theme'),
	formatNoteToHtml: require('./core/content/format-note-to-html'),
	version: 4
};
