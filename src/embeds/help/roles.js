const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    // =========================
    // ROLE ADD
    // =========================

    add(user) {

        return new EmbedBuilder()
            .setTitle("Command: role add")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Adds a role to a member.

\`\`\`
Syntax:
${config.prefix}role add [member] [role]

Example:
${config.prefix}role add @user @Member
\`\`\``
            );

    },

    // =========================
    // ROLE REMOVE
    // =========================

    remove(user) {

        return new EmbedBuilder()
            .setTitle("Command: role remove")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Removes a role from a member.

\`\`\`
Syntax:
${config.prefix}role remove [member] [role]

Example:
${config.prefix}role remove @user @Member
\`\`\``
            );

    },

    // =========================
    // ROLE CREATE
    // =========================

    create(user) {

        return new EmbedBuilder()
            .setTitle("Command: role create")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Creates a new role.

\`\`\`
Syntax:
${config.prefix}role create [name]

Example:
${config.prefix}role create Members
\`\`\``
            );

    },

    // =========================
    // ROLE DELETE
    // =========================

    delete(user) {

        return new EmbedBuilder()
            .setTitle("Command: role delete")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(config.colors.regular)
            .setDescription(
`Deletes an existing role.

\`\`\`
Syntax:
${config.prefix}role delete [role]

Example:
${config.prefix}role delete @Members
\`\`\``
            );

    }

};
