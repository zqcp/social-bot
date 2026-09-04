const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelSelectMenuBuilder
} = require("discord.js");

function buildSelectMenus(menus = [], replace = value => value) {
    const rows = [];

    for (const menu of menus.slice(0, 5)) {
        if (!menu || !menu.customId) continue;

        const type = String(menu.type || "string").toLowerCase();
        const customId = String(replace(menu.customId)).slice(0, 100);

        let select;

        if (type === "user") {
            select = new UserSelectMenuBuilder()
                .setCustomId(customId);
        }

        else if (type === "role") {
            select = new RoleSelectMenuBuilder()
                .setCustomId(customId);
        }

        else if (type === "mentionable") {
            select = new MentionableSelectMenuBuilder()
                .setCustomId(customId);
        }

        else if (type === "channel") {
            select = new ChannelSelectMenuBuilder()
                .setCustomId(customId);
        }

        else {
            select = new StringSelectMenuBuilder()
                .setCustomId(customId);

            const options = (menu.options || [])
                .slice(0, 25)
                .map(option => ({
                    label: String(replace(option.label || "Option")).slice(0, 100),
                    value: String(replace(option.value || option.label || "option")).slice(0, 100),
                    ...(option.description
                        ? {
                            description: String(
                                replace(option.description)
                            ).slice(0, 100)
                        }
                        : {}),
                    ...(option.emoji
                        ? { emoji: replace(option.emoji) }
                        : {}),
                    ...(option.default
                        ? { default: true }
                        : {})
                }));

            if (!options.length) continue;

            select.addOptions(options);
        }

        if (menu.placeholder) {
            select.setPlaceholder(
                String(replace(menu.placeholder)).slice(0, 150)
            );
        }

        if (menu.minValues !== undefined) {
            select.setMinValues(Number(menu.minValues));
        }

        if (menu.maxValues !== undefined) {
            select.setMaxValues(Number(menu.maxValues));
        }

        if (menu.disabled) {
            select.setDisabled(true);
        }

        rows.push(
            new ActionRowBuilder().addComponents(select)
        );
    }

    return rows;
}

module.exports = {
    buildSelectMenus
};
