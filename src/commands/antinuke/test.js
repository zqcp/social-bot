const {
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const roleLogs =
    require("../../systems/antinuke/logs/role");


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

        const roles =
            message.guild.roles.cache
                .filter(
                    role =>
                        role.id !==
                        message.guild.id
                )
                .first(3);

        const roleList =
            [...roles];


        const firstRole =
            roleList[0] ||
            null;

        const secondRole =
            roleList[1] ||
            firstRole;

        const thirdRole =
            roleList[2] ||
            secondRole;


        // =========================
        // ROLE CREATED / UPDATED
        // =========================

        const event =
            roleLogs.event(
                user,
                "updated",
                firstRole,
                [
                    "Administrator — added",
                    "ManageRoles — added",
                    "ManageChannels — added"
                ],
                "Role permissions updated.",
                "TEST-ROLE-EVENT"
            );


        // =========================
        // MULTIPLE ROLE EVENT
        // =========================

        const multipleEvent =
            roleLogs.event(
                user,
                "updated",
                [
                    firstRole,
                    secondRole,
                    thirdRole
                ],
                [
                    "Administrator — added",
                    "ManageRoles — added",
                    "ManageChannels — added"
                ],
                "Multiple role permissions updated.",
                "TEST-ROLE-MULTIPLE"
            );


        // =========================
        // ANTINUKE TRIGGERED
        // =========================

        const triggered =
            roleLogs.triggered(
                user,
                5,
                3,
                [
                    `${firstRole?.name || "Unknown role"} — Administrator added`,
                    `${secondRole?.name || "Unknown role"} — ManageRoles added`,
                    `${thirdRole?.name || "Unknown role"} — ManageChannels added`
                ],
                "ban",
                "Successfully applied.",
                firstRole
            );


        // =========================
        // MULTIPLE ROLE TRIGGER
        // =========================

        const multipleTriggered =
            roleLogs.triggered(
                user,
                8,
                5,
                [
                    `${firstRole?.name || "Unknown role"} — Administrator added`,
                    `${secondRole?.name || "Unknown role"} — ManageRoles added`,
                    `${thirdRole?.name || "Unknown role"} — ManageChannels added`
                ],
                "ban",
                "Successfully applied.",
                [
                    firstRole,
                    secondRole,
                    thirdRole
                ]
            );


        // =========================
        // ROLE RECOVERY
        // =========================

        const recovery =
            roleLogs.recovery(
                user,
                firstRole,
                [
                    "Administrator — removed",
                    "ManageRoles — removed",
                    "ManageChannels — removed"
                ],
                "Role permissions restored."
            );


        // =========================
        // MULTIPLE ROLE RECOVERY
        // =========================

        const multipleRecovery =
            roleLogs.recovery(
                user,
                [
                    firstRole,
                    secondRole,
                    thirdRole
                ],
                [
                    "Administrator — removed",
                    "ManageRoles — removed",
                    "ManageChannels — removed"
                ],
                "Multiple role permissions restored."
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
                multipleEvent
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


        await message.channel.send({
            components: [
                multipleTriggered
            ],
            flags:
                MessageFlags.IsComponentsV2
        });


        await message.channel.send({
            components: [
                recovery
            ],
            flags:
                MessageFlags.IsComponentsV2
        });


        return message.channel.send({
            components: [
                multipleRecovery
            ],
            flags:
                MessageFlags.IsComponentsV2
        });

    }

};
