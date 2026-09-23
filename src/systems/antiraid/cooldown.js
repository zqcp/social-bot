const State =
    require("./state");


function isCoolingDown(
    guildId,
    userId,
    module
) {

    const state =
        State.getGuild(
            guildId
        );

    const key =
        `${module}:${userId}`;

    const expires =
        state.cooldowns.get(
            key
        );

    if (!expires) {
        return false;
    }

    if (
        Date.now() >= expires
    ) {

        state.cooldowns.delete(
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

    const state =
        State.getGuild(
            guildId
        );

    state.cooldowns.set(
        `${module}:${userId}`,
        Date.now() + duration
    );

}


function clear(
    guildId,
    userId,
    module
) {

    const state =
        State.getGuild(
            guildId
        );

    state.cooldowns.delete(
        `${module}:${userId}`
    );

}


module.exports = {
    isCoolingDown,
    set,
    clear
};
