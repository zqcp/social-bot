const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
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

const embedDataSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        },

        author: {
            name: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: ""
            },
            iconURL: {
                type: String,
                default: ""
            }
        },

        thumbnail: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            default: ""
        },

        footer: {
            text: {
                type: String,
                default: ""
            },
            iconURL: {
                type: String,
                default: ""
            }
        },

        timestamp: {
            type: Boolean,
            default: false
        },

        fields: {
            type: [fieldSchema],
            default: []
        }
    },
    {
        _id: false
    }
);

const buttonSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            default: ""
        },
        emoji: {
            type: String,
            default: ""
        },
        style: {
            type: String,
            default: "secondary"
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
        action: {
            type: String,
            default: "none"
        },
        roleId: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

const selectMenuSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: "string"
        },
        customId: {
            type: String,
            default: ""
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
        disabled: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array,
            default: []
        },
        channelTypes: {
            type: Array,
            default: []
        },
        action: {
            type: String,
            default: "none"
        },
        roleId: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

const sentMessageSchema = new mongoose.Schema(
    {
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

const embedSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        channelId: {
            type: String,
            default: null
        },

        content: {
            type: String,
            default: ""
        },

        embeds: {
            type: [embedDataSchema],
            default: []
        },

        buttons: {
            type: [buttonSchema],
            default: []
        },

        selectMenus: {
            type: [selectMenuSchema],
            default: []
        },

        sentMessages: {
            type: [sentMessageSchema],
            default: []
        },

        createdBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

embedSchema.index(
    {
        guildId: 1,
        name: 1
    },
    {
        unique: true
    }
);

module.exports =
    mongoose.models.Embed ||
    mongoose.model("Embed", embedSchema);
