const {
    AuditLogEvent
} = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("./manager");

const audit =
    require("./audit");


async function handle(
    guild,
    module,
    auditType,
    targetId
) {

    if (!guild) {
        return;
    }

    const result =
        await audit.findExecutor(
            guild,
            auditType,
            targetId
        );

    if (!result) {
        return;
    }

    const executor =
        result.executor;

    if (!executor) {
        return;
    }

    const member =
        await guild.members.fetch(
            executor.id
        ).catch(
            () => null
        );

    if (!member) {
        return;
    }

    const target =
        targetId
            ? await guild.members.fetch(
                targetId
            ).catch(
                () => null
            )
            : null;

    await manager.handle(
        guild,
        module,
        member,
        target
    );

}


async function handleBan(
    guild,
    targetId
) {

    return handle(
        guild,
        "ban",
        AuditLogEvent.MemberBanAdd,
        targetId
    );

}


async function handleKick(
    guild,
    targetId
) {

    return handle(
        guild,
        "kick",
        AuditLogEvent.MemberKick,
        targetId
    );

}


async function handleChannel(
    guild,
    targetId
) {

    return handle(
        guild,
        "channel",
        AuditLogEvent.ChannelDelete,
        targetId
    );

}


async function handleRole(
    guild,
    targetId
) {

    return handle(
        guild,
        "role",
        AuditLogEvent.RoleDelete,
        targetId
    );

}


async function handleEmoji(
    guild,
    targetId
) {

    return handle(
        guild,
        "emoji",
        AuditLogEvent.EmojiDelete,
        targetId
    );

}


async function handleBotAdd(
    guild,
    targetId
) {

    return handle(
        guild,
        "botadd",
        AuditLogEvent.BotAdd,
        targetId
    );

}


async function handleWebhook(
    guild,
    targetId
) {

    return handle(
        guild,
        "webhook",
        AuditLogEvent.WebhookDelete,
        targetId
    );

}


module.exports = {
    handle,
    handleBan,
    handleKick,
    handleChannel,
    handleRole,
    handleEmoji,
    handleBotAdd,
    handleWebhook
};
