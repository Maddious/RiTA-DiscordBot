class MessageBuilder {
    /**
     * This is the class to initialize a new MessageBuilder.
     *
     * Chaining of properties is supported so you can message.setTitle("abc").setDescription("blah")
     * @constructor
     */
    constructor() {
        this.data = {
            "attachments": [{ "fields": [] }]
        };
    }

    /**
     * Return the data that would be sent to the webhook if it was executed.
     */
    getJSON() {
        return this.data;
    }

    /**
     * Set the description of the embed
     *
     * @param {string} description The description to use
     */
    setDescription(description) {
        this.data.attachments[0].text = description;
        return this;
    }

    /**
     * Add an avatar to the webhooks
     *
     * @param {string} avatarURL The URL to the avatar.
     */
    setAvatar(avatarURL) {
        this.data.icon_url = avatarURL;
        return this;
    }

    /**
     * Set the footer of the embed
     *
     * @param {string} footer The footer to use
     * @param {string} footerIcon The icon to display in the footer
     */
    setFooter(footer, footerIcon) {
        this.data.attachments[0].footer = footer;

        if (footerIcon) {
            this.data.attachments[0].footer_icon = footerIcon;
        }
        return this;
    }

    /**
     * Set the title of the embed
     *
     * @param {string} title The title to use
     */
    setTitle(title) {
        this.data.attachments[0].title = title;
        return this;
    }

    /**
     * This method sets the username of the hook
     *
     * @param {string} username The username to use
     */
    setName(username) {
        this.data.username = username;
        return this;
    }

    /**
     * This method sets the color of the embed.
     *
     * @param {string} color The hexadecimal color
     */
    setColor(color) {
        this.data.attachments[0].color = color;
        return this;
    }

    /**
     * Set the text to be sent alongside the embed.
     *
     * @param {string} text The text.
     */
    setText(text) {
        this.data.text = text;
        return this;
    }

    /**
     * Set the URL for the Discord embed
     * 
     * @param {string} url The URL to link to from the embed.
     */
    setURL(url) {
        this.data.attachments[0].title_link = url;
        return this;
    }

    /**
     * Set the author of the embed
     * @param {string} author Name of the author
     * @param {string} iconURL Optional: Icon URL of the author
     * @param {string} url Optional: Link to the author
     */
    setAuthor(author, iconURL, url) {
        this.data.attachments[0].author_name = author;

        if (iconURL) {
            this.data.attachments[0].author_icon = iconURL;
        }

        if (url) {
            this.data.attachments[0].author_link = url;
        }

        return this;
    }

    /**
     * This method adds a new field to the embed.
     *
     * @param {string} title The title of the field.
     * @param {string} value The value of the field.
     * @param {bool} inline Should the field be an inline field
     */
    addField(title, value, inline) {
        if (!inline) {
            inline = false;
        }

        const fieldObj = {
            "title": title,
            "value": value,
            "short": inline
        };

        this.data.attachments[0].fields.push(fieldObj);
        return this;
    }

    /**
     * Remove a field from an embed
     *
     * @param {string} name The name of the field to remove
     */
    removeField(name) {
        this.data.attachments[0].fields = this.data.attachments[0].fields.filter(field => field.title != name);

        return this;
    }

    /**
     * Set timestamp, if no argument is passed, the current
     * time is used.
     *
     * @param {number} timestamp The timestamp to use.
     */
    setTime(timestamp) {
        if (!timestamp) {
            timestamp = new Date() / 1000;
        }

        this.data.attachments[0].ts = timestamp;
        return this;
    }

    /**
     * This method adds an image to the embed.
     *
     * @param {string} imageURL The URL to the image.
     */
    setImage(imageURL) {
        if (!imageURL) {
            process.emitWarning("Image passed was null, nothing will be displayed in Discord");
        }
        this.data.attachments[0].image_url = imageURL;
        return this;
    }

    /**
     * This method adds a thumbnail to the embed.
     *
     * @param {string} thumbnailURL The URL to the thumbnail.
     */
    setThumbnail(thumbnailURL) {
        if (!thumbnailURL) {
            process.emitWarning("thumbnail passed was null, nothing will be displayed in Discord");
        }
        this.data.attachments[0].thumb_url = thumbnailURL;
        return this;
    }
}

module.exports = MessageBuilder;
