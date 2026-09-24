const AntiNuke =
    require("../../models/AntiNuke");

const MODULES = [
    "ban",
    "kick",
    "channel",
    "role",
    "emoji",
    "botadd",
    "webhook",
    "vanity",
    "permissions"
];

const PUNISHMENTS = [
    "ban",
    "kick",
    "strip"
];

async function get(
    guildId
) {

    let config =
        await AntiNuke.findOne({
            guildId
        });

    if (!config) {

        config =
            await AntiNuke.create({
                guildId
            });

    }

    return config;

}

function isModule(
    module
) {

    return MODULES.includes(
        module
    );

}

function isPunishment(
    punishment
) {

    return PUNISHMENTS.includes(
        punishment
    );

}

function parse(
    args
) {

    const module =
        args[0]?.toLowerCase();

    const status =
        args[1]?.toLowerCase();

    if (!isModule(module)) {
        return {
            error: "module"
        };
    }

    if (
        status !== "on" &&
        status !== "off"
    ) {
        return {
            error: "status",
            module
        };
    }

    let threshold = null;
    let punishment = null;

    for (
        let i = 2;
        i < args.length;
        i++
    ) {

        const argument =
            args[i]?.toLowerCase();

        if (
            argument ===
            "--threshold"
        ) {

            const value =
                Number(args[i + 1]);

            if (
                !Number.isInteger(value) ||
                value < 1 ||
                value > 20
            ) {

                return {
                    error: "threshold",
                    module
                };

            }

            threshold =
                value;

            i++;

            continue;

        }

        if (
            argument ===
            "--do"
        ) {

            const value =
                args[i + 1]?.toLowerCase();

            if (
                !isPunishment(value)
            ) {

                return {
                    error: "punishment",
                    module
                };

            }

            punishment =
                value;

            i++;

            continue;

        }

        return {
            error: "argument",
            module
        };

    }

    return {
        module,
        status,
        threshold,
        punishment
    };

}

async function update(
    guildId,
    data
) {

    const config =
        await get(guildId);

    const module =
        config.modules[
            data.module
        ];

    if (!module) {
        return null;
    }

    module.enabled =
        data.status === "on";

    if (
        data.threshold !== null
    ) {

        module.threshold =
            data.threshold;

    }

    if (
        data.punishment !== null
    ) {

        module.punishment =
            data.punishment;

    }

    await config.save();

    return config;

}

module.exports = {
    MODULES,
    PUNISHMENTS,
    get,
    isModule,
    isPunishment,
    parse,
    update
};
