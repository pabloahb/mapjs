/*global require, document, window, console */
const MAPJS = require('../src/npm-main'),
	jQuery = require('jquery'),
	themeProvider = require('./theme'),
	testMap = require('./example-map');
	content = MAPJS.content,
	init = function () {
		'use strict';
		var myMap;
		if(window.startupMap)
		{
			myMap=window.startupMap;
		}
		else
		{
			myMap={};
		}
		let domMapController = false;
		const container = jQuery('#container'),
			idea = content(myMap),
			touchEnabled = false,
			mapModel = new MAPJS.MapModel([]),
			layoutThemeStyle = function (themeJson) {
				const themeCSS = themeJson && new MAPJS.ThemeProcessor().process(themeJson).css;
				if (!themeCSS) {
					return false;
				}
				if (window.themeCSS)
				{
				delete window.themeCSS;
				}
				theme = new MAPJS.Theme(themeJson),
				getTheme = () => theme;
				jQuery('<style id="themeCSS" type="text/css"></style>').appendTo('head').text(themeCSS);
				return true;
			};
			var themeJson;
			if(window.defaultTheme)
			{
				themeJson=window.defaultTheme;
			}
			else
			{
				themeJson=themeProvider.default || MAPJS.defaultTheme;
			}
			var theme = new MAPJS.Theme(themeJson),
			getTheme = () => theme;

		jQuery.fn.attachmentEditorWidget = function (mapModel) {
			return this.each(function () {
				mapModel.addEventListener('attachmentOpened', function (nodeId, attachment) {
					mapModel.setAttachment(
						'attachmentEditorWidget',
						nodeId, {
							contentType: 'text/html',
							content: window.prompt('attachment', attachment && attachment.content)
						});
				});
			});
		};
		window.onerror = console.log;
		window.jQuery = jQuery;
		mapModel.touchEnabled=touchEnabled;
		mapModel.loadIdea= function (jsonIdea)
		{
			var myIdea=content(jsonIdea);
			mapModel.setIdea(myIdea);

		}

		container.domMapWidget(console, mapModel, touchEnabled);

		domMapController = new MAPJS.DomMapController(
			mapModel,
			container.find('[data-mapjs-role=stage]'),
			touchEnabled,
			undefined, // resourceTranslator
			getTheme
		);
		jQuery('body').mapToolbarWidget(mapModel);
		//jQuery('#themecss').themeCssWidget(themeProvider, new MAPJS.ThemeProcessor(), mapModel, domMapController);
		// activityLog, mapModel, touchEnabled, imageInsertController, dragContainer, centerSelectedNodeOnOrientationChange

		jQuery('body').attachmentEditorWidget(mapModel);
		layoutThemeStyle(themeJson);
		mapModel.themeStyle= function (jsonTheme) {
			layoutThemeStyle(jsonTheme);
			mapModel.rebuildRequired();
			mapModel.resetView();
		
		
		};
		mapModel.setIdea(idea);


		jQuery('#linkEditWidget').linkEditWidget(mapModel);
		mapModel.content=content;
		window.mapModel = mapModel;
		jQuery('.arrow').click(function () {
			jQuery(this).toggleClass('active');
		});

		container.on('drop', function (e) {
			const dataTransfer = e.originalEvent.dataTransfer;
			e.stopPropagation();
			e.preventDefault();
			if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
				const fileInfo = dataTransfer.files[0];
				if (/\.mup$/.test(fileInfo.name)) {
					const oFReader = new window.FileReader();
					oFReader.onload = function (oFREvent) {
						mapModel.setIdea(content(JSON.parse(oFREvent.target.result)));
					};
					oFReader.readAsText(fileInfo, 'UTF-8');
				}
			}
		});
		var mapjsEvent=new CustomEvent("mapjsStarted");
		document.dispatchEvent(mapjsEvent);
	};
document.addEventListener('DOMContentLoaded', init);
