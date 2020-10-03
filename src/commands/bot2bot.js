/* eslint-disable no-undef */
// -----------------
// Global variables
// -----------------

const colors = require("../core/colors");
const discord = require("discord.js");
var bot2botVar = "off";

// -------------
// Command Code
// -------------

module.exports.getBot2botVar = function(data)
{
   return bot2botVar;
};

module.exports.run = function (data)
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

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `bot2bot` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return data.message.channel.send({
         embed: {
            description: data.text,
            color: colors.get(data.color)
         }
      });
   }

   // ----------------
   // Execute setting
   // ----------------

   bot2botSettings(data);
};

// ---------------------------------
// bot2bot varible command handaler
// ---------------------------------

const bot2botSettings = function (data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      bot2botVar = commandVariable1;
      var output =
         "**```Bot to Bot Translation```**\n" +
         `Bot Message translation is not yet Implemented\n\n`;
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

   // -------------
   // Send message
   // -------------


   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid bot2bot option.\n";

   // -------------
   // Send message
   // -------------

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
};

