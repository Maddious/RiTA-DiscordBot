// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const colors = require("./colors");
const discord = require("discord.js");
const richEmbedMessage = new discord.MessageEmbed();
const logger = require("./logger");
const error = require("./error");
const db = require("./db");
const time = {
   "long": 60000,
   "short": 5000
};
const auth = require("./auth");

// ---------------------
// Send Data to Channel
// ---------------------

function sendMessage (data)
{

   return data.message.channel.send(richEmbedMessage).then((msg) =>
   {

      db.getServerInfo(
         data.message.guild.id,
         function getServerInfo (server)
         {

            if (server[0].persist === false)
            {

               msg.delete({"timeout": time.long}).catch((err) => console.log(
                  "Bot Message Deleted Error 1, command.send.js = ",
                  err
               ));

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

         if (err.code && err.code === error.perm || error.access)
         {

            // console.log("Error 50013");
            logger(
               "custom",
               {
                  "color": "ok",
                  "msg": `:exclamation: Write Permission Error - CS.js\n
                  Server: **${data.channel.guild.name}** \n
                  Channel: **${data.channel.name}**\n
                  Chan ID: **${data.channel.id}**\n
                  Server ID: **${data.message.sourceID}**\n
                  Owner: **${data.message.guild.owner} - ${data.message.guild.owner.user.tag}**\n
                  The server owner has been notified. \n`
               }
            );
            const writeErr =
                  `:no_entry:  **${data.message.client.user.username}** does not have permission to write in your server **` +
                  `${data.channel.guild.name}**. Please fix.`;

            // -------------
            // Send message
            // -------------

            if (!data.channel.guild.owner)
            {

               return console.log(writeErr);

            }
            console.log("DEBUG: Line 68 - Command.Send.js");
            return data.channel.guild.owner.
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

   if (auth.devID.includes(data.message.author.id))
   {

      // console.log("DEBUG: Developer Override");
      data.message.delete({"timeout": time.short}).catch((err) => console.log(
         "Command Message Deleted Error 2, command.send.js = ",
         err
      ));
      richEmbedMessage.
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
   data.message.delete({"timeout": time.short}).catch((err) => console.log(
      "Command Message Deleted Error, command.send.js = ",
      err
   ));
   richEmbedMessage.
      setColor(colors.get(data.color)).
      setDescription(data.text).
      setTimestamp().
      setFooter("This message may self-destruct in one minute");

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
