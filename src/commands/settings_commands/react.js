// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const logger = require("../../core/logger");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// ------------------------------
// React varible command handler
// ------------------------------

function react (data)
{

   const commandVariable = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable === "on" || commandVariable === "off")
   {

      let value = false;
      if (commandVariable === "on")
      {

         value = true;

      }

      // console.log(`DEBUG: React variable ${commandVariable}`);
      return db.updateServerTable(data.message.guild.id, "flag", value, function error (err)
      {

         if (err)
         {

            return logger(
               "error",
               err,
               "react",
               data.message.channel.guild.name
            );

         }
         const output =
            "**```Flag Reactions```**\n" +
      `Translations by Flag Reactions is now turned : \`${commandVariable}\`\n\n` +
      `\n`;
         data.color = "info";
         data.text = output;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      });

   }

   data.color = "error";
   data.text =
      `:warning:  **\`${commandVariable
      }\`** is not a valid react option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// -------------
// Command Code
// -------------

module.exports = function run (data)

{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!data.message.isAdmin)
   {

      {

         data.color = "warn";

      }
      data.text = ":cop:  This command is reserved for server admins.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }


   // --------------------------------
   // Error if react param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `react` parameter. Use `" +
         `${data.config.translateCmdShort} help react\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return react(data);

};


