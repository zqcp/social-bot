const crypto = require("crypto");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    PermissionsBitField
} = require("discord.js");

const Embed = require("../../models/Embed");

const sessions = new Map();
const SESSION_TTL = 30 * 60 * 1000;

function createToken() {
    return crypto.randomBytes(24).toString("hex");
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeEmbed(embed = {}) {
    const out = clone(embed);

    if (out.color !== undefined && out.color !== null && out.color !== "") {
        if (typeof out.color === "string") {
            const hex = out.color.replace("#", "");
            const parsed = parseInt(hex, 16);
            out.color = Number.isNaN(parsed) ? undefined : parsed;
        }
        if (typeof out.color === "number") out.color = out.color >>> 0;
    }

    return out;
}

function normalizeData(data = {}) {
    let embeds = Array.isArray(data.embeds)
        ? data.embeds
        : data.embed
            ? [data.embed]
            : [];

    return {
        content: typeof data.content === "string" ? data.content : "",
        embeds: embeds.map(normalizeEmbed),
        buttons: Array.isArray(data.buttons) ? data.buttons : [],
        selectMenus: Array.isArray(data.selectMenus) ? data.selectMenus : [],
        channelId: data.channelId || null
    };
}

function createSession({ userId, guildId, name, data, edit = false }) {
    const token = createToken();

    const session = {
        token,
        userId,
        guildId,
        name,
        edit,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: normalizeData(data)
    };

    sessions.set(token, session);
    return session;
}

function getSession(token) {
    const session = sessions.get(token);
    if (!session) return null;

    if (Date.now() - session.updatedAt > SESSION_TTL) {
        sessions.delete(token);
        return null;
    }

    return session;
}

function deleteSession(token) {
    sessions.delete(token);
}

function encodeBuilderData(data) {
    const clean = {
        content: data.content || "",
        embeds: Array.isArray(data.embeds) ? data.embeds : []
    };

    return Buffer.from(
        encodeURIComponent(JSON.stringify(clean)),
        "utf8"
    ).toString("base64");
}

function editorUrl(req, token, data) {
    const base = `${req.protocol}://${req.get("host")}/embedbuilder/`;
    const encoded = encodeBuilderData(data || {});

    return `${base}?token=${encodeURIComponent(token)}&data=${encodeURIComponent(encoded)}`;
}

function buildEmbed(data) {
    const embed = new EmbedBuilder();

    if (data.title) embed.setTitle(String(data.title));
    if (data.description) embed.setDescription(String(data.description));
    if (data.url) embed.setURL(String(data.url));

    if (data.color !== undefined && data.color !== null && data.color !== "") {
        try {
            embed.setColor(Number(data.color));
        } catch {}
    }

    if (data.author?.name) {
        const author = { name: String(data.author.name) };
        if (data.author.url) author.url = String(data.author.url);
        if (data.author.icon_url) author.iconURL = String(data.author.icon_url);
        embed.setAuthor(author);
    }

    if (data.thumbnail?.url) embed.setThumbnail(String(data.thumbnail.url));
    if (data.image?.url) embed.setImage(String(data.image.url));

    if (data.footer?.text) {
        const footer = { text: String(data.footer.text) };
        if (data.footer.icon_url) footer.iconURL = String(data.footer.icon_url);
        embed.setFooter(footer);
    }

    if (data.timestamp) {
        if (typeof data.timestamp === "string") {
            const date = new Date(data.timestamp);
            if (!Number.isNaN(date.getTime())) embed.setTimestamp(date);
        } else {
            embed.setTimestamp();
        }
    }

    if (Array.isArray(data.fields)) {
        const fields = data.fields
            .filter(field => field && field.name && field.value)
            .slice(0, 25)
            .map(field => ({
                name: String(field.name),
                value: String(field.value),
                inline: Boolean(field.inline)
            }));

        if (fields.length) embed.addFields(fields);
    }

    return embed;
}

function buildComponents(data) {
    const rows = [];
    let buttonRow = null;

    for (const raw of Array.isArray(data.buttons) ? data.buttons : []) {
        const button = new ButtonBuilder();

        if (raw.style === "link") {
            if (!raw.url) continue;
            button.setStyle(ButtonStyle.Link).setURL(String(raw.url));
        } else {
            const styles = {
                primary: ButtonStyle.Primary,
                secondary: ButtonStyle.Secondary,
                success: ButtonStyle.Success,
                danger: ButtonStyle.Danger
            };

            button
                .setStyle(styles[raw.style] || ButtonStyle.Secondary)
                .setCustomId(String(raw.customId || `embed_${crypto.randomBytes(6).toString("hex")}`));
        }

        if (raw.label) button.setLabel(String(raw.label));
        if (raw.emoji) button.setEmoji(String(raw.emoji));
        if (raw.disabled) button.setDisabled(true);

        if (!buttonRow || buttonRow.components.length >= 5) {
            buttonRow = new ActionRowBuilder();
            rows.push(buttonRow);
        }

        buttonRow.addComponents(button);
    }

    for (const raw of Array.isArray(data.selectMenus) ? data.selectMenus : []) {
        if (rows.length >= 5) break;

        let menu;

        const common = {
            customId: String(raw.customId || `select_${crypto.randomBytes(6).toString("hex")}`),
            placeholder: raw.placeholder ? String(raw.placeholder) : undefined,
            minValues: Number.isInteger(raw.minValues) ? raw.minValues : 1,
            maxValues: Number.isInteger(raw.maxValues) ? raw.maxValues : 1,
            disabled: Boolean(raw.disabled)
        };

        if (raw.type === "user") {
            menu = new UserSelectMenuBuilder().setCustomId(common.customId);
        } else if (raw.type === "role") {
            menu = new RoleSelectMenuBuilder().setCustomId(common.customId);
        } else if (raw.type === "mentionable") {
            menu = new MentionableSelectMenuBuilder().setCustomId(common.customId);
        } else if (raw.type === "channel") {
            menu = new ChannelSelectMenuBuilder().setCustomId(common.customId);
            if (Array.isArray(raw.channelTypes) && raw.channelTypes.length) {
                menu.setChannelTypes(
                    raw.channelTypes
                        .map(type => ChannelType[type] ?? type)
                        .filter(type => type !== undefined)
                );
            }
        } else {
            menu = new StringSelectMenuBuilder()
                .setCustomId(common.customId);

            const options = Array.isArray(raw.options)
                ? raw.options.slice(0, 25)
                : [];

            if (options.length) {
                menu.addOptions(
                    options
                        .filter(option => option?.label && option?.value)
                        .map(option => ({
                            label: String(option.label).slice(0, 100),
                            value: String(option.value).slice(0, 100),
                            ...(option.description ? { description: String(option.description).slice(0, 100) } : {}),
                            ...(option.emoji ? { emoji: String(option.emoji) } : {}),
                            ...(option.default !== undefined ? { default: Boolean(option.default) } : {})
                        }))
                );
            }
        }

        if (common.placeholder && menu.setPlaceholder)
            menu.setPlaceholder(common.placeholder);

        if (menu.setMinValues)
            menu.setMinValues(Math.max(0, Math.min(25, common.minValues)));

        if (menu.setMaxValues)
            menu.setMaxValues(Math.max(common.minValues, Math.min(25, common.maxValues)));

        if (common.disabled && menu.setDisabled)
            menu.setDisabled(true);

        rows.push(new ActionRowBuilder().addComponents(menu));
    }

    return rows.slice(0, 5);
}

function buildPayload(data, includeComponents = true) {
    const payload = {};

    if (data.content) payload.content = String(data.content);

    const embeds = Array.isArray(data.embeds)
        ? data.embeds
            .filter(embed => embed && Object.keys(embed).length)
            .map(buildEmbed)
        : [];

    if (embeds.length) payload.embeds = embeds.slice(0, 10);

    if (includeComponents) {
        const components = buildComponents(data);
        if (components.length) payload.components = components;
    }

    return payload;
}

function splitPayload(data) {
    const embeds = Array.isArray(data.embeds)
        ? data.embeds.filter(embed => embed && Object.keys(embed).length)
        : [];

    if (!embeds.length) {
        return [{
            ...buildPayload(data, true)
        }];
    }

    const groups = [];

    for (let i = 0; i < embeds.length; i += 10) {
        groups.push({
            content: i === 0 ? data.content || "" : "",
            embeds: embeds.slice(i, i + 10).map(buildEmbed),
            ...(i === 0 ? { components: buildComponents(data) } : {})
        });
    }

    return groups;
}

async function sendOrUpdate(client, session, existingDocument = null) {
    const guild = await client.guilds.fetch(session.guildId);
    const channel = await guild.channels.fetch(session.data.channelId || existingDocument?.channelId || null);

    if (!channel || !channel.isTextBased()) {
        throw new Error("The configured channel is unavailable.");
    }

    const groups = splitPayload(session.data);
    const sent = existingDocument?.sentMessages ? clone(existingDocument.sentMessages) : [];

    const resultMessages = [];

    for (let i = 0; i < groups.length; i++) {
        const payload = groups[i];
        const previous = sent[i];

        if (previous) {
            try {
                const oldChannel = await guild.channels.fetch(previous.channelId);
                const msg = await oldChannel.messages.fetch(previous.messageId);
                await msg.edit(payload);
                resultMessages.push(previous);
                continue;
            } catch {}
        }

        const msg = await channel.send(payload);
        resultMessages.push({
            channelId: msg.channel.id,
            messageId: msg.id
        });
    }

    for (let i = groups.length; i < sent.length; i++) {
        try {
            const oldChannel = await guild.channels.fetch(sent[i].channelId);
            const msg = await oldChannel.messages.fetch(sent[i].messageId);
            await msg.delete();
        } catch {}
    }

    return {
        sentMessages: resultMessages,
        channelId: channel.id
    };
}

async function saveSession(client, token) {
    const session = getSession(token);
    if (!session) throw new Error("Your editor session has expired.");

    const data = normalizeData(session.data);

    const existing = await Embed.findOne({
        guildId: session.guildId,
        name: session.name
    });

    if (existing && !session.edit) {
        throw new Error("An embed with that name already exists.");
    }

    const sent = await sendOrUpdate(
        client,
        {
            ...session,
            data: {
                ...data,
                channelId: existing?.channelId || null
            }
        },
        existing
    );

    const document = existing || new Embed({
        guildId: session.guildId,
        name: session.name,
        createdBy: session.userId
    });

    document.content = data.content;
    document.embeds = data.embeds;
    document.buttons = data.buttons;
    document.selectMenus = data.selectMenus;
    document.channelId = sent.channelId;
    document.sentMessages = sent.sentMessages;

    await document.save();

    session.data = data;
    session.updatedAt = Date.now();

    return document;
}

module.exports = {
    sessions,
    createSession,
    getSession,
    deleteSession,
    editorUrl,
    normalizeData,
    buildEmbed,
    buildComponents,
    buildPayload,
    splitPayload,
    saveSession
};
