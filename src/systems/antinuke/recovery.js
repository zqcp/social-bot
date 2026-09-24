const {
    ChannelType
} = require("discord.js");


const snapshots =
    new Map();


function getGuild(
    guildId
) {

    if (
        !snapshots.has(
            guildId
        )
    ) {

        snapshots.set(
            guildId,
            new Map()
        );

    }

    return snapshots.get(
        guildId
    );

}


function serializeOverwrite(
    overwrite
) {

    return {
        id:
            overwrite.id,

        type:
            overwrite.type,

        allow:
            overwrite.allow.bitfield.toString(),

        deny:
            overwrite.deny.bitfield.toString()
    };

}


function snapshot(
    channel
) {

    if (
        !channel?.guild
    ) {
        return null;
    }

    const guildSnapshots =
        getGuild(
            channel.guild.id
        );

    const data = {

        id:
            channel.id,

        name:
            channel.name,

        type:
            channel.type,

        parentId:
            channel.parentId || null,

        position:
            channel.rawPosition,

        topic:
            "topic" in channel
                ? channel.topic
                : null,

        nsfw:
            "nsfw" in channel
                ? channel.nsfw
                : false,

        rateLimitPerUser:
            "rateLimitPerUser" in channel
                ? channel.rateLimitPerUser
                : 0,

        bitrate:
            "bitrate" in channel
                ? channel.bitrate
                : null,

        userLimit:
            "userLimit" in channel
                ? channel.userLimit
                : null,

        rtcRegion:
            "rtcRegion" in channel
                ? channel.rtcRegion
                : null,

        videoQualityMode:
            "videoQualityMode" in channel
                ? channel.videoQualityMode
                : null,

        permissionOverwrites:
            channel.permissionOverwrites
                ? Array.from(
                    channel.permissionOverwrites.cache.values()
                ).map(
                    serializeOverwrite
                )
                : []

    };

    guildSnapshots.set(
        channel.id,
        data
    );

    return data;

}


function get(
    guildId,
    channelId
) {

    const guildSnapshots =
        snapshots.get(
            guildId
        );

    if (!guildSnapshots) {
        return null;
    }

    return (
        guildSnapshots.get(
            channelId
        ) ||
        null
    );

}


function remove(
    guildId,
    channelId
) {

    const guildSnapshots =
        snapshots.get(
            guildId
        );

    if (!guildSnapshots) {
        return;
    }

    guildSnapshots.delete(
        channelId
    );

    if (
        guildSnapshots.size === 0
    ) {

        snapshots.delete(
            guildId
        );

    }

}


function clearGuild(
    guildId
) {

    snapshots.delete(
        guildId
    );

}


function clear() {

    snapshots.clear();

}


function isTextChannel(
    type
) {

    return (
        type === ChannelType.GuildText ||
        type === ChannelType.GuildAnnouncement
    );

}


function isVoiceChannel(
    type
) {

    return (
        type === ChannelType.GuildVoice ||
        type === ChannelType.GuildStageVoice
    );

}


function buildCreateOptions(
    snapshotData
) {

    if (!snapshotData) {
        return null;
    }

    const options = {

        name:
            snapshotData.name,

        type:
            snapshotData.type,

        position:
            snapshotData.position,

        reason:
            "AntiNuke channel recovery."

    };


    if (
        snapshotData.parentId
    ) {

        options.parent =
            snapshotData.parentId;

    }


    if (
        isTextChannel(
            snapshotData.type
        )
    ) {

        if (
            snapshotData.topic !== null
        ) {

            options.topic =
                snapshotData.topic;

        }

        options.nsfw =
            snapshotData.nsfw;

        options.rateLimitPerUser =
            snapshotData.rateLimitPerUser;

    }


    if (
        isVoiceChannel(
            snapshotData.type
        )
    ) {

        if (
            snapshotData.bitrate !== null
        ) {

            options.bitrate =
                snapshotData.bitrate;

        }

        if (
            snapshotData.userLimit !== null
        ) {

            options.userLimit =
                snapshotData.userLimit;

        }

        if (
            snapshotData.rtcRegion !== null
        ) {

            options.rtcRegion =
                snapshotData.rtcRegion;

        }

        if (
            snapshotData.videoQualityMode !== null
        ) {

            options.videoQualityMode =
                snapshotData.videoQualityMode;

        }

    }


    if (
        snapshotData.permissionOverwrites?.length
    ) {

        options.permissionOverwrites =
            snapshotData.permissionOverwrites.map(
                overwrite => ({

                    id:
                        overwrite.id,

                    type:
                        overwrite.type,

                    allow:
                        BigInt(
                            overwrite.allow
                        ),

                    deny:
                        BigInt(
                            overwrite.deny
                        )

                })
            );

    }


    return options;

}


