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

    name: "role create",

    aliases: ["rc"],

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
        // ROLE NAME
        // =========================

        if (!args.length) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "role name"
                    )
                ]
            });
        }

        const roleName =
            args[0];

        // =========================
        // ROLE STYLE
        // =========================

        const style =
            args[1]?.toLowerCase() ||
            "solid";

        const validStyles = [
            "solid",
            "gradient",
            "holographic"
        ];

        if (
            !validStyles.includes(style)
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidStyle(
                        message.author,
                        style
                    )
                ]
            });
        }

        // =========================
        // ROLE NAME LIMIT
        // =========================

        if (roleName.length > 100) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        roleName
                    )
                ]
            });
        }

        // =========================
        // EXISTING ROLE
        // =========================

        const existingRole =
            message.guild.roles.cache.find(
                role =>
                    role.name.toLowerCase() ===
                    roleName.toLowerCase()
            );

        if (existingRole) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.alreadyExists(
                        message.author,
                        roleName
                    )
                ]
            });
        }

        // =========================
        // CREATE ROLE
        // =========================

        try {

            const role =
                await message.guild.roles.create({
                    name: roleName,
                    reason:
                        `Created by ${message.author.tag}`
                });

            // =========================
            // APPLY STYLE
            // =========================

            if (style === "solid") {

                await role.edit({
                    colors: {
                        primaryColor:
                            0x000000
                    }
                });

            }

            if (style === "gradient") {

                await role.edit({
                    colors: {
                        primaryColor:
                            0x5865F2,

                        secondaryColor:
                            0xEB459E
                    }
                });

            }

            if (style === "holographic") {

                await role.edit({
                    colors: {
                        primaryColor:
                            0x5865F2,

                        secondaryColor:
                            0xEB459E,

                        tertiaryColor:
                            0x57F287
                    }
                });

            }

            // =========================
            // SUCCESS
            // =========================

            return message.channel.send({
                embeds: [
                    roleEmbeds.createSuccess(
                        message.author,
                        role
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Create Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.createFailed(
                        message.author,
                        roleName
                    )
                ]
            });

        }

    }

};
