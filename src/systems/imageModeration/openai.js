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
        return false;
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
            return false;
        }

        const data =
            await response.json();

        const result =
            data.results?.[0];

        if (!result) {
            return false;
        }

        // =========================
        // BLOCKED CONTENT
        // =========================

        const categories =
            result.categories || {};

        return (
            categories.sexual === true ||
            categories.violence === true ||
            categories["violence/graphic"] === true ||
            categories["self-harm"] === true ||
            categories["self-harm/intent"] === true ||
            categories["self-harm/instructions"] === true
        );

    } catch (error) {

        console.error(
            "Image Moderation Error:",
            error
        );

        return false;
    }

}

module.exports = {
    scanImage
};
