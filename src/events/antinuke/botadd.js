const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/botadd");


module.exports = {

    name: "guildMemberAdd",

    async execute(
        member,
        client
    ) {

        if (!member.guild) return;

        if (!member.user.bot) return;

        const audit =
            await member.guild.fetchAuditLogs({
                type: AuditLogEvent.BotAdd,
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

        const result =
            await manager.handle(
                member.guild,
                "botadd",
                await member.guild.members
                    .fetch(user.id)
                    .catch(() => null),
                member,
                {
                    action: "added",
                    target: member,
                    actions: [
                        `Added ${member.user.username}`
                    ]
                }
            );

        await logs.event(
            user,
            "added",
            member.user.username,
            [
                "A new bot was added to the server"
            ],
            result?.punished
                ? "The user was punished."
                : "The bot was added.",
            `BOTADD-${member.id}`
        );

    }

};
