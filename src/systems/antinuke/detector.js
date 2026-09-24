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

    if (!antiNuke) {
        return null;
    }

    return antiNuke.modules?.[
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
        !config.isModule(
            module
        )
    ) {

        return {
            allowed: true
        };

    }

    if (!user) {

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

    const window =
        antiNuke.protection?.duration ||
        60 * 1000;

    state.addAction(
        antiNuke.guildId,
        module,
        user.id
    );

    const active =
        state.cleanup(
            antiNuke.guildId,
            module,
            window
        );

    const userActions =
        active.filter(
            action =>
                action.userId ===
                user.id
        );

    const triggered =
        userActions.length >=
        moduleConfig.threshold;

    return {
        allowed:
            !triggered,

        triggered,

        module,

        threshold:
            moduleConfig.threshold,

        punishment:
            moduleConfig.punishment,

        actions:
            active.length,

        userActions:
            userActions.length
    };

}


module.exports = {
    check
};
