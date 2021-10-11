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
function reactpersist (data)
{

   const commandVariable = data.cmd.params.split(" ")[0].toLowerCase();
   // eslint-disable-next-line no-unused-vars

   if (commandVariable === "two" || commandVariable === "thr")
   {

      let value = false;
      if (commandVariable === "two")
      {

         value = true;

      }

      // console.log(`DEBUG: embed variable ${commandVariable1}`);
      return db.updateServerTable(data.message.channel.guild.id, "reactpersist", value, function error (err)
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
            `Reaction Persist Message Tranlastions = ${commandVariable}\n\n`;
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
      }\`** is not a valid persist option.\n`;

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
         ":warning:  Missing `reactpersist` parameter. Use " +
         `\`${data.config.translateCmdShort} help react\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return reactpersist(data);

};


