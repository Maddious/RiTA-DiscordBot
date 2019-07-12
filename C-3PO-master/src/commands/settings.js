const botSend = require("../core/send");
const db = require("../core/db");
const logger = require("../core/logger");

// -------------------------
// Proccess settings params
// -------------------------

module.exports = function(data)
{
   //
   // Command allowed by admins only
   //

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";
      return botSend(data);
   }

   //
   // Error if settings param is missing
   //

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmd} help settings\` to learn more.`;

      return botSend(data);
   }

   //
   // Execute setting
   //

   getSettings(data);
};

// ===================
// Available Settings
// ===================

const getSettings = function(data)
{
   // ----------------------------
   // Set default server language
   // ----------------------------

   const setLang = function(data)
   {
      //
      // Error for invalid language
      //

      if (data.cmd.to.valid.length !== 1)
      {
         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";
         return botSend(data);
      }

      //
      // Error for same language
      //

      if (data.cmd.server && data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {
         data.color = "info";
         data.text =
            ":information_source:  **`" +
            data.cmd.to.valid[0].name + "`** is the current default " +
            "languange of this server. To change:\n```md\n# Example\n" +
            data.config.translateCmd + " settings setLang to french\n```";

         return botSend(data);
      }

      //
      // Update database
      //

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

            return botSend(data);
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
      botSend(data);

      return setTimeout(function()
      {
         data.message.channel.guild.leave();
      }, 3000);
   };

   // ---------------
   // List Servers
   // ---------------

   const listServers = function(data)
   {
      if (data.message.author.id === data.config.owner)
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
            maxLength: 1000,
            char: ""
         };

         return data.message.channel.send(data.text, {split: splitOpts});
      }
   };

   // --------------------------------------
   // Update bot (disconnects from servers)
   // --------------------------------------

   const updateBot = function(data)
   {
      if (data.message.author.id === data.config.owner)
      {
         const activeGuilds = data.client.guilds.array();
         data.color = "info";
         data.text = `Updating bot for **${activeGuilds.length}** servers.`;
         botSend(data);

         activeGuilds.forEach(guild =>
         {
            guild.owner.send(
               "Hello, this bot has been updated to a new version, please " +
               "reinvite through this link: \n" + data.config.inviteURL
            ).then(m => //eslint-disable-line no-unused-vars
            {
               guild.leave();
            }).catch(err => logger("error", err));
         });
      }
   };

   // --------------------------------------
   // Fix guild mismatch
   // --------------------------------------

   const dbFix = function(data)
   {
      if (data.message.author.id === data.config.owner)
      {
         const activeGuilds = data.client.guilds.array();
         data.color = "info";
         data.text = `Updating db for **${activeGuilds.length}** servers.`;
         botSend(data);

         activeGuilds.forEach(guild =>
         {
            db.addServer(guild.id, data.config.defaultLanguage, db.Servers);
         });
      }
   };

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
      "setlang": setLang,
      "disconnect": disconnect,
      "listservers": listServers,
      "dbfix": dbFix,
      "updatebot": updateBot
   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();

   if (validSettings.hasOwnProperty(settingParam))
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

   return botSend(data);
};
