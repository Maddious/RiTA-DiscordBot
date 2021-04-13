// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const auth = require("../../core/auth");
const colors = require("../../core/colors");
//const logger = require("../../core/logger");
const discord = require("discord.js");

// -------------
// Command Code
// -------------

module.exports = function(data)
{
   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   data.color = "info";
   data.text = `:robot:  Current bot version is ${version}`;
   console.log("----------------- Data -----------------");
   console.log(data);
   console.log("----------------- Data -----------------");

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};

// ----------------------
// Send message function
// ----------------------

function sendMessage (data)
{
   data.message.delete(5000).catch(err => console.log("Command Message Deleted Error, version.js = ", err));
   const richEmbedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000).catch(err => console.log("Bot Message Deleted Error, version.js = ", err));
   });
}

