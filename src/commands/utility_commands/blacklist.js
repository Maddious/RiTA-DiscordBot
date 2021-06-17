// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/dev.send");
const oneLine = require("common-tags").oneLine;

// ----------
// Blacklist
// ----------

module.exports.blacklist = function blacklist (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Blacklist");

   const serverID = data.cmd.num;

   return db.updateServerTable(
      serverID,
      "blacklist",
      true,
      async function error (err)
      {

         if (err)
         {

            return logger("error", err, "command", data.message.channel.guild.name);

         }


         const target = data.message.client.guilds.cache.get(serverID);
         if (!target)
         {

            data.color = "warn";
            data.text = oneLine`${`:regional_indicator_x:  **${serverID} Blacklisted**\n`}`;

         }
         else if (target.owner)
         {

            data.color = "warn";
            data.text = `${`:regional_indicator_x:  **${target.name} Blacklisted**\nThe server owner has been notified\n` +
            "```md\n> "}${target.id}\n@${target.owner.user.username}#${
               target.owner.user.discriminator}\n${target.memberCount} members\n\`\`\``;
            data.title = "Server Blacklisted";

            const writeErr = `One of your server's - ${target.name} has been Blacklisted. If you wish to appeal then please join our discord server and speak to an admin: https://discord.gg/mgNR64R`;

            // ----------------------
            // Send message to owner
            // ----------------------
            console.log("DEBUG: Line 62 - Blacklist.js");
            target.owner.
               send(writeErr).
               catch((err) => console.log(
                  "error",
                  err,
                  "warning",
                  target.name
               ));
            console.log(`${serverID}`);
            await target.leave();

         }
         else
         {

            data.color = "warn";
            data.text = `${`:regional_indicator_x:  **${target.name} Blacklisted**\nUnable to notify the server owner\n` +
            "```md\n> "}${target.id}\n${target.memberCount} members\n\`\`\``;
            data.title = "Server Blacklisted";
            await target.leave();


         }

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
   );

};

// -------------
// Un-Blacklist
// -------------

module.exports.unblacklist = function unblacklist (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: unblacklist");

   const serverID = data.cmd.num;

   return db.updateServerTable(
      serverID,
      "blacklist",
      false,
      function error (err)
      {

         if (err)
         {

            return logger("error", err, "command", data.message.channel.guild.name);

         }

         // -------------
         // Send message
         // -------------

         data.color = "warn";
         data.text = oneLine`${`:white_check_mark:  **${serverID} Un-Blacklisted**\n`}`;
         return sendMessage(data);

      }
   ).catch((err) => console.log(
      "error",
      err,
      "warning",
      serverID
   ));

};
