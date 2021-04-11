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
   // --------------------------
   // If no new prefix is given
   // --------------------------

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text = ":warning: Please provide a valid prefix to set.";

      return sendMessage(data);
   }

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (data.message.isAdmin === false)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server admins.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   if (data.message.isAdmin)
   {
      prefix(data);
   }
};


// -------------------------------
// prefix varible command handler
// -------------------------------

const prefix = function(data)
{
   const newPrefix = data.cmd.params.split(" ")[0].toLowerCase();

   if (newPrefix === "reset")
   {
      var reset = "!tr";
      console.log(newPrefix);
      return db.updatePrefix(
         data.message.channel.guild.id,
         reset, //This would be the new prefix
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            var outputvalid =
            "**```Command prefix has been reset```**\n" +
            `Your new prefix is **\`${reset}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            sendMessage(data);
         }
      );
   }
   else if (newPrefix !== "")
   {
      console.log(newPrefix);
      return db.updatePrefix(
         data.message.channel.guild.id,
         newPrefix, //This would be the new prefix
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            var outputvalid =
            "**```New command prefix has been set```**\n" +
            `Your new prefix is **\`${newPrefix}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            sendMessage(data);
         }
      );
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid prefix option.\n";

   // -------------
   // Send message
   // -------------

   sendMessage(data);
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
