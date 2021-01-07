# Discord Webhooks
![version](https://img.shields.io/npm/v/webhook-discord.svg "Version")
![npm](https://img.shields.io/npm/dt/webhook-discord.svg "Total Downloads")

A simple Javascript file for nicely formatting Discord webhooks

See the full documentation at [jb3.github.io/webhook-discord](https://jb3.github.io/webhook-discord)

## Usage
It's simple

To initialise:
```js
const webhook = require("webhook-discord")

const Hook = new webhook.Webhook("WEBHOOK URL")
```

### Presets

To send an info message:
```js
Hook.info("WEBHOOK NAME","Info")
```

To send a warning message:
```js
Hook.warn("WEBHOOK NAME", "Warning message")
```

To send an error message:
```js
Hook.err("WEBHOOK NAME","Error")
```

To send a success message:
```js
Hook.success("WEBHOOK NAME","Yay we did something right")
```

### Custom messages

To send custom messages, you should make use of the MessageBuilder.

See all the options on the [documentation](https://jb3.github.io/webhook-discord/MessageBuilder.html)

```js
const webhook = require("webhook-discord");

const Hook = new webhook.Webhook("WEBHOOK URL");

const msg = new webhook.MessageBuilder()
                .setName("Username")
                .setColor("#aabbcc")
                .setText("This is my webhook!");
Hook.send(msg);
```

## Installation
Either use npm:
```
npm install webhook-discord
```
Or clone from source:
```
git clone https://github.com/jb3/webhook-discord.git
```

## License

MIT


