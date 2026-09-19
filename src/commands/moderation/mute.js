const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const globalEmbeds = require("../../embeds/general/global");
const moderationHelp = require("../../embeds/help/moderation");
const GuildConfig = require("../../models/GuildConfig");

module.exports = {

    name: "mute",
    aliases: [],
    permissions: [PermissionFlagsBits.ModerateMembers],

    async execute(client, message, args) {

        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.channel.send({
                embeds: [globalEmbeds.permission(message.author, "ModerateMembers")]
            });
        }

        const botMember = message.guild.members.me;

        if (!botMember) return;

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageRoles
        ];

        const missingPermissions = requiredPermissions.filter(
            permission => !message.channel.permissionsFor(botMember).has(permission)
        );

        if (missingPermissions.length) {
            return message.channel.send({
                embeds: [globalEmbeds.permissions(message.author, missingPermissions)]
            });
        }

        if (!args[0]) {
            return message.channel.send({
                embeds: [moderationHelp.mute(message.author)]
            });
        }

        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(require("../../config").colors.error)
                        .setDescription(
                            `${require("../../config").emojis.error} ${message.author}: Missing **duration**.`
                        )
                ]
            });
        }

        const durationInput = args[1].toLowerCase().trim();

        const durationMatch = durationInput.match(
            /^(\d+(?:\.\d+)?)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|ds|day|days|w|week|weeks)$/
        );

        if (!durationMatch) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(require("../../config").colors.error)
                        .setDescription(
                            `${require("../../config").emojis.error} ${message.author}: \`${args[1]}\` is an invalid **duration**.`
                        )
                ]
            });
        }

        const amount = Number(durationMatch[1]);
        const unit = durationMatch[2];

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

        const duration = amount * multipliers[unit];

        if (!Number.isFinite(duration) || duration <= 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(require("../../config").colors.error)
                        .setDescription(
                            `${require("../../config").emojis.error} ${message.author}: \`${args[1]}\` is an invalid **duration**.`
                        )
                ]
            });
        }

        const memberQuery = args[0].replace(/[<@!>]/g, "");

        let member = message.mentions.members.first();

        if (!member && /^\d+$/.test(memberQuery)) {
            member = await message.guild.members.fetch(memberQuery).catch(() => null);
        }

        if (!member) {
            member = message.guild.members.cache.find(
                m =>
                    m.user.username.toLowerCase() === args[0].toLowerCase() ||
                    m.displayName.toLowerCase() === args[0].toLowerCase()
            );
        }

        if (!member) {
            return message.channel.send({
                embeds: [globalEmbeds.userNotFound(message.author, args[0])]
            });
        }

        if (member.id === message.author.id) {
            return message.channel.send({
                embeds: [globalEmbeds.self(message.author)]
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [globalEmbeds.owner(message.author)]
            });
        }

        if (
            message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
        ) {
            return message.channel.send({
                embeds: [globalEmbeds.hierarchy(message.author)]
            });
        }

        if (
            botMember.roles.highest.comparePositionTo(member.roles.highest) <= 0
        ) {
            return message.channel.send({
                embeds: [globalEmbeds.botRole(message.author)]
            });
        }

        const guildConfig = await GuildConfig.findOne({
            guildId: message.guild.id
        });

        const muteRoleId = guildConfig?.muteRoleId;

        if (!muteRoleId) {
            return message.channel.send({
                embeds: [globalEmbeds.missing(message.author, "mute role")]
            });
        }

        const muteRole = message.guild.roles.cache.get(muteRoleId);

        if (!muteRole) {
            return message.channel.send({
                embeds: [globalEmbeds.invalid(message.author, "mute role")]
            });
        }

        if (muteRole.managed || muteRole.id === message.guild.id) {
            return message.channel.send({
                embeds: [globalEmbeds.invalid(message.author, "mute role")]
            });
        }

        if (
            botMember.roles.highest.comparePositionTo(muteRole) <= 0
        ) {
            return message.channel.send({
                embeds: [globalEmbeds.botRole(message.author)]
            });
        }

        if (member.roles.cache.has(muteRole.id)) {
            return message.channel.send({
                embeds: [globalEmbeds.alreadyExists(message.author, "mute")]
            });
        }

        const reason = args.slice(2).join(" ") || "No reason provided";

        try {

            await member.roles.add(muteRole, reason);

            const config = require("../../config");

            const durationText = args[1];

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(
                    `${config.emojis.success} ${message.author}: **muted** **${member.user.username}** for \`${durationText}\` for \`${reason}\`.`
                );

            await message.channel.send({
                embeds: [embed]
            });

            setTimeout(async () => {
                const currentMember = await message.guild.members
                    .fetch(member.id)
                    .catch(() => null);

                if (!currentMember) return;

                if (!currentMember.roles.cache.has(muteRole.id)) return;

                await currentMember.roles.remove(
                    muteRole,
                    "Mute duration expired."
                ).catch(() => {});
            }, duration);

        } catch (error) {

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(require("../../config").colors.failed)
                        .setDescription(
                            `${require("../../config").emojis.failed} ${message.author}: Failed to **mute** **${member.user.username}**. Please try again.`
                        )
                ]
            });
        }

    }

};
