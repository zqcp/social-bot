function isWhitelisted(
    config,
    userId
) {

    if (!config) {
        return false;
    }

    if (
        config.admins &&
        config.admins.includes(
            userId
        )
    ) {
        return true;
    }

    if (
        config.whitelist &&
        config.whitelist.includes(
            userId
        )
    ) {
        return true;
    }

    return false;

}

function isBotWhitelisted(
    config,
    user
) {

    if (
        !config ||
        !user
    ) {
        return false;
    }

    if (
        !user.bot
    ) {
        return false;
    }

    return (
        config.whitelistBots === true
    );

}

function bypass(
    config,
    user
) {

    if (
        !config ||
        !user
    ) {
        return true;
    }

    if (
        isWhitelisted(
            config,
            user.id
        )
    ) {
        return true;
    }

    if (
        isBotWhitelisted(
            config,
            user
        )
    ) {
        return true;
    }

    return false;

}

module.exports = {
    isWhitelisted,
    isBotWhitelisted,
    bypass
};
