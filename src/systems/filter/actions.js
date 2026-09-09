const filterConfig =
    require("./config");

// =========================
// TIMEOUT
// =========================

async function timeoutMember(
    member,
    duration
) {

    if (!member?.moderatable) {
        return false;
    }

    try {

        await member.timeout(
            duration,
            "Filter violation"
        );

        return true;

    } catch (error) {

        console.error(
            "Filter Timeout Error:",
            error
        );

        return false;
    }
}

// =========================
// PUNISHMENT
// =========================

async function punish(
    member,
    strike
) {

    const punishment =
        filterConfig.punishments[strike] ||
        filterConfig.punishments[3];

    if (!punishment) {
        return null;
    }

    const success =
        await timeoutMember(
            member,
            punishment.duration
        );

    if (!success) {
        return null;
    }

    return punishment;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    timeoutMember,
    punish
};
