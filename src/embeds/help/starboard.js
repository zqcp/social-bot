const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    add(user) {
        return new EmbedBuilder()
            .setTitle(
                "Command: starboard add"
            )
            .setAuthor({
                name:
                    user.username,
                iconURL:
                    user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setColor(
                config.colors.regular
            )
            .setDescription(
`Create a Starboard.
\`\`\`Syntax: ${config.prefix}starboard add [channel] [emoji] [color] [threshold] [self-react]
Example: ${config.prefix}starboard add #fame ⭐ random 5 yes\`\`\``
            );
    },

    clear(user) {
        return new EmbedBuilder()
            .setTitle(
                "Command: starboard clear"
            )
            .setAuthor({
                name:
                    user.username,
                iconURL:
                    user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setColor(
                config.colors.regular
            )
            .setDescription(
`Clear Starboard entries from a channel.
\`\`\`Syntax: ${config.prefix}starboard clear [channel]
Example: ${config.prefix}starboard clear #fame\`\`\``
            );
    },

    list(user) {
        return new EmbedBuilder()
            .setTitle(
                "Command: starboard list"
            )
            .setAuthor({
                name:
                    user.username,
                iconURL:
                    user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setColor(
                config.colors.regular
            )
            .setDescription(
`View the configured Starboards.
\`\`\`Syntax: ${config.prefix}starboard list
Example: ${config.prefix}starboard list\`\`\``
            );
    },

    remove(user) {
        return new EmbedBuilder()
            .setTitle(
                "Command: starboard remove"
            )
            .setAuthor({
                name:
                    user.username,
                iconURL:
                    user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setColor(
                config.colors.regular
            )
            .setDescription(
`Remove a Starboard.
\`\`\`Syntax: ${config.prefix}starboard remove [channel] [emoji]
Example: ${config.prefix}starboard remove #fame ⭐\`\`\``
            );
    }

};
