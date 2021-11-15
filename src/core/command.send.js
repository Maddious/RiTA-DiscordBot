// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const colors = require("./colors");
const discord = require("discord.js");
const embed = new discord.MessageEmbed();
const logger = require("./logger");
const error = require("./error");
const db = require("./db");
const auth = require("./auth");

// ---------------------
// Send Data to Channel
// ---------------------

async function sendMessage (data)
{

   const owner = await data.message.guild.members.fetch(data.message.guild.ownerID);
   return data.message.channel.send(embed).then((msg) =>
   {

      db.getServerInfo(
         data.message.guild.id,
         function getServerInfo (server)
         {

            if (server[0].menupersist === false || server[0].menupersist === 0)
            {

               try
               {

                  setTimeout(() => msg.delete(), auth.time.long);

               }
               catch (err)
               {

                  console.log(
                     "Bot Message Deleted Error 1, command.send.js",
                     err
                  );

               }

            }

         }
      ).catch((err) => console.log(
         "error",
         err,
         "warning",
         data.message.guild.id
      ));

   }).
      // eslint-disable-next-line consistent-return
      catch((err) =>
      {

         if (err.code && err.code === error.perm || err.code === error.access)
         {

            const col = "errorcount";
            const id = data.message.guild.id || data.message.sourceID;
            const tag = `${owner.user.username}#${owner.user.discriminator}`;
            db.increaseServersCount(col, id);

            // console.log("Error 50013");
            logger(
               "custom",
               {
                  "color": "ok",
                  "msg": `:exclamation: Write Permission Error - CS.js\n
                  Server: **${data.channel.guild.name || "Unknown"}** \n
                  Channel: **${data.channel.name || "Unknown"}**\n
                  Chan ID: **${data.channel.id || "Unknown"}**\n
                  Server ID: **${data.message.guild.id || data.message.sourceID || "Zycore Broke It Again"}**\n
                  Owner: **${owner || "Unknown"}**\n
                  Dscord Tag: **${tag || "Unknown"}**\n
                  The server owner has been notified. \n`
               }
            );
            const writeErr =
                  `:no_entry:  **${data.message.client.user.username}** does not have permission to write in your server **` +
                  `${data.channel.guild.name}**. Please fix.`;

            // -------------
            // Send message
            // -------------

            if (!owner)
            {

               return console.log(writeErr);

            }
            // console.log("DEBUG: Line 101 - Command.Send.js");
            return owner.
               send(writeErr).
               catch((err) => console.log(
                  "error",
                  err,
                  "warning",
                  data.message.guild.name
               ));

         }

      });

}

// ---------------
// Command Header
// ---------------

// eslint-disable-next-line complexity
module.exports = function run (data)
{

   // ---------------------
   // Send Data to Channel
   // ---------------------

   if (data.message.isDev)
   {

      // console.log("DEBUG: Developer Override");
      try
      {

         setTimeout(() => data.message.delete(), auth.time.short);

      }
      catch (err)
      {

         console.log(
            "Bot Message Deleted Error 2, command.send.js",
            err
         );

      }
      embed.
         setColor(colors.get(data.color)).
         setDescription(`Developer Identity confirmed:\n\n${data.text}`).
         setTimestamp().
         setFooter("This message may self-destruct in one minute");
      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }
   // console.log("DEBUG: Sufficient Permission");
   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Bot Message Deleted Error 3, command.send.js",
         err
      );

   }
   embed.
      setColor(colors.get(data.color)).
      setDescription(data.text).
      setTimestamp().
      setFooter("This message may self-destruct in one minute");

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
