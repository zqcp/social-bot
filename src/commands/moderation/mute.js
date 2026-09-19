const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const globalEmbeds =
    require("../../embeds/general/global");

const muteEmbeds =
    require("../../embeds/general/mute");

const moderationHelp =
    require("../../embeds/help/moderation");

const GuildConfig =
    require("../../models/GuildConfig");

const Mute =
    require("../../models/Mute");

const config =
    require("../../config");

module.exports = {
    name: "mute",
    aliases: ["m"],
    permissions: [
        PermissionFlagsBits.ModerateMembers
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
                PermissionFlagsBits.ModerateMembers
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ModerateMembers"
                    )
                ]
            });
        }

        const botMember =
            message.guild.members.me;

        if (!botMember) {
            return;
        }

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
                    moderationHelp.mute(
                        message.author
                    )
                ]
            });
        }

        const durationInput =
            args[1]?.toLowerCase().trim();

        if (!durationInput) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: Missing **duration**.`
                        )
                ]
            });
        }

        const durationMatch =
            durationInput.match(
                /^(\d+(?:\.\d+)?)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|ds|day|days|w|week|weeks)$/
            );

        if (!durationMatch) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: \`${args[1]}\` is an invalid **duration**.`
                        )
                ]
            });
        }

        const amount =
            Number(durationMatch[1]);

        const unit =
            durationMatch[2];

        const multipliers = {
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
            ds: 24 * 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000,

            w: 7 * 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            weeks: 7 * 24 * 60 * 60 * 1000
        };

        const duration =
            amount * multipliers[unit];

        const maxDuration =
            28 * 24 * 60 * 60 * 1000;

        if (
            !Number.isFinite(duration) ||
            duration <= 0
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: \`${args[1]}\` is an invalid **duration**.`
                        )
                ]
            });
        }

        if (duration > maxDuration) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: The maximum **mute duration** is \`28 days\`.`
                        )
                ]
            });
        }

        const memberQuery =
            target.replace(/[<@!>]/g, "");

        let member =
            message.mentions.members.first();

        if (!member) {
            member =
                await message.guild.members
                    .fetch(memberQuery)
                    .catch(() => null);
        }

        if (!member) {
            member =
                message.guild.members.cache.find(
                    member =>
                        member.user.username.toLowerCase() ===
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

        const guildConfig =
            await GuildConfig.findOne({
                guildId: message.guild.id
            });

        const muteConfig =
            await Mute.findOne({
                guildId: message.guild.id
            });

        const muteRoleId =
            muteConfig?.muteRoleId;

        if (!muteRoleId) {
            return message.channel.send({
                embeds: [
                    muteEmbeds.notSetup(
                        message.author
                    )
                ]
            });
        }

        const muteRole =
            message.guild.roles.cache.get(
                muteRoleId
            );

        if (!muteRole) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        "mute role"
                    )
                ]
            });
        }

        if (
            muteRole.managed ||
            muteRole.id === message.guild.id
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.invalid(
                        message.author,
                        "mute role"
                    )
                ]
            });
        }

        if (
            muteRole.position >=
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

        if (
            member.roles.cache.has(
                muteRole.id
            )
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.error
                        )
                        .setDescription(
                            `${config.emojis.error} ${message.author}: **${member.user.username}** is already muted.`
                        )
                ]
            });
        }

        const reason =
            args.slice(2).join(" ") ||
            "No reason provided";

        try {
            await member.roles.add(
                muteRole,
                reason
            );

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.success
                        )
                        .setDescription(
                            `${config.emojis.success} ${message.author}: **muted** **${member.user.username}** for \`${args[1]}\` for \`${reason}\`.`
                        )
                ]
            });

            setTimeout(
                async () => {
                    const currentMember =
                        await message.guild.members
                            .fetch(member.id)
                            .catch(() => null);

                    if (!currentMember) {
                        return;
                    }

                    if (
                        !currentMember.roles.cache.has(
                            muteRole.id
                        )
                    ) {
                        return;
                    }

                    await currentMember.roles
                        .remove(
                            muteRole,
                            "Mute duration expired."
                        )
                        .catch(() => {});
                },
                duration
            );
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.failed
                        )
                        .setDescription(
                            `${config.emojis.failed} ${message.author}: Failed to **mute** **${member.user.username}**. Please try again.`
                        )
                ]
            });
        }
    }
};
