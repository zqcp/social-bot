const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const builder =
    require("../../systems/embed/builder");

const fields =
    require("../../systems/embed/fields");

const buttons =
    require("../../systems/embed/buttons");

const selectMenus =
    require("../../systems/embed/selectMenus");

const globalEmbeds =
    require("../../embeds/general/global");


// ============================================================
// HELPERS
// ============================================================

function getSession(interaction) {
    return builder.getSession(
        interaction.user.id,
        interaction.guildId
    );
}

function error(interaction, text) {
    return interaction.reply({
        embeds: [
            globalEmbeds.error(text)
        ],
        flags: 64
    });
}

function optionLabel(text, fallback) {
    const value = String(text || fallback);
    return value.length > 100
        ? value.slice(0, 97) + "..."
        : value;
}


// ============================================================
// EXECUTE
// ============================================================

module.exports = {

    name: "embedSelectMenus",

    async execute(interaction) {

        if (!interaction.isStringSelectMenu()) {
            return;
        }

        if (!interaction.customId.startsWith("embed:")) {
            return;
        }

        const session =
            getSession(interaction);

        if (!session) {
            return error(
                interaction,
                "This embed editor session has expired."
            );
        }

        const id =
            interaction.customId;


        // ====================================================
        // EMBED SELECT
        // ====================================================

        if (id === "embed:select-embed") {

            const index =
                Number(interaction.values[0]);

            if (
                !Number.isInteger(index) ||
                !session.data.embeds[index]
            ) {
                return error(
                    interaction,
                    "That embed could not be found."
                );
            }

            session.data.activeEmbed =
                index;

            session.data.activeField = 0;

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // FIELD SELECT
        // ====================================================

        if (id === "embed:select-field") {

            const index =
                Number(interaction.values[0]);

            const embedIndex =
                Number(session.data.activeEmbed) || 0;

            const embed =
                session.data.embeds[embedIndex];

            if (
                !embed?.fields?.[index]
            ) {
                return error(
                    interaction,
                    "That field could not be found."
                );
            }

            fields.setActiveField(
                session,
                index
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // BUTTON SELECT
        // ====================================================

        if (id === "embed:select-button") {

            const index =
                Number(interaction.values[0]);

            if (
                !session.data.buttons[index]
            ) {
                return error(
                    interaction,
                    "That button could not be found."
                );
            }

            buttons.setActiveButton(
                session,
                index
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // SELECT MENU SELECT
        // ====================================================

        if (id === "embed:select-menu") {

            const index =
                Number(interaction.values[0]);

            if (
                !session.data.selectMenus[index]
            ) {
                return error(
                    interaction,
                    "That select menu could not be found."
                );
            }

            selectMenus.setActiveSelectMenu(
                session,
                index
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // SELECT MENU OPTION SELECT
        // ====================================================

        if (
            id.startsWith(
                "embed:select-option:"
            )
        ) {

            const parts =
                id.split(":");

            const menuIndex =
                Number(parts[2]);

            const menu =
                session.data.selectMenus[
                    menuIndex
                ];

            if (!menu) {
                return error(
                    interaction,
                    "That select menu could not be found."
                );
            }

            /*
             * This is primarily used by the editor
             * for selecting an option to edit.
             */
            const optionIndex =
                Number(interaction.values[0]);

            if (
                !Number.isInteger(optionIndex) ||
                !menu.options?.[optionIndex]
            ) {
                return error(
                    interaction,
                    "That option could not be found."
                );
            }

            menu.activeOption =
                optionIndex;

            session.data.activeSelectMenu =
                menuIndex;

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // TIMESTAMP YES / NO
        // ====================================================

        if (id === "embed:timestamp") {

            const value =
                interaction.values[0];

            const index =
                Number(session.data.activeEmbed) || 0;

            const embed =
                session.data.embeds[index];

            if (!embed) {
                return error(
                    interaction,
                    "No embed is currently selected."
                );
            }

            embed.timestamp =
                value === "yes";

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // BUTTON STYLE SELECT
        // ====================================================

        if (id === "embed:button-style") {

            const index =
                Number(session.data.activeButton) || 0;

            const button =
                session.data.buttons[index];

            if (!button) {
                return error(
                    interaction,
                    "No button is currently selected."
                );
            }

            const style =
                interaction.values[0];

            const validStyles = [
                "primary",
                "secondary",
                "success",
                "danger",
                "link"
            ];

            if (
                !validStyles.includes(style)
            ) {
                return error(
                    interaction,
                    "Invalid button style."
                );
            }

            buttons.editButton(
                session,
                index,
                { style }
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // BUTTON ACTION SELECT
        // ====================================================

        if (id === "embed:button-action") {

            const index =
                Number(session.data.activeButton) || 0;

            const button =
                session.data.buttons[index];

            if (!button) {
                return error(
                    interaction,
                    "No button is currently selected."
                );
            }

            const action =
                interaction.values[0];

            const validActions = [
                "none",
                "add_role",
                "remove_role"
            ];

            if (
                !validActions.includes(action)
            ) {
                return error(
                    interaction,
                    "Invalid button action."
                );
            }

            buttons.editButton(
                session,
                index,
                { action }
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // SELECT MENU TYPE
        // ====================================================

        if (id === "embed:select-type") {

            const index =
                Number(session.data.activeSelectMenu) || 0;

            const menu =
                session.data.selectMenus[index];

            if (!menu) {
                return error(
                    interaction,
                    "No select menu is currently selected."
                );
            }

            const type =
                interaction.values[0];

            const validTypes = [
                "string",
                "user",
                "role",
                "mentionable",
                "channel"
            ];

            if (
                !validTypes.includes(type)
            ) {
                return error(
                    interaction,
                    "Invalid select menu type."
                );
            }

            selectMenus.editSelectMenu(
                session,
                index,
                {
                    type
                }
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // SELECT MENU ACTION
        // ====================================================

        if (id === "embed:select-action") {

            const index =
                Number(session.data.activeSelectMenu) || 0;

            const menu =
                session.data.selectMenus[index];

            if (!menu) {
                return error(
                    interaction,
                    "No select menu is currently selected."
                );
            }

            const action =
                interaction.values[0];

            const validActions = [
                "none",
                "add_role",
                "remove_role"
            ];

            if (
                !validActions.includes(action)
            ) {
                return error(
                    interaction,
                    "Invalid select menu action."
                );
            }

            selectMenus.editSelectMenu(
                session,
                index,
                { action }
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // FIELD INLINE YES / NO
        // ====================================================

        if (id === "embed:field-inline") {

            const index =
                Number(session.data.activeField) || 0;

            const embedIndex =
                Number(session.data.activeEmbed) || 0;

            const field =
                session.data.embeds[
                    embedIndex
                ]?.fields?.[index];

            if (!field) {
                return error(
                    interaction,
                    "No field is currently selected."
                );
            }

            fields.editField(
                session,
                index,
                {
                    inline:
                        interaction.values[0] === "yes"
                }
            );

            builder.updateSession(session);

            return interaction.update();
        }


        // ====================================================
        // UNKNOWN SELECT MENU
        // ====================================================

        return;
    }
};