async function recreate(
    guild,
    channelId
) {

    if (
        !guild ||
        !channelId
    ) {
        return null;
    }

    const data =
        get(
            guild.id,
            channelId
        );

    if (!data) {
        return null;
    }

    const existing =
        guild.channels.cache.get(
            channelId
        );

    if (existing) {
        return existing;
    }

    const options =
        buildCreateOptions(
            data
        );

    if (!options) {
        return null;
    }

    const channel =
        await guild.channels.create(
            options
        ).catch(
            error => {

                console.error(
                    "[ANTINUKE RECOVERY]",
                    error
                );

                return null;

            }
        );

    if (!channel) {
        return null;
    }

    return channel;

}


async function restore(
    channel,
    channelId = null
) {

    if (
        !channel &&
        !channelId
    ) {
        return null;
    }

    const guild =
        channel?.guild;

    if (!guild) {
        return null;
    }

    const id =
        channelId ||
        channel.id;

    const data =
        get(
            guild.id,
            id
        );

    if (!data) {
        return null;
    }

    const restored = [];

    if (
        channel.name !==
        data.name
    ) {

        await channel.setName(
            data.name,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored channel name"
        );

    }


    if (
        "topic" in channel &&
        channel.topic !== data.topic
    ) {

        await channel.setTopic(
            data.topic,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored channel topic"
        );

    }


    if (
        "nsfw" in channel &&
        channel.nsfw !== data.nsfw
    ) {

        await channel.setNSFW(
            data.nsfw,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored NSFW setting"
        );

    }


    if (
        "rateLimitPerUser" in channel &&
        channel.rateLimitPerUser !==
        data.rateLimitPerUser
    ) {

        await channel.setRateLimitPerUser(
            data.rateLimitPerUser,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored slowmode"
        );

    }


    if (
        "bitrate" in channel &&
        data.bitrate !== null &&
        channel.bitrate !== data.bitrate
    ) {

        await channel.setBitrate(
            data.bitrate,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored bitrate"
        );

    }


    if (
        "userLimit" in channel &&
        data.userLimit !== null &&
        channel.userLimit !== data.userLimit
    ) {

        await channel.setUserLimit(
            data.userLimit,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored user limit"
        );

    }


    if (
        "rtcRegion" in channel &&
        data.rtcRegion !== null &&
        channel.rtcRegion !== data.rtcRegion
    ) {

        await channel.setRTCRegion(
            data.rtcRegion,
            "AntiNuke channel recovery."
        ).catch(
            () => null
        );

        restored.push(
            "Restored RTC region"
        );

    }


    if (
        data.parentId &&
        channel.parentId !==
        data.parentId
    ) {

        await channel.setParent(
            data.parentId,
            {
                lockPermissions: false,
                reason:
                    "AntiNuke channel recovery."
            }
        ).catch(
            () => null
        );

        restored.push(
            "Restored channel category"
        );

    }


    const currentOverwrites =
        channel.permissionOverwrites?.cache;

    if (
        currentOverwrites &&
        data.permissionOverwrites
    ) {

        const desired =
            new Map(
                data.permissionOverwrites.map(
                    overwrite => [
                        overwrite.id,
                        overwrite
                    ]
                )
            );

        for (
            const overwrite
                of currentOverwrites.values()
        ) {

            if (
                !desired.has(
                    overwrite.id
                )
            ) {

                await channel.permissionOverwrites.delete(
                    overwrite.id,
                    "AntiNuke channel recovery."
                ).catch(
                    () => null
                );

                restored.push(
                    `Removed permission overwrite \`${overwrite.id}\``
                );

            }

        }


        for (
            const overwrite
                of desired.values()
        ) {

            const allow =
                BigInt(
                    overwrite.allow
                );

            const deny =
                BigInt(
                    overwrite.deny
                );

            await channel.permissionOverwrites.set(
                overwrite.id,
                {
                    allow,
                    deny
                },
                "AntiNuke channel recovery."
            ).catch(
                () => null
            );

        }

        if (
            desired.size
        ) {

            restored.push(
                "Restored permission overwrites"
            );

        }

    }


    if (
        Number.isInteger(
            data.position
        ) &&
        channel.rawPosition !==
        data.position
    ) {

        await channel.setPosition(
            data.position
        ).catch(
            () => null
        );

        restored.push(
            "Restored channel position"
        );

    }


    return restored;

}


module.exports = {
    snapshot,
    get,
    remove,
    clearGuild,
    clear,
    buildCreateOptions,
    recreate,
    restore
};
