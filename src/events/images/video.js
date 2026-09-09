const {
    scanVideo
} = require(
    "../../systems/imageModeration/video"
);

// =========================
// EVENT
// =========================

module.exports = {

    name: "messageCreate",

    async execute(
        message,
        client
    ) {

        // =========================
        // IGNORE BOTS
        // =========================

        if (message.author.bot) {
            return;
        }

        // =========================
        // ATTACHMENTS
        // =========================

        if (!message.attachments.size) {
            return;
        }

        const videos =
            message.attachments.filter(
                attachment =>
                    attachment.contentType?.startsWith(
                        "video/"
                    )
            );

        if (!videos.size) {
            return;
        }

        // =========================
        // SCAN VIDEOS
        // =========================

        for (
            const attachment
            of videos.values()
        ) {

            const flagged =
                await scanVideo(
                    attachment.url
                );

            if (flagged) {

                try {

                    await message.delete();

                } catch (error) {

                    console.error(
                        "Sightengine Video Delete Error:",
                        error
                    );

                }

                return;
            }

        }

    }

};
