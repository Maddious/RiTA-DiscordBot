// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("./colors");
const discord = require("discord.js");
const richEmbedMessage = new discord.RichEmbed();
const fn = require("./helpers");
const db = require("./db");
const logger = require("./logger");


// ---------------------
// Send Data to Channel
// ---------------------

// eslint-disable-next-line complexity
module.exports = async function(data)
{
   // ---------------------
   // Send Data to Channel
   // ---------------------

   if (process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {
      console.log("Developer Override");
      data.message.delete(5000).catch(err => console.log("Command Message Deleted Error, command.send.js = ", err));
      richEmbedMessage
         .setColor(colors.get(data.color))
         .setAuthor(data.bot.username, data.bot.displayAvatarURL)
         .setDescription("Developer Identity confirmed: \n\n" + data.text)
         .setTimestamp()
         .setFooter("This message will self-destruct in one minute");
      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }
   console.log("Sufficient Permission");
   data.message.delete(5000).catch(err => console.log("Command Message Deleted Error, command.send.js = ", err));
   richEmbedMessage
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};

function sendMessage (data)
{
   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000).catch(err => console.log("Bot Message Deleted Error, command.send.js = ", err));
   })//.catch(err => console.log("error", err, "warning", data.message.guild.name));
      .catch(err =>
      {
         if (err.code && err.code === 50013)
         {
            console.log("Error 50013");
            //return logger("custom", err, "send", data.guild.name);
            logger("custom", {
               color: "ok",
               msg: `:exclamation: Write Permission Error \n
                  Server: **${data.channel.guild.name}** \n
                  Channel: **${data.channel.name}**\n
                  Chan ID: **${data.channel.id}**\n
                  Owner: **${data.channel.guild.owner}**\n
                  The server owner has been notified. \n`
            });
            const writeErr =
                  `:no_entry:  **${data.bot.username}** does not have permission to write in your server **` +
                  `${data.channel.guild.name}**. Please fix.`;

            // -------------
            // Send message
            // -------------

            return data.channel.guild.owner
               .send(writeErr)
               .catch(err => console.log("error", err, "warning", data.message.guild.name));
         }
      });
}
