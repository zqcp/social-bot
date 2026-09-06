const state = require("../state");

// =========================
// GET COMPONENTS
// =========================

function get(userId) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    return Array.isArray(current.components)
        ? current.components
        : [];
}

// =========================
// ADD COMPONENT
// =========================

function add(
    userId,
    component
) {
    const current =
        state.get(userId);

    if (!current || !component) {
        return null;
    }

    const components = get(userId);

    components.push({
        ...component
    });

    state.update(
        userId,
        {
            components
        }
    );

    return components;
}

// =========================
// UPDATE COMPONENT
// =========================

function update(
    userId,
    index,
    changes = {}
) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    const components = get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    components[index] = {
        ...components[index],
        ...changes
    };

    state.update(
        userId,
        {
            components
        }
    );

    return components[index];
}

// =========================
// REMOVE COMPONENT
// =========================

function remove(
    userId,
    index
) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    const components = get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    const removed =
        components.splice(
            index,
            1
        )[0];

    state.update(
        userId,
        {
            components
        }
    );

    return removed;
}

// =========================
// DUPLICATE COMPONENT
// =========================

function duplicate(
    userId,
    index
) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    const components = get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    const copy = {
        ...components[index]
    };

    if (
        Array.isArray(copy.options)
    ) {
        copy.options =
            copy.options.map(
                option => ({
                    ...option
                })
            );
    }

    components.splice(
        index + 1,
        0,
        copy
    );

    state.update(
        userId,
        {
            components
        }
    );

    return copy;
}

// =========================
// MOVE COMPONENT
// =========================

function move(
    userId,
    fromIndex,
    toIndex
) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    const components = get(userId);

    if (
        !Number.isInteger(fromIndex) ||
        !Number.isInteger(toIndex) ||
        fromIndex < 0 ||
        fromIndex >= components.length ||
        toIndex < 0 ||
        toIndex >= components.length
    ) {
        return null;
    }

    if (
        fromIndex === toIndex
    ) {
        return components;
    }

    const moved =
        components.splice(
            fromIndex,
            1
        )[0];

    components.splice(
        toIndex,
        0,
        moved
    );

    state.update(
        userId,
        {
            components
        }
    );

    return components;
}

// =========================
// MOVE UP
// =========================

function moveUp(
    userId,
    index
) {
    if (index <= 0) {
        return get(userId);
    }

    return move(
        userId,
        index,
        index - 1
    );
}

// =========================
// MOVE DOWN
// =========================

function moveDown(
    userId,
    index
) {
    const components =
        get(userId);

    if (
        !components ||
        index >= components.length - 1
    ) {
        return components;
    }

    return move(
        userId,
        index,
        index + 1
    );
}

// =========================
// CLEAR COMPONENTS
// =========================

function clear(userId) {
    const current =
        state.get(userId);

    if (!current) {
        return null;
    }

    state.update(
        userId,
        {
            components: []
        }
    );

    return [];
}

// =========================
// COUNT COMPONENTS
// =========================

function count(userId) {
    return get(userId).length;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    get,
    add,
    update,
    remove,
    duplicate,
    move,
    moveUp,
    moveDown,
    clear,
    count
};
