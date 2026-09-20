const {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    name: "filter",

    aliases: [],

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
                            "Command: filter"
                        )
                        .setDescription(
                            "Manage the server's word filter."
                        )
                ]
            });
        }

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "Command: filter"
                )
                .setDescription(
                    "Manage the server's word filter."
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
\`\`\`Syntax: ${config.prefix}filter [subcommand]
Example: ${config.prefix}filter add spam\`\`\``
                })
                .setColor(
                    config.colors.regular
                );

        const menu =
            new StringSelectMenuBuilder()
                .setCustomId(
                    "filter_subcommand"
                )
                .setPlaceholder(
                    "Select a subcommand"
                )
                .addOptions(
                    {
                        label: "Add",
                        description:
                            "Add a word to the filter.",
                        value: "add"
                    },
                    {
                        label: "Clear",
                        description:
                            "Clear all custom filter words.",
                        value: "clear"
                    },
                    {
                        label: "Disable",
                        description:
                            "Disable the word filter.",
                        value: "disable"
                    },
                    {
                        label: "Enable",
                        description:
                            "Enable the word filter.",
                        value: "enable"
                    },
                    {
                        label: "List",
                        description:
                            "View the filtered words.",
                        value: "list"
                    },
                    {
                        label: "Premade",
                        description:
                            "Manage the premade word filter.",
                        value: "premade"
                    },
                    {
                        label: "Remove",
                        description:
                            "Remove a word from the filter.",
                        value: "remove"
                    }
                );

        const row =
            new ActionRowBuilder()
                .addComponents(
                    menu
                );

        const validSubcommands = [
            "add",
            "clear",
            "disable",
            "enable",
            "list",
            "premade",
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
