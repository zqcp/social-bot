// =========================
// VARIABLES
// =========================

const variables = {
    user: {
        token: "{user}",
        description: "Username"
    },

    userName: {
        token: "{user.name}",
        description: "Username"
    },

    userId: {
        token: "{user.id}",
        description: "User ID"
    },

    userMention: {
        token: "{user.mention}",
        description: "User mention"
    },

    server: {
        token: "{server}",
        description: "Server name"
    },

    serverName: {
        token: "{server.name}",
        description: "Server name"
    },

    serverId: {
        token: "{server.id}",
        description: "Server ID"
    },

    serverMemberCount: {
        token: "{server.memberCount}",
        description: "Server member count"
    },

    channel: {
        token: "{channel}",
        description: "Channel name"
    },

    channelName: {
        token: "{channel.name}",
        description: "Channel name"
    },

    channelId: {
        token: "{channel.id}",
        description: "Channel ID"
    },

    channelMention: {
        token: "{channel.mention}",
        description: "Channel mention"
    }
};

// =========================
// GET VARIABLES
// =========================

function getVariables() {
    const result = {};

    for (
        const [name, data] of Object.entries(
            variables
        )
    ) {
        result[name] = data.token;
    }

    return result;
}

// =========================
// GET VARIABLE DATA
// =========================

function getVariableData() {
    return Object.entries(
        variables
    ).map(
        ([name, data]) => ({
            name,
            token: data.token,
            description:
                data.description
        })
    );
}

// =========================
// GET TOKEN
// =========================

function getToken(name) {
    return variables[name]?.token || null;
}

// =========================
// REPLACEMENTS
// =========================

function getReplacements(
    interaction
) {
    const user =
        interaction?.user;

    const guild =
        interaction?.guild;

    const channel =
        interaction?.channel;

    return {
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
            guild?.memberCount !==
            undefined
                ? String(
                    guild.memberCount
                )
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
}

// =========================
// REPLACE TEXT
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

    const replacements =
        getReplacements(
            interaction
        );

    let result =
        String(text);

    for (
        const [
            token,
            value
        ] of Object.entries(
            replacements
        )
    ) {
        result =
            result.replaceAll(
                token,
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
    if (
        object === null ||
        object === undefined
    ) {
        return object;
    }

    if (
        typeof object === "string"
    ) {
        return replace(
            object,
            interaction
        );
    }

    if (
        Array.isArray(object)
    ) {
        return object.map(
            value =>
                replaceObject(
                    value,
                    interaction
                )
        );
    }

    if (
        typeof object !== "object"
    ) {
        return object;
    }

    const result = {};

    for (
        const [
            key,
            value
        ] of Object.entries(
            object
        )
    ) {
        result[key] =
            replaceObject(
                value,
                interaction
            );
    }

    return result;
}

// =========================
// CHECK VARIABLE
// =========================

function isVariable(
    value
) {
    if (
        typeof value !== "string"
    ) {
        return false;
    }

    return Object.values(
        variables
    ).some(
        data =>
            data.token ===
            value
    );
}

// =========================
// EXPORTS
// =========================

module.exports = {
    getVariables,
    getVariableData,
    getToken,

    replace,
    replaceObject,

    isVariable
};
