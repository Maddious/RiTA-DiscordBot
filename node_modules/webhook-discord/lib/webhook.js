const MessageBuilder = require("./builder");

const snekfetch = require("snekfetch");
const util = require("util");

const ENDPOINT = "https://discordapp.com/api/v7/webhooks";

class Webhook {
    /**
    @constructor
    @param {string} url The webhooks url.
    */
    constructor(url, nowait = false) {
        this.url = url;
        this.id = "";
        this.token = "";
        this.meta = {};
        this.ready = false;
        this.nowait = nowait;
        snekfetch.get(this.url)
            .then((res) => {
                let parsed = JSON.parse(res.text);
                Object.assign(this.meta, parsed);
                this.id = parsed.id;
                this.token = parsed.token;
                this.ready = true;
            })
            .catch((err) => {
                throw err;
            });
    }

    /**
     * Verify the name of a webhook.
     * @param {string} name The name of the webhook
     */
    verifyName(name) {
        if (name.length > 32) {
            throw new Error(`The name specified was ${name.length} characters. Discord webhook names must be under 32 characters`);
        }
    }


    /**
     * Check a fields value length, because discord is rejecting fields containing more than 1024 chararacters in a value.
     * @param {string} value 
     */
    checkFieldValueLength(value) {
        if (value.length > 1024)
            throw new Error(`The value given was ${value.length} characters, fields of Discord embeds must be under 1024 characters`);
    }


    /**
     * Checks every field in the only possible attachment.
     * @param {fields} fields 
     */
    checkFields(payload) {
        if (!payload) {
            return new Promise((resolve) => resolve());
        }

        if (Object.keys(payload).indexOf("fields") == -1) {
            return new Promise((resolve) => resolve());
        }

        return new Promise((resolve) => {
            const checks = [];

            for (var i = 0; i < payload.fields.length; i++) {
                checks.push(this.checkFieldValueLength(payload.fields[i].value));
            }

            Promise.all(checks).then(() => {
                resolve();
            });
        });

    }

    /**
    @param {object} payloadRaw The payload to send.
    @param {function} resolveFunction Used internally for ratelimiting handling
    */
    sendPayload(payloadRaw, resolveFunction) {
        let payload = this.sanitiseEmbeds(payloadRaw);
        this.verifyName(payload.username);
        this.checkFields(payload.attachments[0]).then(() => {
            if (this.ready) {
                return new Promise((resolve, reject) => {
                    snekfetch.post(this.endpoint)
                        .send(payload)
                        .then((response) => {
                            if (resolveFunction) {
                                resolveFunction(response);
                            }

                            resolve();
                        })
                        .catch((err) => {
                            let e = JSON.parse(err.text);

                            if (e.code === 50006) { // We've sent an empty message
                                reject({ error: "No content specified" });
                            }

                            if (e.retry_after) { // We are being ratelimited
                                setTimeout(() => {
                                    this.sendPayload(payload, resolve);
                                }, e.retry_after);
                            } else {
                                reject(err);
                            }
                        });
                });
            } else {
                setTimeout(() => {
                    this.sendPayload(payload, resolveFunction);
                }, 10);
            }
        });

    }

    /**
    @returns {string} The endpoint of the webhook.
    */
    get endpoint() {
        let qs = "";
        if (this.nowait) {
            qs = "?wait=false";
        }
        return `${ENDPOINT}/${this.id}/${this.token}/slack${qs}`;
    }

    /**
    @param {string} name The username of the error webhook.
    @param {string} message The message of the error webhook.
    */
    err(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#ff0000",
                "fields": [{
                    "title": "Error",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    /**
    @param {string} name The username of the info webhook.
    @param {string} message The message of the info webhook.
    */
    info(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#00fffa",
                "fields": [{
                    "title": "Information",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }
    /**
    @param {string} name The username of the success webhook.
    @param {string} message The message of the success webhook.
    */
    success(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#04ff00",
                "fields": [{
                    "title": "Success",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }
    /**
    @param {string} name The username of the warning webhook.
    @param {string} message The message of the warning webhook.
    */
    warn(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#ffe900",
                "fields": [{
                    "title": "Warning",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    /**
    @param {string} name The username of the custom webhook.
    @param {string} message The message of the custom webhook.
    @param {string} title The title of the custom webhook.
    @param {string} color The color of the custom webhook. (optional)
    @param {string} imageUrl The url of the image to attach (optional)
    */
    custom(name, message, title, color, imageUrl) {
        let payload = {
            "username": name,
            "attachments": [{
                "fields": [{
                    "title": title,
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };
        if (color) {
            payload.attachments[0].color = color;
        }
        if (imageUrl) {
            payload.attachments[0].image_url = imageUrl;
        }
        return this.sendPayload(payload);
    }

    /**
    @param {string} name The username of the webhook
    @param {string} message The message for the webhook to send
    @param {string} title The title of the message
    @param {string} imageUrl The URL of the image to attach
    */
    image(name, message, title, imageUrl) {
        let payload = {
            "username": name,
            "attachments": [{
                "fields": [{
                    "title": title,
                    "value": message
                }],
                "ts": new Date() / 1000,
                "image_url": imageUrl
            }]
        };

        return this.sendPayload(payload);
    }

    /**
     * Remove embeds from a message if only text is specified
     *
     * @param {Object} data The Discord webhook data
     */
    sanitiseEmbeds(data) {
        // Need to copy a derefenced object so we don't touch the messagebuilder
        let newPayload = Object.assign({}, data);

        if (data.attachments.length > 0) {
            if (
                Object.keys(data.attachments[0]).length > 1 ||
                data.attachments[0].fields.length > 0
            ) {
                // There is an embed
                return newPayload;
            } else {
                // No embeds
                newPayload.attachments = [];
                return newPayload;
            }
        } else {
            return newPayload;
        }
    }

    /**
     * This method is used to send a MessageBuilder to the webhook.
     *
     * @param {MessageBuilder} messageBuilder The message.
     */
    send(messageBuilder) {
        return new Promise((resolve, reject) => {
            // Discord will return an angry error if we don't specify a username
            if (!messageBuilder.data.username) {
                reject({ error: "No username provided" });
            }


            if (
                messageBuilder.data.text // Check for any text
            ) {
                return this.sendPayload(messageBuilder.data, resolve);
            } else if (
                Object.keys(messageBuilder.data.attachments[0]).length > 1 || // Check if there are any other properties in the embed (fields will always be there)
                messageBuilder.data.attachments[0].fields.length > 0 // Check if there are any fields in the emebd
            ) {
                return this.sendPayload(messageBuilder.data, resolve);
            } else {
                reject({ error: "No content specified" });
            }
        });
    }
}

Webhook.prototype.custom = util.deprecate(Webhook.prototype.custom, "Custom is deprecated, use MessageBuilder instead");

module.exports = {
    Webhook,
    MessageBuilder
};
