const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    jail(user) {
        return new EmbedBuilder()
            .setTitle("Command: jail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Jail a member.
\`\`\`Syntax: ${config.prefix}jail [member] [duration] [reason]
Example: ${config.prefix}jail @user 5 days breaking rules \`\`\``
            );
    },

    unjail(user) {
        return new EmbedBuilder()
            .setTitle("Command: unjail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove a member from jail.
\`\`\`Syntax: ${config.prefix}unjail [member]
Example: ${config.prefix}unjail @user \`\`\``
            );
    },

    setupjail(user) {
        return new EmbedBuilder()
            .setTitle("Command: setup jail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Automatically setup the jail system.
\`\`\`Syntax: ${config.prefix}setup jail
Example: ${config.prefix}setup jail \`\`\``
            );
    },

    removejail(user) {
        return new EmbedBuilder()
            .setTitle("Command: remove jail")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove the jail system.
\`\`\`Syntax: ${config.prefix}remove jail
Example: ${config.prefix}remove jail \`\`\``
            );
    }

};
