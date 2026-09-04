module.exports = {
    name: "embed",
    type: "select",

    async execute(client, interaction) {
        if (!interaction.customId.startsWith("embed:")) return;

        const value = interaction.values?.[0];

        if (!value) {
            return interaction.reply({
                content: "No option was selected.",
                flags: 64
            });
        }

        const action = interaction.customId.split(":")[1];

        if (action === "embed") {
            return interaction.reply({
                content: `Selected embed: \`${value}\``,
                flags: 64
            });
        }

        if (action === "field") {
            return interaction.reply({
                content: `Selected field: \`${value}\``,
                flags: 64
            });
        }

        if (action === "button") {
            return interaction.reply({
                content: `Selected button: \`${value}\``,
                flags: 64
            });
        }

        if (action === "select") {
            return interaction.reply({
                content: `Selected menu option: \`${value}\``,
                flags: 64
            });
        }
    }
};
