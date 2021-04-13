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
module.exports = function(data)
{
   // ---------------------
   // Send Data to Channel
   // ---------------------

   if (data.message.author.id === process.env.DISCORD_BOT_OWNER_ID)
   {
      console.log("In");
      richEmbedMessage
         .setColor(colors.get(data.color))
         .setAuthor(data.bot.username, data.bot.displayAvatarURL)
         .setDescription("Its my Daddy, Where did you go daddy. \n\n" + data.text)
         .setTimestamp()
         .setFooter("This message will self-destruct in one minute");
      return data.message.channel.send(richEmbedMessage).then(msg =>
      {
         msg.delete(60000).catch(err => console.log("Bot Message Deleted Error, misc.js = ", err));
      });
   }
   console.log("Out");
   data.message.delete(5000).catch(err => console.log("Command Message Deleted Error, misc.js = ", err));
   richEmbedMessage
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000).catch(err => console.log("Bot Message Deleted Error, misc.js = ", err));
   });
};
