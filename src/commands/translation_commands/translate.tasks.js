// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const langCheck = require("../../core/lang.check");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// -----------------------
// Destination ID handler
// -----------------------

function destID (dest, author)
{

   if (!dest)
   {

      return "invalid";

   }
   if (dest.startsWith("<#"))
   {

      return dest.slice(
         2,
         -1
      );

   }
   if (dest.startsWith("<@"))
   {

      return dest.slice(
         1,
         -1
      );

   }
   if (dest === "me")
   {

      return `@${author}`;

   }
   return dest;

}

function destResolver (dest)
{

   if (!dest.startsWith("@"))
   {

      return `#${dest}`;

   }
   return dest;

}

// ---------------------
// Remove from database
// ---------------------

// eslint-disable-next-line no-unused-vars
async function shoutTasks (res, data, origin, dest)
{

   data.color = "ok";
   data.text = ":negative_squared_cross_mark:  Translation tasks for this channel:";

   // -------------
   // Send message
   // -------------

   await sendMessage(data);

   for (let i = 0, len = res.length; i < len; i += 1)
   {

      const task = res[i];
      const dest = destResolver(task.dest);
      const origin = destResolver(task.origin);
      const LangFrom = langCheck(task.LangFrom).valid[0].name;
      const LangTo = langCheck(task.LangTo).valid[0].name;
      data.text = `Task ID: **${task.id}**\n` +
                  `:arrow_right:   Translating **${LangFrom}** messages from **<${origin}>, <${data.channel.id}>**\n` +
                  `and sending **${LangTo}** messages to **<${dest}>, <${dest.slice(1)}>**`;

      // -------------
      // Send message
      // -------------

      // eslint-disable-next-line no-await-in-loop
      await sendMessage(data);

   }
   data.text = ":negative_squared_cross_mark:  That's all I have!";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// ---------------
// Database error
// ---------------

function dbError (err, data)
{

   data.color = "error";
   data.text =
      ":warning:  Could not retrieve information from database. Try again " +
      "later or report this issue to an admin if problem continues.";


   // -------------
   // Send message
   // -------------

   sendMessage(data);
   return console.log(
      "error",
      err
   );

}

// --------------------
// Handle stop command
// --------------------

module.exports = function run (data)
{

   // -------------------------------------------------
   // Disallow this command in Direct/Private messages
   // -------------------------------------------------

   if (data.message.channel.type === "dm")
   {

      data.color = "warn";
      data.text =
         ":no_entry:  This command can only be called in server channels.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -------------------------------
   // Disallow multiple destinations
   // -------------------------------

   if (data.cmd.for.length > 1)
   {

      data.color = "error";
      data.text = ":warning:  Please specify only one `for` value.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -----------------------------------------
   // Disallow non-managers to stop for others
   // -----------------------------------------

   Override: if (!data.message.isDev)
   {

      if (!data.message.isGlobalChanManager)
      {

         // console.log(`DEBUG: Is not global chan manager`);
         if (!data.message.isChanManager)
         {

            // console.log(`DEBUG: Is not single chan manager`);
            data.color = "error";
            data.text = ":police_officer:  This command is reserved for server admins & channel managers";

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
         // console.log(`DEBUG: Is single chan manager`);
         break Override;

      }
      // console.log(`DEBUG: Is global chan manager`);
      break Override;

   }

   let origin = null;
   let dest = null;

   if (data.cmd.params && data.cmd.params.toLowerCase().includes("#"))
   {

      origin = destID(
         data.cmd.params,
         data.message.author.id
      );
      dest = "target";

   }
   else
   {

      // ------------------
      // Prepare task data
      // ------------------

      origin = data.message.channel.id;
      dest = destID(
         data.cmd.params,
         data.message.author.id
      );

   }

   // ------------------------------
   // Check if task actually exists
   // ------------------------------

   db.getTasks(
      origin,
      dest,
      async function error (err, res)
      {

         if (err)
         {

            return dbError(
               err,
               data
            );

         }

         // -----------------------------
         // Error if task does not exist
         // -----------------------------

         if (res.length < 1 || !res)
         {

            const orig = destResolver(origin);
            data.color = "error";
            data.text =
            ":warning:  __**No tasks**__ for " +
            `**<${orig}>**.`;
            if (dest === "all")
            {

               data.text =
               ":warning:  This channel is not being automatically " +
               "translated for anyone.";

            }

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }

         // ------------------------------------------------
         // Otherwise, proceed to remove task from database
         // ------------------------------------------------

         await shoutTasks(
            res,
            data,
            origin,
            dest,
         );

      }
   );

};
