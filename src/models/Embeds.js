const {
    Schema,
    model
} = require("mongoose");

// =========================
// SENT MESSAGE
// =========================

const sentMessageSchema =
    new Schema(
        {
            guildId: {
                type: String,
                required: true
            },

            channelId: {
                type: String,
                required: true
            },

            messageId: {
                type: String,
                required: true
            }
        },
        {
            _id: false
        }
    );

// =========================
// AUTHOR
// =========================

const authorSchema =
    new Schema(
        {
            name: {
                type: String,
                default: ""
            },

            iconURL: {
                type: String,
                default: ""
            },

            url: {
                type: String,
                default: ""
            }
        },
        {
            _id: false
        }
    );

// =========================
// FOOTER
// =========================

const footerSchema =
    new Schema(
        {
            text: {
                type: String,
                default: ""
            },

            iconURL: {
                type: String,
                default: ""
            }
        },
        {
            _id: false
        }
    );

// =========================
// FIELD
// =========================

const fieldSchema =
    new Schema(
        {
            name: {
                type: String,
                default: ""
            },

            value: {
                type: String,
                default: ""
            },

            inline: {
                type: Boolean,
                default: false
            }
        },
        {
            _id: false
        }
    );

// =========================
// EMBED
// =========================

const embedSchema =
    new Schema(
        {
            title: {
                type: String,
                default: ""
            },

            description: {
                type: String,
                default: ""
            },

            color: {
                type: String,
                default: null
            },

            url: {
                type: String,
                default: ""
            },

            author: {
                type: authorSchema,
                default: () => ({})
            },

            footer: {
                type: footerSchema,
                default: () => ({})
            },

            thumbnail: {
                type: String,
                default: ""
            },

            image: {
                type: String,
                default: ""
            },

            fields: {
                type: [
                    fieldSchema
                ],
                default: []
            }
        },
        {
            _id: false
        }
    );

// =========================
// EMBED COMPONENT
// =========================

const componentSchema =
    new Schema(
        {
            type: {
                type: String,
                required: true
            },

            label: {
                type: String,
                default: ""
            },

            style: {
                type: String,
                default: "primary"
            },

            emoji: {
                type: String,
                default: ""
            },

            customId: {
                type: String,
                default: ""
            },

            url: {
                type: String,
                default: ""
            },

            disabled: {
                type: Boolean,
                default: false
            },

            selectType: {
                type: String,
                default: "string"
            },

            placeholder: {
                type: String,
                default: ""
            },

            minValues: {
                type: Number,
                default: 1
            },

            maxValues: {
                type: Number,
                default: 1
            },

            options: {
                type: [
                    Schema.Types.Mixed
                ],
                default: []
            }
        },
        {
            _id: false
        }
    );

// =========================
// MAIN MODEL
// =========================

const embedSchemaMain =
    new Schema(
        {
            guildId: {
                type: String,
                required: true,
                index: true
            },

            userId: {
                type: String,
                required: true,
                index: true
            },

            name: {
                type: String,
                required: true,
                trim: true
            },

            content: {
                type: String,
                default: ""
            },

            embed: {
                type: embedSchema,
                default: () => ({})
            },

            components: {
                type: [
                    componentSchema
                ],
                default: []
            },

            sentMessages: {
                type: [
                    sentMessageSchema
                ],
                default: []
            }
        },
        {
            timestamps: true
        }
    );

// =========================
// UNIQUE EMBED NAME
// =========================

embedSchemaMain.index(
    {
        guildId: 1,
        name: 1
    },
    {
        unique: true
    }
);

// =========================
// EXPORT
// =========================

module.exports =
    model(
        "Embed",
        embedSchemaMain
    );
