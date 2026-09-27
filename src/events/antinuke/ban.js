const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/ban");


module.exports = {

    name: "guildBanAdd",

    async execute(
        ban,
        client
    ) {

        if (!ban.guild) return;

        const audit =
            await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 5
            }).catch(() => null);

        if (!audit) return;

        const entry =
            audit.entries.find(
                entry =>
                    entry.target?.id === ban.user.id &&
                    Date.now() - entry.createdTimestamp < 10000
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

        const antiNuke =
            await AntiNuke.findOne({
                guildId: ban.guild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const member =
            await ban.guild.members
                .fetch(user.id)
                .catch(() => null);

        const result =
            await manager.handle(
                ban.guild,
                "ban",
                member,
                ban.user,
                {
                    action: "created",
                    target: ban.user,
                    actions: [
                        `Banned ${ban.user.username}`
                    ]
                }
            );

        await logs.event(
            user,
            "created",
            ban.user.username,
            [
                "Member was banned"
            ],
            result?.punished
                ? "The user was punished."
                : "The ban event was recorded.",
            `BAN-${ban.user.id}`
        );

    }

};
