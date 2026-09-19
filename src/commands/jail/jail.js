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
    name: "jail",
    aliases: ["j"],
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
                    jailHelp.jail(
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

        const memberRecord =
            Array.isArray(jail.members)
                ? jail.members.find(
                    record =>
                        record.userId ===
                        member.id
                )
                : null;

        const isJailed =
            Boolean(memberRecord) ||
            member.roles.cache.has(
                jailRole.id
            );

        if (isJailed) {
            return message.channel.send({
                embeds: [
                    jailEmbeds.alreadyJailed(
                        message.author,
                        member.user
                    )
                ]
            });
        }

        const durationParts = [];
        let durationMs = 0;

        const units = {
            s: 1000,
            sec: 1000,
            secs: 1000,
            second: 1000,
            seconds: 1000,

            m: 60 * 1000,
            min: 60 * 1000,
            mins: 60 * 1000,
            minute: 60 * 1000,
            minutes: 60 * 1000,

            h: 60 * 60 * 1000,
            hr: 60 * 60 * 1000,
            hrs: 60 * 60 * 1000,
            hour: 60 * 60 * 1000,
            hours: 60 * 60 * 1000,

            d: 24 * 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000,

            w: 7 * 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            weeks: 7 * 24 * 60 * 60 * 1000
        };

        while (args.length) {
            const value =
                args[0];

            const compact =
                value.match(
                    /^(\d+(?:\.\d+)?)(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks)$/i
                );

            if (compact) {
                args.shift();

                const amount =
                    Number(compact[1]);

                const unit =
                    compact[2].toLowerCase();

                durationMs +=
                    amount * units[unit];

                durationParts.push(
                    value
                );

                continue;
            }

            if (
                args.length >= 2 &&
                /^\d+(?:\.\d+)?$/.test(
                    args[0]
                )
            ) {
                const amount =
                    Number(args[0]);

                const unit =
                    args[1].toLowerCase();

                if (
                    Object.prototype.hasOwnProperty.call(
                        units,
                        unit
                    )
                ) {
                    args.shift();
                    args.shift();

                    durationMs +=
                        amount * units[unit];

                    durationParts.push(
                        `${amount} ${unit}`
                    );

                    continue;
                }
            }

            break;
        }

        const duration =
            durationParts.length
                ? durationParts.join(" ")
                : null;

        const reason =
            args.join(" ").trim() ||
            "No reason provided";

        const roles =
            member.roles.cache
                .filter(
                    role =>
                        role.id !==
                            message.guild.id &&
                        role.id !==
                            jailRole.id &&
                        role.editable
                )
                .map(
                    role =>
                        role.id
                );

        const caseNumber =
            jail.nextCase || 1;

        try {
            await member.roles.set(
                [jailRole.id],
                reason
            );

            jail.members.push({
                userId: member.id,
                roles,
                reason,
                caseNumber,
                jailedAt: new Date(),
                duration,
                durationMs:
                    durationMs || null,
                expiresAt:
                    durationMs
                        ? new Date(
                            Date.now() +
                            durationMs
                        )
                        : null
            });

            jail.nextCase =
                caseNumber + 1;

            await jail.save();

            await message.channel.send({
                embeds: [
                    jailEmbeds.jailed(
                        message.author,
                        member.user,
                        duration,
                        reason
                    )
                ]
            });

            client.emit("jail", {
                action: "jailed",
                guildId:
                    message.guild.id,
                member,
                moderator:
                    message.author,
                reason,
                duration,
                caseNumber
            });

        } catch (error) {
            console.error(
                "[JAIL] Failed to jail member:",
                error
            );

            return message.channel.send({
                embeds: [
                    jailEmbeds.jailFailed(
                        message.author,
                        member.user
                    )
                ]
            });
        }
    }
};
