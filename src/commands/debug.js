// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("../core/colors");
const db = require("../core/db");
const logger = require("../core/logger");
const discord = require("discord.js");

// -----------------------
// Command code
// -----------------------

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
      debug(data);
   }
};


// -------------------------------
// debug varible command handaler
// -------------------------------

const debug = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "start")
   {
      console.log(commandVariable1);
      {
         var outputgh =
            "**```Start Debug mode```**\n" +
            `Debug mode has been Started. \n` +
            `Error Logs will be output to this channel \n\n`;
         data.color = "info";
         data.text = outputgh;

         // -------------
         // Send message
         // -------------

         sendMessage(data);
      }
   }
   else if (commandVariable1 === "stop")
   {
      console.log(commandVariable1);
      {
         var outputoc =
          "**```Stop Debug mode```**\n" +
          `Debug mode has been Stopped. \n` +
          `Error logs will not be shown.\n\n`;
         data.color = "info";
         data.text = outputoc;

         // -------------
         // Send message
         // -------------

         sendMessage(data);
      }
   }
   else
   {
      data.color = "error";
      data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid donate option.\n";

      // -------------
      // Send message
      // -------------

      sendMessage(data);
   }
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
