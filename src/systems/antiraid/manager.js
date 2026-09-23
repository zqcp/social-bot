const AntiRaidConfig =
    require("../../models/AntiRaid");

const Detector =
    require("./detector");

const Session =
    require("./session");

const Actions =
    require("./actions");

const Whitelist =
    require("./whitelist");

const Logger =
    require("./logger");


const cache =
    new Map();


async function getConfig(
    guildId
) {

    if (
        cache.has(guildId)
    ) {
        return cache.get(
            guildId
        );
    }

    const document =
        await AntiRaidConfig.findOne({
            guildId
        }).lean();

    if (!document) {
        return null;
    }

    cache.set(
        guildId,
        document
    );

    return document;

}


function clearCache(
    guildId
) {

    cache.delete(
        guildId
    );

}


async function handleMemberJoin(
    member
) {

    if (
        !member ||
        !member.guild
    ) {
        return;
    }

    if (
        member.user.bot
    ) {
        return;
    }

    const config =
        await getConfig(
            member.guild.id
        );

    if (
        !config ||
        config.enabled === false
    ) {
        return;
    }

    if (
        await Whitelist.isWhitelisted(
            member.guild.id,
            member.id
        )
    ) {
        return;
    }

    const logger =
        new Logger(
            member.guild
        );

    const raid =
        Detector.isRaid(
            member,
            config
        );

    if (raid) {

        const started =
            Session.start(
                member.guild,
                config,
                logger
            );

        if (started) {

            const state =
                Session.get(
                    member.guild.id
                );

            await logger.raidDetected(
                Detector.recordJoin
                    ? state.actions + config.raid.threshold
                    : config.raid.threshold,
                config.raid.threshold,
                config.raid.window
            );

            if (
                config.lockdown?.enabled
            ) {

                await enableLockdown(
                    member.guild,
                    config,
                    logger
                );

            }

        }

    }

    if (
        config.raid?.enabled &&
        Session.isActive(
            member.guild.id
        )
    ) {

        await evaluate(
            member,
            "raid",
            config.punishment?.raid ||
                "kick",
            config,
            logger,
            "Raid detected."
        );

    }

    const age =
        Detector.accountAge(
            member,
            config
        );

    if (age) {

        await evaluate(
            member,
            "age",
            config.punishment?.age ||
                "strip",
            config,
            logger,
            "Account is below the configured minimum age.",
            {
                age,
                required:
                    age.required
            }
        );

    }

    const username =
        Detector.username(
            member,
            config
        );

    if (username) {

        await evaluate(
            member,
            "username",
            config.punishment?.username ||
                "log",
            config,
            logger,
            `Username matched configured pattern: ${username.pattern}.`
        );

    }

}


async function evaluate(
    member,
    module,
    punishment,
    config,
    logger,
    reason,
    data = {}
) {

    const result =
        await Actions.punish(
            member,
            module,
            punishment,
            {
                config,
                reason,
                duration:
                    module === "rejoin"
                        ? config.timeout?.rejoin
                        : undefined
            }
        );

    if (
        result.skipped
    ) {
        return result;
    }

    if (
        data.age !== undefined
    ) {

        await logger.ageAction(
            member,
            result.action ||
                punishment,
            data.age,
            data.required
        );

        return result;

    }

    await logger.memberAction(
        module === "raid"
            ? "Member kicked"
            : "Member action",
        member,
        result.action ||
            punishment,
        reason
    );

    return result;

}


async function handleMemberRemove(
    member
) {

    if (
        !member ||
        !member.guild
    ) {
        return;
    }

    const config =
        await getConfig(
            member.guild.id
        );

    if (
        !config ||
        config.enabled === false
    ) {
        return;
    }

    Detector.recordRejoin(
        member,
        config
    );

}


async function handleRejoin(
    member
) {

    if (
        !member ||
        !member.guild
    ) {
        return;
    }

    const config =
        await getConfig(
            member.guild.id
        );

    if (
        !config ||
        config.enabled === false ||
        !config.rejoin?.enabled
    ) {
        return;
    }

    if (
        await Whitelist.isWhitelisted(
            member.guild.id,
            member.id
        )
    ) {
        return;
    }

    const detection =
        Detector.recordRejoin(
            member,
            config
        );

    if (!detection) {
        return;
    }

    const logger =
        new Logger(
            member.guild
        );

    const punishment =
        config.punishment?.rejoin ||
        "timeout";

    const result =
        await evaluate(
            member,
            "rejoin",
            punishment,
            config,
            logger,
            `Repeated rejoin activity detected: ${detection.count} joins within ${require("./parser").formatDuration(config.rejoin.window)}.`,
            detection
        );

    await logger.rejoinDetected(
        member,
        detection.count,
        detection.threshold,
        config.rejoin.window,
        result.action ||
            punishment
    );

}


