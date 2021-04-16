
// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
<<<<<<< Updated upstream
const logger = require("../../core/logger");
=======
/* eslint-disable no-undef */
const colors = require("../../core/colors");
>>>>>>> Stashed changes
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");
const message = require("../../message");

// -------------------------------
// prefix varible command handler
// -------------------------------

const prefix = function prefix (data)
{

   const newPrefix = data.cmd.params.split(" ")[0].toLowerCase();

   if (newPrefix === "reset")
   {

      const reset = "!tr";
      console.log(`DEBUG: New Prefix ${newPrefix}`);
      return db.updatePrefix(
         data.message.channel.guild.id,
         reset,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.guild.name
               );

            }
            const outputvalid =
            "**```Command prefix has been reset```**\n" +
            `Your new prefix is **\`${reset}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }
   else if (newPrefix !== "")
   {

      console.log(`DEBUG: New Prefix ${newPrefix}`);
      return db.updatePrefix(
         data.message.channel.guild.id,
         // This would be the new prefix
         newPrefix,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.guild.name
               );

            }
            const outputvalid =
            "**```New command prefix has been set```**\n" +
            `Your new prefix is **\`${newPrefix}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----------------------
// Command code
// -----------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.message.isAdmin === false)
      {

         {

            data.color = "warn";

         }
         data.text = ":cop:  This command is reserved for server adminis.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }

   // --------------------------
   // If no new prefix is given
   // --------------------------

   if (!data.cmd.params)
   {

      const cmd = data.config.translateCmdShort;
      const object_prefix = db.server_obj[data.message.guild.id].db.prefix;
      if (cmd !== object_prefix && object_prefix !== "!tr")
      {

         data.color = "info";
         data.text = `:information_source: Your current prefix is: **\`${db.server_obj[message.guild.id].db.prefix}\`**\n\n`;

      }
      else
      {

         data.color = "info";
         data.text = `:information_source: Your current prefix is: **\`${cmd}\`**\n\n`;

      }

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return prefix(data);

};


