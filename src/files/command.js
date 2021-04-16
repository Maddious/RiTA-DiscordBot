
// Blank example Command File, Delete this line and the /* and */ on line 11 and 119.

// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */

/*
const sendMessage = require("./core/command.send");

// -------------
// Command Code
// -------------

module.exports.run = function(data)
{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {
      if (data.message.isAdmin === false)
      {
         data.color = "warn";
         data.text = ":cop:  This command is reserved for server admins.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data).catch(err => console.log("TITLE, COMMANDNAME.js = ", err));
      }
      break Override;
   }

   // --------------------------------------
   // Error if COMMANDNAME param is missing
   // --------------------------------------

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `COMMANDNAME` parameter. Use `" +
         `${data.config.translateCmdShort} help COMMANDNAME\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data).catch(err => console.log("TITLE, COMMANDNAME.js = ", err));
   }

   // ----------------
   // Execute setting
   // ----------------

   COMMANDNAME(data);

};


// ------------------------------------
// COMMANDNAME varible command handler
// ------------------------------------

const COMMANDNAME = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "Variable1")
   {
      console.log("DEBUG: " + commandVariable1);

      // ------------------

      // Command Code Here

      // ------------------

      // -------------
      // Send message
      // -------------

      return sendMessage(data).catch(err => console.log("TITLE, COMMANDNAME.js = ", err));
   }
   else if (commandVariable1 === "Variable2")
   {
      console.log("DEBUG: " + commandVariable1);

      // ------------------

      // Command Code Here

      // ------------------

      // -------------
      // Send message
      // -------------

      return sendMessage(data).catch(err => console.log("TITLE, COMMANDNAME.js = ", err));
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid COMMANDNAME option.\n";

   // -------------
   // Send message
   // -------------

   return sendMessage(data).catch(err => console.log("TITLE, COMMANDNAME.js = ", err));
};
*/