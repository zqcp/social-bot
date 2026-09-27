const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/webhook");


module.exports = {

    name: "webhookUpdate",

    async execute(
        channel,
        client
    ) {

        if (!channel.guild) return;

        const audit =
            await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.WebhookCreate,
                limit: 5
            }).catch(() => null);

        if (!audit) return;

        const entry =
            audit.entries.find(
                entry =>
                    Date.now() - entry.createdTimestamp < 10000
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

        const member =
            await channel.guild.members
                .fetch(user.id)
                .catch(() => null);

        const result =
            await manager.handle(
                channel.guild,
                "webhook",
                member,
                channel,
                {
                    action: "updated",
                    target: channel,
                    actions: [
                        `Updated webhook in ${channel}`
                    ]
                }
            );

        await logs.event(
            user,
            "updated",
            channel,
            [
                "Webhook activity was detected"
            ],
            result?.punished
                ? "The user was punished."
                : "The webhook event was recorded.",
            `WEBHOOK-${channel.id}`
        );

    }

};
