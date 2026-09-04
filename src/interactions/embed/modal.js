const interactionEmbeds =
    require("../../embeds/general/interaction");

const {
    getSession,
    buildMessage
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "modal",

    async execute(client, interaction) {

        const session =
            getSession(
                interaction.user.id,
                interaction.guildId
            );

        if (!session) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.modalFailed(
                        "This embed builder session has expired."
                    )
                ],
                flags: 64
            });
        }

        const id =
            interaction.customId;

        /*
         * CONTENT
         */

        if (id === "embed:content") {

            session.data.content =
                getValue(
                    interaction,
                    "content"
                );

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Message content updated."
            );
        }

        /*
         * EMBED
         */

        if (id === "embed:embed") {

            const embed =
                getEmbed(session);

            embed.title =
                getValue(
                    interaction,
                    "title"
                ).slice(0, 256);

            embed.description =
                getValue(
                    interaction,
                    "description"
                ).slice(0, 4096);

            embed.url =
                getValue(
                    interaction,
                    "url"
                ).slice(0, 2048);

            embed.color =
                getValue(
                    interaction,
                    "color"
                );

            const timestamp =
                getValue(
                    interaction,
                    "timestamp"
                );

            if (!timestamp) {
                embed.timestamp = false;
            } else if (
                timestamp.toLowerCase() === "true"
            ) {
                embed.timestamp = true;
            } else if (
                !Number.isNaN(
                    Date.parse(timestamp)
                )
            ) {
                embed.timestamp = timestamp;
            } else {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "The timestamp is invalid."
                        )
                    ],
                    flags: 64
                });
            }

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Embed updated."
            );
        }

        /*
         * FIELD
         */

        if (id === "embed:field") {

            const embed =
                getEmbed(session);

            if (
                embed.fields.length >= 25
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This embed already has 25 fields."
                        )
                    ],
                    flags: 64
                });
            }

            const name =
                getValue(
                    interaction,
                    "fieldName"
                ).slice(0, 256);

            const value =
                getValue(
                    interaction,
                    "fieldValue"
                ).slice(0, 1024);

            if (!name || !value) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Field name and value are required."
                        )
                    ],
                    flags: 64
                });
            }

            const inline =
                ["true", "yes", "1"]
                    .includes(
                        getValue(
                            interaction,
                            "fieldInline"
                        ).toLowerCase()
                    );

            embed.fields.push({
                name,
                value,
                inline
            });

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Field added."
            );
        }

        /*
         * BUTTON
         */

        if (id === "embed:button") {

            if (
                !Array.isArray(
                    session.data.buttons
                )
            ) {
                session.data.buttons = [];
            }

            const label =
                getValue(
                    interaction,
                    "buttonLabel"
                ).slice(0, 80);

            const customId =
                getValue(
                    interaction,
                    "buttonId"
                ).slice(0, 100);

            const style =
                getValue(
                    interaction,
                    "buttonStyle"
                ).toLowerCase();

            const url =
                getValue(
                    interaction,
                    "buttonUrl"
                ).slice(0, 512);

            const emoji =
                getValue(
                    interaction,
                    "buttonEmoji"
                ).slice(0, 100);

            const validStyles = [
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ];

            if (!validStyles.includes(style)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Invalid button style. Use primary, secondary, success, danger, or link."
                        )
                    ],
                    flags: 64
                });
            }

            if (!label) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Button label is required."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                style === "link" &&
                !url
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "A URL is required for link buttons."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                style !== "link" &&
                !customId
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "A Custom ID is required for this button."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.buttons.push({
                label,
                emoji,
                style,
                customId:
                    style === "link"
                        ? ""
                        : customId,
                url:
                    style === "link"
                        ? url
                        : "",
                disabled: false
            });

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Button added."
            );
        }

        /*
         * SELECT MENU
         */

        if (id === "embed:select") {

            if (
                !Array.isArray(
                    session.data.selectMenus
                )
            ) {
                session.data.selectMenus = [];
            }

            const customId =
                getValue(
                    interaction,
                    "customId"
                ).slice(0, 100);

            const placeholder =
                getValue(
                    interaction,
                    "placeholder"
                ).slice(0, 150);

            const type =
                getValue(
                    interaction,
                    "type"
                ).toLowerCase();

            const minValues =
                parseNumber(
                    interaction,
                    "minValues",
                    1
                );

            const maxValues =
                parseNumber(
                    interaction,
                    "maxValues",
                    1
                );

            const validTypes = [
                "string",
                "user",
                "role",
                "mentionable",
                "channel"
            ];

            if (!customId) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "A Custom ID is required."
                        )
                    ],
                    flags: 64
                });
            }

            if (!validTypes.includes(type)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Invalid select menu type."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                minValues < 0 ||
                maxValues < 1 ||
                minValues > maxValues ||
                maxValues > 25
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Invalid minimum or maximum values."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.selectMenus.push({
                type,
                customId,
                placeholder:
                    placeholder ||
                    "Select an option",
                minValues,
                maxValues,
                disabled: false,
                options: []
            });

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Select menu added."
            );
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.modalFailed(
                    "This modal action is invalid."
                )
            ],
            flags: 64
        });
    }
};

function getValue(
    interaction,
    id
) {
    try {
        return interaction.fields
            .getTextInputValue(id)
            .trim();
    } catch {
        return "";
    }
}

function parseNumber(
    interaction,
    id,
    fallback
) {
    const value =
        Number(
            getValue(
                interaction,
                id
            )
        );

    return Number.isFinite(value)
        ? value
        : fallback;
}

function getEmbed(session) {

    if (
        !Array.isArray(
            session.data.embeds
        )
    ) {
        session.data.embeds = [];
    }

    if (!session.data.embeds[0]) {
        session.data.embeds.push({
            title: "",
            description: "",
            url: "",
            color: "",
            author: {
                name: "",
                url: "",
                iconURL: ""
            },
            thumbnail: "",
            image: "",
            footer: {
                text: "",
                iconURL: ""
            },
            timestamp: false,
            fields: []
        });
    }

    if (
        !Array.isArray(
            session.data.embeds[0].fields
        )
    ) {
        session.data.embeds[0].fields = [];
    }

    return session.data.embeds[0];
}

async function refreshEditor(
    client,
    session,
    interaction
) {
    if (
        !session.channelId ||
        !session.messageId
    ) {
        return;
    }

    const channel =
        client.channels.cache.get(
            session.channelId
        );

    if (!channel) {
        return;
    }

    try {
        const message =
            await channel.messages.fetch(
                session.messageId
            );

        const data =
            buildMessage(
                session,
                interaction
            );

        await message.edit({
            content:
                data.content || null,
            embeds:
                data.embeds,
            components:
                data.components
        });

    } catch (error) {
        console.error(
            "[EMBED EDITOR]",
            error
        );
    }
}

function success(
    interaction,
    message
) {
    return interaction.reply({
        embeds: [
            interactionEmbeds.modalSuccess(
                message
            )
        ],
        flags: 64
    });
}
