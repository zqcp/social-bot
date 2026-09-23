const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

const AntiRaidConfig =
    require("../../models/AntiRaid");

const {
    formatDuration
} = require("./parser");


class AntiRaidLogger {

    constructor(
        guild
    ) {

        this.guild =
            guild;

    }


    async getChannel() {

        const data =
            await AntiRaidConfig.findOne({
                guildId:
                    this.guild.id
            });

        const channelId =
            data?.logs?.channelId;

        if (!channelId) {
            return null;
        }

        const channel =
            await this.guild.channels.fetch(
                channelId
            ).catch(
                () => null
            );

        if (
            !channel ||
            !channel.isTextBased()
        ) {
            return null;
        }

        return channel;

    }


    async send(
        embed
    ) {

        const channel =
            await this.getChannel();

        if (!channel) {
            return false;
        }

        const bot =
            this.guild.members.me;

        if (
            bot &&
            !channel
                .permissionsFor(bot)
                .has([
                    "ViewChannel",
                    "SendMessages",
                    "EmbedLinks"
                ])
        ) {

            console.error(
                `[ANTIRAID] Missing log permissions in ${this.guild.id}.`
            );

            return false;

        }

        await channel.send({
            embeds: [
                embed
            ]
        }).catch(
            error =>
                console.error(
                    `[ANTIRAID LOG] ${this.guild.id}`,
                    error
                )
        );

        return true;

    }


    base(
        title
    ) {

        return new EmbedBuilder()
            .setColor("#FFFFFF")
            .setAuthor({
                name:
                    "AntiRaid",
                iconURL:
                    this.guild.client.user.displayAvatarURL({
                        extension: "png",
                        size: 128
                    })
            })
            .setTitle(
                title
            );

    }


    async raidDetected(
        count,
        threshold,
        window
    ) {

        const embed =
            this.base(
                "Raid detected"
            )
            .addFields(
                {
                    name: "joins",
                    value:
                        `\`${count}\``,
                    inline: true
                },
                {
                    name: "window",
                    value:
                        `\`${formatDuration(window)}\``,
                    inline: true
                },
                {
                    name: "threshold",
                    value:
                        `\`${threshold} / ${formatDuration(window)}\``,
                    inline: true
                }
            );

        return this.send(
            embed
        );

    }


    async raidEnded() {

        return this.send(
            this.base(
                "Raid ended"
            )
        );

    }


    async memberAction(
        title,
        member,
        action,
        reason
    ) {

        const embed =
            this.base(
                title
            )
            .addFields(
                {
                    name: "member",
                    value:
                        `${member}\n\`${member.id}\``
                },
                {
                    name: "action",
                    value:
                        `\`${action}\``
                },
                {
                    name: "reason",
                    value:
                        reason
                }
            );

        return this.send(
            embed
        );

    }


    async ageAction(
        member,
        action,
        age,
        required
    ) {

        const embed =
            this.base(
                "Member action"
            )
            .addFields(
                {
                    name: "member",
                    value:
                        `${member}\n\`${member.id}\``
                },
                {
                    name: "account age",
                    value:
                        `\`${formatDuration(age)}\``
                },
                {
                    name: "required age",
                    value:
                        `\`${formatDuration(required)}\``
                },
                {
                    name: "action",
                    value:
                        `\`${action}\``
                }
            );

        return this.send(
            embed
        );

    }


    async botDetected(
        botMember,
        executor,
        action
    ) {

        const embed =
            this.base(
                "Unauthorized bot detected"
            )
            .addFields(
                {
                    name: "bot",
                    value:
                        `${botMember}\n\`${botMember.id}\``
                },
                {
                    name: "added by",
                    value:
                        executor
                            ? `${executor}\n\`${executor.id}\``
                            : "Unknown"
                },
                {
                    name: "action",
                    value:
                        `\`${action}\``
                }
            );

        return this.send(
            embed
        );

    }


    async rejoinDetected(
        member,
        count,
        threshold,
        window,
        action
    ) {

        const embed =
            this.base(
                "Rejoin detected"
            )
            .addFields(
                {
                    name: "member",
                    value:
                        `${member}\n\`${member.id}\``
                },
                {
                    name: "rejoins",
                    value:
                        `\`${count}\``
                },
                {
                    name: "window",
                    value:
                        `\`${formatDuration(window)}\``
                },
                {
                    name: "threshold",
                    value:
                        `\`${threshold} / ${formatDuration(window)}\``
                },
                {
                    name: "action",
                    value:
                        `\`${action}\``
                }
            );

        return this.send(
            embed
        );

    }


    async lockdown(
        reason,
        duration
    ) {

        const embed =
            this.base(
                "Raid lockdown enabled"
            )
            .addFields(
                {
                    name: "reason",
                    value:
                        reason
                },
                {
                    name: "duration",
                    value:
                        `\`${formatDuration(duration)}\``
                }
            );

        return this.send(
            embed
        );

    }


    async configuration(
        user,
        setting,
        previous,
        current
    ) {

        const embed =
            this.base(
                "Configuration updated"
            )
            .addFields(
                {
                    name: "user",
                    value:
                        `${user}\n\`${user.id}\``
                },
                {
                    name: "setting",
                    value:
                        setting
                },
                {
                    name: "previous",
                    value:
                        String(previous)
                },
                {
                    name: "new",
                    value:
                        String(current)
                }
            );

        return this.send(
            embed
        );

    }

}


module.exports =
    AntiRaidLogger;
