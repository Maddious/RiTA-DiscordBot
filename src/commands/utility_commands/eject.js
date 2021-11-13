// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/dev.send");
const {oneLine} = require("common-tags");

// ------
// Eject
// ------

module.exports.eject = async function eject (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Eject");

   const serverID = data.cmd.num;
   const target = data.message.client.guilds.cache.get(serverID);
   const owner = await target.members.fetch(target.ownerID);

   data.color = "warn";
   data.text = `\`\`\`${serverID} - Server connection terminated\`\`\``;

   const col = "ejectcount";
   db.increaseServersCount(col, serverID);

   if (!target)
   {

      // ----------------
      // Already ejected
      // ----------------

      data.color = "info";
      data.text = oneLine`\`\`\`${serverID} Server has already been ejected.\n\`\`\``;
      return sendMessage(data);

   }
   else if (owner)
   {

      const writeErr = `Rita has been removed from ${target.name} for Abuse. Continued abuse will result in Blacklisting`;

      // ----------------------
      // Send message to owner
      // ----------------------
      // console.log("DEBUG: Line 54 - Eject.js");
      owner.
         send(writeErr).
         catch((err) => console.log(
            "error",
            err,
            "warning",
            target.name
         ));
      // console.log(`DEBUG: ${serverID}`);
      await target.leave();

   }
   else
   {

      // --------------------------------
      // Unable to locate server details
      // --------------------------------

      data.color = "warn";
      data.text = oneLine`\`\`\`${serverID} - ${target.name}\nUnable to warn Owner, Server connection terminated\`\`\``;
      await target.leave();
      return sendMessage(data);

   }

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----
// Warn
// -----

module.exports.warn = async function warn (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Warn");

   const serverID = data.cmd.num;
   const target = data.message.client.guilds.cache.get(serverID);
   const owner = await target.members.fetch(target.ownerID);

   if (!target)
   {

      // ----------------
      // Already ejected
      // ----------------

      data.color = "info";
      data.text = oneLine`\`\`\`Server ID: ${serverID}\nRita is not in this server, Please Blacklist.\n\`\`\``;
      return sendMessage(data);

   }
   else if (owner)
   {

      const writeErr = `Hi ${owner}, And thank you for deciding to give RITA a try.\n\n` +
      `Unfortunately the recent usage of RITA in **${target.name}** server looks a bit suspicious.\n\n` +
      `If you are having technical issues with RITA and you need some help please come and join us\n` +
      `in our support server. If however the current volume of usage continues, we may be forced to\n` +
      `remove rita from your server.\n\n` +
      `We don't want to do this, if we have made a mistake and your server is just really busy then \n` +
      `please let us know ASAP as we don't want to deprive you of using RITA.\n\n` +
      `Thank You - RITA Dev Team\n\n` +
      `Support Server: https://discord.gg/hXaedzCQ8d\n\n`;

      // ----------------------
      // Send message to owner
      // ----------------------
      // console.log("DEBUG: Line 128 - Eject.js");
      owner.
         send(writeErr).
         catch((err) => console.log(
            "error",
            err,
            "warning",
            target.name
         ));

   }
   else if (!owner)
   {

      // --------------------------------
      // Unable to locate server details
      // --------------------------------

      data.color = "warn";
      data.text = oneLine`\`\`\`Server: ${target.name} \nServer ID:${serverID}\nUnable to warn Owner.\`\`\``;
      await db.updateServerTable(
         serverID,
         "warn",
         true,
         // eslint-disable-next-line consistent-return
         function error (err)
         {

            if (err)
            {

               return console.log("error", err, "warning", serverID);

            }

         }
      );

      // -------------
      // Send message
      // -------------
      return sendMessage(data);

   }

   // -------------
   // Send message
   // -------------
   data.color = "warn";
   data.text = `\`\`\`Owner: ${owner.user.username}#${owner.user.discriminator}\nServer: ${target.name} \nServer ID: ${serverID}\nServer Owner Has Been Warned\`\`\``;

   const col = "warncount";
   db.increaseServersCount(col, serverID);

   await db.updateServerTable(
      serverID,
      "warn",
      true,
      // eslint-disable-next-line consistent-return
      function error (err)
      {

         if (err)
         {

            return console.log("error", err, "warning", serverID);

         }

      }
   );

   // -------------
   // Send message
   // -------------
   return sendMessage(data);

};

// --------
// Un-Warn
// --------

module.exports.unwarn = function unwarn (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Unwarn");

   const serverID = data.cmd.num;

   return db.updateServerTable(
      serverID,
      "warn",
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
         data.text = `${`:white_check_mark:  **${serverID} Un-Warn**\n`}`;
         return sendMessage(data);

      }
   );

};
