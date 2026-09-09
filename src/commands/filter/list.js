const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

const globalEmbeds =
    require("../../embeds/general/global");

const filterEmbeds =
    require("../../embeds/general/filter");

const Filter =
    require("../../models/Filter");

const blockedWords =
    require("../../systems/filter/blockedWords");

module.exports = {
    name: "filter list",
    aliases: [],

    async execute(client, message, args) {

        // =========================
        // GUILD CHECK
        // =========================

        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    globalEmbeds.error(
                        "This command can only be used in a server."
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

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ];

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !message.channel
                        .permissionsFor(botMember)
                        ?.has(permission)
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

            return message.channel.send({
                embeds: [
                    globalEmbeds.botPermission(
                        message.author,
                        permissionNames
                    )
                ]
            });
        }

        // =========================
        // LOAD FILTER
        // =========================

        try {

            const filter =
                await Filter.findOne({
                    guildId:
                        message.guild.id
                });

            if (!filter) {
                return message.channel.send({
                    embeds: [
                        filterEmbeds.empty(
                            message.author
                        )
                    ]
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
                return message.channel.send({
                    embeds: [
                        filterEmbeds.empty(
                            message.author
                        )
                    ]
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

            let page = 0;

            const buildEmbed = () => {

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

                return new EmbedBuilder()
                    .setColor(
                        config.colors.regular
                    )
                    .setAuthor({
                        name:
                            message.guild.name,
                        iconURL:
                            message.guild.iconURL({
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
            };

            // =========================
            // BUTTONS
            // =========================

            const {
                ActionRowBuilder,
                ButtonBuilder,
                ButtonStyle
            } = require("discord.js");

            const createButtons = () => {

                return new ActionRowBuilder()
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
            };

            return message.channel.send({
                embeds: [
                    buildEmbed()
                ],
                components:
                    totalPages > 1
                        ? [
                            createButtons()
                        ]
                        : []
            });

        } catch (error) {

            console.error(
                "Filter List Error:",
                error
            );

            return message.channel.send({
                embeds: [
                    globalEmbeds.actionFailed(
                        message.author,
                        "load the filter"
                    )
                ]
            });
        }
    }
};
