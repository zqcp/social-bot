const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    create(user) {
        return new EmbedBuilder()
            .setTitle("Command: embed create")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Create a new embed using the embed creator.

\`\`\`
Syntax:
${config.prefix}embed create [name]

Example:
${config.prefix}embed create welcome
\`\`\``
            );
    },

    edit(user) {
        return new EmbedBuilder()
            .setTitle("Command: embed edit")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Edit a saved embed using the embed creator.

\`\`\`
Syntax:
${config.prefix}embed edit [name]

Example:
${config.prefix}embed edit welcome
\`\`\``
            );
    },

    list(user) {
        return new EmbedBuilder()
            .setTitle("Command: embed list")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View your saved embeds.

\`\`\`
Syntax:
${config.prefix}embed list

Example:
${config.prefix}embed list
\`\`\``
            );
    },

    delete(user) {
        return new EmbedBuilder()
            .setTitle("Command: embed delete")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Delete a saved embed.

\`\`\`
Syntax:
${config.prefix}embed delete [name]

Example:
${config.prefix}embed delete welcome
\`\`\``
            );
    }

};
