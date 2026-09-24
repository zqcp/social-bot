const config =
    require("./config");

async function configure(
    guildId,
    args
) {

    const parsed =
        config.parse(args);

    if (parsed.error) {
        return parsed;
    }

    const result =
        await config.update(
            guildId,
            parsed
        );

    if (!result) {

        return {
            error: "module",
            module: parsed.module
        };

    }

    return {
        success: true,
        module: parsed.module,
        status: parsed.status,
        threshold:
            result.modules[
                parsed.module
            ].threshold,
        punishment:
            result.modules[
                parsed.module
            ].punishment
    };

}

async function get(
    guildId
) {

    return config.get(
        guildId
    );

}

module.exports = {
    configure,
    get
};
