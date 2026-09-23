const guilds = new Map();


function getGuild(guildId) {

    if (!guilds.has(guildId)) {

        guilds.set(
            guildId,
            {
                joins: [],
                rejoins: new Map(),
                raid: {
                    active: false,
                    startedAt: null,
                    endsAt: null,
                    actions: 0,
                    timer: null
                },
                cooldowns: new Map(),
                actions: new Map(),
                lockdowns: new Map()
            }
        );

    }

    return guilds.get(
        guildId
    );
}


function resetGuild(guildId) {

    const state =
        guilds.get(guildId);

    if (!state) {
        return;
    }

    if (state.raid.timer) {

        clearTimeout(
            state.raid.timer
        );

    }

    guilds.delete(
        guildId
    );
}


function resetAll() {

    for (
        const [guildId, state]
        of guilds
    ) {

        if (state.raid.timer) {

            clearTimeout(
                state.raid.timer
            );

        }

        guilds.delete(
            guildId
        );

    }

}


module.exports = {
    getGuild,
    resetGuild,
    resetAll
};
