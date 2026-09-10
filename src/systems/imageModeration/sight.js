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
        return null;
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
            return null;
        }

        const data =
            await response.json();

        if (
            data.status !==
            "success"
        ) {
            return null;
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
            return "nsfw";
        }

        // =========================
        // NAZI
        // =========================

        const offensive =
            data.offensive || {};

        if (
            Number(offensive.nazi) >=
            THRESHOLD
        ) {
            return "nazi";
        }

        // =========================
        // TERRORIST
        // =========================

        if (
            Number(offensive.terrorist) >=
            THRESHOLD
        ) {
            return "terrorist";
        }

        // =========================
        // EXTREMIST / SUPREMACIST
        // =========================

        if (
            Number(offensive.supremacist) >=
            THRESHOLD
        ) {
            return "nazi";
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
            return "gore";
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
            return "self-harm";
        }

        return null;

    } catch (error) {

        console.error(
            "Sightengine Image Moderation Error:",
            error
        );

        return null;
    }

}

module.exports = {
    scanImage
};
