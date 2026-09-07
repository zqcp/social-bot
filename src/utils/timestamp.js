module.exports = {

    full(
        timestamp
    ) {

        return new Date(timestamp).toLocaleString(
            "en-US",
            {
                timeZone: "UTC",
                month: "numeric",
                day: "numeric",
                year: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );

    },

    short(
        timestamp
    ) {

        return `<t:${Math.floor(timestamp / 1000)}:f>`;

    },

    date(
        timestamp
    ) {

        return `<t:${Math.floor(timestamp / 1000)}:D>`;

    },

    time(
        timestamp
    ) {

        return `<t:${Math.floor(timestamp / 1000)}:t>`;

    },

    relative(
        timestamp
    ) {

        return `<t:${Math.floor(timestamp / 1000)}:R>`;

    }

};
