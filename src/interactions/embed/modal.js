const interactionEmbeds =
    require("../../embeds/general/interaction");

const {
    getSession
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

        // =========================
        // MESSAGE CONTENT
        // =========================

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

        // =========================
        // EMBED
        // =========================

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
                ).slice(0, 20);

            const timestamp =
                getValue(
                    interaction,
                    "timestamp"
                ).trim();

            if (!timestamp) {
                embed.timestamp = false;
            } else if (
                timestamp.toLowerCase() === "true"
            ) {
                embed.timestamp = true;
            } else {
                const date =
                    new Date(timestamp);

                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {
                    return interaction.reply({
                        embeds: [
                            interactionEmbeds.modalFailed(
                                "The timestamp is invalid. Use `true` or a valid date/time."
                            )
                        ],
                        flags: 64
                    });
                }

                embed.timestamp =
                    date.toISOString();
            }

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Embed settings updated."
            );
        }

        // =========================
        // FIELD
        // =========================

        if (id === "embed:field") {

            const name =
                getValue(
                    interaction,
                    "fieldName"
                );

            const value =
                getValue(
                    interaction,
                    "fieldValue"
                );

            const inlineValue =
                getValue(
                    interaction,
                    "fieldInline"
                ).trim()
                .toLowerCase();

            const embed =
                getEmbed(session);

            if (!Array.isArray(embed.fields)) {
                embed.fields = [];
            }

            if (
                embed.fields.length >= 25
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This embed already has the maximum of 25 fields."
                        )
                    ],
                    flags: 64
                });
            }

            if (!name.trim()) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "The field name cannot be empty."
                        )
                    ],
                    flags: 64
                });
            }

            if (!value.trim()) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "The field value cannot be empty."
                        )
                    ],
                    flags: 64
                });
            }

            embed.fields.push({
                name:
                    name.slice(0, 256),

                value:
                    value.slice(0, 1024),

                inline:
                    inlineValue === "true" ||
                    inlineValue === "yes" ||
                    inlineValue === "1"
            });

            await refreshEditor(
                client,
                session,
                interaction
            );

            return success(
                interaction,
                "Embed field added."
            );
        }

        // =========================
        // BUTTON
        // =========================

        if (id === "embed:button") {

            const label =
                getValue(
                    interaction,
                    "buttonLabel"
                );

            const customId =
                getValue(
                    interaction,
                    "buttonId"
                );

            const style =
                getValue(
                    interaction,
                    "buttonStyle"
                )
                .trim()
                .toLowerCase() ||
                "secondary";

            const url =
                getValue(
                    interaction,
                    "buttonUrl"
                );

            const emoji =
                getValue(
                    interaction,
                    "buttonEmoji"
                );

            if (!label.trim()) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "The button label cannot be empty."
                        )
                    ],
                    flags: 64
                });
            }

            const styles = [
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ];

            if (!styles.includes(style)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Invalid button style. Use `primary`, `secondary`, `success`, `danger`, or `link`."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                style === "link" &&
                !url.trim()
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Link buttons require a URL."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                style !== "link" &&
                !customId.trim()
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This button requires a Custom ID."
                        )
                    ],
                    flags: 64
                });
            }

            if (!Array.isArray(
                session.data.buttons
            )) {
                session.data.buttons = [];
            }

            if (
                session.data.buttons.length >= 25
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "You cannot add more than 25 buttons."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.buttons.push({
                label:
                    label.slice(0, 80),

                emoji:
                    emoji.slice(0, 100),

                style,

                customId:
                    customId.slice(0, 100),

                url:
                    url.slice(0, 2048),

                disabled:
                    false
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

        // =========================
        // SELECT MENU
        // =========================

        if (id === "embed:select") {

            const customId =
                getValue(
                    interaction,
                    "customId"
                );

            const placeholder =
                getValue(
                    interaction,
                    "placeholder"
                );

            const type =
                getValue(
                    interaction,
                    "type"
                )
                .trim()
                .toLowerCase() ||
                "string";

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

            const types = [
                "string",
                "user",
                "role",
                "mentionable",
                "channel"
            ];

            if (!types.includes(type)) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "Invalid select menu type."
                        )
                    ],
                    flags: 64
                });
            }

            if (!customId.trim()) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "The select menu Custom ID cannot be empty."
                        )
                    ],
                    flags: 64
                });
            }

            if (
                minValues < 0 ||
                minValues > 25 ||
                maxValues < 1 ||
                maxValues > 25 ||
                minValues > maxValues
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

            if (!Array.isArray(
                session.data.selectMenus
            )) {
                session.data.selectMenus = [];
            }

            if (
                session.data.selectMenus.length >= 5
            ) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "You cannot add more than 5 select menus."
                        )
                    ],
                    flags: 64
                });
            }

            session.data.selectMenus.push({
                type,

                customId:
                    customId.slice(0, 100),

                placeholder:
                    placeholder.slice(0, 150),

                minValues,

                maxValues,

                disabled:
                    false,

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

        // =========================
        // INVALID
        // =========================

        return interaction.reply({
            embeds: [
                interactionEmbeds.modalInvalid(
                    "This embed editor action is invalid."
                )
            ],
            flags: 64
        });
    }
};


// =========================
// GET VALUE
// =========================

function getValue(
    interaction,
    id
) {
    try {
        return interaction.fields
            .getTextInputValue(id);
    } catch {
        return "";
    }
}


// =========================
// NUMBER
// =========================

function parseNumber(
    interaction,
    id,
    fallback
) {
    const value =
        getValue(
            interaction,
            id
        ).trim();

    if (!value) {
        return fallback;
    }

    const number =
        Number(value);

    if (
        !Number.isInteger(number)
    ) {
        return fallback;
    }

    return number;
}


// =========================
// GET EMBED
// =========================

function getEmbed(session) {

    if (!Array.isArray(
        session.data.embeds
    )) {
        session.data.embeds = [];
    }

    if (!session.data.embeds[0]) {

        session.data.embeds[0] = {

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
        };
    }

    return session.data.embeds[0];
}


// =========================
// REFRESH EDITOR
// =========================

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

        const builder =
            require(
                "../../systems/embed/builder"
            );

        const data =
            builder.buildMessage(
                session,
                interaction
            );

        await message.edit({
            content:
                data.content,

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


// =========================
// SUCCESS
// =========================

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
