const Embed =
    require("../../models/Embed");

const state =
    require("../../systems/embedCreator/state");

const panel =
    require("../../systems/embedCreator/panel");

const builder =
    require("../../systems/embedCreator/builder");

const componentManager =
    require("../../systems/embedCreator/components/manager");

const interactionEmbeds =
    require("../../embeds/general/interaction");

// =========================
// OWNERSHIP
// =========================

function isOwner(
    interaction,
    session
) {
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
    const current =
        state.get(
            session.userId
        );

    if (!current) {
        return;
    }

    const view =
        panel.build(current);

    if (interaction.message) {
        await interaction.message.edit(
            view
        );
    }

    const payload =
        builder.buildMessage(
            current,
            interaction
        );

    if (
        payload.success &&
        Array.isArray(
            current.sentMessages
        )
    ) {
        for (
            const entry of [
                ...current.sentMessages
            ]
        ) {
            try {
                const channel =
                    await interaction.client.channels.fetch(
                        entry.channelId
                    );

                if (!channel) {
                    continue;
                }

                const sentMessage =
                    await channel.messages.fetch(
                        entry.messageId
                    );

                if (!sentMessage) {
                    continue;
                }

                await sentMessage.edit(
                    payload.payload
                );
            } catch {
                state.removeSentMessage(
                    current.userId,
                    entry.messageId
                );
            }
        }
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
            content:
                getValue(
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
            name:
                getValue(
                    interaction,
                    "name"
                ),
            iconURL:
                getValue(
                    interaction,
                    "iconURL"
                ),
            url:
                getValue(
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
            text:
                getValue(
                    interaction,
                    "text"
                ),
            iconURL:
                getValue(
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
    const name =
        getValue(
            interaction,
            "name"
        ).trim();

    const value =
        getValue(
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

    const name =
        getValue(
            interaction,
            "name"
        ).trim();

    const value =
        getValue(
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
            label:
                getValue(
                    interaction,
                    "label"
                ).trim(),
            style,
            emoji:
                getValue(
                    interaction,
                    "emoji"
                ).trim(),
            customId:
                getValue(
                    interaction,
                    "customId"
                ).trim(),
            url:
                getValue(
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
            customId:
                getValue(
                    interaction,
                    "customId"
                ).trim(),
            placeholder:
                getValue(
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
    const label =
        getValue(
            interaction,
            "label"
        ).trim();

    const style =
        getValue(
            interaction,
            "style"
        )
            .trim()
            .toLowerCase();

    const emoji =
        getValue(
            interaction,
            "emoji"
        ).trim();

    const customId =
        getValue(
            interaction,
            "customId"
        ).trim();

    const url =
        getValue(
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

    const customId =
        getValue(
            interaction,
            "customId"
        ).trim();

    const placeholder =
        getValue(
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
// ADD ROLE
// =========================

function addRole(
    interaction,
    session
) {
    const name =
        getValue(
            interaction,
            "name"
        ).trim();

    const roleId =
        getValue(
            interaction,
            "roleId"
        ).trim();

    if (!name) {
        throw new Error(
            "Role name cannot be empty."
        );
    }

    if (
        !/^\d{17,20}$/.test(
            roleId
        )
    ) {
        throw new Error(
            "Invalid Discord role ID."
        );
    }

    const components =
        Array.isArray(
            session.components
        )
            ? [
                ...session.components
            ]
            : [];

    const index =
        Number(
            interaction.customId
                .split(":")[4]
        );

    if (
        !Number.isInteger(index) ||
        !components[index] ||
        components[index].type !== "select" ||
        components[index].selectType !== "role"
    ) {
        throw new Error(
            "That role select could not be found."
        );
    }

    const options =
        Array.isArray(
            components[index].options
        )
            ? [
                ...components[index].options
            ]
            : [];

    if (
        options.some(
            option =>
                String(option.value) ===
                roleId
        )
    ) {
        throw new Error(
            "That role is already configured."
        );
    }

    if (options.length >= 25) {
        throw new Error(
            "A role select cannot contain more than 25 roles."
        );
    }

    options.push({
        label:
            name.slice(0, 100),
        value: roleId
    });

    components[index] = {
        ...components[index],
        options
    };

    state.update(
        session.userId,
        {
            components
        }
    );
}

// =========================
// EDIT ROLE
// =========================

function editRole(
    interaction,
    session
) {
    const name =
        getValue(
            interaction,
            "name"
        ).trim();

    const roleId =
        getValue(
            interaction,
            "roleId"
        ).trim();

    if (!name) {
        throw new Error(
            "Role name cannot be empty."
        );
    }

    if (
        !/^\d{17,20}$/.test(
            roleId
        )
    ) {
        throw new Error(
            "Invalid Discord role ID."
        );
    }

    const parts =
        interaction.customId.split(":");

    const componentIndex =
        Number(parts[4]);

    const roleIndex =
        Number(parts[5]);

    const components =
        Array.isArray(
            session.components
        )
            ? [
                ...session.components
            ]
            : [];

    if (
        !Number.isInteger(
            componentIndex
        ) ||
        !components[componentIndex] ||
        components[componentIndex].type !== "select" ||
        components[componentIndex].selectType !== "role"
    ) {
        throw new Error(
            "That role select could not be found."
        );
    }

    const options =
        Array.isArray(
            components[componentIndex].options
        )
            ? [
                ...components[componentIndex].options
            ]
            : [];

    if (
        !Number.isInteger(
            roleIndex
        ) ||
        !options[roleIndex]
    ) {
        throw new Error(
            "That role could not be found."
        );
    }

    const duplicate =
        options.some(
            (option, index) =>
                index !== roleIndex &&
                String(option.value) ===
                    roleId
        );

    if (duplicate) {
        throw new Error(
            "That role is already configured."
        );
    }

    options[roleIndex] = {
        label:
            name.slice(0, 100),
        value: roleId
    };

    components[componentIndex] = {
        ...components[componentIndex],
        options
    };

    state.update(
        session.userId,
        {
            components
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
    const name =
        getValue(
            interaction,
            "name"
        ).trim();

    if (!name) {
        throw new Error(
            "Embed name cannot be empty."
        );
    }

    if (name.length > 100) {
        throw new Error(
            "Embed name cannot be longer than 100 characters."
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

    const oldName =
        session.name;

    const existing =
        await Embed.findOne({
            guildId:
                current.guildId,
            userId:
                current.userId,
            name
        });

    if (
        existing &&
        String(existing._id) !==
            String(
                session.savedEmbedId
            )
    ) {
        throw new Error(
            "An embed with that name already exists."
        );
    }

    const data = {
        guildId:
            current.guildId,

        userId:
            current.userId,

        name,

        content:
            current.content || "",

        embed:
            current.embed || {},

        components:
            Array.isArray(
                current.components
            )
                ? current.components
                : [],

        sentMessages:
            Array.isArray(
                current.sentMessages
            )
                ? current.sentMessages
                : []
    };

    // =========================
    // EXISTING EMBED
    // =========================

    if (
        session.savedEmbedId
    ) {
        const saved =
            await Embed.findOneAndUpdate(
                {
                    _id:
                        session.savedEmbedId,
                    guildId:
                        current.guildId,
                    userId:
                        current.userId
                },
                {
                    $set: {
                        name:
                            data.name,
                        content:
                            data.content,
                        embed:
                            data.embed,
                        components:
                            data.components,
                        sentMessages:
                            data.sentMessages
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!saved) {
            throw new Error(
                "The saved embed could not be found."
            );
        }

        return saved;
    }

    // =========================
    // NEW EMBED
    // =========================

    const saved =
        await Embed.create(
            data
        );

    // Keep the saved document
    // attached to this session.
    session.savedEmbedId =
        saved._id;

    return saved;
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

            case "component:button":
                addButton(
                    interaction,
                    session
                );
                break;

            case "component:select":
                addSelect(
                    interaction,
                    session
                );
                break;

            case "component:role:add":
                addRole(
                    interaction,
                    session
                );
                break;

            case "component:role:edit":
                editRole(
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

                // =========================
                // SAVE
                // =========================

                if (action === "save") {

                    const name =
                        updateName(
                            interaction,
                            session
                        );

                    const saved =
                        await saveEmbed(
                            session,
                            name
                        );

                    const updated =
                        state.get(
                            session.userId
                        );

                    if (
                        interaction.message
                    ) {
                        await interaction.message.edit(
                            panel.build(
                                updated
                            )
                        );
                    }

                    return interaction.editReply({
                        content:
                            "Your embed has been saved.",
                        embeds: [],
                        components: []
                    });
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
