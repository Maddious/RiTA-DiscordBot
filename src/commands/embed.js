/* eslint-disable no-undef */
/* eslint-disable no-extra-parens */
// -----------------
// Global variables
// -----------------

const colors = require("../core/colors");
const db = require("../core/db");
const logger = require("../core/logger");
const discord = require("discord.js");



// -------------
// Command Code
// -------------

module.exports.run = function(data)


{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!data.message.isAdmin)
   {
      const embedMessage = new discord.RichEmbed()
         .setColor(colors.get(data.color))
         .setAuthor(data.bot.username, data.bot.displayAvatarURL)
         .setDescription(data.text)
         .setTimestamp()
         .setFooter("This message will self-destruct in one minute");

      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";

      // -------------
      // Send message
      // -------------

      return message.channel.send(embedMessage).then(msg =>
      {
         message.delete(60000);
         msg.delete(60000);
      });
   }

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {
      const embedMessage = new discord.RichEmbed()
         .setColor(colors.get(data.color))
         .setAuthor(data.bot.username, data.bot.displayAvatarURL)
         .setDescription(data.text)
         .setTimestamp()
         .setFooter("This message will self-destruct in one minute");

      data.color = "error";
      data.text =
         ":warning:  Missing `embed` parameter. Use `" +
         `${data.config.translateCmdShort} help embed\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return message.channel.send(embedMessage).then(msg =>
      {
         message.delete(60000);
         msg.delete(60000);
      });
   }

   // ----------------
   // Execute setting
   // ----------------

   embedSettings(data);
};

// -------------------------------
// embed varible command handaler
// -------------------------------

const embedSettings = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      console.log(commandVariable1);
      return db.updateEmbedVar(
         data.message.channel.guild.id,
         commandVariable1,
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            var output =
            "**```Embedded Translation```**\n" +
            `Embedded Message translation is now turned : ${commandVariable1}\n\n`;
            data.color = "info";
            data.text = output;
            const embedMessage = new discord.RichEmbed()
               .setColor(colors.get(data.color))
               .setAuthor(data.bot.username, data.bot.displayAvatarURL)
               .setDescription(data.text)
               .setTimestamp()
               .setFooter("This message will self-destruct in one minute");


            // -------------
            // Send message
            // -------------

            return message.channel.send(embedMessage).then(msg =>
            {
               message.delete(60000);
               msg.delete(60000);
            });
         }
      );
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid embed option.\n";

   // -------------
   // Send message
   // -------------
   const embedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");


   return message.channel.send(embedMessage).then(msg =>
   {
      message.delete(60000);
      msg.delete(60000);
   });
};
