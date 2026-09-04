const {
    PermissionFlagsBits
} = require("discord.js");

const Embed = require("../../models/Embed");

async function handleRole(interaction, roleId, action) {
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

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.reply({
            content: "You need `Manage Roles` to use this button.",
            flags: 64
        });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({
            content: "I cannot manage that role because it is higher than my highest role.",
            flags: 64
        });
    }

    if (action === "add_role") {
        await member.roles.add(role);
        return interaction.reply({
            content: `Added ${role} to you.`,
            flags: 64
        });
    }

    if (action === "remove_role") {
        await member.roles.remove(role);
        return interaction.reply({
            content: `Removed ${role} from you.`,
            flags: 64
        });
    }

    return interaction.reply({
        content: "This button has no configured action.",
        flags: 64
    });
}

module.exports = {
    type: "button",
    name: "embed_component",

    async execute(client, interaction) {
        const saved = await Embed.findOne({
            guildId: interaction.guildId,
            "buttons.customId": interaction.customId
        });

        const button = saved?.buttons?.find(
            item => item.customId === interaction.customId
        );

        if (!button) {
            return interaction.reply({
                content: "This button is no longer configured.",
                flags: 64
            });
        }

        if (button.action === "add_role" || button.action === "remove_role") {
            return handleRole(
                interaction,
                button.roleId,
                button.action
            );
        }

        return interaction.reply({
            content: "This button has no action configured.",
            flags: 64
        });
    }
};
