const {
    AuditLogEvent,
    PermissionFlagsBits
} = require("discord.js");

const manager =
    require("../../systems/antinuke/manager");

const recovery =
    require("../../systems/antinuke/recovery");


const DANGEROUS_PERMISSIONS = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ManageThreads,
    PermissionFlagsBits.ManageEmojisAndStickers
];


async function findExecutor(
    guild,
    channelId
) {

    const logs =
        await guild.fetchAuditLogs({
            type:
                AuditLogEvent.ChannelUpdate,

            limit:
                10
        }).catch(
            error => {

                console.error(
                    "[ANTINUKE CHANNEL UPDATE]",
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


function getChanges(
    oldChannel,
    newChannel
) {

    const changes = [];

    if (
        oldChannel.name !==
        newChannel.name
    ) {

        changes.push(
            `Name: \`${oldChannel.name}\` → \`${newChannel.name}\``
        );

    }

    if (
        "topic" in oldChannel &&
        oldChannel.topic !==
        newChannel.topic
    ) {

        changes.push(
            "Topic changed"
        );

    }

    if (
        "nsfw" in oldChannel &&
        oldChannel.nsfw !==
        newChannel.nsfw
    ) {

        changes.push(
            `NSFW: \`${oldChannel.nsfw}\` → \`${newChannel.nsfw}\``
        );

    }

    if (
        "rateLimitPerUser" in oldChannel &&
        oldChannel.rateLimitPerUser !==
        newChannel.rateLimitPerUser
    ) {

        changes.push(
            `Slowmode: \`${oldChannel.rateLimitPerUser}s\` → \`${newChannel.rateLimitPerUser}s\``
        );

    }

    if (
        "bitrate" in oldChannel &&
        oldChannel.bitrate !==
        newChannel.bitrate
    ) {

        changes.push(
            `Bitrate: \`${oldChannel.bitrate}\` → \`${newChannel.bitrate}\``
        );

    }

    if (
        "userLimit" in oldChannel &&
        oldChannel.userLimit !==
        newChannel.userLimit
    ) {

        changes.push(
            `User limit: \`${oldChannel.userLimit}\` → \`${newChannel.userLimit}\``
        );

    }

    if (
        oldChannel.parentId !==
        newChannel.parentId
    ) {

        changes.push(
            "Category changed"
        );

    }

    const oldOverwrites =
        oldChannel.permissionOverwrites?.cache;

    const newOverwrites =
        newChannel.permissionOverwrites?.cache;

    if (
        oldOverwrites &&
        newOverwrites
    ) {

        for (
            const overwrite
                of newOverwrites.values()
        ) {

            const oldOverwrite =
                oldOverwrites.get(
                    overwrite.id
                );

            if (!oldOverwrite) {

                for (
                    const permission
                        of DANGEROUS_PERMISSIONS
                ) {

                    if (
                        overwrite.allow.has(
                            permission
                        )
                    ) {

                        changes.push(
                            `${overwrite.id} — ${permission} granted`
                        );

                    }

                }

                continue;

            }

            for (
                const permission
                    of DANGEROUS_PERMISSIONS
            ) {

                const wasAllowed =
                    oldOverwrite.allow.has(
                        permission
                    );

                const isAllowed =
                    overwrite.allow.has(
                        permission
                    );

                if (
                    !wasAllowed &&
                    isAllowed
                ) {

                    changes.push(
                        `${overwrite.id} — ${permission} granted`
                    );

                }

            }

        }

    }

    return changes;

}


module.exports = {

    name:
        "channelUpdate",

    async execute(
        oldChannel,
        newChannel
    ) {

        if (
            !newChannel?.guild
        ) {
            return;
        }

        if (
            !oldChannel
        ) {
            return;
        }

        /*
         * Save the newest known safe state
         * before processing the update.
         */

        recovery.snapshot(
            newChannel
        );

        const changes =
            getChanges(
                oldChannel,
                newChannel
            );

        if (
            !changes.length
        ) {
            return;
        }

        const entry =
            await findExecutor(
                newChannel.guild,
                newChannel.id
            );

        if (
            !entry?.executor
        ) {
            return;
        }

        const member =
            await newChannel.guild.members.fetch(
                entry.executor.id
            ).catch(
                () => null
            );

        if (!member) {
            return;
        }

        await manager.handle(
            newChannel.guild,
            "channel",
            member,
            member,
            {
                action:
                    "updated",

                actions:
                    changes,

                target:
                    newChannel,

                auditEntry:
                    entry
            }
        );

    }

};
