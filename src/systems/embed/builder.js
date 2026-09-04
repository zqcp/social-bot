const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelSelectMenuBuilder
} = require("discord.js");

const Embed = require("../../models/Embed");

const SESSION_TIMEOUT = 30 * 60 * 1000;

const sessions = new Map();


// ============================================================
// SESSION
// ============================================================

function createEmbed() {
    return {
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

function createSession(userId, guildId, messageId, channelId, name) {
    const session = {
        userId,
        guildId,
        messageId,
        channelId,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),

        data: {
            content: "",
            embeds: [
                createEmbed()
            ],
            buttons: [],
            selectMenus: [],

            activeEmbed: 0,
            activeField: 0,
            activeButton: 0,
            activeSelectMenu: 0
        }
    };

    sessions.set(userId, session);

    return session;
}

function getSession(userId) {
    const session = sessions.get(userId);

    if (!session) return null;

    if (Date.now() - session.updatedAt > SESSION_TIMEOUT) {
        sessions.delete(userId);
        return null;
    }

    session.updatedAt = Date.now();

    return session;
}

function updateSession(session) {
    session.updatedAt = Date.now();
    sessions.set(session.userId, session);
}

function deleteSession(userId) {
    sessions.delete(userId);
}


// ============================================================
// VARIABLES
// ============================================================

function replaceVariables(text, message, client) {
    if (!text || typeof text !== "string") return text || "";

    const user = message.author;
    const member = message.member;
    const guild = message.guild;
    const channel = message.channel;
    const bot = client.user;

    const now = new Date();

    const variables = {
        "{user}": user?.tag || "",
        "{user.name}": user?.displayName || user?.username || "",
        "{user.username}": user?.username || "",
        "{user.tag}": user?.tag || "",
        "{user.id}": user?.id || "",
        "{user.mention}": user ? `<@${user.id}>` : "",
        "{user.avatar}": user?.displayAvatarURL?.({ dynamic: true }) || "",
        "{user.created}": user?.createdAt
            ? `<t:${Math.floor(user.createdAt.getTime() / 1000)}:D>`
            : "",

        "{member}": member?.displayName || user?.tag || "",
        "{member.name}": member?.displayName || "",
        "{member.nickname}": member?.nickname || "",
        "{member.id}": member?.id || "",
        "{member.mention}": member ? `<@${member.id}>` : "",
        "{member.joined}": member?.joinedAt
            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:D>`
            : "",
        "{member.joinedAt}": member?.joinedAt
            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:D>`
            : "",
        "{member.avatar}": member?.displayAvatarURL?.({ dynamic: true }) || "",

        "{server}": guild?.name || "",
        "{server.name}": guild?.name || "",
        "{server.id}": guild?.id || "",
        "{server.icon}": guild?.iconURL?.({ dynamic: true }) || "",
        "{server.owner}": guild?.ownerId
            ? `<@${guild.ownerId}>`
            : "",
        "{server.owner.id}": guild?.ownerId || "",
        "{server.owner.mention}": guild?.ownerId
            ? `<@${guild.ownerId}>`
            : "",
        "{server.membercount}": guild?.memberCount?.toString() || "0",
        "{server.members}": guild?.memberCount?.toString() || "0",
        "{server.created}": guild?.createdAt
            ? `<t:${Math.floor(guild.createdAt.getTime() / 1000)}:D>`
            : "",

        "{channel}": channel?.name || "",
        "{channel.name}": channel?.name || "",
        "{channel.id}": channel?.id || "",
        "{channel.mention}": channel ? `<#${channel.id}>` : "",
        "{channel.type}": channel?.type?.toString() || "",
        "{channel.created}": channel?.createdAt
            ? `<t:${Math.floor(channel.createdAt.getTime() / 1000)}:D>`
            : "",

        "{bot}": bot?.tag || "",
        "{bot.name}": bot?.displayName || bot?.username || "",
        "{bot.username}": bot?.username || "",
        "{bot.tag}": bot?.tag || "",
        "{bot.id}": bot?.id || "",
        "{bot.mention}": bot ? `<@${bot.id}>` : "",
        "{bot.avatar}": bot?.displayAvatarURL?.({ dynamic: true }) || "",

        "{time}": now.toLocaleTimeString(),
        "{time.short}": now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        }),
        "{time.long}": now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }),

        "{date}": now.toLocaleDateString(),
        "{date.short}": now.toLocaleDateString(),
        "{date.long}": now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }),

        "{timestamp}": `<t:${Math.floor(now.getTime() / 1000)}>`,
        "{timestamp.relative}": `<t:${Math.floor(now.getTime() / 1000)}:R>`,
        "{timestamp.short}": `<t:${Math.floor(now.getTime() / 1000)}:t>`,
        "{timestamp.long}": `<t:${Math.floor(now.getTime() / 1000)}:T>`,
        "{timestamp.date}": `<t:${Math.floor(now.getTime() / 1000)}:d>`,
        "{timestamp.date.long}": `<t:${Math.floor(now.getTime() / 1000)}:D>`,
        "{timestamp.datetime}": `<t:${Math.floor(now.getTime() / 1000)}:f>`,
        "{timestamp.datetime.long}": `<t:${Math.floor(now.getTime() / 1000)}:F>`
    };

    for (const [variable, value] of Object.entries(variables)) {
        text = text.split(variable).join(value);
    }

    return text;
}


