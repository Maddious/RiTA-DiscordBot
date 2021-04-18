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

};

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.message.isAdmin === false)
      {

         {

            data.color = "warn";

         }
         data.text = ":cop:  This command is reserved for server admins.";

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
