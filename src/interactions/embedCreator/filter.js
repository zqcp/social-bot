const {
    PermissionFlagsBits
} = require("discord.js");

const globalEmbeds =
    require("../embeds/general/global");

const filterHelp =
    require("../embeds/help/filter");

module.exports = {

    name: "filter_subcommand",

    async execute(
        client,
        interaction
    ) {

        if (!interaction.isStringSelectMenu()) return;

        if (
            interaction.customId !==
            "filter_subcommand"
        ) return;

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
                embeds: [
                    globalEmbeds.error(
                        `${interaction.user}: Invalid **filter subcommand**.`
                    )
                ],
                flags: 64
            });
        }

        return interaction.reply({
            embeds: [
                embed(interaction.user)
            ],
            flags: 64
        });

    }

};
