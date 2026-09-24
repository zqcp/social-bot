const states =
    new Map();

function get(
    guildId
) {

    if (
        !states.has(
            guildId
        )
    ) {

        states.set(
            guildId,
            {
                actions: new Map(),

                raidActions: 0,

                lockdown: false,

                lockdownTimer: null
            }
        );

    }

    return states.get(
        guildId
    );

}

function getModule(
    guildId,
    module
) {

    const state =
        get(
            guildId
        );

    if (
        !state.actions.has(
            module
        )
    ) {

        state.actions.set(
            module,
            []
        );

    }

    return state.actions.get(
        module
    );

}

function addAction(
    guildId,
    module,
    userId
) {

    const actions =
        getModule(
            guildId,
            module
        );

    actions.push({
        userId,

        timestamp:
            Date.now()
    });

    return actions;

}

function cleanup(
    guildId,
    module,
    window
) {

    const actions =
        getModule(
            guildId,
            module
        );

    const cutoff =
        Date.now() -
        window;

    const active =
        actions.filter(
            action =>
                action.timestamp >=
                cutoff
        );

    const state =
        get(
            guildId
        );

    state.actions.set(
        module,
        active
    );

    return active;

}

function incrementRaid(
    guildId
) {

    const state =
        get(
            guildId
        );

    state.raidActions++;

    return state.raidActions;

}

function resetRaid(
    guildId
) {

    const state =
        get(
            guildId
        );

    state.raidActions = 0;

}

function setLockdown(
    guildId,
    value
) {

    const state =
        get(
            guildId
        );

    state.lockdown =
        value;

}

function isLocked(
    guildId
) {

    return get(
        guildId
    ).lockdown;

}

function clear(
    guildId
) {

    const state =
        states.get(
            guildId
        );

    if (!state) {
        return;
    }

    if (
        state.lockdownTimer
    ) {

        clearTimeout(
            state.lockdownTimer
        );

    }

    states.delete(
        guildId
    );

}

module.exports = {
    get,
    getModule,
    addAction,
    cleanup,
    incrementRaid,
    resetRaid,
    setLockdown,
    isLocked,
    clear
};
