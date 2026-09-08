const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const roleEmbeds =
    require("../../embeds/general/roles");

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
// RGB HELPERS
// =========================

function hexToRgb(hex) {

    const value =
        hex.replace("#", "");

    return {
        r: parseInt(
            value.substring(0, 2),
            16
        ),
        g: parseInt(
            value.substring(2, 4),
            16
        ),
        b: parseInt(
            value.substring(4, 6),
            16
        )
    };
}

function rgbToHex(r, g, b) {

    return (
        "#" +
        [r, g, b]
            .map(
                value =>
                    Math.max(
                        0,
                        Math.min(
                            255,
                            Math.round(value)
                        )
                    )
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("")
            .toUpperCase()
    );
}

// =========================
// GENERATE GRADIENT SHADE
// =========================

function generateGradientColor(hex) {

    const {
        r,
        g,
        b
    } = hexToRgb(hex);

    const brightness =
        (
            r * 299 +
            g * 587 +
            b * 114
        ) / 1000;

    const amount =
        brightness < 128
            ? 1.35
            : 0.65;

    return rgbToHex(
        r * amount,
        g * amount,
        b * amount
    );
}

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role color",

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
        // COLOR
        // =========================

        const primaryInput =
            args[1];

        if (!primaryInput) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "color"
                    )
                ]
            });
        }

        const primaryColor =
            resolveColor(
                primaryInput
            );

        if (!primaryColor) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.invalidColor(
                        message.author,
                        primaryInput
                    )
                ]
            });
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
        // UPDATE COLOR
        // =========================

        try {

            const hasGradient =
                role.colors &&
                role.colors.secondaryColor;

            // =========================
            // GRADIENT
            // =========================

            if (hasGradient) {

                const secondaryInput =
                    args[2];

                let secondaryColor;

                if (secondaryInput) {

                    secondaryColor =
                        resolveColor(
                            secondaryInput
                        );

                    if (!secondaryColor) {
                        return message.channel.send({
                            embeds: [
                                roleEmbeds.invalidColor(
                                    message.author,
                                    secondaryInput
                                )
                            ]
                        });
                    }

                } else {

                    secondaryColor =
                        generateGradientColor(
                            primaryColor
                        );
                }

                await role.setColors({
                    primaryColor,
                    secondaryColor
                });

                return message.channel.send({
                    embeds: [
                        roleEmbeds.gradient(
                            message.author,
                            role,
                            primaryInput,
                            secondaryInput ||
                                secondaryColor
                        )
                    ]
                });
            }

            // =========================
            // SOLID
            // =========================

            await role.setColors({
                primaryColor
            });

            return message.channel.send({
                embeds: [
                    roleEmbeds.solid(
                        message.author,
                        role,
                        primaryInput
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Color Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "update the role color"
                    )
                ]
            });
        }

    }

};
