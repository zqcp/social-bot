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

    name: "role remove",

    aliases: ["rr"],

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
        // MEMBER
        // =========================

        const memberValue =
            args[0];

        if (!memberValue) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "member"
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
        // ROLES
        // =========================

        const roleValues =
            args.slice(1);

        if (!roleValues.length) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "role"
                    )
                ]
            });
        }

        const roles = [];

        for (const roleValue of roleValues) {

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

            if (
                !roles.some(
                    existingRole =>
                        existingRole.id === role.id
                )
            ) {
                roles.push(role);
            }

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
        // CHECK ROLES
        // =========================

        for (const role of roles) {

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
            // DOESN'T HAVE ROLE
            // =========================

            if (
                !member.roles.cache.has(
                    role.id
                )
            ) {
                return message.channel.send({
                    embeds: [
                        roleEmbeds.notHas(
                            message.author,
                            role,
                            member
                        )
                    ]
                });
            }

        }

        // =========================
        // REMOVE ROLES
        // =========================

        try {

            await member.roles.remove(
                roles
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.removeSuccess(
                        message.author,
                        roles,
                        member
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Remove Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.removeFailed(
                        message.author,
                        roles,
                        member
                    )
                ]
            });

        }

    }

};
