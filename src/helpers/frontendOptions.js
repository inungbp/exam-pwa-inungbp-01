/* eslint-disable indent */

import { COLORS } from '../theme/vars';

// eslint-disable-next-line import/prefer-default-export
export const frontendConfig = (pwaConfig) => {
    if (pwaConfig) {
        const {
            primary_color,
            secondary_color,
            font_color,
            background_color,
            button_background_color,
            error_color,
            warning_msg_color,
            success_msg_color,
            link_color,
            link_font_decoration,
            link_hover_color,
            link_font_hover_decoration,
            button_text_color,
            default_font,
            button_background_hover_color,
            button_disabled_text_color,
            button_border_color,
            button_disabled_background_color,
            button_border_hover_color,
            button_text_hover_color,
            heading_font,
        } = pwaConfig;

        return `
            :root {
                --color-pwa-primary_color: ${primary_color || COLORS.primary.DEFAULT};
                --color-pwa-secondary_color: ${secondary_color || COLORS.neutral.DEFAULT};
                --color-pwa-background_color: ${background_color || COLORS.neutral.white};

                --color-pwa-error_color: ${error_color || COLORS.red.DEFAULT};
                --color-pwa-warning_msg_color: ${warning_msg_color || COLORS.yellow.DEFAULT};
                --color-pwa-success_msg_color: ${success_msg_color || COLORS.green.DEFAULT};

                --color-pwa-button_text_color: ${button_text_color || COLORS.neutral.white};
                --color-pwa-button_disabled_text_color: ${button_disabled_text_color || COLORS.neutral[50]};
                --color-pwa-button_background_color: ${button_background_color || COLORS.primary.DEFAULT};
                --color-pwa-button_background_hover_color: ${button_background_hover_color || COLORS.primary.DEFAULT};
                --color-pwa-button_disabled_background_color: ${button_disabled_background_color || COLORS.neutral[100]};
                --color-pwa-button_text_hover_color: ${button_text_hover_color || COLORS.neutral.white};
                --color-pwa-button_border_color: ${button_border_color || COLORS.primary.DEFAULT};
                --color-pwa-button_border_hover_color: ${button_border_hover_color || COLORS.primary[100]};

                --color-pwa-font_color: ${font_color || COLORS.neutral.DEFAULT};
                --font-pwa-default_font: ${(default_font && default_font !== '0') || 'Inter'};
                --font-pwa-heading_font: ${(heading_font && heading_font !== '0') || 'Inter'};

                --color-pwa-link_color: ${link_color || COLORS.neutral.DEFAULT};
                --color-pwa-link_hover_color: ${link_hover_color || COLORS.neutral.DEFAULT};
                --font-pwa-link_font_decoration: ${link_font_decoration || 'underline'};
                --font-pwa-link_font_hover_decoration: ${link_font_hover_decoration || 'underline'};
            }
        `;
    }
    return `
        :root {
            // general styles
            --color-pwa-primary_color: ${COLORS.primary.DEFAULT};
            --color-pwa-secondary_color: ${COLORS.neutral.DEFAULT};
            --color-pwa-background_color: ${COLORS.neutral.white};

            // message styles
            --color-pwa-error_color: ${COLORS.red.DEFAULT};
            --color-pwa-warning_msg_color: ${COLORS.yellow.DEFAULT};
            --color-pwa-success_msg_color: ${COLORS.green.DEFAULT};

            // button styles
            --color-pwa-button_text_color: ${COLORS.neutral.white};
            --color-pwa-button_disabled_text_color: ${COLORS.neutral[50]};
            --color-pwa-button_background_color: ${COLORS.primary.DEFAULT};
            --color-pwa-button_background_hover_color: ${COLORS.primary[200]};
            --color-pwa-button_disabled_background_color: ${COLORS.neutral[100]};
            --color-pwa-button_text_hover_color: ${COLORS.neutral.white};
            --color-pwa-button_border_color: ${COLORS.primary.DEFAULT};
            --color-pwa-button_border_hover_color: ${COLORS.primary[100]};

            // font styles
            --color-pwa-font_color: ${COLORS.neutral[500]};
            --font-pwa-default_font: Inter;
            --font-pwa-heading_font: Inter;

            // link styles
            --color-pwa-link_color: ${COLORS.neutral[500]};
            --color-pwa-link_hover_color: ${COLORS.neutral.DEFAULT};
            --font-pwa-link_font_decoration: underline;
            --font-pwa-link_font_hover_decoration: underline;
        }
    `;
};
