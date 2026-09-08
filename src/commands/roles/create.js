const {
    PermissionFlagsBits,
    Constants
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
        // PARSE OPTIONS
        // =========================

        const options = {
            style: "solid",
            colors: [],
            icon: null
        };

        const nameParts = [];

        for (
            let index = 0;
            index < args.length;
            index++
        ) {

            const argument =
                args[index];

            if (
                argument === "--style" ||
                argument === "-s"
            ) {
                options.style =
                    args[++index]?.toLowerCase();

                continue;
            }

            if (
                argument === "--color" ||
                argument === "-c"
            ) {
                const color =
                    args[++index];

                if (color) {
                    options.colors.push(
                        color
                    );
                }

                continue;
            }

            if (
                argument === "--colors"
            ) {
                const colors =
                    args[++index];

                if (colors) {
                    options.colors.push(
                        ...colors.split(",")
                    );
                }

                continue;
            }

            if (
                argument === "--icon" ||
                argument === "-i"
            ) {
                options.icon =
                    args[++index];

                continue;
            }

            nameParts.push(
                argument
            );
        }

        // =========================
        // ROLE NAME
        // =========================

        const roleName =
            nameParts.join(" ").trim();

        if (!roleName) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "role name"
                    )
                ]
            });
        }

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
        // CHECK EXISTING ROLE
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
        // VALIDATE STYLE
        // =========================

        const validStyles = [
            "solid",
            "gradient",
            "holographic"
        ];

        if (
            !validStyles.includes(
                options.style
            )
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidStyle(
                        message.author,
                        options.style
                    )
                ]
            });
        }

        // =========================
        // VALIDATE COLORS
        // =========================

        const colorRegex =
            /^#?[0-9a-fA-F]{6}$/;

        if (
            options.colors.length &&
            options.colors.some(
                color =>
                    !colorRegex.test(
                        color
                    )
            )
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidColor(
                        message.author,
                        options.colors.join(", ")
                    )
                ]
            });
        }

        options.colors =
            options.colors.map(
                color =>
                    color.startsWith("#")
                        ? color
                        : `#${color}`
            );

        // =========================
        // STYLE COLOR REQUIREMENTS
        // =========================

        if (
            options.style === "gradient" &&
            options.colors.length !== 2
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidColor(
                        message.author,
                        "Gradient requires two colors."
                    )
                ]
            });
        }

        if (
            options.style === "solid" &&
            options.colors.length > 1
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidColor(
                        message.author,
                        "Solid roles only use one color."
                    )
                ]
            });
        }

        if (
            options.style === "holographic" &&
            options.colors.length
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidColor(
                        message.author,
                        "Holographic roles use Discord's holographic colors."
                    )
                ]
            });
        }

        // =========================
        // CREATE ROLE
        // =========================

        try {

            const roleOptions = {
                name: roleName,
                reason:
                    `Created by ${message.author.tag}`
            };

            // =========================
            // ROLE STYLE
            // =========================

            if (
                options.style === "solid"
            ) {

                if (
                    options.colors.length
                ) {
                    roleOptions.colors = {
                        primaryColor:
                            options.colors[0]
                    };
                }

            }

            if (
                options.style === "gradient"
            ) {

                roleOptions.colors = {
                    primaryColor:
                        options.colors[0],

                    secondaryColor:
                        options.colors[1]
                };

            }

            if (
                options.style === "holographic"
            ) {

                roleOptions.colors = {
                    primaryColor:
                        Constants.HolographicStyle.Primary,

                    secondaryColor:
                        Constants.HolographicStyle.Secondary,

                    tertiaryColor:
                        Constants.HolographicStyle.Tertiary
                };

            }

            // =========================
            // CREATE
            // =========================

            const role =
                await message.guild.roles.create(
                    roleOptions
                );

            // =========================
            // ROLE ICON
            // =========================

            if (options.icon) {

                try {

                    await role.setIcon(
                        options.icon,
                        `Role icon set by ${message.author.tag}`
                    );

                } catch (error) {

                    console.error(
                        "Role Icon Error:",
                        error
                    );

                    await role.delete(
                        "Role creation rolled back after invalid role icon"
                    );

                    return message.channel.send({
                        embeds: [
                            roleEmbeds.invalidIcon(
                                message.author,
                                options.icon
                            )
                        ]
                    });

                }
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
