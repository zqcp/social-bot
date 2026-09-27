{"variant":"document","id":"ui4vlb","subject":"src/commands/antinuke/test.js"}
```js
const {
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const vanityLogs =
    require("../../systems/antinuke/logs/vanity");


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


        // =========================
        // VANITY EVENT
        // =========================

        const event =
            vanityLogs.event(
                user,
                "updated",
                "oldvanity",
                "newvanity",
                "The vanity change was detected and restored.",
                "TEST-VANITY-EVENT"
            );


        // =========================
        // ANTINUKE TRIGGERED
        // =========================

        const triggered =
            vanityLogs.triggered(
                user,
                "oldvanity",
                "newvanity",
                1,
                1,
                "ban",
                "The original vanity was restored successfully.",
                [
                    "Vanity changed"
                ]
            );


        // =========================
        // VANITY RECOVERY
        // =========================

        const recovery =
            vanityLogs.recovery(
                user,
                "oldvanity",
                "The original vanity was restored successfully."
            );


        // =========================
        // SEND EACH LOG SEPARATELY
        // =========================

        await message.channel.send({
            components: [
                event
            ],
            flags:
                MessageFlags.IsComponentsV2
        });


        await message.channel.send({
            components: [
                triggered
            ],
            flags:
                MessageFlags.IsComponentsV2
        });


        return message.channel.send({
            components: [
                recovery
            ],
            flags:
                MessageFlags.IsComponentsV2
        });

    }

};
