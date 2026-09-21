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

    name: "role delete",

    aliases: ["rd"],

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

        const roleValue =
            args.join(" ").trim();

        if (!roleValue) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.missing(
                        message.author,
                        "role"
                    )
                ]
            });
        }

        let role =
            message.mentions.roles.first();

        if (!role) {

            const roleId =
                roleValue.replace(
                    /[<@&>]/g,
                    ""
                );

            if (/^\d{17,20}$/.test(roleId)) {

                try {

                    role =
                        await message.guild.roles.fetch(
                            roleId
                        );

                } catch {

                    role = null;

                }

            } else {

                role =
                    message.guild.roles.cache.find(
                        guildRole =>
                            guildRole.name
                                .toLowerCase() ===
                            roleValue.toLowerCase()
                    );

            }
        }

        // =========================
        // ROLE NOT FOUND
        // =========================

        if (!role) {
            return message.channel.send({
                embeds: [
                    roleEmbeds.couldNotFind(
                        message.author,
                        roleValue
                    )
                ]
            });
        }

        // =========================
        // PROTECTED ROLES
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
        // DELETE ROLE
        // =========================

        try {

            await role.delete(
                `Deleted by ${message.author.tag}`
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.deleteSuccess(
                        message.author,
                        role
                    )
                ]
            });

        } catch (error) {

            console.error(
                "Role Delete Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    roleEmbeds.deleteFailed(
                        message.author,
                        role
                    )
                ]
            });

        }

    }

};
