const interactionEmbeds =
    require("../../embeds/general/interaction");

const {
    getSession
} = require("../../systems/embed/builder");

module.exports = {
    name: "embed",
    type: "modal",

    async execute(client, interaction) {

        const session = getSession(
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

        const id = interaction.customId;

        // =========================
        // MESSAGE CONTENT
        // =========================

        if (id === "embed:content") {

            session.data.content =
                interaction.fields.getTextInputValue(
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

            const embed = getEmbed(session);

            embed.title =
                interaction.fields.getTextInputValue(
                    "title"
                ).slice(0, 256);

            embed.description =
                interaction.fields.getTextInputValue(
                    "description"
                ).slice(0, 4096);

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

        // =========================
        // FIELD
        // =========================

        if (id === "embed:field") {

            const name =
                interaction.fields.getTextInputValue(
                    "fieldName"
                );

            const value =
                interaction.fields.getTextInputValue(
                    "fieldValue"
                );

            const embed = getEmbed(session);

            if (!Array.isArray(embed.fields)) {
                embed.fields = [];
            }

            if (embed.fields.length >= 25) {
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.modalFailed(
                            "This embed already has the maximum of 25 fields."
                        )
                    ],
                    flags: 64
                });
            }

            embed.fields.push({
                name: name.slice(0, 256),
                value: value.slice(0, 1024),
                inline: false
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
                interaction.fields.getTextInputValue(
                    "buttonLabel"
                );

            const customId =
                interaction.fields.getTextInputValue(
                    "buttonId"
                );

            if (!Array.isArray(session.data.buttons)) {
                session.data.buttons = [];
            }

            if (session.data.buttons.length >= 25) {
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
                label: label.slice(0, 80),
                emoji: "",
                style: "secondary",
                customId: customId.slice(0, 100),
                url: "",
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

        // =========================
        // SELECT MENU
        // =========================

        if (id === "embed:select") {

            const customId =
                interaction.fields.getTextInputValue(
                    "customId"
                );

            if (!Array.isArray(session.data.selectMenus)) {
                session.data.selectMenus = [];
            }

            if (session.data.selectMenus.length >= 5) {
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
                type: "string",
                customId: customId.slice(0, 100),
                placeholder: "Select an option",
                minValues: 1,
                maxValues: 1,
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
                interactionEmbeds.modalInvalid(
                    "This embed editor action is invalid."
                )
            ],
            flags: 64
        });
    }
};


// =========================
// GET EMBED
// =========================

function getEmbed(session) {

    if (!Array.isArray(session.data.embeds)) {
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
            require("../../systems/embed/builder");

        const data =
            builder.buildMessage(
                session,
                interaction
            );

        await message.edit({
            content: data.content,
            embeds: data.embeds,
            components: data.components
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
