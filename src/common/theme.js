
'use strict';

import * as colors from '/common/colors.js'


const useDark = window.matchMedia("(prefers-color-scheme: dark)");


export async function set(themeType, theme) {

	if (!themeType) {
		if (!theme) theme = await browser.theme.getCurrent();
		if (theme && theme.colors) {
			setAll(theme);
			themeType = 'custom';
		}
	}

	if (themeType) {
		update(themeType);
		useDark.removeEventListener('change', darkToggle);
	} else {
		darkToggle(useDark);
		useDark.addEventListener('change', darkToggle);
	}
}

function darkToggle(dark) {
	if (dark.matches) {
		update('dark');
	} else {
		update('light');
	}
}

function update(themeType) {
	document.body.className = themeType;
}

async function setAll(theme) {

	if (!theme) theme = await browser.theme.getCurrent();

	if (theme && theme.colors) {

		let color_shadow = colors.toRGBA(theme.colors.toolbar_field_text);
		    color_shadow[3] = 0.15;

		let color_tab_overlay = colors.toRGBA(theme.colors.toolbar_field);
		    color_tab_overlay[3] = 0.8;

		let color_tab_hover = colors.toRGBA(theme.colors.toolbar_field_text);
		    color_tab_hover[3] = 0.3;

		let frame = colors.toRGBA(theme.colors.frame);
		let toolbar = colors.toRGBA(theme.colors.toolbar);
		let color_group_background = colors.mix(frame, toolbar);

		const style = [
			`--color-background: ${theme.colors.frame}`,
			`--color-text: ${theme.colors.toolbar_field_text}`,
			`--color-shadow: rgba(${color_shadow})`,

			`--color-group-background: rgba(${color_group_background.join(',')})`,
			`--color-group-border: ${theme.colors.toolbar_bottom_separator ? theme.colors.toolbar_bottom_separator : 'rgba(0, 0, 0, 0.3)'}`,
			`--color-group-count-background: ${theme.colors.toolbar_field}`,

			`--color-tab: ${theme.colors.toolbar_field}`,
			`--color-tab-overlay: rgba(${color_tab_overlay.join(',')})`,
			`--color-tab-hover: rgba(${color_tab_hover.join(',')})`,
			`--color-tab-active: ${(theme.colors.appmenu_info_icon_color) ? theme.colors.appmenu_info_icon_color : theme.colors.tab_line}` //appmenu_info_icon_color
		];

		let stylesheet = new CSSStyleSheet();
		stylesheet.insertRule(`.custom { ${style.join(';')} }`);
		document.adoptedStyleSheets = [stylesheet];
	}
}