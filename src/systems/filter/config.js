module.exports = {

    // =========================
    // FILTER
    // =========================

    enabled: true,

    // =========================
    // PUNISHMENTS
    // =========================

    punishments: {
        1: {
            duration: 10 * 60 * 1000,
            name: "10 minutes"
        },

        2: {
            duration: 60 * 60 * 1000,
            name: "1 hour"
        },

        3: {
            duration: 24 * 60 * 60 * 1000,
            name: "1 day"
        }
    },

    // =========================
    // STRIKES
    // =========================

    strikeReset: 24 * 60 * 60 * 1000,

    // =========================
    // DETECTION
    // =========================

    normalize: true,

    ignoreBots: true,

    // =========================
    // BYPASS
    // =========================

    bypassPermissions: [
        "ManageMessages"
    ],

    // =========================
    // MESSAGE
    // =========================

    deleteMessage: true,

    sendWarning: true,

    warningDeleteAfter: 5000

};
