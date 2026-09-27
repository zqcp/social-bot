const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/emoji");


module.exports = {

    name: "emojiCreate",

    async execute(
        emoji,
        client
    ) {

        if (!emoji.guild) return;

        const audit =
            await emoji.guild.fetchAuditLogs({
                type: AuditLogEvent.EmojiCreate,
                limit: 5
            }).catch(() => null);

        if (!audit) return;

        const entry =
            audit.entries.find(
                entry =>
                    entry.target?.id === emoji.id &&
                    Date.now() - entry.createdTimestamp < 10000
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

        const antiNuke =
            await AntiNuke.findOne({
                guildId: emoji.guild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const member =
            await emoji.guild.members
                .fetch(user.id)
                .catch(() => null);

        const result =
            await manager.handle(
                emoji.guild,
                "emoji",
                member,
                emoji,
                {
                    action: "created",
                    target: emoji,
                    actions: [
                        `Created ${emoji}`
                    ]
                }
            );

        await logs.event(
            user,
            "created",
            emoji,
            [
                "Emoji was created"
            ],
            result?.punished
                ? "The user was punished."
                : "The emoji was created.",
            `EMOJI-${emoji.id}`
        );

    }

};
