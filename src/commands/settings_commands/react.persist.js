// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const logger = require("../../core/logger");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// --------------------
// Flag Persistence
// --------------------
function flagpersist (data)
{

   const commandVariable2 = data.cmd.params.split(" ")[0].toLowerCase();
   // eslint-disable-next-line no-unused-vars

   if (commandVariable2 === "on" || commandVariable2 === "off")
   {

      let value = false;
      if (commandVariable2 === "on")
      {

         value = true;

      }

      // console.log(`DEBUG: embed variable ${commandVariable1}`);
      return db.updateServerTable(data.message.channel.guild.id, "flagpersist", value, function error (err)
      {

         if (err)
         {

            return logger(
               "error",
               err,
               "command",
               data.message.channel.guild.name
            );

         }
         const output =
            "**```Updated Persist Settings```**\n" +
            `Reaction Persist Message Tranlastions = ${commandVariable2}\n\n`;
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
      `:warning:  **\`${commandVariable2
      }\`** is not a valid react option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

module.exports = function run (data)

{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (data.message.isAdmin === false)
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
         ":warning:  Missing `flagpersist` parameter. Use `" +
         `${data.config.translateCmdShort} help react\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return flagpersist(data);

};


