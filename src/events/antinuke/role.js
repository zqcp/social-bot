const { AuditLogEvent } = require("discord.js");

const AntiNuke =
    require("../../models/AntiNuke");

const manager =
    require("../../systems/antinuke/manager");

const logs =
    require("../../systems/antinuke/logs/role");


async function executor(
    guild,
    targetId
) {

    const audit =
        await guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
            limit: 5
        }).catch(() => null);

    if (!audit) return null;

    return audit.entries.find(
        entry =>
            entry.target?.id === targetId &&
            Date.now() - entry.createdTimestamp < 10000
    );

}


module.exports = {

    name: "roleCreate",

    async execute(
        role,
        client
    ) {

        if (!role.guild) return;

        const entry =
            await executor(
                role.guild,
                role.id
            );

        if (!entry?.executor) return;

        const user =
            entry.executor;

        const antiNuke =
            await AntiNuke.findOne({
                guildId: role.guild.id
            });

        if (!antiNuke) return;

        if (
            antiNuke.whitelist?.includes(user.id) ||
            antiNuke.admins?.includes(user.id)
        ) {
            return;
        }

        const member =
            await role.guild.members
                .fetch(user.id)
                .catch(() => null);

        const result =
            await manager.handle(
                role.guild,
                "role",
                member,
                role,
                {
                    action: "created",
                    target: role,
                    actions: [
                        `Created ${role}`
                    ]
                }
            );

        await logs.event(
            user,
            "created",
            role,
            [
                "Role was created"
            ],
            result?.punished
                ? "The user was punished."
                : "The role was created.",
            `ROLE-${role.id}`
        );

    }

};
