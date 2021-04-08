// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("../core/colors");
//const db = require("../core/db");
//const logger = require("../core/logger");
const discord = require("discord.js");

// ----------------------
// Database Auth Process
// ----------------------


module.exports.run = function(data)
{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (data.message.isAdmin === false)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server adminis.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   if (data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":white_check_mark:  This command file works, now add code!";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }
};

// -----------------------
// Command code
// -----------------------

/*

// -------------------------------
// debug varible command handaler
// -------------------------------

const debugettings = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if
   ----- If command is !debug #destination
   then
   Do this
   esle
   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `#Destination` parameter. Use `" +
         `${data.config.translateCmdShort} help debug\` to learn more.`;

      // -------------
      // Send message
      // -------------

      sendMessage(data);
   }

   // -------------
   // Send message
   // -------------

   sendMessage(data);
};
*/

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
