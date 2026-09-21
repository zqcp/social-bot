const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

const globalEmbeds =
    require("../../embeds/general/global");

const roleEmbeds =
    require("../../embeds/general/roles");

const rolesHelp =
    require("../../embeds/help/roles");

// =========================
// COMMAND
// =========================

module.exports = {

    name: "role rename",

    aliases: ["rrn"],

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
                "Role Rename Error: Bot member could not be found."
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
                    rolesHelp.rename(
                        message.author
                    )
                ]
            });
        }

        let role =
            message.mentions.roles.first();

        let nameStart = 1;

        // =========================
        // ROLE MENTION
        // =========================

        if (role) {

            nameStart = 1;

        }

        // =========================
        // ROLE ID
        // =========================

        if (!role) {

            const roleId =
                args[0].replace(
                    /[<@&>]/g,
                    ""
                );

            if (
                /^\d{17,20}$/.test(
                    roleId
                )
            ) {

                try {

                    role =
                        await message.guild.roles.fetch(
                            roleId
                        );

                } catch {

                    role = null;

                }

                nameStart = 1;

            }

        }

        // =========================
        // ROLE NAME
        // =========================

        if (!role) {

            for (
                let i = args.length - 1;
                i >= 1;
                i--
            ) {

                const possibleRoleName =
                    args
                        .slice(0, i)
                        .join(" ")
                        .trim();

                const foundRole =
                    message.guild.roles.cache.find(
                        guildRole =>
                            guildRole.name
                                .toLowerCase() ===
                            possibleRoleName.toLowerCase()
                    );

                if (foundRole) {

                    role =
                        foundRole;

                    nameStart =
                        i;

                    break;

                }

            }

        }

        if (!role) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.roleNotFound(
                        message.author,
                        args[0]
                    )
                ]
            });
        }

        // =========================
        // NEW NAME
        // =========================

        const newName =
            args
                .slice(nameStart)
                .join(" ")
                .trim();

        if (!newName) {
            return message.channel.send({
                embeds: [
                    rolesHelp.rename(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // PROTECTED ROLE
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
        // RENAME ROLE
        // =========================

        const oldName =
            role.name;

        try {

            await role.setName(
                newName,
                `Renamed by ${message.author.tag}`
            );

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.success
                    )
                    .setDescription(
                        `${config.emojis.success} ${message.author}: Renamed **${oldName}** to <@&${role.id}>.`
                    );

            return message.channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {

            console.error(
                "Role Rename Error:",
                error
            );

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.colors.failed
                    )
                    .setDescription(
                        `${config.emojis.failed} ${message.author}: Failed to rename **${oldName}** to **${newName}**. Please try again.`
                    );

            return message.channel.send({
                embeds: [
                    embed
                ]
            });

        }

    }

};
