const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
    {
        enabled: {
            type: Boolean,
            default: false
        },

        threshold: {
            type: Number,
            default: 3
        },

        punishment: {
            type: String,
            default: "strip"
        }
    },
    {
        _id: false
    }
);

const AntiNukeSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true
        },

        enabled: {
            type: Boolean,
            default: true
        },

        admins: {
            type: [String],
            default: []
        },

        whitelist: {
            type: [String],
            default: []
        },

        whitelistBots: {
            type: Boolean,
            default: false
        },

        modules: {
            ban: {
                type: ModuleSchema,
                default: () => ({})
            },

            kick: {
                type: ModuleSchema,
                default: () => ({})
            },

            channel: {
                type: ModuleSchema,
                default: () => ({})
            },

            role: {
                type: ModuleSchema,
                default: () => ({})
            },

            emoji: {
                type: ModuleSchema,
                default: () => ({})
            },

            botadd: {
                type: ModuleSchema,
                default: () => ({
                    threshold: 1,
                    punishment: "ban"
                })
            },

            webhook: {
                type: ModuleSchema,
                default: () => ({})
            },

            vanity: {
                type: ModuleSchema,
                default: () => ({
                    threshold: 1,
                    punishment: "ban"
                })
            },

            permissions: {
                type: ModuleSchema,
                default: () => ({})
            }
        },

        logs: {
            enabled: {
                type: Boolean,
                default: true
            },

            channelId: {
                type: String,
                default: null
            }
        },

        lockdown: {
            enabled: {
                type: Boolean,
                default: false
            },

            duration: {
                type: Number,
                default: 60 * 1000
            }
        },

        protection: {
            duration: {
                type: Number,
                default: 60 * 1000
            },

            cooldown: {
                type: Number,
                default: 5 * 60 * 1000
            },

            maxActionsPerRaid: {
                type: Number,
                default: 20
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.AntiNuke ||
    mongoose.model(
        "AntiNuke",
        AntiNukeSchema
    );
