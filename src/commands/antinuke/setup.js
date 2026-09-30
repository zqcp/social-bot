const {
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const globalEmbeds =
    require("../../embeds/general/global");

const config =
    require("../../config");


module.exports = {

    name: "antinuke setup",
    aliases: [],
    permissions: [
        PermissionFlagsBits.Administrator
    ],

    async execute(
        client,
        message,
        args
    ) {

        if (!message.guild) {
            return;
        }

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "Administrator"
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
                PermissionFlagsBits.ManageChannels
            )
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        PermissionFlagsBits.ManageChannels
                    )
                ]
            });

        }

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.ManageWebhooks
            )
        ) {

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        PermissionFlagsBits.ManageWebhooks
                    )
                ]
            });

        }

        try {

            const antiNuke =
                await AntiNuke.findOneAndUpdate(
                    {
                        guildId:
                            message.guild.id
                    },
                    {
                        $setOnInsert: {
                            guildId:
                                message.guild.id
                        }
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );

            if (
                antiNuke.logs?.channelId
            ) {

                const existingChannel =
                    message.guild.channels.cache.get(
                        antiNuke.logs.channelId
                    );

                if (existingChannel) {

                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(
                                    config.colors.error
                                )
                                .setDescription(
                                    `${config.emojis.error} ${message.author}: **AntiNuke logs** are already set to ${existingChannel}.`
                                )
                        ]
                    });

                }

            }

            const channel =
                await message.guild.channels.create({
                    name: "antinuke-logs",
                    type: ChannelType.GuildText,
                    reason:
                        "AntiNuke logging channel setup."
                });

            const webhook =
                await channel.createWebhook({
                    name:
                        "AntiNuke Logs",
                    reason:
                        "AntiNuke logging webhook setup."
                });

            antiNuke.logs.enabled =
                true;

            antiNuke.logs.channelId =
                channel.id;

            antiNuke.logs.webhookUrl =
                webhook.url;

            await antiNuke.save();

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.success
                        )
                        .setDescription(
                            `${config.emojis.success} ${message.author}: **AntiNuke logs** have been set to ${channel}.`
                        )
                ]
            });

        } catch (error) {

            console.error(
                "[ANTINUKE SETLOGS]",
                error
            );

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.failed
                        )
                        .setDescription(
                            `${config.emojis.failed} ${message.author}: Failed to **create AntiNuke logs**. Please try again.`
                        )
                ]
            });

        }

    }

};
