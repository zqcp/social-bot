const { EmbedBuilder } = require("discord.js");

const { buildButtons } = require("./buttons");
const { buildSelectMenus } = require("./selectMenus");

const sessions = new Map();

const SESSION_TIME = 30 * 60 * 1000;

function getKey(userId, guildId) {
    return `${guildId}:${userId}`;
}

function createSession(userId, guildId) {
    const session = {
        userId,
        guildId,

        messageId: null,
        channelId: null,

        createdAt: Date.now(),
        updatedAt: Date.now(),

        data: {
            content: "",
            embeds: [],
            buttons: [],
            selectMenus: [],
            activeEmbed: 0,
            activeButton: 0,
            activeSelectMenu: 0
        }
    };

    sessions.set(
        getKey(userId, guildId),
        session
    );

    return session;
}

function getSession(userId, guildId) {
    const key = getKey(userId, guildId);
    const session = sessions.get(key);

    if (!session) return null;

    if (
        Date.now() - session.updatedAt >
        SESSION_TIME
    ) {
        sessions.delete(key);
        return null;
    }

    session.updatedAt = Date.now();

    return session;
}

function deleteSession(userId, guildId) {
    sessions.delete(
        getKey(userId, guildId)
    );
}

function replaceVariables(value, interaction) {
    if (
        value === undefined ||
        value === null
    ) {
        return value;
    }

    const text = String(value);

    const user = interaction?.user;
    const member = interaction?.member;
    const guild = interaction?.guild;
    const channel = interaction?.channel;
    const client = interaction?.client;

    const owner = guild?.ownerId
        ? guild.members?.cache?.get(guild.ownerId)
        : null;

    const humanCount = guild?.members?.cache
        ? guild.members.cache.filter(
            member => !member.user.bot
        ).size
        : "";

    const botCount = guild?.members?.cache
        ? guild.members.cache.filter(
            member => member.user.bot
        ).size
        : "";

    const variables = {
        // =========================
        // USER
        // =========================

        "{user}": user?.username || "",
        "{user.name}": user?.username || "",
        "{user.username}": user?.username || "",
        "{user.displayName}":
            member?.displayName ||
            user?.displayName ||
            "",
        "{user.mention}":
            user
                ? `<@${user.id}>`
                : "",
        "{user.id}": user?.id || "",
        "{user.tag}": user?.tag || "",
        "{user.avatar}":
            user?.displayAvatarURL?.({
                size: 4096
            }) || "",
        "{user.createdAt}":
            user?.createdAt?.toISOString?.() || "",
        "{user.joinedAt}":
            member?.joinedAt?.toISOString?.() || "",
        "{user.isBooster}":
            member?.premiumSince
                ? "true"
                : "false",
        "{user.boostedAt}":
            member?.premiumSince?.toISOString?.() || "",

        // =========================
        // SERVER
        // =========================

        "{server}": guild?.name || "",
        "{server.name}": guild?.name || "",
        "{server.id}": guild?.id || "",
        "{server.icon}":
            guild?.iconURL?.({
                size: 4096
            }) || "",
        "{server.banner}":
            guild?.bannerURL?.({
                size: 4096
            }) || "",
        "{server.splash}":
            guild?.splashURL?.({
                size: 4096
            }) || "",
        "{server.owner}":
            owner?.user?.username ||
            guild?.ownerId ||
            "",
        "{server.ownerId}":
            guild?.ownerId || "",
        "{server.memberCount}":
            guild?.memberCount || 0,
        "{server.humanCount}":
            humanCount,
        "{server.botCount}":
            botCount,
        "{server.channelCount}":
            guild?.channels?.cache?.size || 0,
        "{server.roleCount}":
            guild?.roles?.cache?.size || 0,
        "{server.emojiCount}":
            guild?.emojis?.cache?.size || 0,
        "{server.stickerCount}":
            guild?.stickers?.cache?.size || 0,
        "{server.boostCount}":
            guild?.premiumSubscriptionCount || 0,
        "{server.boosterCount}":
            guild?.premiumSubscriptionCount || 0,
        "{server.boostLevel}":
            guild?.premiumTier || 0,
        "{server.createdAt}":
            guild?.createdAt?.toISOString?.() || "",
        "{server.verificationLevel}":
            guild?.verificationLevel || "",

        // =========================
        // CHANNEL
        // =========================

        "{channel}":
            channel?.name || "",
        "{channel.name}":
            channel?.name || "",
        "{channel.id}":
            channel?.id || "",
        "{channel.mention}":
            channel
                ? `<#${channel.id}>`
                : "",
        "{channel.type}":
            channel?.type || "",
        "{channel.createdAt}":
            channel?.createdAt?.toISOString?.() || "",
        "{channel.topic}":
            channel?.topic || "",

        // =========================
        // BOT
        // =========================

        "{bot}":
            client?.user?.username || "",
        "{bot.name}":
            client?.user?.username || "",
        "{bot.id}":
            client?.user?.id || "",
        "{bot.mention}":
            client?.user
                ? `<@${client.user.id}>`
                : "",
        "{bot.avatar}":
            client?.user?.displayAvatarURL?.({
                size: 4096
            }) || "",
        "{bot.tag}":
            client?.user?.tag || "",

        // =========================
        // TIME
        // =========================

        "{time}":
            new Date().toLocaleTimeString(),
        "{date}":
            new Date().toLocaleDateString(),
        "{timestamp}":
            `<t:${Math.floor(
                Date.now() / 1000
            )}:F>`
    };

    return text.replace(
        /\{[^}]+\}/g,
        match =>
            variables[match] !== undefined
                ? String(variables[match])
                : match
    );
}

