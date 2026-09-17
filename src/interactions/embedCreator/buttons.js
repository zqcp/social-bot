const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const state = require("../../systems/embedCreator/state");
const panel = require("../../systems/embedCreator/panel");
const inputs = require("../../systems/embedCreator/inputs");
const builder = require("../../systems/embedCreator/builder");
const interactionEmbeds = require("../../embeds/general/interaction");

const buttonTypes =
    require("../../systems/embedCreator/components/buttonTypes");

const selectTypes =
    require("../../systems/embedCreator/components/selectTypes");

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
    return interaction.update(
        panel.build(session)
    );
}

// =========================
// OPEN MODAL
// =========================

async function openModal(
    interaction,
    modal
) {
    return interaction.showModal(modal);
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
    interaction,
    session
) {
    return interaction.update(
        panel.buildFields(session)
    );
}

// =========================
// FIELD ADD
// =========================

async function fieldAdd(
    interaction
) {
    return openModal(
        interaction,
        inputs.field()
    );
}

// =========================
// FIELD MANAGE
// =========================

async function fieldManage(
    interaction,
    session
) {
    return interaction.update(
        panel.buildFieldList(session)
    );
}

// =========================
// FIELD SELECT
// =========================

async function fieldSelect(
    interaction,
    session,
    index
) {
    const field =
        session.embed?.fields?.[index];

    if (!field) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That field could not be found."
                )
            ],
            flags: 64
        });
    }

    return openModal(
        interaction,
        inputs.editField(
            index,
            field
        )
    );
}

// =========================
// FIELDS BACK
// =========================

async function fieldsBack(
    interaction,
    session
) {
    return updatePanel(
        interaction,
        session
    );
}

// =========================
// COMPONENTS
// =========================

async function components(
    interaction,
    session
) {
    return interaction.update(
        panel.buildComponents(session)
    );
}

// =========================
// BUTTON TYPE MENU
// =========================

async function buttonTypeMenu(
    interaction
) {
    const rows = [];
    const types = buttonTypes.list();

    for (
        let index = 0;
        index < types.length;
        index += 5
    ) {
        const row =
            new ActionRowBuilder();

        types
            .slice(index, index + 5)
            .forEach(type => {
                const data =
                    buttonTypes.get(type);

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(
                            `embedCreator:component:buttonType:${type}`
                        )
                        .setLabel(
                            data.label
                        )
                        .setStyle(
                            data.style
                        )
                );
            });

        rows.push(row);
    }

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:components:back"
                )
                .setLabel("Back")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    );

    const embed =
        new EmbedBuilder()
            .setTitle("Button Type")
            .setDescription(
                "Select the type of button you want to add."
            );

    return interaction.update({
        embeds: [embed],
        components: rows
    });
}

// =========================
// SELECT TYPE MENU
// =========================

async function selectTypeMenu(
    interaction
) {
    const rows = [];
    const types = selectTypes.list();

    for (
        let index = 0;
        index < types.length;
        index += 5
    ) {
        const row =
            new ActionRowBuilder();

        types
            .slice(index, index + 5)
            .forEach(type => {
                const data =
                    selectTypes.get(type);

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(
                            `embedCreator:component:selectType:${type}`
                        )
                        .setLabel(
                            data.label
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        )
                );
            });

        rows.push(row);
    }

    rows.push(
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "embedCreator:components:back"
                )
                .setLabel("Back")
                .setStyle(
                    ButtonStyle.Secondary
                )
        )
    );

    const embed =
        new EmbedBuilder()
            .setTitle("Select Menu Type")
            .setDescription(
                "Select the type of select menu you want to add."
            );

    return interaction.update({
        embeds: [embed],
        components: rows
    });
}

// =========================
// BUTTON TYPE SELECT
// =========================

async function buttonTypeSelect(
    interaction,
    type
) {
    const buttonType =
        buttonTypes.get(type);

    if (!buttonType) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That button type is invalid."
                )
            ],
            flags: 64
        });
    }

    return openModal(
        interaction,
        inputs.button({
            style: type
        })
    );
}

// =========================
// SELECT TYPE SELECT
// =========================

async function selectTypeSelect(
    interaction,
    type
) {
    const selectType =
        selectTypes.get(type);

    if (!selectType) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That select menu type is invalid."
                )
            ],
            flags: 64
        });
    }

    return openModal(
        interaction,
        inputs.select({
            type,
            selectType: type
        })
    );
}

