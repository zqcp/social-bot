const AntiNuke =
    require("../../models/AntiNuke");

const generalEmbeds =
    require("../../embeds/antinuke/general");

const adminEmbeds =
    require("../../embeds/antinuke/admin");

module.exports = {

    name: "antinuke admin add",

    aliases: [],

    async execute(
        client,
        message,
        args
    ) {

        // =========================
        // GUILD CHECK
        // =========================

        if (!message.guild) {
            return;
        }

        // =========================
        // OWNER CHECK
        // =========================

        if (
            message.author.id !==
            message.guild.ownerId
        ) {
            return message.channel.send({
                embeds: [
                    generalEmbeds.owner(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // USER CHECK
        // =========================

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    adminEmbeds.invalid(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // MEMBER RESOLUTION
        // =========================

        let member =
            message.mentions.members.first();

        const userQuery =
            args[0].replace(
                /[<@!>]/g,
                ""
            );

        if (
            !member &&
            /^\d+$/.test(userQuery)
        ) {
            member =
                await message.guild.members
                    .fetch(userQuery)
                    .catch(
                        () => null
                    );
        }

        if (!member) {
            member =
                message.guild.members.cache.find(
                    m =>
                        m.user.username.toLowerCase() ===
                            args[0].toLowerCase() ||
                        m.displayName.toLowerCase() ===
                            args[0].toLowerCase()
                );
        }

        if (!member) {
            return message.channel.send({
                embeds: [
                    adminEmbeds.invalid(
                        message.author
                    )
                ]
            });
        }

        // =========================
        // DATABASE
        // =========================

        try {

            let antinuke =
                await AntiNuke.findOne({
                    guildId:
                        message.guild.id
                });

            if (!antinuke) {
                antinuke =
                    await AntiNuke.create({
                        guildId:
                            message.guild.id
                    });
            }

            // =========================
            // ALREADY ADMIN
            // =========================

            if (
                antinuke.admins.includes(
                    member.id
                )
            ) {
                return message.channel.send({
                    embeds: [
                        adminEmbeds.alreadyAdded(
                            message.author,
                            member
                        )
                    ]
                });
            }

            // =========================
            // ADD ADMIN
            // =========================

            antinuke.admins.push(
                member.id
            );

            await antinuke.save();

            // =========================
            // SUCCESS
            // =========================

            return message.channel.send({
                embeds: [
                    adminEmbeds.added(
                        message.author,
                        member
                    )
                ]
            });

        } catch (error) {

            console.error(
                "[ANTINUKE ADMIN ADD]",
                error
            );

            return message.channel.send({
                embeds: [
                    adminEmbeds.failed(
                        message.author,
                        "add the AntiNuke admin"
                    )
                ]
            });
        }

    }

};
