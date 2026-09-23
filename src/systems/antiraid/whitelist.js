const AntiRaidConfig =
    require("../../models/AntiRaid");


async function getConfig(
    guildId
) {

    return AntiRaidConfig.findOne({
        guildId
    });

}


async function isWhitelisted(
    guildId,
    userId
) {

    const config =
        await getConfig(
            guildId
        );

    if (!config) {
        return false;
    }

    return Array.isArray(
        config.whitelist
    ) &&
        config.whitelist.includes(
            userId
        );

}


async function add(
    guildId,
    userId
) {

    return AntiRaidConfig.findOneAndUpdate(
        {
            guildId
        },
        {
            $addToSet: {
                whitelist: userId
            }
        },
        {
            new: true,
            upsert: true
        }
    );

}


async function remove(
    guildId,
    userId
) {

    return AntiRaidConfig.findOneAndUpdate(
        {
            guildId
        },
        {
            $pull: {
                whitelist: userId
            }
        },
        {
            new: true
        }
    );

}


async function list(
    guildId
) {

    const config =
        await getConfig(
            guildId
        );

    return config?.whitelist || [];
}


module.exports = {
    isWhitelisted,
    add,
    remove,
    list
};