// =========================
// COMPONENT ADD BUTTON
// =========================

async function componentAddButton(
    interaction
) {
    return buttonTypeMenu(
        interaction
    );
}

// =========================
// COMPONENT ADD SELECT
// =========================

async function componentAddSelect(
    interaction
) {
    return selectTypeMenu(
        interaction
    );
}

// =========================
// COMPONENT MANAGE
// =========================

async function componentManage(
    interaction,
    session
) {
    return interaction.update(
        panel.buildComponentList(session)
    );
}

// =========================
// COMPONENT SELECT
// =========================

async function componentSelect(
    interaction,
    session,
    index
) {
    const component =
        Array.isArray(session.components)
            ? session.components[index]
            : null;

    if (!component) {
        return interaction.reply({
            embeds: [
                interactionEmbeds.embedCreatorInvalid(
                    "That component could not be found."
                )
            ],
            flags: 64
        });
    }

    if (
        component.type === "button"
    ) {
        return openModal(
            interaction,
            inputs.button({
                ...component,
                index
            })
        );
    }

    if (
        component.type === "select"
    ) {
        const selectType =
            (
                component.selectType ||
                "string"
            ).toLowerCase();

        if (
            !selectTypes.has(
                selectType
            )
        ) {
            return interaction.reply({
                embeds: [
                    interactionEmbeds.embedCreatorInvalid(
                        "That select menu type is invalid."
                    )
                ],
                flags: 64
            });
        }

        return openModal(
            interaction,
            inputs.select({
                ...component,
                type: selectType,
                selectType,
                index
            })
        );
    }

    return interaction.reply({
        embeds: [
            interactionEmbeds.embedCreatorInvalid(
                "That component type is invalid."
            )
        ],
        flags: 64
    });
}

// =========================
// COMPONENTS BACK
// =========================

async function componentsBack(
    interaction,
    session
) {
    return updatePanel(
        interaction,
        session
    );
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

    const sentMessages =
        Array.isArray(session.sentMessages)
            ? session.sentMessages
            : [];

    let existingMessage = null;

    for (
        const entry of sentMessages
    ) {
        try {
            const channel =
                await interaction.client.channels.fetch(
                    entry.channelId
                );

            if (!channel) continue;

            existingMessage =
                await channel.messages.fetch(
                    entry.messageId
                );

            if (existingMessage) {
                break;
            }
        } catch {
            state.removeSentMessage(
                session.userId,
                entry.messageId
            );
        }
    }

    if (existingMessage) {
        await existingMessage.edit(
            result.payload
        );
    } else {
        const sent =
            await interaction.channel.send(
                result.payload
            );

        state.addSentMessage(
            session.userId,
            {
                guildId:
                    sent.guildId,
                channelId:
                    sent.channelId,
                messageId:
                    sent.id
            }
        );
    }

    return interaction.reply({
        content:
            "Embed sent successfully.",
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
        content:
            embed.data.description,
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

            case "field:add":
                return fieldAdd(
                    interaction
                );

            case "field:manage":
                return fieldManage(
                    interaction,
                    session
                );

            case "fields:back":
                return fieldsBack(
                    interaction,
                    session
                );

            case "components":
                return components(
                    interaction,
                    session
                );

            case "component:addbutton":
                return componentAddButton(
                    interaction
                );

            case "component:addselect":
                return componentAddSelect(
                    interaction
                );

            case "component:manage":
                return componentManage(
                    interaction,
                    session
                );

            case "components:back":
                return componentsBack(
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
                if (
                    action.startsWith(
                        "component:buttontype:"
                    )
                ) {
                    const type =
                        action
                            .split(":")[2];

                    return buttonTypeSelect(
                        interaction,
                        type
                    );
                }

                if (
                    action.startsWith(
                        "component:selecttype:"
                    )
                ) {
                    const type =
                        action
                            .split(":")[2];

                    return selectTypeSelect(
                        interaction,
                        type
                    );
                }

                if (
                    action.startsWith(
                        "field:select:"
                    )
                ) {
                    const index =
                        Number(
                            action.split(":")[2]
                        );

                    return fieldSelect(
                        interaction,
                        session,
                        index
                    );
                }

                if (
                    action.startsWith(
                        "component:select:"
                    )
                ) {
                    const index =
                        Number(
                            action.split(":")[2]
                        );

                    return componentSelect(
                        interaction,
                        session,
                        index
                    );
                }

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
