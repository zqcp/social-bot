const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config =
    require("../../config");

const starboardHelp =
    require("../../embeds/help/starboard");

module.exports = {

    name: "starboard_subcommand",

    type: "select",

    async execute(
        client,
        interaction
    ) {

        if (
            !interaction.isStringSelectMenu() ||
            interaction.customId !==
                "starboard_subcommand"
        ) {
            return;
        }

        const subcommand =
            interaction.values[0];

        const helpEmbeds = {
            add:
                starboardHelp.add,
            clear:
                starboardHelp.clear,
            list:
                starboardHelp.list,
            remove:
                starboardHelp.remove
        };

        const help =
            helpEmbeds[subcommand];

        if (!help) {
            return interaction.deferUpdate();
        }

        const embed =
            help(interaction.user);

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
                        value: "add",
                        default:
                            subcommand === "add"
                    },
                    {
                        label: "Clear",
                        description:
                            "Clear Starboard entries.",
                        value: "clear",
                        default:
                            subcommand === "clear"
                    },
                    {
                        label: "List",
                        description:
                            "View configured Starboards.",
                        value: "list",
                        default:
                            subcommand === "list"
                    },
                    {
                        label: "Remove",
                        description:
                            "Remove a Starboard.",
                        value: "remove",
                        default:
                            subcommand === "remove"
                    }
                );

        const row =
            new ActionRowBuilder()
                .addComponents(
                    menu
                );

        await interaction.update({
            embeds: [
                embed
            ],
            components: [
                row
            ]
        });

    }

};
