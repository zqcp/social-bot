const cooldowns =
    new Map();

function getKey(
    guildId,
    userId,
    module
) {

    return `${guildId}:${userId}:${module}`;

}

function active(
    guildId,
    userId,
    module
) {

    const key =
        getKey(
            guildId,
            userId,
            module
        );

    const expires =
        cooldowns.get(
            key
        );

    if (!expires) {
        return false;
    }

    if (
        expires <=
        Date.now()
    ) {

        cooldowns.delete(
            key
        );

        return false;

    }

    return true;

}

function set(
    guildId,
    userId,
    module,
    duration
) {

    cooldowns.set(
        getKey(
            guildId,
            userId,
            module
        ),
        Date.now() +
        duration
    );

}

function clear(
    guildId,
    userId,
    module
) {

    cooldowns.delete(
        getKey(
            guildId,
            userId,
            module
        )
    );

}

function clearGuild(
    guildId
) {

    const prefix =
        `${guildId}:`;

    for (
        const key of cooldowns.keys()
    ) {

        if (
            key.startsWith(
                prefix
            )
        ) {

            cooldowns.delete(
                key
            );

        }

    }

}

module.exports = {
    active,
    set,
    clear,
    clearGuild
};
