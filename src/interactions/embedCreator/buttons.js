const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const state = require("../../systems/embedCreator/state");
const panel = require("../../systems/embedCreator/panel");
const inputs = require("../../systems/embedCreator/inputs");
const builder = require("../../systems/embedCreator/builder");
const interactionEmbeds = require("../../embeds/general/interaction");

// =========================
// OWNERSHIP
// =========================

function isOwner(interaction, session) {
    return (
        session &&
        interaction.user.id === session.userId
    );
}

// =========================
// UPDATE PANEL
// =========================

async function updatePanel(
    interaction,
    session
) {
    const view =
        panel.build(session);

    await interaction.update(view);
}

// =========================
// SHOW MODAL
// =========================

async function showModal(
    interaction,
    modal
) {
    await interaction.showModal(modal);
}

// =========================
// PREVIEW
// =========================

async function preview(
    interaction,
    session
) {
    const result =
        builder.buildMessage(
            session,
            interaction
        );

    if (!result.success) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    result.errors[0]
                )
            ],
            flags: 64
        });
    }

    await interaction.reply({
        ...result.payload,
        flags: 64
    });
}

// =========================
// RESET
// =========================

async function reset(
    interaction,
    session
) {
    state.create(
        session.userId,
        session.guildId
    );

    const fresh =
        state.get(
            session.userId
        );

    await updatePanel(
        interaction,
        fresh
    );
}

// =========================
// CANCEL
// =========================

async function cancel(
    interaction,
    session
) {
    state.remove(
        session.userId
    );

    await interaction.update({
        content: interactionEmbeds
            .embedCreatorCancelled()
            .data.description,
        embeds: [],
        components: []
    });
}

// =========================
// CONTENT
// =========================

async function content(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.content(session)
    );
}

// =========================
// EMBED
// =========================

async function embed(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.embed(session)
    );
}

// =========================
// AUTHOR
// =========================

async function author(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.author(session)
    );
}

// =========================
// FOOTER
// =========================

async function footer(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.footer(session)
    );
}

// =========================
// MEDIA
// =========================

async function media(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.media(session)
    );
}

// =========================
// FIELDS
// =========================

async function fields(
    interaction
) {
    await interaction.reply({
        content:
            "📋 Field management will be available here.",
        flags: 64
    });
}

// =========================
// COMPONENTS
// =========================

async function components(
    interaction
) {
    await interaction.reply({
        content:
            "🧩 Component management will be available here.",
        flags: 64
    });
}

// =========================
// SAVE
// =========================

async function save(
    interaction,
    session
) {
    await showModal(
        interaction,
        inputs.save(
            session.name || ""
        )
    );
}

// =========================
// SEND
// =========================

async function send(
    interaction
) {
    await interaction.reply({
        content:
            "📤 Send handling will be connected after the creator interaction flow is complete.",
        flags: 64
    });
}

// =========================
// ROUTER
// =========================

async function execute(
    client,
    interaction
) {
    const customId =
        interaction.customId || "";

    const action =
        customId
            .split(":")
            .slice(1)
            .join(":")
            .toLowerCase();

    const session =
        state.get(
            interaction.user.id
        );

    if (!session) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorExpired()
            ],
            flags: 64
        });
    }

    if (
        !isOwner(
            interaction,
            session
        )
    ) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorNoPermission()
            ],
            flags: 64
        });
    }

    switch (action) {
        case "content":
            return content(
                interaction,
                session
            );

        case "embed":
            return embed(
                interaction,
                session
            );

        case "author":
            return author(
                interaction,
                session
            );

        case "footer":
            return footer(
                interaction,
                session
            );

        case "media":
            return media(
                interaction,
                session
            );

        case "fields":
            return fields(
                interaction,
                session
            );

        case "components":
            return components(
                interaction,
                session
            );

        case "preview":
            return preview(
                interaction,
                session
            );

        case "save":
            return save(
                interaction,
                session
            );

        case "send":
            return send(
                interaction,
                session
            );

        case "reset":
            return reset(
                interaction,
                session
            );

        case "cancel":
            return cancel(
                interaction,
                session
            );

        default:
            return interaction.reply({
                embeds: [
                    interactionEmbeds.embedCreatorFailed(
                        "That creator action is not available."
                    )
                ],
                flags: 64
            });
    }
}

// =========================
// EXPORTS
// =========================

module.exports = {
    name: "embedCreator",
    type: "button",
    execute
};
