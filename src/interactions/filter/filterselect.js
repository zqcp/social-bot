const {
    PermissionFlagsBits,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config =
    require("../../config");

const filterHelp =
    require("../../embeds/help/filter");

module.exports = {

    name: "filter_subcommand",

    type: "select",

    async execute(
        client,
        interaction
    ) {

        if (!interaction.isStringSelectMenu()) {
            return;
        }

        if (
            interaction.customId !==
            "filter_subcommand"
        ) {
            return;
        }

        if (!interaction.guild) {
            return interaction.reply({
                content:
                    `${config.emojis.error} This interaction can only be used in a server.`,
                flags: 64
            });
        }

        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return interaction.reply({
                content:
                    `${config.emojis.error} ${interaction.user}: You cannot use this!`,
                flags: 64
            });
        }

        const subcommand =
            interaction.values[0];

        const embeds = {
            add: filterHelp.add,
            clear: filterHelp.clear,
            disable: filterHelp.disable,
            enable: filterHelp.enable,
            list: filterHelp.list,
            premade: filterHelp.premade,
            remove: filterHelp.remove
        };

        const embed =
            embeds[subcommand];

        if (!embed) {
            return interaction.reply({
                content:
                    `${config.emojis.error} ${interaction.user}: Invalid **filter subcommand**.`,
                flags: 64
            });
        }

        await interaction.update({
            embeds: [
                embed(interaction.user)
            ]
        });

        if (!client.filterTimers) {
            client.filterTimers =
                new Map();
        }

        const existingTimer =
            client.filterTimers.get(
                interaction.message.id
            );

        if (existingTimer) {
            clearTimeout(
                existingTimer
            );
        }

        const newTimer =
            setTimeout(
                async () => {

                    try {

                        const disabledMenu =
                            new StringSelectMenuBuilder()
                                .setCustomId(
                                    "filter_subcommand"
                                )
                                .setPlaceholder(
                                    "Select a subcommand"
                                )
                                .setDisabled(
                                    true
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
                                    disabledMenu
                                );

                        await interaction.message.edit({
                            components: [
                                row
                            ]
                        });

                    } catch (error) {

                        console.error(
                            "[FILTER] Select menu timeout error:",
                            error
                        );

                    }

                    client.filterTimers.delete(
                        interaction.message.id
                    );

                },
                60000
            );

        client.filterTimers.set(
            interaction.message.id,
            newTimer
        );

    }

};