async function handleBotAdd(
    member
) {

    if (
        !member ||
        !member.guild ||
        !member.user?.bot
    ) {
        return;
    }

    const config =
        await getConfig(
            member.guild.id
        );

    if (
        !config ||
        config.enabled === false ||
        !config.bots?.enabled
    ) {
        return;
    }

    if (
        await Whitelist.isWhitelisted(
            member.guild.id,
            member.id
        )
    ) {
        return;
    }

    const logger =
        new Logger(
            member.guild
        );

    const Audit =
        require("./audit");

    const executor =
        await Audit.findBotAddExecutor(
            member.guild,
            member.id
        );

    if (!executor) {

        await logger.botDetected(
            member,
            null,
            "Logged"
        );

        return;

    }

    if (
        await Whitelist.isWhitelisted(
            member.guild.id,
            executor.id
        )
    ) {
        return;
    }

    const punishment =
        config.punishment?.botadd ||
        "ban";

    const result =
        await Actions.punish(
            member,
            "botadd",
            punishment,
            {
                config,
                reason:
                    "Unauthorized bot addition."
            }
        );

    await logger.botDetected(
        member,
        executor,
        result.action ||
            punishment
    );

}


async function enableLockdown(
    guild,
    config,
    logger
) {

    const state =
        require("./state").getGuild(
            guild.id
        );

    if (
        state.lockdowns.has(
            "raid"
        )
    ) {
        return;
    }

    const everyone =
        guild.roles.everyone;

    const channels =
        guild.channels.cache.filter(
            channel =>
                channel.isTextBased() &&
                channel.permissionOverwrites
        );

    const changed =
        [];

    for (
        const channel
        of channels.values()
    ) {

        const overwrite =
            channel.permissionOverwrites.cache.get(
                everyone.id
            );

        if (
            overwrite?.deny.has(
                "SendMessages"
            )
        ) {
            continue;
        }

        await channel.permissionOverwrites.edit(
            everyone,
            {
                SendMessages: false
            },
            {
                reason:
                    "AntiRaid lockdown."
            }
        ).then(
            () => changed.push(channel.id)
        ).catch(
            () => {}
        );

    }

    state.lockdowns.set(
        "raid",
        {
            channels: changed
        }
    );

    await logger.lockdown(
        `Raid detected: ${config.raid.threshold} joins / ${require("./parser").formatDuration(config.raid.window)}.`,
        config.lockdown.duration
    );

    setTimeout(
        async () => {

            await disableLockdown(
                guild
            );

        },
        config.lockdown.duration
    );

}


async function disableLockdown(
    guild
) {

    const state =
        require("./state").getGuild(
            guild.id
        );

    const lockdown =
        state.lockdowns.get(
            "raid"
        );

    if (!lockdown) {
        return;
    }

    const everyone =
        guild.roles.everyone;

    for (
        const channelId
        of lockdown.channels
    ) {

        const channel =
            guild.channels.cache.get(
                channelId
            );

        if (!channel) {
            continue;
        }

        await channel.permissionOverwrites.edit(
            everyone,
            {
                SendMessages: null
            },
            {
                reason:
                    "AntiRaid lockdown ended."
            }
        ).catch(
            () => {}
        );

    }

    state.lockdowns.delete(
        "raid"
    );

}


async function reset(
    guildId
) {

    const state =
        require("./state").getGuild(
            guildId
        );

    if (state.raid.timer) {

        clearTimeout(
            state.raid.timer
        );

    }

    state.joins = [];
    state.rejoins.clear();
    state.cooldowns.clear();
    state.actions.clear();

    Session.end(
        guildId
    );

    clearCache(
        guildId
    );

}


module.exports = {
    getConfig,
    clearCache,
    handleMemberJoin,
    handleMemberRemove,
    handleRejoin,
    handleBotAdd,
    enableLockdown,
    disableLockdown,
    reset
};
