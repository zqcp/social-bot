const SIGHTENGINE_USER =
    process.env.SIGHTENGINE_API_USER;

const SIGHTENGINE_SECRET =
    process.env.SIGHTENGINE_API_SECRET;

const SIGHTENGINE_URL =
    "https://api.sightengine.com/1.0/video/check-sync.json";

const MODELS =
    "nudity-2.1,offensive-2.0,gore-2.0,self-harm";

const THRESHOLD = 0.90;

// =========================
// SCAN VIDEO
// =========================

async function scanVideo(
    videoUrl
) {

    if (
        !SIGHTENGINE_USER ||
        !SIGHTENGINE_SECRET
    ) {
        return null;
    }

    try {

        // =========================
        // DOWNLOAD VIDEO
        // =========================

        const videoResponse =
            await fetch(videoUrl);

        if (!videoResponse.ok) {
            return null;
        }

        const videoBuffer =
            Buffer.from(
                await videoResponse.arrayBuffer()
            );

        // =========================
        // BUILD FORM DATA
        // =========================

        const formData =
            new FormData();

        formData.append(
            "media",
            new Blob([videoBuffer])
        );

        formData.append(
            "models",
            MODELS
        );

        formData.append(
            "api_user",
            SIGHTENGINE_USER
        );

        formData.append(
            "api_secret",
            SIGHTENGINE_SECRET
        );

        // =========================
        // SEND TO SIGHTENGINE
        // =========================

        const response =
            await fetch(
                SIGHTENGINE_URL,
                {
                    method: "POST",
                    body: formData
                }
            );

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
            Number(
                nudity.sexual_activity
            ) >= THRESHOLD ||
            Number(
                nudity.sexual_display
            ) >= THRESHOLD ||
            Number(
                nudity.erotica
            ) >= THRESHOLD ||
            Number(
                nudity.very_suggestive
            ) >= THRESHOLD
        ) {
            return "nsfw";
        }

        // =========================
        // EXTREMIST / HATE
        // =========================

        const offensive =
            data.offensive || {};

        if (
            Number(
                offensive.nazi
            ) >= THRESHOLD
        ) {
            return "nazi";
        }

        if (
            Number(
                offensive.terrorist
            ) >= THRESHOLD
        ) {
            return "terrorist";
        }

        if (
            Number(
                offensive.supremacist
            ) >= THRESHOLD ||
            Number(
                offensive.confederate
            ) >= THRESHOLD ||
            Number(
                offensive.offensive
            ) >= THRESHOLD
        ) {
            return "illegal";
        }

        // =========================
        // GORE
        // =========================

        const gore =
            data.gore || {};

        if (
            Number(
                gore.gore
            ) >= THRESHOLD
        ) {
            return "gore";
        }

        // =========================
        // SELF-HARM
        // =========================

        const selfHarm =
            data["self-harm"] || {};

        if (
            Number(
                selfHarm.prob
            ) >= THRESHOLD ||
            Number(
                selfHarm.type?.real
            ) >= THRESHOLD
        ) {
            return "self-harm";
        }

        return null;

    } catch (error) {

        console.error(
            "Sightengine Video Moderation Error:",
            error
        );

        return null;
    }

}

module.exports = {
    scanVideo
};
