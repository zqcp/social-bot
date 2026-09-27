const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/kick");


module.exports = {

    name: "guildMemberRemove",

    async execute(
        member,
        client
    ) {

        if (!member.guild) return;

        const audit =
            await member.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberKick,
                limit: 5
            }).catch(() => null);

        if (!audit) return;

        const entry =
            audit.entries.find(
                entry =>
                    entry.target?.id === member.id &&
                    Date.now() - entry.createdTimestamp < 10000
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

        const antiNuke =
            await AntiNuke.findOne({
                guildId: member.guild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const executor =
            await member.guild.members
                .fetch(user.id)
                .catch(() => null);

        const result =
            await manager.handle(
                member.guild,
                "kick",
                executor,
                member,
                {
                    action: "removed",
                    target: member,
                    actions: [
                        `Kicked ${member.user.username}`
                    ]
                }
            );

        await logs.event(
            user,
            "removed",
            member.user.username,
            [
                "Member was kicked"
            ],
            result?.punished
                ? "The user was punished."
                : "The kick event was recorded.",
            `KICK-${member.id}`
        );

    }

};
