const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelSelectMenuBuilder
} = require("discord.js");

// =========================
// SELECT MENU BUILDERS
// =========================

const menuTypes = {
    string: StringSelectMenuBuilder,
    user: UserSelectMenuBuilder,
    role: RoleSelectMenuBuilder,
    mentionable: MentionableSelectMenuBuilder,
    channel: ChannelSelectMenuBuilder
};

// =========================
// BUILD SELECT MENUS
// =========================

function buildSelectMenus(menus = [], replace = value => value) {
    const rows = [];

    for (const menu of menus.slice(0, 5)) {
        if (!menu || !menu.type || !menu.customId) continue;

        const MenuBuilder = menuTypes[
            String(menu.type).toLowerCase()
        ];

        if (!MenuBuilder) continue;

        const builder = new MenuBuilder()
            .setCustomId(
                String(replace(menu.customId)).slice(0, 100)
            );

        if (menu.placeholder) {
            builder.setPlaceholder(
                String(replace(menu.placeholder)).slice(0, 150)
            );
        }

        if (menu.minValues !== undefined) {
            builder.setMinValues(
                Math.max(0, Number(menu.minValues) || 0)
            );
        }

        if (menu.maxValues !== undefined) {
            builder.setMaxValues(
                Math.max(1, Number(menu.maxValues) || 1)
            );
        }

        if (menu.disabled) {
            builder.setDisabled(true);
        }

        // String select options
        if (
            String(menu.type).toLowerCase() === "string" &&
            Array.isArray(menu.options)
        ) {
            const options = menu.options
                .slice(0, 25)
                .filter(option => option?.label && option?.value)
                .map(option => ({
                    label: String(
                        replace(option.label)
                    ).slice(0, 100),

                    value: String(
                        replace(option.value)
                    ).slice(0, 100),

                    description: option.description
                        ? String(
                            replace(option.description)
                        ).slice(0, 100)
                        : undefined,

                    emoji: option.emoji
                        ? String(
                            replace(option.emoji)
                        )
                        : undefined,

                    default: Boolean(option.default)
                }));

            if (!options.length) continue;

            builder.addOptions(options);
        }

        rows.push(
            new ActionRowBuilder().addComponents(builder)
        );
    }

    return rows;
}

module.exports = {
    buildSelectMenus,
    menuTypes
};
