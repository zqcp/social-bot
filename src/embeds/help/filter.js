const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    add(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter add")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Add a word to the server filter.
\`\`\`Syntax: ${config.prefix}filter add [word]
Example: ${config.prefix}filter add spam\`\`\``
            );
    },

    clear(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter clear")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Clear all custom words from the server filter.
\`\`\`Syntax: ${config.prefix}filter clear
Example: ${config.prefix}filter clear\`\`\``
            );
    },

    disable(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter disable")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Disable the server word filter.
\`\`\`Syntax: ${config.prefix}filter disable
Example: ${config.prefix}filter disable\`\`\``
            );
    },

    enable(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter enable")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Enable the server word filter.
\`\`\`Syntax: ${config.prefix}filter enable
Example: ${config.prefix}filter enable\`\`\``
            );
    },

    list(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter list")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`View the words currently configured in the server filter.
\`\`\`Syntax: ${config.prefix}filter list
Example: ${config.prefix}filter list\`\`\``
            );
    },

    premade(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter premade")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Manage the premade word filter. 
\`\`\`Syntax: ${config.prefix}filter premade [enable/disable]
Example: ${config.prefix}filter premade enable\`\`\``
            );
    },

    remove(user) {
        return new EmbedBuilder()
            .setTitle("Command: filter remove")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Remove a word from the server filter.
\`\`\`Syntax: ${config.prefix}filter remove [word]
Example: ${config.prefix}filter remove spam\`\`\``
            );
    }

};
