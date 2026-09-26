const {
    MessageFlags
} = require("discord.js");

const channelLogs =
    require("../../systems/antinuke/logs/channel");


module.exports = {

    name:
        "antinuke test",

    aliases: [],

    async execute(
        client,
        message
    ) {

        if (
            !message.guild
        ) {
            return;
        }


        const channel =
            message.channel;

        const user =
            message.author;


        // =========================
        // CHANNEL CREATED
        // =========================

        const created =
            channelLogs.event(
                user,
                "created",
                channel,
                [
                    `${channel.name} — created`,
                    "Permissions configured"
                ],
                "Channel event detected.",
                "TEST-CREATED"
            );


        // =========================
        // CHANNEL UPDATED
        // =========================

        const updated =
            channelLogs.event(
                user,
                "updated",
                channel,
                [
                    "Name changed",
                    "Topic changed",
                    "Permission overwrite changed"
                ],
                "Channel event detected.",
                "TEST-UPDATED"
            );


        // =========================
        // CHANNEL DELETED
        // =========================

        const deleted =
            channelLogs.event(
                user,
                "deleted",
                channel,
                [
                    `${channel.name} — deleted`,
                    "Permission overwrites removed"
                ],
                "Channel event detected.",
                "TEST-DELETED"
            );


        // =========================
        // ANTINUKE TRIGGERED
        // =========================

        const triggered =
            channelLogs.triggered(
                user,
                8,
                5,
                [
                    `${channel.name} — deleted`,
                    "#rules — deleted",
                    "#media — deleted",
                    "#staff — deleted",
                    "#general — deleted"
                ],
                "ban",
                "Successfully applied.",
                channel
            );


        // =========================
        // ANTINUKE RECOVERY
        // =========================

        const recovery =
            channelLogs.recovery(
                user,
                [
                    channel,
                    "#rules",
                    "#media"
                ],
                [
                    "Channel recreated",
                    "Permission overwrites restored",
                    "Channel settings restored"
                ],
                "Channel recovery completed."
            );


        // =========================
        // SEND COMPONENTS V2
        // =========================

        return message.channel.send({

            components: [
                created,
                updated,
                deleted,
                triggered,
                recovery
            ],

            flags:
                MessageFlags.IsComponentsV2

        });

    }

};
