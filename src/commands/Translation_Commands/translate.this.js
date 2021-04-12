// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const translate = require("../../core/translate");
const colors = require("../../core/colors");
const discord = require("discord.js");
const botSend = require("../../core/send");

// -----------------------------
// Translate string to language
// -----------------------------

module.exports = function(data)
{
   // -----------------------------
   // Send error for empty content
   // -----------------------------

   if (!data.cmd.content)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing content for translation.\n ```md\n" +
         "# Valid examples\n" +
         data.config.translateCmd + " this to french: Hello world\n" +
         data.config.translateCmd + " this to en from de: Wie geht's?\n" +
         data.config.translateCmd + " this to hebrew, arabic: I love you\n\n" +
         "# More help with this command\n> " +
         data.config.translateCmd + " help custom" +
         "```";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ------------------
   // Start translation
   // ------------------

   data.translate = {
      original: data.cmd.content,
      to: data.cmd.to,
      from: data.cmd.from,
      multi: true
   };

   delete data.message.attachments;

   translate(data);
};

// ----------------------
// Send message function
// ----------------------

function sendMessage (data)
{
   data.message.delete(5000);
   const richEmbedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000);
   });
}
