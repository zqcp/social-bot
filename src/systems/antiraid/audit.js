const {
    AuditLogEvent
} = require("discord.js");


async function findBotAddExecutor(
    guild,
    botId
) {

    try {

        const logs =
            await guild.fetchAuditLogs({
                type:
                    AuditLogEvent.BotAdd,
                limit: 10
            });

        const entry =
            logs.entries.find(
                item =>
                    item.target?.id === botId &&
                    Date.now() -
                        item.createdTimestamp <
                        15 * 1000
            );

        return entry?.executor || null;

    } catch (error) {

        console.error(
            `[ANTIRAID AUDIT] ${guild.id}`,
            error
        );

        return null;

    }

}


module.exports = {
    findBotAddExecutor
};
