const {
    AuditLogEvent
} = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const vanityLogs =
    require("../../systems/antinuke/logs/vanity");

const detector =
    require("../../systems/antinuke/detector");

const actions =
    require("../../systems/antinuke/actions");


module.exports = {

    name: "guildUpdate",

    async execute(oldGuild, newGuild, client) {

        if (!oldGuild || !newGuild) {
            return;
        }

        if (
            oldGuild.vanityURLCode ===
            newGuild.vanityURLCode
        ) {
            return;
        }

        const antiNuke =
            await AntiNuke.findOne({
                guildId: newGuild.id
            });

        if (
            !antiNuke ||
            antiNuke.enabled !== true
        ) {
            return;
        }

        const moduleConfig =
            antiNuke.modules?.vanity;

        if (
            !moduleConfig ||
            moduleConfig.enabled !== true
        ) {
            return;
        }

        let auditLogs;

        try {

            auditLogs =
                await newGuild.fetchAuditLogs({
                    type:
                        AuditLogEvent.GuildUpdate,
                    limit: 10
                });

        } catch (error) {

            console.error(
                "[ANTINUKE VANITY AUDIT]",
                error
            );

            return;

        }

        const entry =
            auditLogs.entries.find(
                auditEntry =>
                    auditEntry.target?.id ===
                        newGuild.id &&
                    Date.now() -
                        auditEntry.createdTimestamp <
                        10000 &&
                    auditEntry.changes?.some(
                        change =>
                            change.key ===
                            "vanity_url_code"
                    )
            );

        if (!entry) {
            return;
        }

        const user =
            entry.executor;

        if (!user) {
            return;
        }

        const member =
            await newGuild.members
                .fetch(user.id)
                .catch(
                    () => null
                );

        if (!member) {
            return;
        }

        const oldVanity =
            oldGuild.vanityURLCode ||
            null;

        const newVanity =
            newGuild.vanityURLCode ||
            null;

        const eventId =
            `VANITY-${entry.id}`;

        const detected =
            detector.check(
                antiNuke,
                "vanity",
                user
            );

        if (
            detected.allowed
        ) {

            const event =
                vanityLogs.event(
                    user,
                    "updated",
                    oldVanity,
                    newVanity,
                    "The vanity change was detected and restored.",
                    eventId
                );

            if (
                antiNuke.logs?.enabled &&
                antiNuke.logs?.channelId
            ) {

                const channel =
                    newGuild.channels.cache.get(
                        antiNuke.logs.channelId
                    );

                if (channel) {

                    await channel.send({
                        components: [event],
                        flags: 32768
                    }).catch(
                        () => null
                    );

                }

            }

            return;
        }

        const detectedActions = [
            `Changed vanity from \`${oldVanity || "None"}\` to \`${newVanity || "None"}\``
        ];

        let punished =
            false;

        const reason =
            "AntiNuke: vanity threshold exceeded.";

        if (
            moduleConfig.punishment
        ) {

            punished =
                await actions.execute(
                    member,
                    moduleConfig.punishment,
                    reason
                ).catch(
                    error => {

                        console.error(
                            "[ANTINUKE VANITY ACTION]",
                            error
                        );

                        return false;

                    }
                );

        }

        const triggered =
            vanityLogs.triggered(
                user,
                oldVanity,
                newVanity,
                detected.userActions ||
                    detected.actions ||
                    0,
                moduleConfig.threshold,
                moduleConfig.punishment,
                punished
                    ? "Punishment applied successfully."
                    : "Failed to apply punishment.",
                detectedActions
            );

        if (
            antiNuke.logs?.enabled &&
            antiNuke.logs?.channelId
        ) {

            const channel =
                newGuild.channels.cache.get(
                    antiNuke.logs.channelId
                );

            if (channel) {

                await channel.send({
                    components: [triggered],
                    flags: 32768
                }).catch(
                    () => null
                );

            }

        }

        let restored =
            false;

        try {

            await newGuild.edit({
                vanityURLCode:
                    oldVanity
            });

            restored = true;

        } catch (error) {

            console.error(
                "[ANTINUKE VANITY RESTORE]",
                error
            );

        }

        if (
            restored
        ) {

            const recovery =
                vanityLogs.recovery(
                    user,
                    oldVanity,
                    "The original server vanity was restored successfully."
                );

            if (
                antiNuke.logs?.enabled &&
                antiNuke.logs?.channelId
            ) {

                const channel =
                    newGuild.channels.cache.get(
                        antiNuke.logs.channelId
                    );

                if (channel) {

                    await channel.send({
                        components: [recovery],
                        flags: 32768
                    }).catch(
                        () => null
                    );

                }

            }

        } else {

            const failed =
                vanityLogs.failed(
                    user,
                    oldVanity,
                    newVanity,
                    "The original server vanity could not be restored."
                );

            if (
                antiNuke.logs?.enabled &&
                antiNuke.logs?.channelId
            ) {

                const channel =
                    newGuild.channels.cache.get(
                        antiNuke.logs.channelId
                    );

                if (channel) {

                    await channel.send({
                        components: [failed],
                        flags: 32768
                    }).catch(
                        () => null
                    );

                }

            }

        }

    }

};
