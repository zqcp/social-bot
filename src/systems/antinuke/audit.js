const {
    AuditLogEvent
} = require("discord.js");

async function findEntry(
    guild,
    type,
    targetId = null
) {

    const logs =
        await guild.fetchAuditLogs({
            type,
            limit: 10
        }).catch(
            () => null
        );

    if (!logs) {
        return null;
    }

    const now =
        Date.now();

    const entry =
        logs.entries.find(
            item => {

                if (
                    now -
                    item.createdTimestamp >
                    10000
                ) {
                    return false;
                }

                if (
                    targetId &&
                    item.target?.id !==
                    targetId
                ) {
                    return false;
                }

                return true;

            }
        );

    return entry || null;

}

async function findExecutor(
    guild,
    type,
    targetId = null
) {

    const entry =
        await findEntry(
            guild,
            type,
            targetId
        );

    if (!entry?.executor) {
        return null;
    }

    return {
        entry,
        executor: entry.executor
    };

}

module.exports = {
    findEntry,
    findExecutor,
    AuditLogEvent
};
