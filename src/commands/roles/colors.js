const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const roleEmbeds =
    require("../../embeds/general/roles");

const rolesHelp =
    require("../../embeds/help/roles");

// =========================
// COLOR HELPERS
// =========================

function resolveColor(input) {

    if (!input) {
        return null;
    }

    const colors = {
        red: "#FF0000",
        orange: "#FFA500",
        yellow: "#FFFF00",
        green: "#008000",
        blue: "#0000FF",
        purple: "#800080",
        pink: "#FFC0CB",
        white: "#FFFFFF",
        black: "#000000",
        gray: "#808080",
        grey: "#808080",
        cyan: "#00FFFF",
        aqua: "#00FFFF",
        teal: "#008080",
        lime: "#00FF00",
        navy: "#000080",
        gold: "#FFD700",
        silver: "#C0C0C0",
        violet: "#EE82EE",
        indigo: "#4B0082",
        magenta: "#FF00FF",

        caramel: "#C68A4A",
        midnight: "#191970",
        sunset: "#FF6B6B",
        ocean: "#0077B6",
        lavender: "#B57EDC",
        rose: "#E11D48",
        forest: "#166534",
        candy: "#EC4899",
        fire: "#EF4444",
        ice: "#67E8F9",
        sky: "#38BDF8",
        emerald: "#10B981",
        ruby: "#DC2626",
        sapphire: "#2563EB",
        amethyst: "#9333EA",
        peach: "#FDBA74",
        mint: "#6EE7B7",
        chocolate: "#7B3F00",
        coffee: "#6F4E37"
    };

    const value =
        input
            .trim()
            .toLowerCase();

    if (
        /^#([0-9a-f]{6}|[0-9a-f]{3})$/i
            .test(value)
    ) {

        if (value.length === 4) {
            return (
                "#" +
                value[1] +
                value[1] +
                value[2] +
                value[2] +
                value[3] +
                value[3]
            );
        }

        return value.toUpperCase();
    }

    return colors[value] || null;
}

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role colors",

    aliases: [],

    permissions: [
        PermissionFlagsBits.ManageRoles
    ],

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
            console.error(
                "Role Colors Error: Bot member could not be found."
            );

            return;
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

            if (permissionNames.length === 1) {
                return message.channel.send({
                    embeds: [
                        globalEmbeds.botPermission(
                            message.author,
                            permissionNames[0]
                        )
                    ]
                });
            }

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
        // ROLE
        // =========================

        if (!args.length) {
            return message.channel.send({
                embeds: [
                    rolesHelp.colors(
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
        // ROLE AVAILABILITY
        // =========================

        if (
            role.id ===
            message.guild.id
        ) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.unavailable(
                        message.author,
                        role.name
                    )
                ]
            });
        }

        if (role.managed) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.unavailable(
                        message.author,
                        role.name
                    )
                ]
            });
        }

        // =========================
        // COLORS
        // =========================

        const colorInputs =
            args.slice(1);

        if (!colorInputs.length) {
            return message.channel.send({
                embeds: [
                    rolesHelp.colors(
                        message.author
                    )
                ]
            });
        }

        if (colorInputs.length > 3) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.tooManyColors(
                        message.author
                    )
                ]
            });
        }

        const colors = [];

        for (
            const colorInput of colorInputs
        ) {

            const color =
                resolveColor(
                    colorInput
                );

            if (!color) {
                return message.channel.send({
                    embeds: [
                        roleEmbeds.invalidColor(
                            message.author,
                            colorInput
                        )
                    ]
                });
            }

            colors.push(color);
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
        // UPDATE COLORS
        // =========================

        try {

            if (colors.length === 1) {

                await role.setColors({
                    primaryColor:
                        colors[0],
                    secondaryColor:
                        null,
                    tertiaryColor:
                        null
                });

                return message.channel.send({
                    embeds: [
                        roleEmbeds.solid(
                            message.author,
                            role,
                            colors[0]
                        )
                    ]
                });
            }

            if (colors.length === 2) {

                await role.setColors({
                    primaryColor:
                        colors[0],
                    secondaryColor:
                        colors[1],
                    tertiaryColor:
                        null
                });

                return message.channel.send({
                    embeds: [
                        roleEmbeds.gradient(
                            message.author,
                            role,
                            colors[0],
                            colors[1]
                        )
                    ]
                });
            }

            await role.setColors({
                primaryColor:
                    colors[0],
                secondaryColor:
                    colors[1],
                tertiaryColor:
                    colors[2]
            });

            return message.channel.send({
                embeds: [
                    roleEmbeds.holographic(
                        message.author,
                        role,
                        colors.join(", ")
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Colors Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "update the role colors"
                    )
                ]
            });
        }

    }

};
