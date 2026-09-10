const {
    PermissionFlagsBits
} = require("discord.js");

const roleEmbeds =
    require("../../embeds/general/roles");

const globalEmbeds =
    require("../../embeds/general/global");

const config =
    require("../../config");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role create",

    aliases: ["rolecreate", "create role"],

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

        if (!botMember) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "I couldn't find my member information in this server."
                    )
                ]
            });
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageRoles
        ];

        const permissions =
            message.channel.permissionsFor(
                botMember
            );

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !permissions?.has(permission)
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
                    globalEmbeds.botPermissions(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // NAME
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

        // =========================
        // STYLE
        // =========================

        let style = "solid";

        const possibleStyle =
            args[args.length - 1]?.toLowerCase();

        const styles = [
            "solid",
            "gradient",
            "holographic"
        ];

        if (styles.includes(possibleStyle)) {
            style = possibleStyle;
            args.pop();
        }

        // =========================
        // ROLE NAME
        // =========================

        const name =
            args.join(" ").trim();

        if (!name) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "role name"
                    )
                ]
            });
        }

        if (name.length > 100) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        "Role name"
                    )
                ]
            });
        }

        // =========================
        // CREATE ROLE
        // =========================

        try {

            let role;

            // =========================
            // SOLID
            // =========================

            if (style === "solid") {

                role =
                    await message.guild.roles.create({
                        name,
                        colors: {
                            primaryColor:
                                config.colors.role
                        },
                        reason:
                            `Created by ${message.author.tag}`
                    });

            }

            // =========================
            // GRADIENT
            // =========================

            if (style === "gradient") {

                role =
                    await message.guild.roles.create({
                        name,
                        colors: {
                            primaryColor:
                                config.colors.role,
                            secondaryColor:
                                config.colors.regular
                        },
                        reason:
                            `Created by ${message.author.tag}`
                    });

            }

            // =========================
            // HOLOGRAPHIC
            // =========================

            if (style === "holographic") {

                role =
                    await message.guild.roles.create({
                        name,
                        colors: {
                            primaryColor:
                                config.colors.role,
                            secondaryColor:
                                config.colors.regular,
                            tertiaryColor:
                                config.colors.success
                        },
                        reason:
                            `Created by ${message.author.tag}`
                    });

            }

            if (!role) {
                return message.channel.send({
                    embeds: [
                        roleEmbeds.createFailed(
                            message.author,
                            {
                                name
                            }
                        )
                    ]
                });
            }

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
                        {
                            name
                        }
                    )
                ]
            });

        }

    }

};
