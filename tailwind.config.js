/* eslint-disable global-require */
import {
    BREAKPOINTS, COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, SPACING, ZINDEX,
} from './src/theme/vars';

const plugin = require('tailwindcss/plugin');

// full list https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './core/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/tailwind-datepicker-react/dist/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                /**
                 * START store config value
                 */
                pwa: {
                    primary: 'var(--color-pwa-primary_color)',
                    secondary: 'var(--color-pwa-secondary_color)',
                    font: 'var(--color-pwa-font_color)',
                    background: 'var(--color-pwa-background_color)',
                    error: 'var(--color-pwa-error_color)',
                    warning: 'var(--color-pwa-warning_msg_color)',
                    success: 'var(--color-pwa-success_msg_color)',
                    link: 'var(--color-pwa-link_color)',
                    link_hover: 'var(--color-pwa-link_hover_color)',
                    button_text: 'var(--color-pwa-button_text_color)',
                    button_text_hover: 'var(--color-pwa-button_text_hover_color)',
                    button_background: 'var(--color-pwa-button_background_color)',
                    button_background_hover: 'var(--color-pwa-button_background_hover_color)',
                    button_border: 'var(--color-pwa-button_border_color)',
                    button_border_hover: 'var(--color-pwa-button_border_hover_color)',
                    button_disabled_text: 'var(--color-pwa-button_disabled_text_color)',
                    button_disabled_background: 'var(--color-pwa-button_disabled_background_color)',
                    badge: COLORS.badge,
                },
                // END store config value
                primary: COLORS.primary,
                secondary: COLORS.secondary,
                neutral: COLORS.neutral,
            },
            lineHeight: LINE_HEIGHT,
            fontSize: FONT_SIZE,
            fontFamily: FONT_FAMILY,
            spacing: SPACING,
            boxShadow: {
                base: `0px 1px 2px 0px ${COLORS.neutral[900]}0F, 0px 1px 3px 0px ${COLORS.neutral[900]}1A`,
                sm: `0px 1px 2px 0px ${COLORS.neutral[900]}0D`,
                md: `0px 2px 4px -1px ${COLORS.neutral[900]}0F, 0px 4px 6px -1px ${COLORS.neutral[900]}1A`,
                lg: `0px 4px 6px -2px ${COLORS.neutral[900]}0D, 0px 10px 15px -3px ${COLORS.neutral[900]}1A`,
                xl: `0px 10px 10px -5px ${COLORS.neutral[900]}0A, 0px 20px 25px -5px ${COLORS.neutral[900]}1A`,
            },
            zIndex: ZINDEX,
            keyframes: {
                'cart-drawer-desktop': {
                    '0%': { right: '0px' },
                    '100%': { right: '540px' },
                },
                'cart-drawer-tablet': {
                    '0%': { right: '0px' },
                    '100%': { right: '396px' },
                },
                'cart-drawer-mobile': {
                    '0%': { right: '0px' },
                    '100%': { right: '320px' },
                },
                'cart-drawer-close-desktop': {
                    '0%': { right: '540px' },
                    '100%': { right: '0px' },
                },
                'cart-drawer-close-tablet': {
                    '0%': { right: '396px' },
                    '100%': { right: '0px' },
                },
                'cart-drawer-close-mobile': {
                    '0%': { right: '320px' },
                    '100%': { right: '0px' },
                },

                'hamburger-drawer': {
                    '0%': { left: '-540px' },
                    '100%': { left: '0px' },
                },
                'hamburger-drawer-close': {
                    '0%': { left: '0px' },
                    '100%': { left: '-540px' },
                },
            },
            animation: {
                'drawer-in-desktop': 'cart-drawer-desktop 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'drawer-in-tablet': 'cart-drawer-tablet 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'drawer-in-mobile': 'cart-drawer-mobile 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'drawer-out-desktop': 'cart-drawer-close-desktop 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'drawer-out-tablet': 'cart-drawer-close-tablet 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'drawer-out-mobile': 'cart-drawer-close-mobile 500ms cubic-bezier(0.4, 0, 0.2, 1);',

                'hamburger-drawer-in': 'hamburger-drawer 500ms cubic-bezier(0.4, 0, 0.2, 1);',
                'hamburger-drawer-out': 'hamburger-drawer-close 500ms cubic-bezier(0.4, 0, 0.2, 1);',
            },
        },
        screens: {
            xs: `${BREAKPOINTS.xs}px`,
            sm: `${BREAKPOINTS.sm}px`,
            md: `${BREAKPOINTS.md}px`,
            lg: `${BREAKPOINTS.lg}px`,
            xl: `${BREAKPOINTS.xl}px`,
            mobile: `${BREAKPOINTS.xs}px`,
            tablet: `${BREAKPOINTS.md}px`,
            desktop: `${BREAKPOINTS.xl}px`,
        },
        colors: {
            red: COLORS.red,
            yellow: COLORS.yellow,
            green: COLORS.green,
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        plugin(({ addUtilities }) => {
            addUtilities({
                '.scrollbar-none': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                },
                '.scrollbar-none::-webkit-scrollbar': {
                    display: 'none',
                },
            });
        }),
    ],
};
