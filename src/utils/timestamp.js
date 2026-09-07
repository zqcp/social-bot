module.exports = {

    full(
        timestamp
    ) {

        return `<t:${Math.floor(timestamp / 1000)}:F>`;

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
