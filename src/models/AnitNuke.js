const mongoose = require("mongoose");

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
            type: [
                String
            ],
            default: []
        },

        whitelist: {
            type: [
                String
            ],
            default: []
        },

        whitelistBots: {
            type: Boolean,
            default: false
        },

        modules: {
            ban: {
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
                    default: "ban"
                }
            },

            kick: {
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
                    default: "kick"
                }
            },

            channel: {
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

            role: {
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

            emoji: {
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

            botadd: {
                enabled: {
                    type: Boolean,
                    default: false
                },

                threshold: {
                    type: Number,
                    default: 1
                },

                punishment: {
                    type: String,
                    default: "ban"
                }
            },

            webhook: {
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

            vanity: {
                enabled: {
                    type: Boolean,
                    default: false
                },

                threshold: {
                    type: Number,
                    default: 1
                },

                punishment: {
                    type: String,
                    default: "ban"
                }
            },

            permissions: {
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
