function replaceVariables(value, message) {
    if (typeof value !== "string") return value;

    const user = message?.author;
    const member = message?.member;
    const guild = message?.guild;
    const channel = message?.channel;
    const client = message?.client;

    const now = new Date();

    const variables = {
        // =========================
        // USER
        // =========================
        "{user}": user?.username || "",
        "{user.name}": user?.username || "",
        "{user.username}": user?.username || "",
        "{user.tag}": user?.tag || "",
        "{user.id}": user?.id || "",
        "{user.mention}": user ? `<@${user.id}>` : "",
        "{user.avatar}": user?.displayAvatarURL?.({ dynamic: true }) || "",
        "{user.created}": user
            ? `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`
            : "",

        // =========================
        // MEMBER
        // =========================
        "{member}": member?.displayName || user?.username || "",
        "{member.name}": member?.displayName || "",
        "{member.nickname}": member?.nickname || "",
        "{member.id}": member?.id || user?.id || "",
        "{member.mention}": member
            ? `<@${member.id}>`
            : user
                ? `<@${user.id}>`
                : "",
        "{member.joined}": member?.joinedTimestamp
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
            : "",
        "{member.joinedAt}": member?.joinedAt
            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>`
            : "",
        "{member.avatar}": member?.displayAvatarURL?.({
            dynamic: true
        }) || "",

        // =========================
        // SERVER
        // =========================
        "{server}": guild?.name || "",
        "{server.name}": guild?.name || "",
        "{server.id}": guild?.id || "",
        "{server.icon}": guild?.iconURL?.({ dynamic: true }) || "",
        "{server.owner}": guild?.ownerId || "",
        "{server.owner.id}": guild?.ownerId || "",
        "{server.owner.mention}": guild?.ownerId
            ? `<@${guild.ownerId}>`
            : "",
        "{server.membercount}": guild?.memberCount?.toString() || "",
        "{server.members}": guild?.memberCount?.toString() || "",
        "{server.created}": guild
            ? `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
            : "",

        // =========================
        // CHANNEL
        // =========================
        "{channel}": channel?.name || "",
        "{channel.name}": channel?.name || "",
        "{channel.id}": channel?.id || "",
        "{channel.mention}": channel
            ? `<#${channel.id}>`
            : "",
        "{channel.type}": channel?.type?.toString() || "",
        "{channel.created}": channel
            ? `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`
            : "",

        // =========================
        // BOT
        // =========================
        "{bot}": client?.user?.username || "",
        "{bot.name}": client?.user?.username || "",
        "{bot.username}": client?.user?.username || "",
        "{bot.tag}": client?.user?.tag || "",
        "{bot.id}": client?.user?.id || "",
        "{bot.mention}": client?.user
            ? `<@${client.user.id}>`
            : "",
        "{bot.avatar}": client?.user?.displayAvatarURL?.({
            dynamic: true
        }) || "",

        // =========================
        // TIME
        // =========================
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

        // =========================
        // DATE
        // =========================
        "{date}": now.toLocaleDateString(),
        "{date.short}": now.toLocaleDateString(),
        "{date.long}": now.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),

        // =========================
        // TIMESTAMP
        // =========================
        "{timestamp}": `<t:${Math.floor(now.getTime() / 1000)}:F>`,
        "{timestamp.relative}": `<t:${Math.floor(now.getTime() / 1000)}:R>`,
        "{timestamp.short}": `<t:${Math.floor(now.getTime() / 1000)}:t>`,
        "{timestamp.long}": `<t:${Math.floor(now.getTime() / 1000)}:T>`,
        "{timestamp.date}": `<t:${Math.floor(now.getTime() / 1000)}:d>`,
        "{timestamp.date.long}": `<t:${Math.floor(now.getTime() / 1000)}:D>`,
        "{timestamp.datetime}": `<t:${Math.floor(now.getTime() / 1000)}:f>`,
        "{timestamp.datetime.long}": `<t:${Math.floor(now.getTime() / 1000)}:F>`
    };

    let result = value;

    for (const [variable, replacement] of Object.entries(variables)) {
        result = result.replace(
            new RegExp(
                variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "gi"
            ),
            replacement
        );
    }

    return result;
}
