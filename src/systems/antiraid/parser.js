function parseDuration(input) {

    if (!input) {
        return null;
    }

    const value =
        String(input)
            .toLowerCase()
            .trim();

    const match =
        value.match(
            /^(\d+(?:\.\d+)?)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/
        );

    if (!match) {
        return null;
    }

    const amount =
        Number(match[1]);

    const unit =
        match[2];

    const multipliers = {

        s: 1000,
        sec: 1000,
        secs: 1000,
        second: 1000,
        seconds: 1000,

        m: 60 * 1000,
        min: 60 * 1000,
        mins: 60 * 1000,
        minute: 60 * 1000,
        minutes: 60 * 1000,

        h: 60 * 60 * 1000,
        hr: 60 * 60 * 1000,
        hrs: 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        hours: 60 * 60 * 1000,

        d: 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000

    };

    const duration =
        amount * multipliers[unit];

    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {
        return null;
    }

    return duration;
}


function formatDuration(milliseconds) {

    if (
        !Number.isFinite(milliseconds) ||
        milliseconds <= 0
    ) {
        return "0s";
    }

    const seconds =
        Math.floor(milliseconds / 1000);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes =
        Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours =
        Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h`;
    }

    const days =
        Math.floor(hours / 24);

    return `${days}d`;
}


module.exports = {
    parseDuration,
    formatDuration
};
