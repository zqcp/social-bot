const state = require("../state");

// =========================
// GET COMPONENTS
// =========================

function get(userId) {
    const session =
        state.get(userId);

    if (!session) {
        return [];
    }

    return Array.isArray(
        session.components
    )
        ? session.components
        : [];
}

// =========================
// GET COMPONENT
// =========================

function getOne(
    userId,
    index
) {
    const components =
        get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    return components[index];
}

// =========================
// ADD
// =========================

function add(
    userId,
    component
) {
    if (
        !component ||
        typeof component !== "object"
    ) {
        return null;
    }

    const components = [
        ...get(userId),
        cloneComponent(component)
    ];

    return state.update(
        userId,
        {
            components
        }
    );
}

// =========================
// UPDATE
// =========================

function update(
    userId,
    index,
    changes = {}
) {
    const components =
        get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    if (
        !changes ||
        typeof changes !== "object"
    ) {
        return null;
    }

    const updated = components.map(
        (component, componentIndex) => {
            if (
                componentIndex !== index
            ) {
                return component;
            }

            return {
                ...component,
                ...cloneComponent(
                    changes
                )
            };
        }
    );

    return state.update(
        userId,
        {
            components: updated
        }
    );
}

// =========================
// REMOVE
// =========================

function remove(
    userId,
    index
) {
    const components =
        get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    components.splice(
        index,
        1
    );

    return state.update(
        userId,
        {
            components
        }
    );
}

// =========================
// DUPLICATE
// =========================

function duplicate(
    userId,
    index
) {
    const components =
        get(userId);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= components.length
    ) {
        return null;
    }

    const copy =
        cloneComponent(
            components[index]
        );

    components.splice(
        index + 1,
        0,
        copy
    );

    return state.update(
        userId,
        {
            components
        }
    );
}

// =========================
// MOVE
// =========================

function move(
    userId,
    fromIndex,
    toIndex
) {
    const components =
        get(userId);

    if (
        !Number.isInteger(
            fromIndex
        ) ||
        !Number.isInteger(
            toIndex
        )
    ) {
        return null;
    }

    if (
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
        return state.get(
            userId
        );
    }

    const updated = [
        ...components
    ];

    const [
        component
    ] = updated.splice(
        fromIndex,
        1
    );

    updated.splice(
        toIndex,
        0,
        component
    );

    return state.update(
        userId,
        {
            components: updated
        }
    );
}

// =========================
// MOVE UP
// =========================

function moveUp(
    userId,
    index
) {
    if (
        !Number.isInteger(index) ||
        index <= 0
    ) {
        return null;
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
        !Number.isInteger(index) ||
        index < 0 ||
        index >=
            components.length - 1
    ) {
        return null;
    }

    return move(
        userId,
        index,
        index + 1
    );
}

// =========================
// CLEAR
// =========================

function clear(
    userId
) {
    return state.update(
        userId,
        {
            components: []
        }
    );
}

// =========================
// COUNT
// =========================

function count(
    userId
) {
    return get(userId).length;
}

// =========================
// CLONE COMPONENT
// =========================

function cloneComponent(
    component
) {
    if (
        !component ||
        typeof component !== "object"
    ) {
        return component;
    }

    const result = {
        ...component
    };

    if (
        Array.isArray(
            component.options
        )
    ) {
        result.options =
            component.options.map(
                option => ({
                    ...option
                })
            );
    }

    return result;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    get,
    getOne,

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
