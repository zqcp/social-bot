const Starboard = require("../../../models/Starboard");

module.exports = {

    name: "messageReactionAdd",

    async execute(reaction, user, client) {

        try {

            if (user.bot) return;

            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            if (!message.guild) return;

            const config = await Starboard.findOne({
                guildId: message.guild.id,
                channelId: { $exists: true }
            });

            if (!config) return;

            const emoji = reaction.emoji.id
                ? reaction.emoji.id
                : reaction.emoji.name;

            const configuredEmoji = config.emoji.id
                ? config.emoji.id
                : config.emoji;

            if (emoji !== configuredEmoji) return;

            if (
                config.selfReact === false &&
                message.author?.id === user.id
            ) {
                return;
            }

            const count = reaction.count || 0;

            if (count < config.threshold) return;

            const starboardChannel =
                message.guild.channels.cache.get(
                    config.channelId
                );

            if (!starboardChannel) return;

            if (!starboardChannel.isTextBased()) return;

            const permissions =
                starboardChannel.permissionsFor(client.user);

            if (
                !permissions ||
                !permissions.has("ViewChannel") ||
                !permissions.has("SendMessages") ||
                !permissions.has("EmbedLinks")
            ) {
                return;
            }

            // Starboard creation/update will be handled here
            // once the Starboard embed/template is added.

        } catch (error) {

            console.error(
                "Starboard reaction add error:",
                error
            );

        }

    }

};
