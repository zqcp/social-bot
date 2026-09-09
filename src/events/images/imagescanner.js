// =========================
// IMAGE MODERATION
// =========================

const {
    scanImage
} = require(
    "../../systems/imageModeration/scanner"
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
        // IGNORE WITHOUT ATTACHMENTS
        // =========================

        if (!message.attachments.size) {
            return;
        }

        // =========================
        // FIND IMAGES
        // =========================

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

            // =========================
            // DELETE FLAGGED MESSAGE
            // =========================

            if (flagged) {

                try {

                    await message.delete();

                } catch (error) {

                    console.error(
                        "Image Delete Error:",
                        error
                    );

                }

                return;
            }

        }

    }

};