// ============================================================
// EMBEDS
// ============================================================

function buildEmbeds(session, message, client) {
    return session.data.embeds
        .slice(0, 10)
        .map(data => {
            const embed = new EmbedBuilder();

            if (data.title) {
                embed.setTitle(
                    replaceVariables(data.title, message, client)
                );
            }

            if (data.description) {
                embed.setDescription(
                    replaceVariables(data.description, message, client)
                );
            }

            if (data.url) {
                embed.setURL(
                    replaceVariables(data.url, message, client)
                );
            }

            if (data.color) {
                try {
                    embed.setColor(data.color);
                } catch {
                    // Ignore invalid colors.
                }
            }

            if (data.author?.name) {
                const author = {
                    name: replaceVariables(
                        data.author.name,
                        message,
                        client
                    )
                };

                if (data.author.url) {
                    author.url = replaceVariables(
                        data.author.url,
                        message,
                        client
                    );
                }

                if (data.author.iconURL) {
                    author.iconURL = replaceVariables(
                        data.author.iconURL,
                        message,
                        client
                    );
                }

                embed.setAuthor(author);
            }

            if (data.thumbnail) {
                embed.setThumbnail(
                    replaceVariables(
                        data.thumbnail,
                        message,
                        client
                    )
                );
            }

            if (data.image) {
                embed.setImage(
                    replaceVariables(
                        data.image,
                        message,
                        client
                    )
                );
            }

            if (data.footer?.text) {
                const footer = {
                    text: replaceVariables(
                        data.footer.text,
                        message,
                        client
                    )
                };

                if (data.footer.iconURL) {
                    footer.iconURL = replaceVariables(
                        data.footer.iconURL,
                        message,
                        client
                    );
                }

                embed.setFooter(footer);
            }

            if (data.timestamp === true) {
                embed.setTimestamp();
            }

            if (Array.isArray(data.fields)) {
                for (const field of data.fields.slice(0, 25)) {
                    if (!field?.name || !field?.value) continue;

                    embed.addFields({
                        name: replaceVariables(
                            field.name,
                            message,
                            client
                        ),
                        value: replaceVariables(
                            field.value,
                            message,
                            client
                        ),
                        inline: Boolean(field.inline)
                    });
                }
            }

            return embed;
        });
}


// ============================================================
// COMPONENTS
// ============================================================

function buildButtons(session, message, client) {
    if (!session.data.buttons.length) return [];

    return session.data.buttons.map(button => {
        const builder = new ButtonBuilder()
            .setLabel(
                replaceVariables(
                    button.label || "Button",
                    message,
                    client
                )
            )
            .setDisabled(Boolean(button.disabled));

        if (button.emoji) {
            builder.setEmoji(button.emoji);
        }

        if (button.style === "link") {
            builder
                .setStyle(ButtonStyle.Link)
                .setURL(
                    replaceVariables(
                        button.url || "https://discord.com",
                        message,
                        client
                    )
                );
        } else {
            const styles = {
                primary: ButtonStyle.Primary,
                secondary: ButtonStyle.Secondary,
                success: ButtonStyle.Success,
                danger: ButtonStyle.Danger
            };

            builder
                .setStyle(
                    styles[button.style] ||
                    ButtonStyle.Secondary
                )
                .setCustomId(
                    button.customId ||
                    `embed:button:${Math.random()
                        .toString(36)
                        .slice(2, 10)}`
                );
        }

        return builder;
    });
}

