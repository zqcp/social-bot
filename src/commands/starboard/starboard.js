const {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require("discord.js");

const config =
    require("../../config");

const globalEmbeds =
    require("../../embeds/general/global");

module.exports = {

    name: "starboard",

    aliases: [],

    permissions: [
        PermissionFlagsBits.ManageMessages
    ],

    async execute(
        client,
        message,
        args
    ) {

        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            config.colors.regular
                        )
                        .setTitle(
                            "Command: starboard"
                        )
                        .setAuthor({
                            name:
                                message.author.username,
                            iconURL:
                                message.author.displayAvatarURL({
                                    dynamic: true
                                })
                        })
                        .setDescription(
                            "Manage the server's Starboard."
                        )
                ]
            });
        }

        // =========================
        // USER PERMISSION
        // =========================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.permission(
                        message.author,
                        "ManageMessages"
                    )
                ]
            });
        }

        // =========================
        // BOT PERMISSIONS
        // =========================

        const botMember =
            message.guild.members.me;

        if (!botMember) {

            console.error(
                "Starboard Router Error: Bot member could not be found."
            );

            return;
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        const permissions =
            message.channel.permissionsFor(
                botMember
            );

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !permissions?.has(
                        permission
                    )
            );

        if (missingPermissions.length) {

            const permissionNames =
                missingPermissions.map(
                    permission =>
                        Object.entries(
                            PermissionFlagsBits
                        ).find(
                            ([, value]) =>
                                value === permission
                        )?.[0] || permission
                );

            if (
                permissionNames.length === 1
            ) {
                return message.channel.send({
                    embeds: [
                        globalEmbeds.botPermission(
                            message.author,
                            permissionNames[0]
                        )
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermissions(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // STARBOARD EMBED
        // =========================

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "Command: starboard"
                )
                .setAuthor({
                    name:
                        message.author.username,
                    iconURL:
                        message.author.displayAvatarURL({
                            dynamic: true
                        })
                })
                .setDescription(
                    "Manage the server's starboard."
                )
                .addFields({
                    name: "\u200b",
                    value:
`**Aliases**
None
**Module**
Server
**Permissions**
ManageMessages
\`\`\`Syntax: ${config.prefix}starboard [subcommand]
Example: ${config.prefix}starboard add #fame ⭐ random 5 yes\`\`\``
                })
                .setColor(
                    config.colors.regular
                );

        // =========================
        // SUBCOMMAND MENU
        // =========================

        const menu =
            new StringSelectMenuBuilder()
                .setCustomId(
                    "starboard_subcommand"
                )
                .setPlaceholder(
                    "Select a subcommand"
                )
                .addOptions(
                    {
                        label: "Add",
                        description:
                            "Create a Starboard.",
                        value: "add"
                    },
                    {
                        label: "Clear",
                        description:
                            "Clear Starboard entries.",
                        value: "clear"
                    },
                    {
                        label: "List",
                        description:
                            "View configured Starboards.",
                        value: "list"
                    },
                    {
                        label: "Remove",
                        description:
                            "Remove a Starboard.",
                        value: "remove"
                    }
                );

        const row =
            new ActionRowBuilder()
                .addComponents(
                    menu
                );

        // =========================
        // SUBCOMMAND CHECK
        // =========================

        const validSubcommands = [
            "add",
            "clear",
            "list",
            "remove"
        ];

        const subcommand =
            args[0]?.toLowerCase();

        if (
            !subcommand ||
            !validSubcommands.includes(
                subcommand
            )
        ) {
            return message.channel.send({
                embeds: [
                    embed
                ],
                components: [
                    row
                ]
            });
        }

        return message.channel.send({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        });

    }

};
