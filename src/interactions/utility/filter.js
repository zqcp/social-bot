const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

const Filter =
    require("../../models/Filter");

const blockedWords =
    require("../../systems/filter/blockedWords");

// =========================
// INTERACTION
// =========================

module.exports = {

    name: "filter_list",

    async execute(
        client,
        interaction
    ) {

        // =========================
        // BUTTON CHECK
        // =========================

        if (!interaction.isButton()) {
            return;
        }

        // =========================
        // GET PAGE
        // =========================

        const currentEmbed =
            interaction.message.embeds[0];

        const footer =
            currentEmbed?.footer?.text || "";

        const pageMatch =
            footer.match(
                /Page (\d+)\/(\d+)/
            );

        let page =
            pageMatch
                ? Number(pageMatch[1]) - 1
                : 0;

        // =========================
        // LOAD FILTER
        // =========================

        const filter =
            await Filter.findOne({
                guildId:
                    interaction.guild.id
            });

        if (!filter) {
            return interaction.update({
                embeds: [],
                components: []
            });
        }

        // =========================
        // BUILD WORD LIST
        // =========================

        const words = [];

        // =========================
        // PREMADE WORDS
        // =========================

        if (filter.premade === true) {

            const disabledPremade =
                Array.isArray(
                    filter.disabledPremade
                )
                    ? filter.disabledPremade
                    : [];

            for (const word of blockedWords) {

                const disabled =
                    disabledPremade.some(
                        disabledWord =>
                            disabledWord.toLowerCase() ===
                            word.toLowerCase()
                    );

                if (!disabled) {
                    words.push(word);
                }
            }
        }

        // =========================
        // CUSTOM WORDS
        // =========================

        if (Array.isArray(filter.words)) {
            words.push(
                ...filter.words
            );
        }

        // =========================
        // REMOVE DUPLICATES
        // =========================

        const uniqueWords = [
            ...new Map(
                words
                    .filter(
                        word =>
                            typeof word === "string" &&
                            word.trim()
                    )
                    .map(
                        word => [
                            word.trim().toLowerCase(),
                            word.trim()
                        ]
                    )
            ).values()
        ];

        if (!uniqueWords.length) {
            return interaction.update({
                embeds: [],
                components: []
            });
        }

        // =========================
        // PAGINATION
        // =========================

        const pageSize = 25;

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    uniqueWords.length /
                    pageSize
                )
            );

        // =========================
        // BUTTON ACTION
        // =========================

        if (
            interaction.customId ===
            "filter_list_previous"
        ) {
            page--;
        }

        if (
            interaction.customId ===
            "filter_list_next"
        ) {
            page++;
        }

        page =
            Math.max(
                0,
                Math.min(
                    page,
                    totalPages - 1
                )
            );

        // =========================
        // PAGE WORDS
        // =========================

        const start =
            page * pageSize;

        const pageWords =
            uniqueWords.slice(
                start,
                start + pageSize
            );

        const description =
            pageWords
                .map(
                    (word, index) =>
                        `\`${String(
                            start + index + 1
                        ).padStart(2, "0")}\` **${word}**`
                )
                .join("\n");

        // =========================
        // EMBED
        // =========================

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.colors.regular
                )
                .setAuthor({
                    name:
                        interaction.guild.name,
                    iconURL:
                        interaction.guild.iconURL({
                            dynamic: true
                        }) || undefined
                })
                .addFields({
                    name: "\u200B",
                    value:
                        `**blacklisted words**\n\n${description}`
                })
                .setFooter({
                    text:
                        `Page ${page + 1}/${totalPages} • (${uniqueWords.length} words)`
                });

        // =========================
        // BUTTONS
        // =========================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "filter_list_previous"
                        )
                        .setLabel("◀")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page === 0
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "filter_list_page"
                        )
                        .setLabel(
                            `${page + 1}/${totalPages}`
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(true),

                    new ButtonBuilder()
                        .setCustomId(
                            "filter_list_next"
                        )
                        .setLabel("▶")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page >= totalPages - 1
                        )

                );

        // =========================
        // UPDATE MESSAGE
        // =========================

        return interaction.update({
            embeds: [
                embed
            ],
            components:
                totalPages > 1
                    ? [row]
                    : []
        });
    }

};
