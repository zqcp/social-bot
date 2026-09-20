const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../embeds/general/global");

const filterHelp =
    require("../embeds/help/filter");

module.exports = {

    name: "filter_subcommand",

    type: "select",

    async execute(
        client,
        interaction
    ) {

        // =========================
        // SELECT CHECK
        // =========================

        if (
            !interaction.isStringSelectMenu()
        ) {
            return;
        }

        if (
            interaction.customId !==
            "filter_subcommand"
        ) {
            return;
        }

        // =========================
        // GUILD CHECK
        // =========================

        if (!interaction.guild) {
            return interaction.reply({
                embeds: [
                    globalEmbeds.error(
                        "This interaction can only be used in a server."
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // PERMISSION CHECK
        // =========================

        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        ) {
            return interaction.reply({
                embeds: [
                    globalEmbeds.permission(
                        interaction.user,
                        "ManageMessages"
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // GET SUBCOMMAND
        // =========================

        const subcommand =
            interaction.values[0];

        // =========================
        // GET HELP EMBED
        // =========================

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
                embeds: [
                    globalEmbeds.error(
                        `${interaction.user}: Invalid **filter subcommand**.`
                    )
                ],
                flags: 64
            });
        }

        // =========================
        // UPDATE ORIGINAL MESSAGE
        // =========================

        await interaction.update({
            embeds: [
                embed(interaction.user)
            ]
        });

        // =========================
        // RESET 60 SECOND TIMER
        // =========================

        if (
            client.filterTimers
        ) {

            const timer =
                client.filterTimers.get(
                    interaction.message.id
                );

            if (timer) {
                clearTimeout(timer);
            }

            const newTimer =
                setTimeout(
                    async () => {

                        try {

                            await interaction.message.edit({
                                components: []
                            });

                        } catch (error) {

                            console.error(
                                "Filter Select Timeout Error:",
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

    }

};