function buildEmbeds(
    embedData = [],
    interaction
) {
    return embedData
        .slice(0, 10)
        .map(data => {
            const embed = new EmbedBuilder();

            if (data.title) {
                embed.setTitle(
                    replaceVariables(
                        data.title,
                        interaction
                    ).slice(0, 256)
                );
            }

            if (data.description) {
                embed.setDescription(
                    replaceVariables(
                        data.description,
                        interaction
                    ).slice(0, 4096)
                );
            }

            if (data.url) {
                embed.setURL(
                    replaceVariables(
                        data.url,
                        interaction
                    ).slice(0, 2048)
                );
            }

            if (data.color) {
                embed.setColor(data.color);
            }

            if (data.author?.name) {
                embed.setAuthor({
                    name: replaceVariables(
                        data.author.name,
                        interaction
                    ).slice(0, 256),

                    url: data.author.url
                        ? replaceVariables(
                            data.author.url,
                            interaction
                        )
                        : undefined,

                    iconURL: data.author.iconURL
                        ? replaceVariables(
                            data.author.iconURL,
                            interaction
                        )
                        : undefined
                });
            }

            if (data.thumbnail) {
                embed.setThumbnail(
                    replaceVariables(
                        data.thumbnail,
                        interaction
                    )
                );
            }

            if (data.image) {
                embed.setImage(
                    replaceVariables(
                        data.image,
                        interaction
                    )
                );
            }

            if (data.footer?.text) {
                embed.setFooter({
                    text: replaceVariables(
                        data.footer.text,
                        interaction
                    ).slice(0, 2048),

                    iconURL: data.footer.iconURL
                        ? replaceVariables(
                            data.footer.iconURL,
                            interaction
                        )
                        : undefined
                });
            }

            if (data.timestamp) {
                embed.setTimestamp(
                    data.timestamp === true
                        ? new Date()
                        : new Date(data.timestamp)
                );
            }

            if (Array.isArray(data.fields)) {
                for (
                    const field of data.fields.slice(0, 25)
                ) {
                    if (
                        !field?.name ||
                        !field?.value
                    ) {
                        continue;
                    }

                    embed.addFields({
                        name: replaceVariables(
                            field.name,
                            interaction
                        ).slice(0, 256),

                        value: replaceVariables(
                            field.value,
                            interaction
                        ).slice(0, 1024),

                        inline: Boolean(
                            field.inline
                        )
                    });
                }
            }

            return embed;
        });
}

function buildMessage(session, interaction) {
    const embeds = buildEmbeds(
        session?.data?.embeds || [],
        interaction
    );

    const content = session?.data?.content
        ? replaceVariables(
            session.data.content,
            interaction
        )
        : undefined;

    const buttons = buildButtons(
        session?.data?.buttons || [],
        value =>
            replaceVariables(
                value,
                interaction
            )
    );

    const selectMenus = buildSelectMenus(
        session?.data?.selectMenus || [],
        value =>
            replaceVariables(
                value,
                interaction
            )
    );

    const components = [
        ...buttons,
        ...selectMenus
    ].slice(0, 5);

    return {
        content,
        embeds,
        components
    };
}

module.exports = {
    createSession,
    getSession,
    deleteSession,
    replaceVariables,
    buildEmbeds,
    buildMessage
};
