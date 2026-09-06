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
    const view = panel.build(session);

    await interaction.update(view);
}

// =========================
// OPEN MODAL
// =========================

async function openModal(
    interaction,
    modal
) {
    await interaction.showModal(modal);
}

// =========================
// CONTENT
// =========================

async function content(
    interaction,
    session
) {
    return openModal(
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
    return openModal(
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
    return openModal(
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
    return openModal(
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
    return openModal(
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
    return interaction.reply({
        content:
            "📋 Field management is being connected.",
        flags: 64
    });
}

// =========================
// COMPONENTS
// =========================

async function components(
    interaction
) {
    return interaction.reply({
        content:
            "🧩 Component management is being connected.",
        flags: 64
    });
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

    return interaction.reply({
        ...result.payload,
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
    return openModal(
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
    return interaction.reply({
        content:
            "📤 Send will be connected after the creator flow is complete.",
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

    const updated =
        state.get(
            session.userId
        );

    return updatePanel(
        interaction,
        updated
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

    const embed =
        interactionEmbeds
            .embedCreatorCancelled();

    return interaction.update({
        content: embed.data.description,
        embeds: [],
        components: []
    });
}

// =========================
// EXECUTE
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

    try {
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
    } catch (error) {
        console.error(
            "Embed Creator Button Error:",
            error
        );

        if (
            interaction.deferred ||
            interaction.replied
        ) {
            return interaction.editReply({
                embeds: [
                    interactionEmbeds.embedCreatorFailed()
                ]
            });
        }

        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorFailed()
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
