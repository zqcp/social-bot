const config =
    require("./config");

const detector =
    require("./detector");

const actions =
    require("./actions");

const logger =
    require("./logger");


async function configure(
    guildId,
    args
) {

    const parsed =
        config.parse(
            args
        );

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

            module:
                parsed.module
        };

    }

    const module =
        result.modules[
            parsed.module
        ];

    return {
        success: true,

        module:
            parsed.module,

        status:
            parsed.status,

        threshold:
            module.threshold,

        punishment:
            module.punishment
    };

}


async function get(
    guildId
) {

    return config.get(
        guildId
    );

}


async function handle(
    guild,
    module,
    member,
    target
) {

    if (
        !guild ||
        !member
    ) {
        return;
    }

    const antiNuke =
        await get(
            guild.id
        );

    if (!antiNuke) {
        return;
    }

    const result =
        detector.check(
            antiNuke,
            module,
            member.user
        );

    if (
        result.allowed
    ) {
        return result;
    }

    if (
        !result.triggered
    ) {
        return result;
    }

    if (!target) {
        return result;
    }

    const reason =
        `AntiNuke: ${module} threshold exceeded.`;

    const punished =
        await actions.execute(
            target,
            result.punishment,
            reason
        ).catch(
            error => {

                console.error(
                    "[ANTINUKE ACTION]",
                    error
                );

                return false;

            }
        );

    await logger.send(
        guild,
        punished
            ? `${member}: AntiNuke triggered **${module}** protection. Punishment: **${result.punishment}**.`
            : `${member}: AntiNuke detected **${module}** activity but failed to apply **${result.punishment}**.`
    );

    return {
        ...result,

        punished
    };

}


module.exports = {
    configure,
    get,
    handle
};
