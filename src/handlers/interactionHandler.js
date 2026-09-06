const fs = require("fs");
const path = require("path");

const slashCommands = new Map();
const buttons = new Map();
const selectMenus = new Map();
const modals = new Map();

// =========================
// UTILITIES
// =========================

function normalize(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function getInteractionType(interaction) {
    if (interaction.isButton()) {
        return "button";
    }

    if (
        interaction.isStringSelectMenu() ||
        interaction.isUserSelectMenu() ||
        interaction.isRoleSelectMenu() ||
        interaction.isChannelSelectMenu() ||
        interaction.isMentionableSelectMenu()
    ) {
        return "select";
    }

    if (interaction.isModalSubmit()) {
        return "modal";
    }

    if (interaction.isChatInputCommand()) {
        return "command";
    }

    return "unknown";
}

function getCollection(type) {
    if (type === "command") {
        return slashCommands;
    }

    if (type === "button") {
        return buttons;
    }

    if (type === "select") {
        return selectMenus;
    }

    if (type === "modal") {
        return modals;
    }

    return null;
}

// =========================
// REGISTER INTERACTION
// =========================

function registerInteraction(
    type,
    name,
    handler,
    filePath = "unknown"
) {
    if (!name || typeof handler !== "function") {
        console.warn(
            `[INTERACTION CHECK] Invalid handler | Type: ${type || "MISSING"} | Name: ${name || "MISSING"} | File: ${filePath}`
        );

        return false;
    }

    const collection =
        getCollection(type);

    if (!collection) {
        console.warn(
            `[INTERACTION CHECK] Invalid interaction type | Type: ${type} | Name: ${name} | File: ${filePath}`
        );

        return false;
    }

    const key =
        normalize(name);

    if (collection.has(key)) {
        const existingHandler =
            collection.get(key);

        console.warn(
            `\n========== DUPLICATE INTERACTION ==========`
        );

        console.warn(
            `Type: ${type}`
        );

        console.warn(
            `Name: ${name}`
        );

        console.warn(
            `Existing File: ${
                existingHandler.__interactionFile ||
                "unknown"
            }`
        );

        console.warn(
            `Duplicate File: ${filePath}`
        );

        console.warn(
            `===========================================\n`
        );

        return false;
    }

    handler.__interactionFile =
        filePath;

    handler.__interactionName =
        name;

    handler.__interactionType =
        type;

    collection.set(
        key,
        handler
    );

    return true;
}

// =========================
// LOAD INTERACTIONS
// =========================

function loadInteractions(client) {
    const interactionsPath =
        path.join(
            __dirname,
            "../interactions"
        );

    if (!fs.existsSync(interactionsPath)) {
        console.error(
            `[INTERACTION CHECK] Interactions folder not found: ${interactionsPath}`
        );

        return {
            commands: slashCommands,
            buttons,
            selectMenus,
            modals
        };
    }

    function loadFolder(folder) {
        let files;

        try {
            files =
                fs.readdirSync(folder);
        } catch (error) {
            console.error(
                `[INTERACTION CHECK] Failed to read folder: ${folder}`
            );

            console.error(error);

            return;
        }

        for (const file of files) {
            const filePath =
                path.join(
                    folder,
                    file
                );

            let stat;

            try {
                stat =
                    fs.statSync(
                        filePath
                    );
            } catch (error) {
                console.error(
                    `[INTERACTION CHECK] Failed to read: ${filePath}`
                );

                console.error(error);

                continue;
            }

            if (stat.isDirectory()) {
                loadFolder(filePath);
                continue;
            }

            if (!file.endsWith(".js")) {
                continue;
            }

            let interaction;

            try {
                interaction =
                    require(filePath);
            } catch (error) {
                console.error(
                    `\n========== INTERACTION LOAD ERROR ==========`
                );

                console.error(
                    "File:",
                    filePath
                );

                console.error(
                    "Error:",
                    error
                );

                console.error(
                    "============================================\n"
                );

                continue;
            }

            if (
                !interaction ||
                typeof interaction !==
                    "object"
            ) {
                console.error(
                    `[INTERACTION CHECK] Invalid export | File: ${filePath}`
                );

                continue;
            }

            if (!interaction.name) {
                console.error(
                    `[INTERACTION CHECK] Missing name | File: ${filePath}`
                );

                continue;
            }

            if (!interaction.type) {
                console.error(
                    `[INTERACTION CHECK] Missing type | Name: ${interaction.name} | File: ${filePath}`
                );

                continue;
            }

            if (
                typeof interaction.execute !==
                "function"
            ) {
                console.error(
                    `[INTERACTION CHECK] Missing execute() | ${interaction.type} | ${interaction.name} | File: ${filePath}`
                );

                continue;
            }

            const registered =
                registerInteraction(
                    interaction.type,
                    interaction.name,
                    interaction.execute,
                    filePath
                );

            if (registered) {
                console.log(
                    `[INTERACTION] Loaded ${interaction.type.toUpperCase()} | ${interaction.name} | ${filePath}`
                );
            }
        }
    }

    loadFolder(
        interactionsPath
    );

    client.interactions = {
        commands: slashCommands,
        buttons,
        selectMenus,
        modals
    };

    console.log(
        "\n========== INTERACTION REGISTRY =========="
    );

    console.log(
        `Commands: ${slashCommands.size}`
    );

    console.log(
        `Buttons: ${buttons.size}`
    );

    console.log(
        `Select Menus: ${selectMenus.size}`
    );

    console.log(
        `Modals: ${modals.size}`
    );

    console.log(
        "==========================================\n"
    );

    return client.interactions;
}

// =========================
// FIND HANDLER
// =========================

function findHandler(
    collection,
    customId
) {
    const id =
        normalize(customId);

    if (!id) {
        return null;
    }

    if (collection.has(id)) {
        return collection.get(id);
    }

    for (const [
        key,
        handler
    ] of collection) {
        if (
            id.startsWith(
                `${key}:`
            )
        ) {
            return handler;
        }
    }

    return null;
}

// =========================
// PRINT REGISTERED HANDLERS
// =========================

function printRegisteredHandlers(
    collection,
    collectionName
) {
    console.error(
        `\n========== REGISTERED ${collectionName.toUpperCase()} ==========`
    );

    if (!collection.size) {
        console.error("NONE");
    } else {
        for (const [
            key,
            handler
        ] of collection) {
            console.error(
                `${key} | ${
                    handler.__interactionFile ||
                    "unknown"
                }`
            );
        }
    }

    console.error(
        "================================================\n"
    );
}

// =========================
// SEND ERROR RESPONSE
// =========================

async function sendInteractionError(
    interaction
) {
    try {
        const message =
            "❌ Something went wrong while processing that interaction.";

        const payload = {
            content: message,
            flags: 64
        };

        if (
            interaction.replied ||
            interaction.deferred
        ) {
            await interaction.followUp(
                payload
            );

            return;
        }

        await interaction.reply(
            payload
        );
    } catch (error) {
        console.error(
            "[INTERACTIONS] Failed to send interaction error:",
            error
        );
    }
}

// =========================
// EXECUTE HANDLER
// =========================

async function executeHandler(
    handler,
    interaction
) {
    try {
        await handler(
            interaction.client,
            interaction
        );

        return true;
    } catch (error) {
        console.error(
            "\n========== INTERACTION ERROR =========="
        );

        console.error(
            "Type:",
            getInteractionType(
                interaction
            )
        );

        console.error(
            "Discord Type:",
            interaction.type
        );

        console.error(
            "User:",
            interaction.user?.tag ||
            interaction.user?.id ||
            "Unknown"
        );

        console.error(
            "Guild:",
            interaction.guild?.id ||
            "DM"
        );

        console.error(
            "Custom ID:",
            interaction.customId ||
            "N/A"
        );

        console.error(
            "Handler:",
            handler?.__interactionName ||
            handler?.name ||
            "Unknown"
        );

        console.error(
            "Handler File:",
            handler?.__interactionFile ||
            "unknown"
        );

        console.error(
            "Error:",
            error
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Stack:",
            error?.stack
        );

        console.error(
            "=======================================\n"
        );

        await sendInteractionError(
            interaction
        );

        return false;
    }
}

// =========================
// HANDLE BUTTON
// =========================

async function handleButton(
    interaction
) {
    const handler =
        findHandler(
            buttons,
            interaction.customId
        );

    console.log(
        `[INTERACTION] BUTTON | ${interaction.customId} | Handler: ${
            handler?.__interactionName ||
            "NOT FOUND"
        }`
    );

    if (!handler) {
        console.error(
            `\n========== BUTTON HANDLER NOT FOUND ==========`
        );

        console.error(
            "Custom ID:",
            interaction.customId
        );

        console.error(
            "Normalized:",
            normalize(
                interaction.customId
            )
        );

        printRegisteredHandlers(
            buttons,
            "BUTTONS"
        );

        return;
    }

    await executeHandler(
        handler,
        interaction
    );
}

// =========================
// HANDLE SELECT
// =========================

async function handleSelect(
    interaction
) {
    const handler =
        findHandler(
            selectMenus,
            interaction.customId
        );

    console.log(
        `[INTERACTION] SELECT | ${interaction.customId} | Handler: ${
            handler?.__interactionName ||
            "NOT FOUND"
        }`
    );

    if (!handler) {
        console.error(
            `\n========== SELECT HANDLER NOT FOUND ==========`
        );

        console.error(
            "Custom ID:",
            interaction.customId
        );

        console.error(
            "Normalized:",
            normalize(
                interaction.customId
            )
        );

        console.error(
            "Select Type:",
            interaction.isStringSelectMenu()
                ? "String"
                : interaction.isRoleSelectMenu()
                    ? "Role"
                    : interaction.isUserSelectMenu()
                        ? "User"
                        : interaction.isChannelSelectMenu()
                            ? "Channel"
                            : interaction.isMentionableSelectMenu()
                                ? "Mentionable"
                                : "Unknown"
        );

        console.error(
            "Selected Values:",
            interaction.values || []
        );

        printRegisteredHandlers(
            selectMenus,
            "SELECT MENUS"
        );

        return;
    }

    await executeHandler(
        handler,
        interaction
    );
}

// =========================
// HANDLE MODAL
// =========================

async function handleModal(
    interaction
) {
    const handler =
        findHandler(
            modals,
            interaction.customId
        );

    console.log(
        "\n========== MODAL SUBMIT =========="
    );

    console.log(
        "Custom ID:",
        interaction.customId
    );

    console.log(
        "Handler:",
        handler?.__interactionName ||
        "NOT FOUND"
    );

    console.log(
        "Handler File:",
        handler?.__interactionFile ||
        "unknown"
    );

    console.log(
        "Guild:",
        interaction.guild?.id ||
        "DM"
    );

    console.log(
        "User:",
        interaction.user?.tag ||
        interaction.user?.id ||
        "Unknown"
    );

    console.log(
        "Fields:",
        interaction.fields?.fields
            ? [
                ...interaction.fields.fields.keys()
            ]
            : []
    );

    console.log(
        "==================================\n"
    );

    if (!handler) {
        printRegisteredHandlers(
            modals,
            "MODALS"
        );

        return;
    }

    await executeHandler(
        handler,
        interaction
    );
}

// =========================
// HANDLE INTERACTION
// =========================

async function handleInteraction(
    interaction
) {
    if (interaction.isButton()) {
        await handleButton(
            interaction
        );

        return;
    }

    if (
        interaction.isStringSelectMenu() ||
        interaction.isUserSelectMenu() ||
        interaction.isRoleSelectMenu() ||
        interaction.isChannelSelectMenu() ||
        interaction.isMentionableSelectMenu()
    ) {
        await handleSelect(
            interaction
        );

        return;
    }

    if (interaction.isModalSubmit()) {
        await handleModal(
            interaction
        );

        return;
    }
}

// =========================
// REGISTER EVENT
// =========================

function register(client) {

    // Load every interaction before
    // handling interactionCreate events.
    loadInteractions(client);

    client.on(
        "interactionCreate",
        async interaction => {
            try {
                await handleInteraction(
                    interaction
                );
            } catch (error) {
                console.error(
                    "\n[INTERACTIONS] UNHANDLED ERROR"
                );

                console.error(
                    "Type:",
                    getInteractionType(
                        interaction
                    )
                );

                console.error(
                    "Custom ID:",
                    interaction.customId ||
                    "N/A"
                );

                console.error(
                    "Error:",
                    error
                );

                console.error(
                    "Stack:",
                    error?.stack
                );

                console.error(
                    "=======================================\n"
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {
                    await sendInteractionError(
                        interaction
                    );
                }
            }
        }
    );
}

// =========================
// EXPORTS
// =========================

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
