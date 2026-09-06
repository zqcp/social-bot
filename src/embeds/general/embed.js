const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    created(
        user,
        name
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Embed \`${name}\` has been **created**.`
            );

    },


    edited(
        user,
        name
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Embed \`${name}\` has been **updated**.`
            );

    },


    sent(
        user,
        name,
        channel
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Embed \`${name}\` has been **sent** to ${channel}.`
            );

    },


    deleted(
        user,
        name
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.success
            )
            .setDescription(
                `${config.emojis.success} ${user}: Embed \`${name}\` has been **deleted**.`
            );

    },


    alreadyExists(
        user,
        name
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: An embed named \`${name}\` **already exists**.`
            );

    },


    notFound(
        user,
        name
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: I couldn't find an embed named \`${name}\`.`
            );

    },


    noName(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You need to provide an embed **name**.`
            );

    },


    noEmbeds(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You don't have any **saved embeds**.`
            );

    },


    invalidName(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: That embed name is **invalid**.`
            );

    },


    limit(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: You've reached the **maximum number of saved embeds**.`
            );

    },


    invalid(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: That embed is **invalid**.`
            );

    },


    failed(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Something went wrong while **processing the embed**.`
            );

    },


    sessionExpired(
        user
    ) {

        return new EmbedBuilder()
            .setColor(
                config.colors.error
            )
            .setDescription(
                `${config.emojis.error} ${user}: Your embed editor **session has expired**.`
            );

    }

};
