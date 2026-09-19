// src/embeds/jailLogs.js

const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../../config");

module.exports = {

    jailed(
        member,
        moderator,
        reason,
        caseNumber
    ) {

        return new EmbedBuilder()
            .setColor(
                0xFFFFFF
            )
            .setAuthor({
                name:
                    member.user.username,

                iconURL:
                    member.user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setTitle(
                `Member jailed - case #${caseNumber}`
            )
            .setDescription(
`**member**
${member}
\`${member.id}\`
**moderator**
${moderator}
**reason**
${reason || "n/a (no reason)"}`
            )
            .setTimestamp()
            .setFooter({
                text:
                    `user id: ${member.id}`
            });

    },


    unjailed(
        member,
        moderator,
        caseNumber
    ) {

        return new EmbedBuilder()
            .setColor(
                0xFFFFFF
            )
            .setAuthor({
                name:
                    member.user.username,

                iconURL:
                    member.user.displayAvatarURL({
                        dynamic: true
                    })
            })
            .setTitle(
                `Member unjailed - case #${caseNumber}`
            )
            .setDescription(
`**member**
${member}
\`${member.id}\`
**moderator**
${moderator}`
            )
            .setTimestamp()
            .setFooter({
                text:
                    `user id: ${member.id}`
            });

    }

};
