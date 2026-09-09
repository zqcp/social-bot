const {
    scanImage
} = require(
    "../../systems/imageModeration/sight"
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

        const images =
            message.attachments.filter(
                attachment =>
                    attachment.contentType?.startsWith(
                        "image/"
                    )
            );

        if (!images.size) {
            return;
        }

        // =========================
        // SCAN IMAGES
        // =========================

        for (
            const attachment
            of images.values()
        ) {

            const flagged =
                await scanImage(
                    attachment.url
                );

            if (flagged) {

                try {

                    await message.delete();

                } catch (error) {

                    console.error(
                        "Sightengine Image Delete Error:",
                        error
                    );

                }

                return;
            }

        }

    }

};
