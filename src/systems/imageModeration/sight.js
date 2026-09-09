const SIGHTENGINE_USER =
    process.env.SIGHTENGINE_API_USER;

const SIGHTENGINE_SECRET =
    process.env.SIGHTENGINE_API_SECRET;

const SIGHTENGINE_URL =
    "https://api.sightengine.com/1.0/check.json";

const MODELS = [
    "nudity-2.1",
    "offensive-2.0",
    "gore-2.0",
    "self-harm"
].join(",");

const THRESHOLD = 0.90;

// =========================
// SCAN IMAGE
// =========================

async function scanImage(
    imageUrl
) {

    if (
        !SIGHTENGINE_USER ||
        !SIGHTENGINE_SECRET
    ) {
        return false;
    }

    try {

        const url =
            new URL(
                SIGHTENGINE_URL
            );

        url.searchParams.set(
            "url",
            imageUrl
        );

        url.searchParams.set(
            "models",
            MODELS
        );

        url.searchParams.set(
            "api_user",
            SIGHTENGINE_USER
        );

        url.searchParams.set(
            "api_secret",
            SIGHTENGINE_SECRET
        );

        const response =
            await fetch(url);

        if (!response.ok) {
            return false;
        }

        const data =
            await response.json();

        if (
            data.status !==
            "success"
        ) {
            return false;
        }

        // =========================
        // NSFW
        // =========================

        const nudity =
            data.nudity || {};

        if (
            Number(nudity.sexual_activity) >=
                THRESHOLD ||
            Number(nudity.sexual_display) >=
                THRESHOLD ||
            Number(nudity.erotica) >=
                THRESHOLD ||
            Number(nudity.very_suggestive) >=
                THRESHOLD ||
            Number(nudity.suggestive) >=
                THRESHOLD
        ) {
            return true;
        }

        // =========================
        // EXTREMIST / HATE
        // =========================

        const offensive =
            data.offensive || {};

        if (
            Number(offensive.prob) >=
                THRESHOLD ||
            Number(offensive.nazi) >=
                THRESHOLD ||
            Number(offensive.terrorist) >=
                THRESHOLD ||
            Number(offensive.supremacist) >=
                THRESHOLD ||
            Number(offensive.confederate) >=
                THRESHOLD
        ) {
            return true;
        }

        // =========================
        // GORE
        // =========================

        const gore =
            data.gore || {};

        if (
            Number(gore.prob) >=
            THRESHOLD
        ) {
            return true;
        }

        // =========================
        // SELF-HARM
        // =========================

        const selfHarm =
            data["self-harm"] || {};

        if (
            Number(selfHarm.prob) >=
            THRESHOLD ||
            Number(
                selfHarm.type?.real
            ) >= THRESHOLD
        ) {
            return true;
        }

        return false;

    } catch (error) {

        console.error(
            "Sightengine Image Moderation Error:",
            error
        );

        return false;
    }

}

module.exports = {
    scanImage
};
