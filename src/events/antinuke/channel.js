const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/channel");


async function getExecutor(
    guild,
    type,
    targetId
) {

    const audit =
        await guild.fetchAuditLogs({
            type,
            limit: 5
        }).catch(() => null);

    if (!audit) return null;

    const entry =
        audit.entries.find(
            entry =>
                entry.target?.id === targetId &&
                Date.now() - entry.createdTimestamp < 10000
        );

    return entry || null;

}


module.exports = {

    name: "channelCreate",

    async execute(
        channel,
        client
    ) {

        if (!channel.guild) return;

        const entry =
            await getExecutor(
                channel.guild,
                AuditLogEvent.ChannelCreate,
                channel.id
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

        const antiNuke =
            await AntiNuke.findOne({
                guildId: channel.guild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const result =
            await manager.handle(
                channel.guild,
                "channel",
                await channel.guild.members.fetch(user.id).catch(() => null),
                channel,
                {
                    action: "created",
                    target: channel,
                    actions: [
                        `Created ${channel}`
                    ]
                }
            );

        if (
            result?.triggered
        ) {

            await channel.delete(
                "AntiNuke protection."
            ).catch(() => {});

        }

        await channel.guild.channels.fetch(
            channel.id
        ).catch(() => null);

        await logs.event(
            user,
            "created",
            channel,
            [
                "Channel was created"
            ],
            result?.punished
                ? "The user was punished."
                : "The channel was created.",
            `CHANNEL-${channel.id}`
        );

    }

};
