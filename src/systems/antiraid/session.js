const State =
    require("./state");


function isActive(
    guildId
) {

    const state =
        State.getGuild(
            guildId
        );

    return state.raid.active;
}


function get(
    guildId
) {

    return State.getGuild(
        guildId
    ).raid;
}


function start(
    guild,
    config,
    logger
) {

    const state =
        State.getGuild(
            guild.id
        );

    if (
        state.raid.active
    ) {
        return false;
    }

    const now =
        Date.now();

    state.raid.active = true;
    state.raid.startedAt = now;
    state.raid.endsAt =
        now +
        config.protection.duration;
    state.raid.actions = 0;

    if (state.raid.timer) {

        clearTimeout(
            state.raid.timer
        );

    }

    state.raid.timer =
        setTimeout(
            async () => {

                state.raid.active = false;
                state.raid.startedAt = null;
                state.raid.endsAt = null;
                state.raid.actions = 0;
                state.raid.timer = null;

                if (logger) {

                    await logger.raidEnded(
                        guild
                    ).catch(
                        () => {}
                    );

                }

            },
            config.protection.duration
        );

    return true;
}


function canAct(
    guildId,
    config
) {

    const state =
        State.getGuild(
            guildId
        );

    if (
        !state.raid.active
    ) {
        return false;
    }

    return state.raid.actions <
        config.protection.maxActionsPerRaid;
}


function action(
    guildId
) {

    const state =
        State.getGuild(
            guildId
        );

    state.raid.actions++;
}


function end(
    guildId
) {

    const state =
        State.getGuild(
            guildId
        );

    if (state.raid.timer) {

        clearTimeout(
            state.raid.timer
        );

    }

    state.raid.active = false;
    state.raid.startedAt = null;
    state.raid.endsAt = null;
    state.raid.actions = 0;
    state.raid.timer = null;

}


module.exports = {
    isActive,
    get,
    start,
    canAct,
    action,
    end
};
