// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const db = require("../../core/db");
const auth = require("../../core/auth");
const sendMessage = require("../../core/command.send");

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

// --------------------------
// Remove task from database
// --------------------------


function deleteTask (data)
{

   console.log(`DEBUG: [5] deleteTask Called`);
   db.removeTaskID(
      data.cmd.num,
      function error (err, res)
      {

         // console.log("DEBUG: remoteTask()");
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

            data.color = "error";
            data.text = `:warning: Unable to delete task from DB`;

            // -------------
            // Send message
            // -------------

            console.log(`DEBUG: [6] Unable to delete task from DB`);
            return sendMessage(data);

         }

         data.color = "ok";
         data.text = `:white_check_mark: Task ${data.cmd.num} Deleted`;

         // -------------
         // Send message
         // -------------

         console.log(`DEBUG: [6] Task ${data.cmd.num} Deleted`);
         return sendMessage(data);

      }

   );

}

// --------------------------
// Remove task from database
// --------------------------


function checkDeleteTask (data)
{

   if (!data.cmd.num)
   {

      data.color = "error";
      data.text = `:warning:  Please specify a task ID`;

      // -------------
      // Send message
      // -------------
      console.log(`DEBUG: [2] No task ID in command`);
      return sendMessage(data);

   }

   console.log(`DEBUG: [2] Has task ID in command`);

   {

      db.checkTask(
         data.cmd.num,
         "id",
         null,
         function error (err, res)
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

               data.color = "error";
               data.text = `:warning: No such task`;

               // -------------
               // Send message
               // -------------

               console.log(`DEBUG: [3] Invalid task ID in command`);
               return sendMessage(data);

            }
            console.log(`DEBUG: [3] Valid task ID in command`);

            // -----------------------------------
            // Check where is command called from
            // -----------------------------------

            const server = res[0].server;
            if (data.message.guild.id === server)
            {

               console.log(`DEBUG: [4] Matching Servers - Call deleteTask`);
               return deleteTask(data);

            }


            if (!data.message.isDev)
            {

               data.color = "error";
               data.text =
                     ":police_officer: Only Dev's can stop a command for another server.";

               // -------------
               // Send message
               // -------------

               console.log(`DEBUG: [4] Not Dev - Non-Matching Servers - Terminate`);
               return sendMessage(data);

            }

            // --------------------------------------
            // Otherwise, proceed to call deleteTask
            // --------------------------------------

            console.log(`DEBUG: [4] Dev Confimred - Non-Matching Servers - Call deleteTask`);
            return deleteTask(data);

         }
      );

   }

}

// ----------------------
// Remove from database
// ----------------------

function removeTask (res, data, origin, dest, destDisplay)
{

   db.removeTask(
      origin,
      dest,
      function error (err)
      {

         // console.log("DEBUG: remoteTask()");
         if (err)
         {

            return dbError(
               err,
               data
            );

         }
         if (!isNaN(destDisplay))
         {

            // eslint-disable-next-line no-param-reassign
            destDisplay = `<@${destDisplay}>`;

         }
         data.color = "ok";
         data.text =
         `${":negative_squared_cross_mark:  Auto translation of this " +
         "channel has been stopped for **"}${destDisplay}**`;

         if (dest === "all")
         {

            data.text += ` (${res.length})`;

         }

         data.text += ".";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
   );

}

// ------------------------
// Destination ID handler
// ------------------------

function destID (dest, author)
{

   // console.log(`DEBUG: Dest Raw ${dest}`);
   if (dest.startsWith("<#"))
   {

      // console.log(`DEBUG: Pre 1 ${dest}`);
      return dest.slice(
         2,
         -1
      );

   }
   if (dest.startsWith("cs#"))
   {

      // console.log(`DEBUG: Pre 2 ${dest}`);
      return dest.slice(3);

   }
   if (dest.startsWith("<@") && !dest.startsWith("<@!"))
   {

      return dest.slice(
         1,
         -1
      );

   }
   if (dest.startsWith("<@!"))
   {

      dest = dest.slice(
         3,
         -1
      );
      return `@${dest}`;

   }
   if (dest === "me")
   {

      // console.log(`DEBUG: Pre 4 ${dest}`);
      return `@${author}`;

   }
   if (!isNaN(dest))
   {

      // console.log(`DEBUG: Pre 5 ${dest}`);
      return `@${dest}`;

   }
   return dest;

}

function destResolver (dest, author)
{

   if (dest === "me")
   {

      return `<@${author}>`;

   }
   return dest;

}

// ---------------------
// Handle stop command
// ---------------------

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
            data.text = ":police_officer:  You need to be a channel manager to stop translating this channel for others.";

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

   if (data.cmd.params && data.cmd.params.toLowerCase().includes("task"))
   {

      console.log(`DEBUG: [1] Stop by Task ID called by ${data.message.author.username}`);
      return checkDeleteTask(data);

   }

   // ------------------
   // Prepare task data
   // ------------------

   const origin = data.message.channel.id;
   data.channel = data.message.channel;
   const from = data.cmd.from.unique[0];
   const to = data.cmd.to.unique[0];
   const dest = destID(
      data.cmd.for[0],
      data.message.author.id
   );
   let destDisplay = destResolver(
      data.cmd.for[0],
      data.message.author.id
   );

   // ------------------------------
   // Check if task actually exists
   // ------------------------------

   {

      db.checkTask(
         origin,
         dest,
         null,
         function error (err, res)
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

               if (!isNaN(destDisplay))
               {

                  // eslint-disable-next-line no-param-reassign
                  destDisplay = `<@${destDisplay}>`;

               }
               data.color = "error";
               data.text =
            ":warning:  This channel is __**not**__ being translated for " +
            `**${destDisplay}**.`;

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

            removeTask(
               res,
               data,
               origin,
               dest,
               destDisplay
            );

         }
      );

   }

};
