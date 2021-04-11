// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const colors = require("../core/colors");
const db = require("../core/db");
const logger = require("../core/logger");
const discord = require("discord.js");

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function(data)
{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ----------------
   // Execute setting
   // ----------------

   getSettings(data);
};

// -------------------
// Available Settings
// -------------------

const getSettings = function(data)
{
   // ----------------------------
   // Set default server language
   // ----------------------------

   const setLang = function(data)
   {
      // ---------------------------
      // Error for invalid language
      // ---------------------------

      if (data.cmd.to.valid.length !== 1)
      {
         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // ------------------------
      // Error for same language
      // ------------------------

      if (data.cmd.server && data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {
         data.color = "info";
         data.text =
            ":information_source:  **`" +
            data.cmd.to.valid[0].name + "`** is the current default " +
            "languange of this server. To change:\n```md\n# Example\n" +
            data.config.translateCmd + " settings setLang to french\n```";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // ----------------
      // Update database
      // ----------------

      return db.updateServerLang(
         data.message.channel.guild.id,
         data.cmd.to.valid[0].iso,
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            data.color = "ok";
            data.text =
               "Default language for server has been changed to **`" +
               data.cmd.to.valid[0].name + "`**.";

            // -------------
            // Send message
            // -------------

            return sendMessage(data);
         }
      );
   };

   // ---------------
   // Disconnect bot
   // ---------------

   const disconnect = function(data)
   {
      data.color = "info";
      data.text = data.bot.username + " is now disconnected from the server.";
      sendMessage(data);

      return setTimeout(function()
      {
         data.message.channel.guild.leave();
      }, 3000);
   };

   // -------------
   // List Servers
   // -------------

   const listServers = function(data)
   {
      data.text = "__**Active Servers**__ - ";

      const activeGuilds = data.client.guilds.array();

      data.text += `${activeGuilds.length}\n\n`;

      activeGuilds.forEach(guild =>
      {
         data.text += "```md\n";
         data.text += `> ${guild.id}\n# ${guild.name}\n`;
         data.text += `@${guild.owner.user.username}#`;
         data.text += guild.owner.user.discriminator + "\n```";
      });

      const splitOpts = {
         maxLength: 2000,
         char: ""
      };

      // -------------
      // Send message
      // -------------

      return data.message.channel.send(data.text, {split: splitOpts});
   };


   // --------------------------------------
   // Update bot (disconnects from servers)
   // --------------------------------------

   const updateBot = function(data)
   {
      //const activeGuilds = data.client.guilds.array();
      //data.color = "info";
      //data.text = `Updating bot for **${activeGuilds.length}** servers.`;
      //return sendMessage(data);
      //
      //activeGuilds.forEach(guild =>
      //{
      //   guild.owner.send(
      //   "Hello, this bot has been updated to a new version.\n " +
      //   "More info: https://ritabot.gg/whats-new/#new-in-121\n");
      //});
      return data.message.channel.send({embed: {
         color: 13107200,
         author: {
            name: data.client.user.username,
            icon_url: data.client.user.displayAvatarURL
         },
         description: ":no_entry_sign: This command has been disabled"

      }}).then((msg) =>
      {
         msg.delete(10000);
      });
   };

   // ----------
   // Update db
   // ----------

   const updateDB = function(data)
   {
      data.color = "info";
      data.text =
      ":white_check_mark: **Database has been updated.**";

      // -------------
      // Send message
      // -------------
      db.updateColumns();

      return sendMessage(data);
   };

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
      "setlang": setLang,
      "disconnect": disconnect,
      "listservers": listServers,
      "updatedb": updateDB,
      "updatebot": updateBot
   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();

   if (Object.prototype.hasOwnProperty.call(validSettings,settingParam))
   {
      return validSettings[settingParam](data);
   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      ":warning:  **`" + data.cmd.params +
      "`** is not a valid settings option.";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};

// ----------------------
// Send message function
// ----------------------

function sendMessage (data)
{
   data.message.delete(5000);
   const richEmbedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000);
   });
}
