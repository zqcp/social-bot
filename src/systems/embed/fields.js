// ============================================================
// EMBED FIELDS SYSTEM
// ============================================================

function createField(name = "", value = "", inline = false) {
    return {
        name,
        value,
        inline: Boolean(inline)
    };
}


// ============================================================
// ADD
// ============================================================

function addField(session, field = {}) {
    if (!session?.data?.embeds) {
        return null;
    }

    const embedIndex = Number(
        session.data.activeEmbed
    ) || 0;

    const embed =
        session.data.embeds[embedIndex];

    if (!embed) {
        return null;
    }

    if (embed.fields.length >= 25) {
        return null;
    }

    const newField = createField(
        field.name || "",
        field.value || "",
        field.inline || false
    );

    embed.fields.push(newField);

    session.data.activeField =
        embed.fields.length - 1;

    session.updatedAt = Date.now();

    return newField;
}


// ============================================================
// EDIT
// ============================================================

function editField(session, index, changes = {}) {
    if (!session?.data?.embeds) {
        return null;
    }

    const embedIndex = Number(
        session.data.activeEmbed
    ) || 0;

    const embed =
        session.data.embeds[embedIndex];

    if (!embed?.fields?.[index]) {
        return null;
    }

    const field = embed.fields[index];

    if (changes.name !== undefined) {
        field.name = String(changes.name);
    }

    if (changes.value !== undefined) {
        field.value = String(changes.value);
    }

    if (changes.inline !== undefined) {
        field.inline = Boolean(changes.inline);
    }

    session.data.activeField = index;
    session.updatedAt = Date.now();

    return field;
}


// ============================================================
// REMOVE
// ============================================================

function removeField(session, index) {
    if (!session?.data?.embeds) {
        return null;
    }

    const embedIndex = Number(
        session.data.activeEmbed
    ) || 0;

    const embed =
        session.data.embeds[embedIndex];

    if (!embed?.fields?.[index]) {
        return null;
    }

    const removed =
        embed.fields.splice(index, 1)[0];

    if (!embed.fields.length) {
        session.data.activeField = 0;
    } else {
        session.data.activeField = Math.min(
            index,
            embed.fields.length - 1
        );
    }

    session.updatedAt = Date.now();

    return removed;
}


// ============================================================
// MOVE
// ============================================================

function moveField(session, from, to) {
    if (!session?.data?.embeds) {
        return false;
    }

    const embedIndex = Number(
        session.data.activeEmbed
    ) || 0;

    const embed =
        session.data.embeds[embedIndex];

    if (!embed?.fields?.length) {
        return false;
    }

    from = Number(from);
    to = Number(to);

    if (
        !Number.isInteger(from) ||
        !Number.isInteger(to) ||
        from < 0 ||
        from >= embed.fields.length ||
        to < 0 ||
        to >= embed.fields.length
    ) {
        return false;
    }

    if (from === to) {
        return true;
    }

    const [field] =
        embed.fields.splice(from, 1);

    embed.fields.splice(to, 0, field);

    session.data.activeField = to;
    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// GET
// ============================================================

function getFields(session, embedIndex = null) {
    if (!session?.data?.embeds) {
        return [];
    }

    const index =
        embedIndex === null
            ? Number(session.data.activeEmbed) || 0
            : Number(embedIndex);

    return session.data.embeds[index]?.fields || [];
}


// ============================================================
// GET ONE
// ============================================================

function getField(session, index, embedIndex = null) {
    const fields = getFields(
        session,
        embedIndex
    );

    return fields[index] || null;
}


// ============================================================
// SET ACTIVE FIELD
// ============================================================

function setActiveField(session, index) {
    const fields = getFields(session);

    index = Number(index);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= fields.length
    ) {
        return false;
    }

    session.data.activeField = index;
    session.updatedAt = Date.now();

    return true;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createField,

    addField,
    editField,
    removeField,
    moveField,

    getFields,
    getField,

    setActiveField
};
