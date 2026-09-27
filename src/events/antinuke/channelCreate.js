const {
    AuditLogEvent,
    ChannelType
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
                AuditLogEvent.ChannelCreate,

            limit:
                10
        }).catch(
            error => {

                console.error(
                    "[ANTINUKE CHANNEL CREATE]",
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


function isRecoverableChannel(
    channel
) {

    return (
        channel.type ===
            ChannelType.GuildText ||
        channel.type ===
            ChannelType.GuildAnnouncement ||
        channel.type ===
            ChannelType.GuildVoice ||
        channel.type ===
            ChannelType.GuildStageVoice ||
        channel.type ===
            ChannelType.GuildCategory ||
        channel.type ===
            ChannelType.GuildForum ||
        channel.type ===
            ChannelType.GuildMedia
    );

}


module.exports = {

    name:
        "channelCreate",

    async execute(
        channel
    ) {

        if (
            !channel?.guild
        ) {
            return;
        }

        if (
            !isRecoverableChannel(
                channel
            )
        ) {
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

        /*
         * Store the original channel state.
         *
         * This gives the recovery system a snapshot
         * that can later be used if the channel is
         * modified or deleted.
         */

        recovery.snapshot(
            channel
        );

        await manager.handle(
            channel.guild,
            "channel",
            member,
            member,
            {
                action:
                    "created",

                actions: [
                    `${channel.name} — created`
                ],

                target:
                    channel,

                auditEntry:
                    entry
            }
        );

    }

};
