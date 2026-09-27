module.exports = {

    name: "guildUpdate",

    async execute(
        oldGuild,
        newGuild,
        client
    ) {

        if (!oldGuild || !newGuild) return;

        if (
            oldGuild.vanityURLCode ===
            newGuild.vanityURLCode
        ) {
            return;
        }

        const AntiNuke =
            require("../../models/AntiNuke");

        const manager =
            require("../../systems/antinuke/manager");

        const logs =
            require("../../systems/antinuke/logs/vanity");

        const antiNuke =
            await AntiNuke.findOne({
                guildId: newGuild.id
            });

        if (!antiNuke) return;

        const audit =
            await newGuild.fetchAuditLogs({
                type: 1,
                limit: 5
            }).catch(() => null);

        const entry =
            audit?.entries.find(
                entry =>
                    Date.now() - entry.createdTimestamp < 10000
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

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

        const result =
            await manager.handle(
                newGuild,
                "vanity",
                member,
                newGuild,
                {
                    action: "updated",
                    target: "Server vanity",
                    actions: [
                        `Changed vanity from \`${oldGuild.vanityURLCode || "None"}\` to \`${newGuild.vanityURLCode || "None"}\``
                    ]
                }
            );

        await logs.event(
            user,
            "updated",
            "Server vanity",
            [
                `Changed from \`${oldGuild.vanityURLCode || "None"}\` to \`${newGuild.vanityURLCode || "None"}\``
            ],
            result?.punished
                ? "The user was punished."
                : "The vanity change was recorded.",
            `VANITY-${newGuild.id}`
        );

    }

};
