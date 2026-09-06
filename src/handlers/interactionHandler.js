const fs = require("fs");
const path = require("path");

const slashCommands = new Map();
const buttons = new Map();
const selectMenus = new Map();
const modals = new Map();

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function getType(i) {
    if (i.isButton()) return "button";
    if (
        i.isStringSelectMenu() ||
        i.isUserSelectMenu() ||
        i.isRoleSelectMenu() ||
        i.isChannelSelectMenu() ||
        i.isMentionableSelectMenu()
    ) return "select";
    if (i.isModalSubmit()) return "modal";
    if (i.isChatInputCommand()) return "command";
    return "unknown";
}

function getCollection(type) {
    return {
        command: slashCommands,
        button: buttons,
        select: selectMenus,
        modal: modals
    }[type] || null;
}

function registerInteraction(type, name, handler, file = "unknown") {
    const collection = getCollection(type);

    if (!collection || !name || typeof handler !== "function") {
        console.warn(`[INTERACTION] Invalid handler: ${file}`);
        return false;
    }

    const key = normalize(name);

    if (collection.has(key)) {
        console.warn(
            `[INTERACTION] Duplicate ${type}: ${name}\n` +
            `Existing: ${collection.get(key).__interactionFile || "unknown"}\n` +
            `Duplicate: ${file}`
        );
        return false;
    }

    handler.__interactionFile = file;
    handler.__interactionName = name;
    handler.__interactionType = type;
    collection.set(key, handler);
    return true;
}

function loadInteractions(client) {
    const root = path.join(__dirname, "../interactions");

    if (!fs.existsSync(root)) {
        console.error(`[INTERACTION] Folder not found: ${root}`);
        return;
    }

    function load(folder) {
        for (const file of fs.readdirSync(folder)) {
            const full = path.join(folder, file);
            const stat = fs.statSync(full);

            if (stat.isDirectory()) {
                load(full);
                continue;
            }

            if (!file.endsWith(".js")) continue;

            let interaction;
            try {
                interaction = require(full);
            } catch (error) {
                console.error(`[INTERACTION] Failed to load: ${full}`, error);
                continue;
            }

            if (
                !interaction?.name ||
                !interaction?.type ||
                typeof interaction.execute !== "function"
            ) {
                console.error(`[INTERACTION] Invalid file: ${full}`);
                continue;
            }

            if (
                registerInteraction(
                    interaction.type,
                    interaction.name,
                    interaction.execute,
                    full
                )
            ) {
                console.log(
                    `[INTERACTION] Loaded ${interaction.type.toUpperCase()} | ${interaction.name}`
                );
            }
        }
    }

    load(root);

    client.interactions = {
        commands: slashCommands,
        buttons,
        selectMenus,
        modals
    };

    console.log(
        `[INTERACTION] Commands: ${slashCommands.size} | ` +
        `Buttons: ${buttons.size} | ` +
        `Selects: ${selectMenus.size} | ` +
        `Modals: ${modals.size}`
    );

    return client.interactions;
}

function findHandler(collection, customId) {
    const id = normalize(customId);
    if (!id) return null;

    if (collection.has(id)) return collection.get(id);

    for (const [key, handler] of collection) {
        if (id.startsWith(`${key}:`)) return handler;
    }

    return null;
}

async function sendError(interaction) {
    const payload = {
        content: "❌ Something went wrong while processing that interaction.",
        flags: 64
    };

    try {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(payload);
        } else {
            await interaction.reply(payload);
        }
    } catch (error) {
        console.error("[INTERACTION] Error response failed:", error);
    }
}

async function executeHandler(handler, interaction) {
    try {
        await handler(interaction.client, interaction);
    } catch (error) {
        console.error(
            `[INTERACTION] ${handler.__interactionName || "Unknown"} failed:`,
            error
        );
        await sendError(interaction);
    }
}

async function handleInteraction(interaction) {
    let collection;

    if (interaction.isButton()) {
        collection = buttons;
    } else if (
        interaction.isStringSelectMenu() ||
        interaction.isUserSelectMenu() ||
        interaction.isRoleSelectMenu() ||
        interaction.isChannelSelectMenu() ||
        interaction.isMentionableSelectMenu()
    ) {
        collection = selectMenus;
    } else if (interaction.isModalSubmit()) {
        collection = modals;
    } else {
        return;
    }

    const handler = findHandler(collection, interaction.customId);

    if (!handler) {
        console.warn(
            `[INTERACTION] Handler not found | ${getType(interaction)} | ${interaction.customId}`
        );
        return;
    }

    await executeHandler(handler, interaction);
}

function register(client) {
    // Interactions are loaded once by index.js.
    client.on("interactionCreate", async interaction => {
        try {
            await handleInteraction(interaction);
        } catch (error) {
            console.error("[INTERACTION] Unhandled error:", error);

            if (!interaction.replied && !interaction.deferred) {
                await sendError(interaction);
            }
        }
    });
}

module.exports = {
    loadInteractions,
    handleInteraction,
    registerInteraction,
    register,
    slashCommands,
    buttons,
    selectMenus,
    modals
};
