const state =
    require("./state");

function record(
    guildId,
    module,
    userId,
    window
) {

    state.addAction(
        guildId,
        module,
        userId
    );

    return state.cleanup(
        guildId,
        module,
        window
    );

}

function count(
    guildId,
    module,
    window,
    userId = null
) {

    const actions =
        state.cleanup(
            guildId,
            module,
            window
        );

    if (!userId) {
        return actions.length;
    }

    return actions.filter(
        action =>
            action.userId ===
            userId
    ).length;

}

function exceeded(
    guildId,
    module,
    threshold,
    window,
    userId
) {

    return count(
        guildId,
        module,
        window,
        userId
    ) >= threshold;

}

module.exports = {
    record,
    count,
    exceeded
};
