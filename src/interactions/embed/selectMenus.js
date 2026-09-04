const {
    PermissionFlagsBits
} = require("discord.js");

const Embed = require("../../models/Embed");

async function applyRole(interaction, roleId, action, userIds = []) {
    const role = await interaction.guild.roles.fetch(roleId).catch(() => null);

    if (!role) {
        return interaction.reply({
            content: "That role no longer exists.",
            flags: 64
        });
    }

    if (role.managed) {
        return interaction.reply({
            content: "That role is managed and cannot be assigned.",
            flags: 64
        });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.reply({
            content: "I need `Manage Roles` to use this menu.",
            flags: 64
        });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({
            content: "I cannot manage that role because it is higher than my highest role.",
            flags: 64
        });
    }

    const targets = userIds.length
        ? userIds
        : [interaction.user.id];

    let changed = 0;

    for (const userId of targets) {
        const member = await interaction.guild.members.fetch(userId).catch(() => null);
        if (!member) continue;

        try {
            if (action === "add_role") {
                await member.roles.add(role);
            } else {
                await member.roles.remove(role);
            }
            changed++;
        } catch {}
    }

    return interaction.reply({
        content: `${action === "add_role" ? "Added" : "Removed"} ${role} ${changed ? `for ${changed} member${changed === 1 ? "" : "s"}` : ""}.`,
        flags: 64
    });
}

module.exports = {
    type: "select",
    name: "embed_component_select",

    async execute(client, interaction) {
        const saved = await Embed.findOne({
            guildId: interaction.guildId,
            "selectMenus.customId": interaction.customId
        });

        const menu = saved?.selectMenus?.find(
            item => item.customId === interaction.customId
        );

        if (!menu) {
            return interaction.reply({
                content: "This select menu is no longer configured.",
                flags: 64
            });
        }

        if (menu.action !== "add_role" && menu.action !== "remove_role") {
            return interaction.reply({
                content: "This select menu has no action configured.",
                flags: 64
            });
        }

        const userIds =
            interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()
                ? interaction.values
                : [];

        return applyRole(
            interaction,
            menu.roleId,
            menu.action,
            userIds
        );
    }
};
