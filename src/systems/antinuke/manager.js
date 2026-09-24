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
    target,
    event = {}
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
        {
            module,
            user:
                member.user,

            actions:
                result.userActions ||
                result.actions ||
                0,

            threshold:
                result.threshold,

            punishment:
                result.punishment,

            result:
                punished
                    ? "Punishment applied successfully."
                    : "Failed to apply punishment.",

            action:
                event.action ||
                module,

            detectedActions:
                event.actions ||
                [],

            target:
                event.target ||
                target,

            auditEntry:
                event.auditEntry ||
                null
        }
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
