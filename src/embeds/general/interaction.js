const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {

    // =========================
    // GENERAL
    // =========================

    success(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    failed(description) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(description);
    },

    error(description) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    regular(description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },


    // =========================
    // BUTTONS
    // =========================

    buttonSuccess(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    buttonFailed(description) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(description);
    },

    buttonDisabled(description = "This button is currently disabled.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    buttonExpired(description = "This button has expired.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // ROLES
    // =========================

    roleAdded(role) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`The ${role} role has been added.`);
    },

    roleRemoved(role) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`The ${role} role has been removed.`);
    },

    roleAlreadyHas(role) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(`You already have the ${role} role.`);
    },

    roleMissing(role) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(`You don't have the ${role} role.`);
    },

    roleFailed(description = "I couldn't update your role.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    roleNotFound(description = "The requested role could not be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // VERIFICATION
    // =========================

    verified(description = "You have been verified successfully.") {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    alreadyVerified(description = "You are already verified.") {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },

    verificationFailed(description = "Verification failed. Please try again.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // TICKETS
    // =========================

    ticketCreated(channel) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`Your ticket has been created: ${channel}`);
    },

    ticketClosed(description = "This ticket has been closed.") {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    ticketAlreadyOpen(description = "You already have an open ticket.") {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },

    ticketNotFound(description = "No ticket could be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    ticketFailed(description = "I couldn't complete the ticket action.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // SELECT MENUS
    // =========================

    selectSuccess(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    selectRequired(description = "Please select an option first.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    selectInvalid(description = "That selection is invalid.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    selectDisabled(description = "This select menu is currently disabled.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // MODALS / FORMS
    // =========================

    modalSuccess(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    modalFailed(description = "I couldn't process the form.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    modalInvalid(description = "The information provided is invalid.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // PERMISSIONS
    // =========================

    noPermission(description = "You don't have permission to use this interaction.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    botPermission(description = "I don't have permission to complete this interaction.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    hierarchy(description = "You cannot interact with this member or role.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // CONFIRMATION
    // =========================

    confirmationRequired(description = "Please confirm this action.") {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },

    confirmed(description = "The action has been confirmed.") {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    cancelled(description = "The action has been cancelled.") {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(description);
    },


    // =========================
    // INTERACTION STATE
    // =========================

    expired(description = "This interaction has expired. Please try again.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    unavailable(description = "This interaction is no longer available.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    cooldown(description = "Please wait before using this interaction again.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    alreadyUsed(description = "This interaction has already been used.") {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },


    // =========================
    // USER / MEMBER
    // =========================

    userNotFound(description = "The requested user could not be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    memberNotFound(description = "The requested member could not be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // CHANNELS
    // =========================

    channelNotFound(description = "The requested channel could not be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    channelInvalid(description = "This interaction cannot be used in this channel.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },


    // =========================
    // GENERIC ERRORS
    // =========================

    notFound(description = "The requested item could not be found.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    invalid(description = "The information provided is invalid.") {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    failedAction(description = "I couldn't complete this action.") {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(description);
    },


    // =========================
    // EMBED CREATOR
    // =========================

    embedCreator(description) {
        return new EmbedBuilder()
            .setColor(config.colors.regular)
            .setDescription(description);
    },

    embedCreatorSuccess(
        description = "The embed was updated successfully."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    embedCreatorFailed(
        description = "I couldn't update the embed."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    embedCreatorCancelled(
        description = "The embed creator has been cancelled."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.failed)
            .setDescription(description);
    },

    embedCreatorExpired(
        description = "This embed creator has expired. Please run the command again."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    embedCreatorInvalid(
        description = "The embed information provided is invalid."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    },

    embedCreatorSent(
        description = "The embed has been sent successfully."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(description);
    },

    embedCreatorNoPermission(
        description = "You don't have permission to use the embed creator."
    ) {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(description);
    }

};