function buildSelectMenus(session, message, client) {
    if (!session.data.selectMenus.length) return [];

    return session.data.selectMenus.map(menu => {
        let builder;

        switch (menu.type) {
            case "user":
                builder = new UserSelectMenuBuilder();
                break;

            case "role":
                builder = new RoleSelectMenuBuilder();
                break;

            case "mentionable":
                builder = new MentionableSelectMenuBuilder();
                break;

            case "channel":
                builder = new ChannelSelectMenuBuilder();

                if (Array.isArray(menu.channelTypes) &&
                    menu.channelTypes.length) {
                    builder.setChannelTypes(
                        ...menu.channelTypes
                    );
                }

                break;

            default:
                builder = new StringSelectMenuBuilder();

                if (Array.isArray(menu.options)) {
                    builder.addOptions(
                        menu.options.slice(0, 25)
                    );
                }

                break;
        }

        builder
            .setCustomId(
                menu.customId ||
                `embed:select:${Math.random()
                    .toString(36)
                    .slice(2, 10)}`
            )
            .setDisabled(Boolean(menu.disabled));

        if (menu.placeholder) {
            builder.setPlaceholder(
                replaceVariables(
                    menu.placeholder,
                    message,
                    client
                )
            );
        }

        builder.setMinValues(
            Math.max(0, Number(menu.minValues) || 1)
        );

        builder.setMaxValues(
            Math.max(
                Number(menu.minValues) || 1,
                Number(menu.maxValues) || 1
            )
        );

        return builder;
    });
}

function buildComponents(session, message, client) {
    const components = [];

    const buttons = buildButtons(
        session,
        message,
        client
    );

    const selectMenus = buildSelectMenus(
        session,
        message,
        client
    );

    for (let i = 0; i < buttons.length; i += 5) {
        components.push(
            new ActionRowBuilder().addComponents(
                buttons.slice(i, i + 5)
            )
        );
    }

    for (const menu of selectMenus) {
        components.push(
            new ActionRowBuilder().addComponents(menu)
        );
    }

    return components.slice(0, 5);
}


// ============================================================
// MESSAGE BUILDING
// ============================================================

function buildMessage(session, message, client) {
    const payload = {};

    const content = replaceVariables(
        session.data.content || "",
        message,
        client
    );

    if (content) {
        payload.content = content;
    }

    const embeds = buildEmbeds(
        session,
        message,
        client
    );

    if (embeds.length) {
        payload.embeds = embeds;
    }

    const components = buildComponents(
        session,
        message,
        client
    );

    if (components.length) {
        payload.components = components;
    }

    return payload;
}


// ============================================================
// SEND PAYLOADS
// ============================================================

function buildSendMessages(session, message, client) {
    const embeds = session.data.embeds || [];

    if (!embeds.length) {
        return [
            buildMessage(
                session,
                message,
                client
            )
        ];
    }

    const messages = [];

    for (let i = 0; i < embeds.length; i += 10) {
        const embedChunk = embeds.slice(i, i + 10);

        const tempSession = {
            ...session,
            data: {
                ...session.data,
                embeds: embedChunk
            }
        };

        const payload = buildMessage(
            tempSession,
            message,
            client
        );

        if (i !== 0) {
            delete payload.content;
            delete payload.components;
        }

        messages.push(payload);
    }

    return messages;
}


// ============================================================
// SAVE
// ============================================================

async function saveSession(session) {
    const data = {
        guildId: session.guildId,
        name: session.name,
        channelId: session.channelId || null,
        content: session.data.content || "",
        embeds: session.data.embeds || [],
        buttons: session.data.buttons || [],
        selectMenus: session.data.selectMenus || [],
        createdBy: session.userId
    };

    const saved = await Embed.findOneAndUpdate(
        {
            guildId: session.guildId,
            name: session.name
        },
        {
            $set: data
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    return saved;
}


// ============================================================
// UPDATE SENT MESSAGES
// ============================================================

async function updateSentMessages(saved, message, client) {
    if (!saved?.sentMessages?.length) {
        return [];
    }

    const tempSession = {
        userId: saved.createdBy,
        guildId: saved.guildId,
        channelId: saved.channelId,
        name: saved.name,

        data: {
            content: saved.content || "",
            embeds: saved.embeds || [],
            buttons: saved.buttons || [],
            selectMenus: saved.selectMenus || []
        }
    };

    const payloads = buildSendMessages(
        tempSession,
        message,
        client
    );

    const updated = [];

    for (
        let i = 0;
        i < saved.sentMessages.length && i < payloads.length;
        i++
    ) {
        const sent = saved.sentMessages[i];

        try {
            const channel =
                await client.channels.fetch(
                    sent.channelId
                );

            if (!channel?.isTextBased()) continue;

            const sentMessage =
                await channel.messages.fetch(
                    sent.messageId
                );

            await sentMessage.edit(
                payloads[i]
            );

            updated.push({
                channelId: sent.channelId,
                messageId: sent.messageId
            });
        } catch {
            // Message may have been deleted.
        }
    }

    return updated;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createEmbed,
    createSession,
    getSession,
    updateSession,
    deleteSession,

    replaceVariables,

    buildEmbeds,
    buildButtons,
    buildSelectMenus,
    buildComponents,
    buildMessage,
    buildSendMessages,

    saveSession,
    updateSentMessages
};
