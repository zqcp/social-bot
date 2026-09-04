const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const styles = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    link: ButtonStyle.Link
};

function buildButtons(buttons = [], replace = value => value) {
    const rows = [];

    for (let i = 0; i < buttons.length && rows.length < 5; i += 5) {
        const rowButtons = buttons
            .slice(i, i + 5)
            .map(button => {
                if (!button) return null;

                const style =
                    styles[String(button.style || "secondary").toLowerCase()] ||
                    ButtonStyle.Secondary;

                const builder = new ButtonBuilder()
                    .setStyle(style);

                if (button.label) {
                    builder.setLabel(
                        String(replace(button.label)).slice(0, 80)
                    );
                }

                if (button.emoji) {
                    builder.setEmoji(
                        String(replace(button.emoji))
                    );
                }

                if (button.disabled) {
                    builder.setDisabled(true);
                }

                if (style === ButtonStyle.Link) {
                    if (!button.url) return null;

                    builder.setURL(
                        String(replace(button.url)).slice(0, 512)
                    );
                } else {
                    if (!button.customId) return null;

                    builder.setCustomId(
                        String(replace(button.customId)).slice(0, 100)
                    );
                }

                return builder;
            })
            .filter(Boolean);

        if (!rowButtons.length) continue;

        rows.push(
            new ActionRowBuilder().addComponents(...rowButtons)
        );
    }

    return rows;
}

module.exports = {
    buildButtons,
    styles
};
