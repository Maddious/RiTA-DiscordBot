// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------
const channelName = function channelName (data)
{

   // Arguments to set the channel name
   const channelName = data.cmd.params.split(" ")[0].toLowerCase();

   data.message.guild.createChannel(channelName, {
      // This create a text channel, you can make a voice one too, by changing "text" to "voice"

      "type": "text"
   });

   data.color = "ok";
   data.text =
   "**```New channel has been created```**\n" +
   `Your new channel is **\`${channelName}\`**. \n\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

module.exports = function run (data)
{

   // -----------------------------------------
   // Command allowed by channel managers only
   // -----------------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.cmd.for[0] !== "me" && !data.message.isManager)
      {

         data.color = "error";
         data.text =
         ":cop:  You need to be a channel manager to " +
         "create a new channel";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }

   // ----------------
   // Execute setting
   // ----------------

   return channelName(data);

};
