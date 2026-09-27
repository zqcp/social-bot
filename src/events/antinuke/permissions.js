const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/permissions");


module.exports = {

    name: "guildUpdate",

    async execute(
        oldGuild,
        newGuild,
        client
    ) {

        if (!newGuild) return;

        const audit =
            await newGuild.fetchAuditLogs({
                type: AuditLogEvent.GuildUpdate,
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
                guildId: newGuild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const member =
            await newGuild.members
                .fetch(user.id)
                .catch(() => null);

        const changes = [];

        if (
            entry.changes?.length
        ) {

            for (
                const change of entry.changes
            ) {

                changes.push(
                    `${change.key} was changed`
                );

            }

        }

        const result =
            await manager.handle(
                newGuild,
                "permissions",
                member,
                newGuild,
                {
                    action: "updated",
                    target: "Server permissions",
                    actions: changes
                }
            );

        await logs.event(
            user,
            "updated",
            "Server permissions",
            changes.length
                ? changes
                : [
                    "Server permissions were updated"
                ],
            result?.punished
                ? "The user was punished."
                : "The permissions event was recorded.",
            `PERMISSIONS-${newGuild.id}`
        );

    }

};
