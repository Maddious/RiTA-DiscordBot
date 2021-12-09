// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/dev.send");
const {oneLine} = require("common-tags");

// ----------
// Blacklist
// ----------

module.exports.blacklist = async function blacklist (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Blacklist");

   const serverID = data.cmd.num;
   const target = data.message.client.guilds.cache.get(serverID);
   if (!target)
   {

      data.color = "warn";
      data.text = oneLine`${`:regional_indicator_x:  **${serverID} Blacklisted**\n`}`;

   }
   else if (target.owner)
   {

      const owner = await target.members.fetch(target.ownerID);
      data.color = "warn";
      data.text = `${`:regional_indicator_x:  **${target.name} Blacklisted**\nThe server owner has been notified\n` +
      "```md\n> "}${target.id}\n@${owner.user.tag}\n${target.memberCount} members\n\`\`\``;
      data.title = "Server Blacklisted";

      const writeErr = `One of your server's - ${target.name} has been Blacklisted. If you wish to appeal then please join our discord server and speak to an admin: https://discord.gg/mgNR64R`;

      // ----------------------
      // Send message to owner
      // ----------------------
      // console.log("DEBUG: Line 47 - Blacklist.js");
      owner.
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

   await db.updateServerTable(
      serverID,
      "blacklisted",
      true,
      // eslint-disable-next-line consistent-return
      function error (err)
      {

         if (err)
         {

            return logger("error", err, "command", data.message.channel.guild.name);

         }

      }
   );

   // -------------
   // Send message
   // -------------
   return sendMessage(data);

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
      "blacklisted",
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
