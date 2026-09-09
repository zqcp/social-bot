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

    type: "button",

    async execute(
        client,
        interaction
    ) {

        // =========================
        // BUTTON CHECK
        // =========================

        if (
            !interaction.isButton()
        ) {
            return;
        }

        if (
            !interaction.customId.startsWith(
                "filter_list:"
            )
        ) {
            return;
        }

        // =========================
        // BUTTON DATA
        // =========================

        const parts =
            interaction.customId.split(":");

        const action =
            parts[1];

        const ownerId =
            parts[2];

        // =========================
        // BUTTON OWNER CHECK
        // =========================

        if (
            interaction.user.id !==
            ownerId
        ) {
            return interaction.reply({
                content:
                    "These buttons don't belong to you.",
                flags: 64
            });
        }

        // =========================
        // GET CURRENT PAGE
        // =========================

        const currentEmbed =
            interaction.message.embeds[0];

        if (!currentEmbed) {
            return interaction.deferUpdate();
        }

        const footer =
            currentEmbed.footer?.text || "";

        const pageMatch =
            footer.match(
                /Page (\d+)\/(\d+)/
            );

        if (!pageMatch) {
            return interaction.deferUpdate();
        }

        let page =
            Number(pageMatch[1]);

        const totalPages =
            Number(pageMatch[2]);

        // =========================
        // CHANGE PAGE
        // =========================

        if (
            action === "previous"
        ) {
            page--;
        }

        if (
            action === "next"
        ) {
            page++;
        }

        page =
            Math.max(
                1,
                Math.min(
                    page,
                    totalPages
                )
            );

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

        const calculatedTotalPages =
            Math.max(
                1,
                Math.ceil(
                    uniqueWords.length /
                    pageSize
                )
            );

        page =
            Math.max(
                1,
                Math.min(
                    page,
                    calculatedTotalPages
                )
            );

        // =========================
        // PAGE WORDS
        // =========================

        const start =
            (page - 1) *
            pageSize;

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
                            start +
                            index +
                            1
                        ).padStart(
                            2,
                            "0"
                        )}\` **${word}**`
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
                        `**blacklisted words**\n${description}`
                })
                .setFooter({
                    text:
                        `Page ${page}/${calculatedTotalPages} • (${uniqueWords.length} words)`
                });

        // =========================
        // BUTTONS
        // =========================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            `filter_list:previous:${ownerId}`
                        )
                        .setLabel("◀")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page <= 1
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            `filter_list:page:${ownerId}`
                        )
                        .setLabel(
                            `${page}/${calculatedTotalPages}`
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(true),

                    new ButtonBuilder()
                        .setCustomId(
                            `filter_list:next:${ownerId}`
                        )
                        .setLabel("▶")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page >=
                            calculatedTotalPages
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
                calculatedTotalPages > 1
                    ? [row]
                    : []
        });
    }

};
