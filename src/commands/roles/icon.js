const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const roleEmbeds =
    require("../../embeds/general/roles");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role icon",

    aliases: [],

    async execute(
        client,
        message,
        args
    ) {

        // =========================
        // GUILD CHECK
        // =========================

        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

        // =========================
        // USER PERMISSION
        // =========================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageRoles"
                    )
                ]
            });
        }

        // =========================
        // BOT PERMISSIONS
        // =========================

        const botMember =
            message.guild.members.me;

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageRoles
        ];

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !message.channel
                        .permissionsFor(botMember)
                        ?.has(permission)
            );

        if (missingPermissions.length) {
            const permissionNames =
                missingPermissions.map(
                    permission =>
                        Object.entries(
                            PermissionFlagsBits
                        ).find(
                            ([, value]) =>
                                value === permission
                        )?.[0] || permission
                );

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // ROLE
        // =========================

        if (!args.length) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.noRole(
                        message.author
                    )
                ]
            });
        }

        const roleInput =
            args[0];

        const roleId =
            roleInput.replace(
                /[<@&>]/g,
                ""
            );

        const role =
            message.guild.roles.cache.get(
                roleId
            ) ||
            message.guild.roles.cache.find(
                currentRole =>
                    currentRole.name.toLowerCase() ===
                    roleInput.toLowerCase()
            );

        if (!role) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.roleNotFound(
                        message.author,
                        roleInput
                    )
                ]
            });
        }

        // =========================
        // ROLE ICON AVAILABILITY
        // =========================

        if (
            !message.guild.features.includes(
                "ROLE_ICONS"
            )
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.unavailable(
                        message.author,
                        "role icon"
                    )
                ]
            });
        }

        // =========================
        // EMOJI
        // =========================

        const iconInput =
            args[1];

        if (!iconInput) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "emoji"
                    )
                ]
            });
        }

        let icon =
            iconInput;

        // =========================
        // CUSTOM EMOJI
        // =========================

        const customEmoji =
            iconInput.match(
                /^<a?:\w+:(\d+)>$/
            );

        if (customEmoji) {
            icon =
                customEmoji[1];
        }

        // =========================
        // ROLE HIERARCHY
        // =========================

        if (
            role.position >=
            message.member.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.userRole(
                        message.author,
                        role
                    )
                ]
            });
        }

        if (
            role.position >=
            botMember.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.botRole(
                        message.author,
                        role
                    )
                ]
            });
        }

        // =========================
        // UPDATE ICON
        // =========================

        try {

            await role.setIcon(
                icon
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.roleIcon(
                        message.author,
                        role,
                        iconInput
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Icon Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidIcon(
                        message.author,
                        iconInput
                    )
                ]
            });

        }

    }

};
