const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const roleEmbeds =
    require("../../embeds/general/roles");

const globalEmbeds =
    require("../../embeds/general/global");

const rolesHelp =
    require("../../embeds/help/roles");

const config =
    require("../../config");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role add",

    aliases: ["r", "role"],

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
                "Role Add Error: Bot member could not be found."
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
        // MEMBER
        // =========================

        const memberValue =
            args[0];

        if (!memberValue) {
            return message.channel.send({
                embeds: [
                    rolesHelp.add(
                        message.author
                    )
                ]
            });
        }

        let member =
            message.mentions.members.first();

        if (!member) {

            if (
                /^\d{17,20}$/.test(
                    memberValue
                )
            ) {

                try {

                    member =
                        await message.guild.members.fetch(
                            memberValue
                        );

                } catch {

                    member = null;

                }

            } else {

                const search =
                    memberValue.toLowerCase();

                member =
                    message.guild.members.cache.find(
                        guildMember =>
                            guildMember.user.username
                                .toLowerCase() === search ||
                            guildMember.displayName
                                .toLowerCase() === search
                    );

            }

        }

        if (!member) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.userNotFound(
                        message.author,
                        memberValue
                    )
                ]
            });
        }

        // =========================
        // MEMBER PROTECTION
        // =========================

        if (
            member.id ===
            message.author.id
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.self(
                        message.author
                    )
                ]
            });
        }

        if (
            member.id ===
            message.guild.ownerId
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.owner(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // ROLE INPUT
        // =========================

        const roleInput =
            args
                .slice(1)
                .join(" ")
                .trim();

        if (!roleInput) {
            return message.channel.send({
                embeds: [
                    rolesHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // SPLIT ROLES
        // =========================

        const roleValues =
            roleInput
                .split(",")
                .map(
                    role =>
                        role.trim()
                )
                .filter(Boolean);

        if (!roleValues.length) {
            return message.channel.send({
                embeds: [
                    rolesHelp.add(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // FIND ROLES
        // =========================

        const roles = [];

        for (
            const roleValue of roleValues
        ) {

            const roleId =
                roleValue.replace(
                    /[<@&>]/g,
                    ""
                );

            let role =
                message.guild.roles.cache.get(
                    roleId
                );

            if (!role) {

                if (
                    /^\d{17,20}$/.test(
                        roleValue
                    )
                ) {

                    try {

                        role =
                            await message.guild.roles.fetch(
                                roleValue
                            );

                    } catch {

                        role = null;

                    }

                }

            }

            if (!role) {

                const search =
                    roleValue.toLowerCase();

                role =
                    message.guild.roles.cache.find(
                        guildRole =>
                            guildRole.name
                                .toLowerCase() === search
                    );

            }

            if (!role) {
                return message.channel.send({
                    embeds: [
                        roleEmbeds.roleNotFound(
                            message.author,
                            roleValue
                        )
                    ]
                });
            }

            // =========================
            // REMOVE DUPLICATES
            // =========================

            if (
                roles.some(
                    existingRole =>
                        existingRole.id ===
                        role.id
                )
            ) {
                continue;
            }

            roles.push(role);

        }

        // =========================
        // CHECK ROLES
        // =========================

        for (
            const role of roles
        ) {

            // =========================
            // MANAGED ROLE
            // =========================

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
            // EVERYONE ROLE
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

            // =========================
            // USER HIERARCHY
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

            // =========================
            // BOT HIERARCHY
            // =========================

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
            // ALREADY HAS ROLE
            // =========================

            if (
                member.roles.cache.has(
                    role.id
                )
            ) {
                return message.channel.send({
                    embeds: [
                        roleEmbeds.alreadyHas(
                            message.author,
                            role,
                            member
                        )
                    ]
                });
            }

        }

        // =========================
        // ADD ROLES
        // =========================

        try {

            await member.roles.add(
                roles
            );

            // =========================
            // SINGLE ROLE
            // =========================

            if (
                roles.length === 1
            ) {

                return message.channel.send({
                    embeds: [
                        roleEmbeds.success(
                            message.author,
                            roles[0],
                            member
                        )
                    ]
                });

            }

            // =========================
            // MULTIPLE ROLES
            // =========================

            const roleNames =
                roles
                    .map(
                        role =>
                            role.name
                    )
                    .join(", ");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.role
                        )
                        .setDescription(
                            `${message.author}: Changed **roles** for **${member.user.username}**: **${roleNames}**.`
                        )
                ]
            });

        } catch (error) {

            console.error(
                "Role Add Error:",
                error
            );

            // =========================
            // SINGLE ROLE FAILURE
            // =========================

            if (
                roles.length === 1
            ) {

                const singleFailed =
                    new EmbedBuilder()
                        .setColor(
                            config.colors.failed
                        )
                        .setDescription(
                            `${config.emojis.failed} ${message.author}: Failed to add **role** **${roles[0].name}** for **${member.user.username}**. Please try again.`
                        );

                return message.channel.send({
                    embeds: [
                        singleFailed
                    ]
                });

            }

            // =========================
            // MULTIPLE ROLE FAILURE
            // =========================

            const multipleFailed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.failed
                    )
                    .setDescription(
                        `${config.emojis.failed} ${message.author}: Failed to add **roles** for **${member.user.username}**: **${roles.map(role => role.name).join(", ")}**. Please try again.`
                    );

            return message.channel.send({
                embeds: [
                    multipleFailed
                ]
            });

        }

    }

};
