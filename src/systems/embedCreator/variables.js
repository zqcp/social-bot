// =========================
// EMBED CREATOR VARIABLES
// =========================

const variables = {
    user: "{user}",
    userName: "{user.name}",
    userId: "{user.id}",
    userMention: "{user.mention}",

    server: "{server}",
    serverName: "{server.name}",
    serverId: "{server.id}",
    serverMemberCount: "{server.memberCount}",

    channel: "{channel}",
    channelName: "{channel.name}",
    channelId: "{channel.id}",
    channelMention: "{channel.mention}"
};

// =========================
// GET VARIABLES
// =========================

function getVariables() {
    return {
        ...variables
    };
}

// =========================
// REPLACE VARIABLES
// =========================

function replace(
    text,
    interaction
) {
    if (
        text === null ||
        text === undefined
    ) {
        return text;
    }

    if (!interaction) {
        return String(text);
    }

    const user = interaction.user;
    const guild = interaction.guild;
    const channel = interaction.channel;

    const replacements = {
        "{user}":
            user?.username || "",

        "{user.name}":
            user?.username || "",

        "{user.id}":
            user?.id || "",

        "{user.mention}":
            user
                ? `<@${user.id}>`
                : "",

        "{server}":
            guild?.name || "",

        "{server.name}":
            guild?.name || "",

        "{server.id}":
            guild?.id || "",

        "{server.memberCount}":
            guild?.memberCount !== undefined
                ? String(guild.memberCount)
                : "",

        "{channel}":
            channel?.name || "",

        "{channel.name}":
            channel?.name || "",

        "{channel.id}":
            channel?.id || "",

        "{channel.mention}":
            channel
                ? `<#${channel.id}>`
                : ""
    };

    let result = String(text);

    for (
        const [
            variable,
            value
        ] of Object.entries(
            replacements
        )
    ) {
        result = result.replaceAll(
            variable,
            value
        );
    }

    return result;
}

// =========================
// REPLACE OBJECT
// =========================

function replaceObject(
    object,
    interaction
) {
    if (!object || typeof object !== "object") {
        return object;
    }

    if (Array.isArray(object)) {
        return object.map(
            value =>
                replaceObject(
                    value,
                    interaction
                )
        );
    }

    const result = {};

    for (
        const [
            key,
            value
        ] of Object.entries(object)
    ) {
        if (
            typeof value === "string"
        ) {
            result[key] =
                replace(
                    value,
                    interaction
                );
        } else if (
            value &&
            typeof value === "object"
        ) {
            result[key] =
                replaceObject(
                    value,
                    interaction
                );
        } else {
            result[key] = value;
        }
    }

    return result;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    getVariables,
    replace,
    replaceObject
};
