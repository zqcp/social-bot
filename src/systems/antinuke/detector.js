const config =
    require("./config");

const state =
    require("./state");

const whitelist =
    require("./whitelist");

function getModule(
    antiNuke,
    module
) {

    return antiNuke?.modules?.[
        module
    ] || null;

}

function check(
    antiNuke,
    module,
    user
) {

    if (!antiNuke) {
        return {
            allowed: true
        };
    }

    if (
        antiNuke.enabled !== true
    ) {

        return {
            allowed: true
        };

    }

    if (
        !config.isModule(module)
    ) {

        return {
            allowed: true
        };

    }

    if (
        whitelist.bypass(
            antiNuke,
            user
        )
    ) {

        return {
            allowed: true
        };

    }

    const moduleConfig =
        getModule(
            antiNuke,
            module
        );

    if (
        !moduleConfig ||
        moduleConfig.enabled !== true
    ) {

        return {
            allowed: true
        };

    }

    const actions =
        state.addAction(
            antiNuke.guildId,
            module,
            user.id
        );

    const active =
        state.cleanup(
            antiNuke.guildId,
            module,
            60 * 1000
        );

    const userActions =
        active.filter(
            action =>
                action.userId === user.id
        );

    return {
        allowed:
            userActions.length <
            moduleConfig.threshold,

        triggered:
            userActions.length >=
            moduleConfig.threshold,

        module,
        threshold:
            moduleConfig.threshold,

        punishment:
            moduleConfig.punishment,

        actions: active.length
    };

}

module.exports = {
    check
};
