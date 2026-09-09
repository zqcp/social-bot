const SIGHTENGINE_USER =
    process.env.SIGHTENGINE_API_USER;

const SIGHTENGINE_SECRET =
    process.env.SIGHTENGINE_API_SECRET;

const SIGHTENGINE_URL =
    "https://api.sightengine.com/1.0/check.json";

// =========================
// SCAN EXTREMIST CONTENT
// =========================

async function scanExtremist(
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
            "api_user",
            SIGHTENGINE_USER
        );

        url.searchParams.set(
            "api_secret",
            SIGHTENGINE_SECRET
        );

        url.searchParams.set(
            "models",
            "offensive"
        );

        url.searchParams.set(
            "url",
            imageUrl
        );

        const response =
            await fetch(url);

        if (!response.ok) {
            return false;
        }

        const data =
            await response.json();

        // =========================
        // HATE / EXTREMIST CONTENT
        // =========================

        const offensive =
            data.offensive || {};

        const nazi =
            Number(
                offensive.nazi
            ) || 0;

        const kkk =
            Number(
                offensive.kkk
            ) || 0;

        const terrorist =
            Number(
                offensive.terrorist
            ) || 0;

        const supremacist =
            Number(
                offensive.supremacist
            ) || 0;

        const hate =
            Number(
                offensive.hate
            ) || 0;

        return (
            nazi >= 0.90 ||
            kkk >= 0.90 ||
            terrorist >= 0.90 ||
            supremacist >= 0.90 ||
            hate >= 0.90
        );

    } catch (error) {

        console.error(
            "Extremist Image Moderation Error:",
            error
        );

        return false;
    }

}

module.exports = {
    scanExtremist
};
