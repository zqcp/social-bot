const {
    parseDuration
} = require("./parser");

const limits =
    require("./limits");


const defaults = {

    enabled: true,

    raid: {
        enabled: true,
        threshold: 5,
        window: 10 * 1000
    },

    age: {
        enabled: true,
        minimum: 7 * 24 * 60 * 60 * 1000
    },

    bots: {
        enabled: true
    },

    rejoin: {
        enabled: false,
        threshold: 3,
        window: 5 * 60 * 1000
    },

    username: {
        enabled: false,
        patterns: []
    },

    punishment: {
        raid: "kick",
        age: "strip",
        botadd: "ban",
        rejoin: "timeout",
        username: "log"
    },

    timeout: {
        rejoin: 10 * 60 * 1000
    },

    lockdown: {
        enabled: false,
        duration: 60 * 1000
    },

    logs: {
        channelId: null
    },

    protection: {
        duration: 60 * 1000,
        cooldown: 5 * 60 * 1000,
        maxActionsPerRaid: 20
    },

    whitelist: []

};


function createDefaults() {

    return JSON.parse(
        JSON.stringify(defaults)
    );
}


function normalize(config) {

    const result =
        createDefaults();

    if (!config) {
        return result;
    }

    result.enabled =
        config.enabled !== false;

    if (config.raid) {

        result.raid.enabled =
            config.raid.enabled !== false;

        if (
            Number.isInteger(
                config.raid.threshold
            )
        ) {
            result.raid.threshold =
                Math.min(
                    limits.raidThreshold.max,
                    Math.max(
                        limits.raidThreshold.min,
                        config.raid.threshold
                    )
                );
        }

        if (
            Number.isFinite(
                config.raid.window
            )
        ) {
            result.raid.window =
                Math.min(
                    limits.raidWindow.max,
                    Math.max(
                        limits.raidWindow.min,
                        config.raid.window
                    )
                );
        }
    }

    if (config.age) {

        result.age.enabled =
            config.age.enabled !== false;

        if (
            Number.isFinite(
                config.age.minimum
            )
        ) {
            result.age.minimum =
                Math.min(
                    limits.age.max,
                    Math.max(
                        limits.age.min,
                        config.age.minimum
                    )
                );
        }
    }

    if (config.bots) {
        result.bots.enabled =
            config.bots.enabled !== false;
    }

    if (config.rejoin) {

        result.rejoin.enabled =
            config.rejoin.enabled === true;

        if (
            Number.isInteger(
                config.rejoin.threshold
            )
        ) {
            result.rejoin.threshold =
                Math.min(
                    limits.rejoinThreshold.max,
                    Math.max(
                        limits.rejoinThreshold.min,
                        config.rejoin.threshold
                    )
                );
        }

        if (
            Number.isFinite(
                config.rejoin.window
            )
        ) {
            result.rejoin.window =
                Math.min(
                    limits.rejoinWindow.max,
                    Math.max(
                        limits.rejoinWindow.min,
                        config.rejoin.window
                    )
                );
        }
    }

    if (config.username) {

        result.username.enabled =
            config.username.enabled === true;

        if (
            Array.isArray(
                config.username.patterns
            )
        ) {
            result.username.patterns =
                config.username.patterns
                    .filter(
                        pattern =>
                            typeof pattern === "string" &&
                            pattern.trim().length > 0
                    )
                    .slice(0, 100);
        }
    }

    if (config.punishment) {

        const valid = [
            "log",
            "timeout",
            "kick",
            "ban",
            "strip"
        ];

        for (
            const module of [
                "raid",
                "age",
                "botadd",
                "rejoin",
                "username"
            ]
        ) {

            if (
                valid.includes(
                    config.punishment[module]
                )
            ) {
                result.punishment[module] =
                    config.punishment[module];
            }
        }
    }

    if (config.timeout) {

        if (
            Number.isFinite(
                config.timeout.rejoin
            )
        ) {
            result.timeout.rejoin =
                Math.min(
                    limits.protectionDuration.max,
                    Math.max(
                        limits.protectionDuration.min,
                        config.timeout.rejoin
                    )
                );
        }
    }

    if (config.lockdown) {

        result.lockdown.enabled =
            config.lockdown.enabled === true;

        if (
            Number.isFinite(
                config.lockdown.duration
            )
        ) {
            result.lockdown.duration =
                Math.min(
                    limits.protectionDuration.max,
                    Math.max(
                        limits.protectionDuration.min,
                        config.lockdown.duration
                    )
                );
        }
    }

    if (config.logs) {

        result.logs.channelId =
            config.logs.channelId || null;
    }

    if (config.protection) {

        if (
            Number.isFinite(
                config.protection.duration
            )
        ) {
            result.protection.duration =
                Math.min(
                    limits.protectionDuration.max,
                    Math.max(
                        limits.protectionDuration.min,
                        config.protection.duration
                    )
                );
        }

        if (
            Number.isFinite(
                config.protection.cooldown
            )
        ) {
            result.protection.cooldown =
                Math.min(
                    limits.cooldown.max,
                    Math.max(
                        limits.cooldown.min,
                        config.protection.cooldown
                    )
                );
        }

        if (
            Number.isInteger(
                config.protection.maxActionsPerRaid
            )
        ) {
            result.protection.maxActionsPerRaid =
                Math.min(
                    limits.maxActionsPerRaid.max,
                    Math.max(
                        limits.maxActionsPerRaid.min,
                        config.protection.maxActionsPerRaid
                    )
                );
        }
    }

    if (
        Array.isArray(
            config.whitelist
        )
    ) {
        result.whitelist =
            config.whitelist
                .filter(
                    id =>
                        typeof id === "string" &&
                        /^\d+$/.test(id)
                )
                .slice(0, 1000);
    }

    return result;
}


function parseSettingDuration(input) {

    return parseDuration(
        input
    );
}


module.exports = {
    defaults,
    createDefaults,
    normalize,
    parseSettingDuration
};
