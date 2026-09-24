const mongoose = require("mongoose");

const AntiRaidSchema = new mongoose.Schema(
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

        raid: {
            enabled: {
                type: Boolean,
                default: true
            },

            threshold: {
                type: Number,
                default: 5
            },

            window: {
                type: Number,
                default: 10000
            }
        },

        age: {
            enabled: {
                type: Boolean,
                default: true
            },

            minimum: {
                type: Number,
                default: 7 * 24 * 60 * 60 * 1000
            }
        },

        bots: {
            enabled: {
                type: Boolean,
                default: true
            }
        },

        rejoin: {
            enabled: {
                type: Boolean,
                default: false
            },

            threshold: {
                type: Number,
                default: 3
            },

            window: {
                type: Number,
                default: 5 * 60 * 1000
            }
        },

        username: {
            enabled: {
                type: Boolean,
                default: false
            },

            patterns: {
                type: [
                    String
                ],
                default: []
            }
        },

        punishment: {
            raid: {
                type: String,
                default: "kick"
            },

            age: {
                type: String,
                default: "strip"
            },

            botadd: {
                type: String,
                default: "ban"
            },

            rejoin: {
                type: String,
                default: "timeout"
            },

            username: {
                type: String,
                default: "log"
            }
        },

        timeout: {
            rejoin: {
                type: Number,
                default: 10 * 60 * 1000
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

        logs: {
            channelId: {
                type: String,
                default: null
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
        },

        whitelist: {
            type: [
                String
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.AntiRaid ||
    mongoose.model(
        "AntiRaid",
        AntiRaidSchema
    );
