const Embed = require("../../models/Embed");
const state = require("../../systems/embedCreator/state");
const panel = require("../../systems/embedCreator/panel");
const componentManager =
    require("../../systems/embedCreator/components/manager");
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

function getValue(
    interaction,
    id
) {
    return interaction.fields.getTextInputValue(
        id
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

    if (interaction.message) {
        await interaction.message.edit(view);
    }

    await interaction.deleteReply();
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
        getValue(
            interaction,
            "title"
        )
    );

    state.updateEmbed(
        session.userId,
        "description",
        getValue(
            interaction,
            "description"
        )
    );

    state.updateEmbed(
        session.userId,
        "color",
        getValue(
            interaction,
            "color"
        )
    );

    state.updateEmbed(
        session.userId,
        "url",
        getValue(
            interaction,
            "url"
        )
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
// EDIT FIELD
// =========================

function editField(
    interaction,
    session,
    index
) {
    const fields =
        Array.isArray(
            session.embed?.fields
        )
            ? [
                ...session.embed.fields
            ]
            : [];

    if (
        !Number.isInteger(index) ||
        !fields[index]
    ) {
        throw new Error(
            "That field could not be found."
        );
    }

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

    fields[index] = {
        name,
        value,
        inline
    };

    state.updateEmbed(
        session.userId,
        "fields",
        fields
    );
}

// =========================
// UPDATE COMPONENT
// =========================

function updateComponent(
    interaction,
    session,
    index
) {
    const components =
        Array.isArray(
            session.components
        )
            ? [
                ...session.components
            ]
            : [];

    if (
        !Number.isInteger(index) ||
        !components[index]
    ) {
        throw new Error(
            "That component could not be found."
        );
    }

    const component =
        components[index];

    if (
        component.type === "button"
    ) {
        const style =
            getValue(
                interaction,
                "style"
            )
                .trim()
                .toLowerCase();

        if (
            ![
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ].includes(style)
        ) {
            throw new Error(
                "Invalid button style."
            );
        }

        components[index] = {
            ...component,
            type: "button",
            label: getValue(
                interaction,
                "label"
            ).trim(),
            style,
            emoji: getValue(
                interaction,
                "emoji"
            ).trim(),
            customId: getValue(
                interaction,
                "customId"
            ).trim(),
            url: getValue(
                interaction,
                "url"
            ).trim()
        };
    } else if (
        component.type === "select"
    ) {
        const type =
            getValue(
                interaction,
                "type"
            )
                .trim()
                .toLowerCase();

        if (
            ![
                "string",
                "user",
                "role",
                "channel",
                "mentionable"
            ].includes(type)
        ) {
            throw new Error(
                "Invalid select menu type."
            );
        }

        const minValues =
            Number(
                getValue(
                    interaction,
                    "minValues"
                )
            );

        const maxValues =
            Number(
                getValue(
                    interaction,
                    "maxValues"
                )
            );

        const min =
            Number.isInteger(
                minValues
            ) &&
            minValues >= 0
                ? minValues
                : 1;

        const max =
            Number.isInteger(
                maxValues
            ) &&
            maxValues >= min
                ? maxValues
                : min;

        components[index] = {
            ...component,
            type: "select",
            selectType: type,
            customId: getValue(
                interaction,
                "customId"
            ).trim(),
            placeholder: getValue(
                interaction,
                "placeholder"
            ).trim(),
            minValues: min,
            maxValues: max
        };
    } else {
        throw new Error(
            "Invalid component type."
        );
    }

    state.update(
        session.userId,
        {
            components
        }
    );
}

// =========================
// ADD BUTTON
// =========================

function addButton(
    interaction,
    session
) {
    const label = getValue(
        interaction,
        "label"
    ).trim();

    const style = getValue(
        interaction,
        "style"
    ).trim().toLowerCase();

    const emoji = getValue(
        interaction,
        "emoji"
    ).trim();

    const customId = getValue(
        interaction,
        "customId"
    ).trim();

    const url = getValue(
        interaction,
        "url"
    ).trim();

    if (
        ![
            "primary",
            "secondary",
            "success",
            "danger",
            "link"
        ].includes(style)
    ) {
        throw new Error(
            "Invalid button style."
        );
    }

    if (
        style === "link" &&
        !url
    ) {
        throw new Error(
            "A link button requires a URL."
        );
    }

    if (
        style !== "link" &&
        !customId
    ) {
        throw new Error(
            "This button requires a custom ID."
        );
    }

    componentManager.add(
        session.userId,
        {
            type: "button",
            label,
            style,
            emoji,
            customId,
            url,
            disabled: false
        }
    );
}

// =========================
// ADD SELECT
// =========================

function addSelect(
    interaction,
    session
) {
    const type = getValue(
        interaction,
        "type"
    ).trim().toLowerCase();

    if (
        ![
            "string",
            "user",
            "role",
            "channel",
            "mentionable"
        ].includes(type)
    ) {
        throw new Error(
            "Invalid select menu type."
        );
    }

    const customId = getValue(
        interaction,
        "customId"
    ).trim();

    const placeholder = getValue(
        interaction,
        "placeholder"
    ).trim();

    if (!customId) {
        throw new Error(
            "A select menu requires a custom ID."
        );
    }

    const minValues =
        Number(
            getValue(
                interaction,
                "minValues"
            )
        );

    const maxValues =
        Number(
            getValue(
                interaction,
                "maxValues"
            )
        );

    const min =
        Number.isInteger(
            minValues
        ) &&
        minValues >= 0
            ? minValues
            : 1;

    const max =
        Number.isInteger(
            maxValues
        ) &&
        maxValues >= min
            ? maxValues
            : min;

    componentManager.add(
        session.userId,
        {
            type: "select",
            selectType: type,
            customId,
            placeholder,
            minValues: min,
            maxValues: max,
            options: [],
            disabled: false
        }
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

    return name;
}

// =========================
// SAVE EMBED
// =========================

async function saveEmbed(
    session,
    name
) {
    const current =
        state.get(
            session.userId
        );

    if (!current) {
        throw new Error(
            "The embed creator session has expired."
        );
    }

    await Embed.findOneAndUpdate(
        {
            guildId:
                current.guildId,
            userId:
                current.userId,
            name:
                session.name
        },
        {
            $set: {
                name,
                content:
                    current.content || "",
                embed:
                    current.embed || {},
                components:
                    current.components || []
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return true;
}

// =========================
// ACKNOWLEDGE MODAL
// =========================

async function acknowledge(
    interaction
) {
    await interaction.deferReply({
        flags: 64
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
        await acknowledge(
            interaction
        );

        switch (action) {
            case "content":
                updateContent(
                    interaction,
                    session
                );
                break;

            case "embed":
                updateEmbed(
                    interaction,
                    session
                );
                break;

            case "author":
                updateAuthor(
                    interaction,
                    session
                );
                break;

            case "footer":
                updateFooter(
                    interaction,
                    session
                );
                break;

            case "media":
                updateMedia(
                    interaction,
                    session
                );
                break;

            case "field":
                addField(
                    interaction,
                    session
                );
                break;

            default:
                if (
                    action.startsWith(
                        "field:edit:"
                    )
                ) {
                    const index =
                        Number(
                            action.split(":")[2]
                        );

                    editField(
                        interaction,
                        session,
                        index
                    );

                    break;
                }

                if (
                    action ===
                    "component:button"
                ) {
                    addButton(
                        interaction,
                        session
                    );

                    break;
                }

                if (
                    action ===
                    "component:select"
                ) {
                    addSelect(
                        interaction,
                        session
                    );

                    break;
                }

                if (
                    action.startsWith(
                        "component:button:edit:"
                    )
                ) {
                    const index =
                        Number(
                            action.split(":")[3]
                        );

                    updateComponent(
                        interaction,
                        session,
                        index
                    );

                    break;
                }

                if (
                    action.startsWith(
                        "component:select:edit:"
                    )
                ) {
                    const index =
                        Number(
                            action.split(":")[3]
                        );

                    updateComponent(
                        interaction,
                        session,
                        index
                    );

                    break;
                }

                if (action === "save") {
                    const oldName =
                        session.name;

                    const name =
                        updateName(
                            interaction,
                            session
                        );

                    const updated =
                        state.get(
                            session.userId
                        );

                    await Embed.findOneAndUpdate(
                        {
                            guildId:
                                updated.guildId,
                            userId:
                                updated.userId,
                            name:
                                oldName
                        },
                        {
                            $set: {
                                name,
                                content:
                                    updated.content || "",
                                embed:
                                    updated.embed || {},
                                components:
                                    updated.components || []
                            }
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    );

                    break;
                }

                throw new Error(
                    "That creator form is not available."
                );
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

        if (
            interaction.deferred ||
            interaction.replied
        ) {
            return interaction.editReply({
                embeds: [
                    interactionEmbeds.embedCreatorInvalid(
                        error.message
                    )
                ],
                components: []
            });
        }

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

// =========================
// EXPORTS
// =========================

module.exports = {
    name: "embedCreator",
    type: "modal",
    execute
};
