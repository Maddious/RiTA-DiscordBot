// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
<<<<<<< Updated upstream
/* eslint-disable consistent-return */
=======
>>>>>>> Stashed changes
const discord = require("discord.js");
const auth = require("./auth");
const colors = require("./colors").get;
const spacer = "​                                                          ​";

const hook = new discord.WebhookClient(
   auth.loggerWebhookID,
   auth.loggerWebhookToken
);

// --------------------
// Log data to console
// --------------------

const devConsole = function devConsole (data)
{

   if (auth.dev)
   {

      return console.log(data);

   }

};

// ------------
// Hook Sender
// ------------

const hookSend = function hookSend (data)
{

   const embed = new discord.RichEmbed({
<<<<<<< Updated upstream
=======
      title: data.title,
>>>>>>> Stashed changes
      color: colors(data.color),
      description: data.msg,
      footer: {
         text: data.footer
<<<<<<< Updated upstream
      },
      title: data.title
=======
      }
>>>>>>> Stashed changes
   });
   hook.send(embed).catch((err) =>
   {

      console.error(`hook.send error:\n${err}`);

   });

};

// -------------
// Error Logger
// -------------

const errorLog = function errorLog (error, subtype, id)
{

   let errorTitle = null;

   const errorTypes = {
<<<<<<< Updated upstream
      api: ":boom:  External API Error",
      command: ":chains: Command Error",
      db: ":outbox_tray:  Database Error",
      discord: ":notepad_spiral: DiscordAPIError: Unknown Message",
=======
>>>>>>> Stashed changes
      dm: ":skull_crossbones:  Discord - user.createDM",
      edit: ":crayon:  Discord - message.edit",
      fetch: ":no_pedestrians:  Discord - client.fetchUser",
      presence: ":loudspeaker:  Discord - client.setPresence",
      react: ":anger:  Discord - message.react",
      send: ":postbox:  Discord - send",
      shardFetch: ":pager:  Discord - shard.fetchClientValues",
      typing: ":keyboard:  Discord - channel.startTyping",
      uncaught: ":japanese_goblin:  Uncaught Exception",
      unhandled: ":japanese_ogre:  Unhandled promise rejection",
      warning: ":exclamation:  Process Warning"
   };

<<<<<<< Updated upstream
   // if (errorTypes.hasOwnProperty(subtype))
   if (Object.prototype.hasOwnProperty.call(
      errorTypes,
      subtype
   ))
=======
   //if (errorTypes.hasOwnProperty(subtype))
   if (Object.prototype.hasOwnProperty.call(errorTypes,subtype))
>>>>>>> Stashed changes
   {

      errorTitle = errorTypes[subtype];

   }

   hookSend({
<<<<<<< Updated upstream
      color: "err",
      // eslint-disable-next-line no-useless-concat
      msg: `\`\`\`json\n${error.toString()}\n${error.stack}\n\n` + `Error originated from server: ${id}\`\`\``,
      title: errorTitle
=======
      title: errorTitle,
      color: "err",
      // eslint-disable-next-line no-useless-concat
      msg: "```json\n" + error.toString() + "\n" + error.stack + "\n\n" + "Error originated from server: " + id + "```"
>>>>>>> Stashed changes
   });

};

// ----------------
// Warnings Logger
// ----------------

const warnLog = function warnLog (warning)
{

   hookSend({
      color: "warn",
      msg: warning
   });

};

// ---------------
// Guild Join Log
// ---------------

const logJoin = function logJoin (guild)
{

   hookSend({
      color: "ok",
      msg:
<<<<<<< Updated upstream
         `${`:white_check_mark:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${guild.owner.user.username}#${
            guild.owner.user.discriminator}\n\`\`\`${spacer}${spacer}`,
      title: "Joined Guild"

=======
         `:white_check_mark:  **${guild.name}**\n` +
         "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
         guild.owner.user.discriminator + "\n```" + spacer + spacer
>>>>>>> Stashed changes
   });

};

// ----------------
// Guild Leave Log
// ----------------

const logLeave = function logLeave (guild)
{

   hookSend({
      color: "warn",
      msg:
<<<<<<< Updated upstream
         `${`:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${guild.owner.user.username}#${
            guild.owner.user.discriminator}\n\`\`\`${spacer}${spacer}`,
      title: "Left Guild"
   });

};

// ------------
// logger code
// ------------

module.exports = function run (type, data, subtype = null, id = "Unknown")
{

   if (hook.id === undefined)
   {

      return;

   }
   const logTypes = {
      custom: hookSend,
      dev: devConsole,
      error: errorLog,
      guildJoin: logJoin,
      guildLeave: logLeave,
      warn: warnLog
   };

   // if (logTypes.hasOwnProperty(type))
   if (Object.prototype.hasOwnProperty.call(
      logTypes,
      type
   ))
   {

      return logTypes[type](
         data,
         subtype,
         id
      );

   }

=======
         `:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
         guild.owner.user.discriminator + "\n```" + spacer + spacer
   });
>>>>>>> Stashed changes
};
