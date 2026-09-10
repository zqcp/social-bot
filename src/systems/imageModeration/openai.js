const OPENAI_API_KEY =
    process.env.OPENAI_API_KEY;

const MODERATION_URL =
    "https://api.openai.com/v1/moderations";

const MODEL =
    "omni-moderation-latest";

// =========================
// SCAN IMAGE
// =========================

async function scanImage(
    imageUrl
) {

    if (!OPENAI_API_KEY) {
        return null;
    }

    try {

        const response =
            await fetch(
                MODERATION_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${OPENAI_API_KEY}`
                    },

                    body: JSON.stringify({
                        model: MODEL,

                        input: [
                            {
                                type: "image_url",

                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    })
                }
            );

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        const result =
            data.results?.[0];

        if (!result) {
            return null;
        }

        // =========================
        // CATEGORIES
        // =========================

        const categories =
            result.categories || {};

        // =========================
        // NSFW
        // =========================

        if (
            categories.sexual === true
        ) {
            return "nsfw";
        }

        // =========================
        // GORE
        // =========================

        if (
            categories["violence/graphic"] === true
        ) {
            return "gore";
        }

        // =========================
        // SELF HARM
        // =========================

        if (
            categories["self-harm"] === true ||
            categories["self-harm/intent"] === true ||
            categories["self-harm/instructions"] === true
        ) {
            return "self-harm";
        }

        return null;

    } catch (error) {

        console.error(
            "Image Moderation Error:",
            error
        );

        return null;
    }

}

module.exports = {
    scanImage
};
