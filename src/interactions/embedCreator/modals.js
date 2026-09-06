const state = require("../../systems/embedCreator/state");
const panel = require("../../systems/embedCreator/panel");
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
// GET VALUE
// =========================

function getValue(interaction, id) {
    return interaction.fields.getTextInputValue(id);
}

// =========================
// UPDATE PANEL
// =========================

async function updatePanel(
    interaction,
    session
) {
    const view = panel.build(session);

    await interaction.editReply(view);
}

// =========================
// UPDATE CONTENT
// =========================

function updateContent(
    interaction,
    session
) {
    state.update(
        session.userId,
        {
            content: getValue(
                interaction,
                "content"
            )
        }
    );
}

// =========================
// UPDATE EMBED
// =========================

function updateEmbed(
    interaction,
    session
) {
    state.updateEmbed(
        session.userId,
        "title",
        getValue(interaction, "title")
    );

    state.updateEmbed(
        session.userId,
        "description",
        getValue(interaction, "description")
    );

    state.updateEmbed(
        session.userId,
        "color",
        getValue(interaction, "color")
    );

    state.updateEmbed(
        session.userId,
        "url",
        getValue(interaction, "url")
    );
}

// =========================
// UPDATE AUTHOR
// =========================

function updateAuthor(
    interaction,
    session
) {
    state.updateAuthor(
        session.userId,
        {
            name: getValue(
                interaction,
                "name"
            ),
            iconURL: getValue(
                interaction,
                "iconURL"
            ),
            url: getValue(
                interaction,
                "url"
            )
        }
    );
}

// =========================
// UPDATE FOOTER
// =========================

function updateFooter(
    interaction,
    session
) {
    state.updateFooter(
        session.userId,
        {
            text: getValue(
                interaction,
                "text"
            ),
            iconURL: getValue(
                interaction,
                "iconURL"
            )
        }
    );
}

// =========================
// UPDATE MEDIA
// =========================

function updateMedia(
    interaction,
    session
) {
    state.updateEmbed(
        session.userId,
        "thumbnail",
        getValue(
            interaction,
            "thumbnail"
        )
    );

    state.updateEmbed(
        session.userId,
        "image",
        getValue(
            interaction,
            "image"
        )
    );
}

// =========================
// ADD FIELD
// =========================

function addField(
    interaction,
    session
) {
    const name = getValue(
        interaction,
        "name"
    ).trim();

    const value = getValue(
        interaction,
        "value"
    ).trim();

    const inline =
        getValue(
            interaction,
            "inline"
        )
            .trim()
            .toLowerCase() === "true";

    if (!name) {
        throw new Error(
            "Field name cannot be empty."
        );
    }

    if (!value) {
        throw new Error(
            "Field value cannot be empty."
        );
    }

    const fields =
        Array.isArray(
            session.embed.fields
        )
            ? [
                ...session.embed.fields
            ]
            : [];

    if (fields.length >= 25) {
        throw new Error(
            "An embed cannot contain more than 25 fields."
        );
    }

    fields.push({
        name,
        value,
        inline
    });

    state.updateEmbed(
        session.userId,
        "fields",
        fields
    );
}

// =========================
// UPDATE SAVE NAME
// =========================

function updateName(
    interaction,
    session
) {
    const name = getValue(
        interaction,
        "name"
    ).trim();

    if (!name) {
        throw new Error(
            "Embed name cannot be empty."
        );
    }

    state.update(
        session.userId,
        {
            name
        }
    );
}

// =========================
// ACKNOWLEDGE MODAL
// =========================

async function acknowledge(
    interaction
) {
    await interaction.deferUpdate();
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
                await acknowledge(interaction);

                updateContent(
                    interaction,
                    session
                );
                break;

            case "embed":
                await acknowledge(interaction);

                updateEmbed(
                    interaction,
                    session
                );
                break;

            case "author":
                await acknowledge(interaction);

                updateAuthor(
                    interaction,
                    session
                );
                break;

            case "footer":
                await acknowledge(interaction);

                updateFooter(
                    interaction,
                    session
                );
                break;

            case "media":
                await acknowledge(interaction);

                updateMedia(
                    interaction,
                    session
                );
                break;

            case "field":
                await acknowledge(interaction);

                addField(
                    interaction,
                    session
                );
                break;

            case "save":
                await acknowledge(interaction);

                updateName(
                    interaction,
                    session
                );
                break;

            default:
                return interaction.reply({
                    embeds: [
                        interactionEmbeds.embedCreatorFailed(
                            "That creator form is not available."
                        )
                    ],
                    flags: 64
                });
        }

        const updated =
            state.get(
                session.userId
            );

        if (!updated) {
            return;
        }

        await updatePanel(
            interaction,
            updated
        );
    } catch (error) {
        console.error(
            "Embed Creator Modal Error:",
            error
        );

        if (interaction.deferred) {
            return interaction.editReply({
                embeds: [
                    interactionEmbeds.embedCreatorInvalid(
                        error.message
                    )
                ],
                components: []
            });
        }

        if (!interaction.replied) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.embedCreatorInvalid(
                        error.message
                    )
                ],
                flags: 64
            });
        }
    }
}

// =========================
// EXPORTS
// =========================

module.exports = {
    name: "embedCreator",
    type: "modal",
    execute
};
