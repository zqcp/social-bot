const {
    PermissionFlagsBits
} = require("discord.js");

async function ban(
    member,
    reason
) {

    if (!member) {
        return false;
    }

    if (
        !member.bannable
    ) {
        return false;
    }

    await member.ban({
        reason
    });

    return true;

}

async function kick(
    member,
    reason
) {

    if (!member) {
        return false;
    }

    if (
        !member.kickable
    ) {
        return false;
    }

    await member.kick(
        reason
    );

    return true;

}

async function strip(
    member,
    reason
) {

    if (!member) {
        return false;
    }

    const botMember =
        member.guild.members.me;

    if (!botMember) {
        return false;
    }

    if (
        !botMember.permissions.has(
            PermissionFlagsBits.ManageRoles
        )
    ) {
        return false;
    }

    const removable =
        member.roles.cache.filter(
            role =>
                role.id !==
                    member.guild.id &&
                !role.managed &&
                role.position <
                    botMember.roles.highest.position
        );

    if (!removable.size) {
        return true;
    }

    await member.roles.remove(
        removable,
        reason
    );

    return true;

}

async function execute(
    member,
    punishment,
    reason
) {

    switch (
        punishment
    ) {

        case "ban":
            return ban(
                member,
                reason
            );

        case "kick":
            return kick(
                member,
                reason
            );

        case "strip":
            return strip(
                member,
                reason
            );

        default:
            return false;

    }

}

module.exports = {
    ban,
    kick,
    strip,
    execute
};
