const {
    PermissionFlagsBits
} = require("discord.js");

const Cooldown =
    require("./cooldown");

const Session =
    require("./session");


async function strip(
    member
) {

    const removable =
        member.roles.cache.filter(
            role =>
                role.id !== member.guild.id &&
                !role.managed &&
                role.position <
                    member.guild.members.me.roles.highest.position
        );

    if (!removable.size) {
        return true;
    }

    await member.roles.remove(
        removable,
        "AntiRaid protection."
    );

    return true;
}


async function execute(
    member,
    punishment,
    options = {}
) {

    if (
        !member ||
        !member.guild
    ) {
        return {
            success: false,
            reason: "Member unavailable."
        };
    }

    const guild =
        member.guild;

    const bot =
        guild.members.me;

    if (!bot) {

        console.error(
            `[ANTIRAID] Bot member unavailable in ${guild.id}.`
        );

        return {
            success: false,
            reason: "Bot member unavailable."
        };

    }

    if (
        member.id === guild.ownerId
    ) {

        return {
            success: false,
            reason: "Cannot punish the server owner."
        };

    }

    if (
        member.id === bot.id
    ) {

        return {
            success: false,
            reason: "Cannot punish the bot."
        };

    }

    if (
        bot.roles.highest.comparePositionTo(
            member.roles.highest
        ) <= 0
    ) {

        return {
            success: false,
            reason: "Member role is above the bot."
        };

    }

    if (
        punishment === "log"
    ) {

        return {
            success: true,
            action: "Logged"
        };

    }

    if (
        punishment === "timeout"
    ) {

        if (
            !bot.permissions.has(
                PermissionFlagsBits.ModerateMembers
            )
        ) {

            return {
                success: false,
                reason:
                    "Bot is missing ModerateMembers."
            };

        }

        const duration =
            options.duration ||
            10 * 60 * 1000;

        await member.timeout(
            duration,
            options.reason ||
                "AntiRaid protection."
        );

        return {
            success: true,
            action: "Timed out"
        };

    }

    if (
        punishment === "kick"
    ) {

        if (
            !bot.permissions.has(
                PermissionFlagsBits.KickMembers
            )
        ) {

            return {
                success: false,
                reason:
                    "Bot is missing KickMembers."
            };

        }

        await member.kick(
            options.reason ||
                "AntiRaid protection."
        );

        return {
            success: true,
            action: "Kicked"
        };

    }

    if (
        punishment === "ban"
    ) {

        if (
            !bot.permissions.has(
                PermissionFlagsBits.BanMembers
            )
        ) {

            return {
                success: false,
                reason:
                    "Bot is missing BanMembers."
            };

        }

        await member.ban({
            reason:
                options.reason ||
                "AntiRaid protection."
        });

        return {
            success: true,
            action: "Banned"
        };

    }

    if (
        punishment === "strip"
    ) {

        if (
            !bot.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {

            return {
                success: false,
                reason:
                    "Bot is missing ManageRoles."
            };

        }

        await strip(
            member
        );

        return {
            success: true,
            action: "Roles stripped"
        };

    }

    return {
        success: false,
        reason:
            `Unknown punishment: ${punishment}`
    };

}


async function punish(
    member,
    module,
    punishment,
    options = {}
) {

    if (
        !member ||
        !member.guild
    ) {
        return {
            success: false,
            reason: "Member unavailable."
        };
    }

    const config =
        options.config;

    if (
        config &&
        options.cooldown !== false
    ) {

        if (
            Cooldown.isCoolingDown(
                member.guild.id,
                member.id,
                module
            )
        ) {

            return {
                success: false,
                skipped: true,
                reason: "Member is on cooldown."
            };

        }

        Cooldown.set(
            member.guild.id,
            member.id,
            module,
            config.protection.cooldown
        );

    }

    if (
        module === "raid" &&
        config &&
        !Session.canAct(
            member.guild.id,
            config
        )
    ) {

        return {
            success: false,
            skipped: true,
            reason:
                "Raid action limit reached."
        };

    }

    const result =
        await execute(
            member,
            punishment,
            options
        );

    if (
        result.success &&
        module === "raid"
    ) {

        Session.action(
            member.guild.id
        );

    }

    return result;
}


module.exports = {
    execute,
    punish
};
