const State =
    require("./state");

const Whitelist =
    require("./whitelist");


function recordJoin(
    member,
    config
) {

    const state =
        State.getGuild(
            member.guild.id
        );

    const now =
        Date.now();

    state.joins.push(
        {
            userId: member.id,
            joinedAt: now
        }
    );

    const minimum =
        now -
        config.raid.window;

    state.joins =
        state.joins.filter(
            join =>
                join.joinedAt >= minimum
        );

    return state.joins.length;
}


function isRaid(
    member,
    config
) {

    if (
        !config.enabled ||
        !config.raid.enabled
    ) {
        return false;
    }

    const count =
        recordJoin(
            member,
            config
        );

    return count >=
        config.raid.threshold;
}


function accountAge(
    member,
    config
) {

    if (
        !config.enabled ||
        !config.age.enabled
    ) {
        return null;
    }

    const created =
        member.user.createdTimestamp;

    if (!created) {
        return null;
    }

    const age =
        Date.now() - created;

    if (
        age < config.age.minimum
    ) {

        return {
            age,
            required:
                config.age.minimum
        };

    }

    return null;
}


function username(
    member,
    config
) {

    if (
        !config.enabled ||
        !config.username.enabled
    ) {
        return null;
    }

    const username =
        member.user.username
            .toLowerCase();

    const displayName =
        member.displayName
            .toLowerCase();

    for (
        const pattern
        of config.username.patterns
    ) {

        const value =
            pattern.toLowerCase();

        if (
            username.includes(value) ||
            displayName.includes(value)
        ) {

            return {
                pattern
            };

        }

    }

    return null;
}


function recordRejoin(
    member,
    config
) {

    if (
        !config.enabled ||
        !config.rejoin.enabled
    ) {
        return null;
    }

    const state =
        State.getGuild(
            member.guild.id
        );

    const now =
        Date.now();

    const existing =
        state.rejoins.get(
            member.id
        ) || [];

    const minimum =
        now -
        config.rejoin.window;

    const joins =
        existing.filter(
            timestamp =>
                timestamp >= minimum
        );

    joins.push(
        now
    );

    state.rejoins.set(
        member.id,
        joins
    );

    if (
        joins.length >=
        config.rejoin.threshold
    ) {

        return {
            count:
                joins.length,
            threshold:
                config.rejoin.threshold
        };

    }

    return null;
}


async function ignored(
    member
) {

    if (
        !member ||
        !member.guild
    ) {
        return true;
    }

    if (
        member.user.bot
    ) {
        return true;
    }

    return Whitelist.isWhitelisted(
        member.guild.id,
        member.id
    );

}


module.exports = {
    recordJoin,
    isRaid,
    accountAge,
    username,
    recordRejoin,
    ignored
};
