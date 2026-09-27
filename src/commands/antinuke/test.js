const {
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const banLogs =
    require("../../systems/antinuke/logs/ban");

const kickLogs =
    require("../../systems/antinuke/logs/kick");

const channelLogs =
    require("../../systems/antinuke/logs/channel");

const roleLogs =
    require("../../systems/antinuke/logs/role");

const emojiLogs =
    require("../../systems/antinuke/logs/emoji");

const botaddLogs =
    require("../../systems/antinuke/logs/botadd");

const webhookLogs =
    require("../../systems/antinuke/logs/webhook");

const vanityLogs =
    require("../../systems/antinuke/logs/vanity");

const permissionsLogs =
    require("../../systems/antinuke/logs/permissions");


module.exports = {

    name:
        "antinuke test",

    aliases: [],

    permissions: [
        PermissionFlagsBits.Administrator
    ],

    async execute(
        client,
        message
    ) {

        if (
            !message.guild
        ) {
            return;
        }


        const user =
            message.author;


        const tests = [];


        // =========================
        // BAN
        // =========================

        tests.push(
            banLogs.event(
                user,
                "created",
                user,
                [
                    "Ban action detected"
                ],
                "The ban event was recorded.",
                "TEST-BAN-EVENT"
            )
        );

        tests.push(
            banLogs.triggered(
                user,
                3,
                3,
                [
                    "Banned member",
                    "Banned member",
                    "Banned member"
                ],
                "ban",
                "The user was punished.",
                user
            )
        );

        tests.push(
            banLogs.recovery(
                user,
                [
                    user
                ],
                [
                    "Restored affected ban changes"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            banLogs.failed(
                user,
                user,
                [
                    "Failed to restore ban changes"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // KICK
        // =========================

        tests.push(
            kickLogs.event(
                user,
                "created",
                user,
                [
                    "Kick action detected"
                ],
                "The kick event was recorded.",
                "TEST-KICK-EVENT"
            )
        );

        tests.push(
            kickLogs.triggered(
                user,
                3,
                3,
                [
                    "Kicked member",
                    "Kicked member",
                    "Kicked member"
                ],
                "kick",
                "The user was punished.",
                user
            )
        );

        tests.push(
            kickLogs.recovery(
                user,
                [
                    user
                ],
                [
                    "Restored affected kick changes"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            kickLogs.failed(
                user,
                user,
                [
                    "Failed to restore kick changes"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // CHANNEL
        // =========================

        tests.push(
            channelLogs.event(
                user,
                "updated",
                message.channel,
                [
                    "Changed the channel settings",
                    "Updated channel permissions"
                ],
                "The channel was updated.",
                "TEST-CHANNEL-EVENT"
            )
        );

        tests.push(
            channelLogs.triggered(
                user,
                5,
                3,
                [
                    "Deleted #general",
                    "Deleted #staff",
                    "Created #spam",
                    "Updated #logs",
                    "Deleted #rules"
                ],
                "ban",
                "The user was punished.",
                message.channel
            )
        );

        tests.push(
            channelLogs.recovery(
                user,
                [
                    message.channel,
                    {
                        name: "staff",
                        id: "123456789012345678"
                    }
                ],
                [
                    "Recreated deleted channels",
                    "Restored channel permissions"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            channelLogs.failed(
                user,
                message.channel,
                [
                    "Failed to recreate the channel",
                    "Failed to restore channel permissions"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // ROLE
        // =========================

        tests.push(
            roleLogs.event(
                user,
                "updated",
                "@Moderator",
                [
                    "Changed dangerous permissions",
                    "Updated role permissions"
                ],
                "The role was updated.",
                "TEST-ROLE-EVENT"
            )
        );

        tests.push(
            roleLogs.triggered(
                user,
                4,
                3,
                [
                    "Updated @Moderator",
                    "Updated @Staff",
                    "Removed permissions from @Admin",
                    "Added dangerous permissions"
                ],
                "strip",
                "The user was punished.",
                "@Moderator"
            )
        );

        tests.push(
            roleLogs.recovery(
                user,
                [
                    {
                        name: "Moderator",
                        id: "123456789012345678"
                    },
                    {
                        name: "Staff",
                        id: "123456789012345679"
                    }
                ],
                [
                    "Restored dangerous permissions",
                    "Restored affected roles"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            roleLogs.failed(
                user,
                "@Moderator",
                [
                    "Failed to restore role permissions",
                    "Failed to restore role settings"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // EMOJI
        // =========================

        tests.push(
            emojiLogs.event(
                user,
                "created",
                "🔥",
                [
                    "Emoji was created"
                ],
                "The emoji was created.",
                "TEST-EMOJI-EVENT"
            )
        );

        tests.push(
            emojiLogs.triggered(
                user,
                3,
                3,
                [
                    "Created 🔥",
                    "Created 💀",
                    "Deleted 😈"
                ],
                "ban",
                "The user was punished.",
                "Emoji changes"
            )
        );

        tests.push(
            emojiLogs.recovery(
                user,
                [
                    "🔥 [123456789012345678]",
                    "💀 [123456789012345679]"
                ],
                [
                    "Restored affected emojis"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            emojiLogs.failed(
                user,
                "🔥",
                [
                    "Failed to restore the emoji"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // BOT ADD
        // =========================

        tests.push(
            botaddLogs.event(
                user,
                "added",
                "Test Bot",
                [
                    "A new bot was added to the server"
                ],
                "The bot addition was recorded.",
                "TEST-BOTADD-EVENT"
            )
        );

        tests.push(
            botaddLogs.triggered(
                user,
                1,
                1,
                [
                    "Added Test Bot"
                ],
                "ban",
                "The user was punished.",
                "Test Bot"
            )
        );

        tests.push(
            botaddLogs.recovery(
                user,
                [
                    "Test Bot [123456789012345678]"
                ],
                [
                    "Removed the unauthorized bot"
                ],
                "The unauthorized bot was removed."
            )
        );

        tests.push(
            botaddLogs.failed(
                user,
                "Test Bot",
                [
                    "Failed to remove the unauthorized bot"
                ],
                "The unauthorized bot could not be removed.",
                "remove"
            )
        );


        // =========================
        // WEBHOOK
        // =========================

        tests.push(
            webhookLogs.event(
                user,
                "created",
                "Test Webhook",
                [
                    "Webhook was created"
                ],
                "The webhook was created.",
                "TEST-WEBHOOK-EVENT"
            )
        );

        tests.push(
            webhookLogs.triggered(
                user,
                3,
                3,
                [
                    "Created Test Webhook",
                    "Created Test Webhook",
                    "Deleted Test Webhook"
                ],
                "ban",
                "The user was punished.",
                "Test Webhook"
            )
        );

        tests.push(
            webhookLogs.recovery(
                user,
                [
                    "Test Webhook [123456789012345678]"
                ],
                [
                    "Removed unauthorized webhook changes"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            webhookLogs.failed(
                user,
                "Test Webhook",
                [
                    "Failed to remove the unauthorized webhook"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // VANITY
        // =========================

        tests.push(
            vanityLogs.event(
                user,
                "updated",
                "oldvanity",
                "newvanity",
                "The vanity change was detected and restored.",
                "TEST-VANITY-EVENT"
            )
        );

        tests.push(
            vanityLogs.triggered(
                user,
                "oldvanity",
                "newvanity",
                3,
                3,
                "ban",
                "Punishment applied successfully.",
                [
                    "Vanity changed",
                    "Unauthorized vanity update",
                    "Vanity restoration"
                ]
            )
        );

        tests.push(
            vanityLogs.recovery(
                user,
                "oldvanity",
                "The original server vanity was restored successfully."
            )
        );

        tests.push(
            vanityLogs.failed(
                user,
                "oldvanity",
                "newvanity",
                "Failed to restore the original server vanity."
            )
        );


        // =========================
        // PERMISSIONS
        // =========================

        tests.push(
            permissionsLogs.event(
                user,
                "updated",
                "Test Permissions",
                [
                    "Changed administrator permissions",
                    "Updated dangerous permissions"
                ],
                "The permissions were updated.",
                "TEST-PERMISSIONS-EVENT"
            )
        );

        tests.push(
            permissionsLogs.triggered(
                user,
                4,
                3,
                [
                    "Administrator permission granted",
                    "Manage Guild permission granted",
                    "Manage Roles permission granted",
                    "Manage Channels permission granted"
                ],
                "strip",
                "The user was punished.",
                "Server permissions"
            )
        );

        tests.push(
            permissionsLogs.recovery(
                user,
                [
                    "Server permissions"
                ],
                [
                    "Removed unauthorized permissions",
                    "Restored protected permissions"
                ],
                "Everything was restored."
            )
        );

        tests.push(
            permissionsLogs.failed(
                user,
                "Server permissions",
                [
                    "Failed to restore administrator permissions",
                    "Failed to restore protected permissions"
                ],
                "Some changes could not be restored.",
                "restore"
            )
        );


        // =========================
        // SEND ALL TEST LOGS
        // =========================

        for (
            const component of tests
        ) {

            await message.channel.send({
                components: [
                    component
                ],
                flags:
                    MessageFlags.IsComponentsV2
            });

        }

    }

};
