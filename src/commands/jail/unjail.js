const {
    PermissionFlagsBits
} = require("discord.js");

const Jail =
    require("../../models/Jail");

const globalEmbeds =
    require("../../embeds/general/global");

const jailEmbeds =
    require("../../embeds/general/jail");

const jailHelp =
    require("../../embeds/help/jail");

module.exports = {
    name: "unjail",
    aliases: ["unj"],
    permissions: [
        PermissionFlagsBits.ManageGuild
    ],

    async execute(client, message, args) {
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
                    )
                ]
            });
        }

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageGuild"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        "ManageRoles"
                    )
                ]
            });
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
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
                    globalEmbeds.botPermissions(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        const target =
            args[0];

        if (!target) {
            return message.channel.send({
                embeds: [
                    jailHelp.unjail(
                        message.author
                    )
                ]
            });
        }

        let member =
            message.mentions.members.first();

        if (!member) {
            member =
                await message.guild.members
                    .fetch(target)
                    .catch(() => null);
        }

        if (!member) {
            member =
                message.guild.members.cache.find(
                    cachedMember =>
                        cachedMember.user.username.toLowerCase() ===
                        target.toLowerCase()
                );
        }

        if (!member) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.userNotFound(
                        message.author,
                        target
                    )
                ]
            });
        }

        if (member.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.self(
                        message.author
                    )
                ]
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.owner(
                        message.author
                    )
                ]
            });
        }

        if (
            member.roles.highest.position >=
            message.member.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.hierarchy(
                        message.author
                    )
                ]
            });
        }

        if (
            member.roles.highest.position >=
            botMember.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botRole(
                        message.author
                    )
                ]
            });
        }

        const jail =
            await Jail.findOne({
                guildId:
                    message.guild.id
            });

        if (!jail) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.notSetup(
                        message.author
                    )
                ]
            });
        }

        const jailRole =
            message.guild.roles.cache.get(
                jail.roleId
            );

        if (!jailRole) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.notSetup(
                        message.author
                    )
                ]
            });
        }

        if (!jailRole.editable) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.botRole(
                        message.author
                    )
                ]
            });
        }

        const recordIndex =
            Array.isArray(jail.members)
                ? jail.members.findIndex(
                    record =>
                        record.userId ===
                        member.id
                )
                : -1;

        const isJailed =
            recordIndex !== -1 ||
            member.roles.cache.has(
                jailRole.id
            );

        if (!isJailed) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.alreadyUnjailed(
                        message.author,
                        member.user
                    )
                ]
            });
        }

        const record =
            recordIndex !== -1
                ? jail.members[recordIndex]
                : null;

        const rolesToRestore =
            record &&
            Array.isArray(record.roles)
                ? record.roles
                    .map(
                        roleId =>
                            message.guild.roles.cache.get(
                                roleId
                            )
                    )
                    .filter(
                        role =>
                            role &&
                            role.id !==
                                message.guild.id &&
                            role.id !==
                                jailRole.id &&
                            role.editable
                    )
                    .map(
                        role =>
                            role.id
                    )
                : [];

        const caseNumber =
            record?.caseNumber || "N/A";

        try {
            if (record) {
                await member.roles.set(
                    rolesToRestore,
                    "Unjailed"
                );
            } else {
                await member.roles.remove(
                    jailRole,
                    "Unjailed"
                );
            }

            if (recordIndex !== -1) {
                jail.members.splice(
                    recordIndex,
                    1
                );
            }

            await jail.save();

            await message.channel.send({
                embeds: [
                    jailEmbeds.unjailed(
                        message.author,
                        member.user
                    )
                ]
            });

            client.emit("jail", {
                action: "unjail",
                guildId:
                    message.guild.id,
                member,
                moderator:
                    message.author,
                caseNumber
            });

        } catch (error) {
            console.error(
                "[UNJAIL] Failed to unjail member:",
                error
            );

            return message.channel.send({
                embeds: [
                    jailEmbeds.unjailFailed(
                        message.author,
                        member.user
                    )
                ]
            });
        }
    }
};
