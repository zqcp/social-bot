const Filter =
    require("../../models/Filter");

const filterSystem =
    require("../../systems/filter");

module.exports = {
    name: "messageCreate",

    async execute(client, message) {
        if (
            !message.guild ||
            message.author.bot
        ) {
            return;
        }

        try {
            const filter =
                await Filter.findOne({
                    guildId:
                        message.guild.id
                });

            if (!filter) {
                return;
            }

            await filterSystem.handleMessage(
                message,
                filter
            );

        } catch (error) {
            console.error(
                "Filter Error:",
                error
            );
        }
    }
};
