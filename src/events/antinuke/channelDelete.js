const {
    AuditLogEvent
} = require("discord.js");

const manager =
    require("../../systems/antinuke/manager");

const recovery =
    require("../../systems/antinuke/recovery");


async function findExecutor(
    guild,
    channelId
) {

    const logs =
        await guild.fetchAuditLogs({
            type:
                AuditLogEvent.ChannelDelete,

            limit:
                10
        }).catch(
            error => {

                console.error(
                    "[ANTINUKE CHANNEL DELETE]",
                    error
                );

                return null;

            }
        );

    if (!logs) {
        return null;
    }

    const now =
        Date.now();

    return (
        logs.entries.find(
            entry => {

                if (
                    now -
                    entry.createdTimestamp >
                    10000
                ) {
                    return false;
                }

                if (
                    entry.target?.id !==
                    channelId
                ) {
                    return false;
                }

                return true;

            }
        ) || null
    );

}


module.exports = {

    name:
        "channelDelete",

    async execute(
        channel
    ) {

        if (
            !channel?.guild
        ) {
            return;
        }

        /*
         * The recovery snapshot must already exist
         * from channelCreate/channelUpdate.
         */

        const snapshot =
            recovery.get(
                channel.guild.id,
                channel.id
            );

        if (!snapshot) {
            return;
        }

        const entry =
            await findExecutor(
                channel.guild,
                channel.id
            );

        if (
            !entry?.executor
        ) {
            return;
        }

        const member =
            await channel.guild.members.fetch(
                entry.executor.id
            ).catch(
                () => null
            );

        if (!member) {
            return;
        }

        await manager.handle(
            channel.guild,
            "channel",
            member,
            member,
            {
                action:
                    "deleted",

                actions: [
                    `${snapshot.name} — deleted`
                ],

                target:
                    channel,

                auditEntry:
                    entry
            }
        );

        /*
         * The actual recreation/recovery is handled
         * after AntiNuke protection is triggered.
         *
         * Keep the snapshot until recovery is complete.
         */

    }

};
