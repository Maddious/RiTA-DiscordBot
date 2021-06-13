// -----------------
// Global variables
// -----------------

/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");

// -------------
// Command Code
// -------------

module.exports = async function run (guild, config)
{

   let defaultChannel = "";
   guild.channels.cache.forEach((channel) =>
   {

      Override: if (guild.systemChannel)
      {

         if (guild.systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES"))
         {

            defaultChannel = guild.systemChannel;
            break Override;

         }

      }
      else if (channel.type === "text" && defaultChannel === "")
      {

         if (channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
         {

            defaultChannel = channel;

         }

      }

   });
   const invite = await defaultChannel.createInvite({
      "maxAge": 0,
      "reason": "Remote Support",
      "temporary": true,
      "unique": false
   },).
      catch(console.log);

   db.saveInvite(
      guild.id,
      invite.url,
      // eslint-disable-next-line consistent-return
      function error (err)
      {

         if (err)
         {

            return console.log(`DEBUG: Unable to save link to DB on Server Join`);

         }

      }
   );

   return defaultChannel.send(`Hello, I'm RITA. Thanks for inviting me.`, {"embed": {
      "color": 9514728,
      "description": "We developed RITA to be the best free Translator Bot on Discord (& soon Guilded).\nSpeaking to other people should not have to cost you an arm and a leg, Our aim is to break that language barrier without you having to pay out for the privilege.",
      "fields": [
         {
            "name": ":tada: Getting Started",
            "value": `To get started try running the help command, **${config.translateCmdShort} help** or take a look at our Quick Setup guide **${config.translateCmdShort} newbot**`
         },
         {
            "name": ":tools: Support ",
            "value": "If you need some support why not drop by our [Support Server](https://discord.gg/hXaedzCQ8d) and we will be more than willing to leand a hand."
         },
         {
            "name": ":moneybag: On a side note.",
            "value": `While rita is free, and we always aim to keep it this way, She does have costs.\nCurrently the Dev Team pays these cost. If you would like to support us and enable us to coninue to provide RITA for free then please vist our [GitHub Sponsors](https://github.com/sponsors/RitaBot-Project) page, or type **${config.translateCmdShort} donate** for more info`
         }
      ],

      "footer": {
         "text": "RITA is developed by the RITA Bot Project"
      },
      "title": "A MESSAGE FROM THE DEV TEAM"
   }});

};

module.exports.newBot = function newBot (data)
{

   data.message.channel.send({"embed": {
      "color": 9514728,
      "description": "Let's get started:\nRita supports a few different methods of translations.\n**‏‏‎ ‎‎‎‎‎‎**",
      "fields": [
         {
            "name": ":flag_white: Translate by Reacting",
            "value": `React to a message with a flag and it will translate to that language.\n**‏‏‎ ‎‎‎‎‎‎**`
         },
         {
            "name": ":abc: Translate Custom Text",
            "value": `You can also translates a single custom message.
            *${data.config.translateCmdShort} this to [lang]:* message here\n**‏‏‎ ‎‎‎‎‎‎**`
         },
         {
            "name": ":hash: Translate Channel (Automatic)",
            "value": `Automatically translates any new messages in channel and forwards them to you.
            Admins/mods can set forwarding to other channels or users in server. 
            Messages in forwarded channels will also be sent back to origin.
            *${data.config.translateCmdShort} channel from [lang] to [lang] for [me/@/#]*\n**‏‏‎ ‎‎‎‎‎‎**`
         },
         {
            "name": ":wrench: Customize your Bot, Change your prefix",
            "value": `We know you like to customize thing, so you can change the prefix of your bot.
            *${data.config.translateCmdShort} prefix [prefix]*\n**‏‏‎ ‎‎‎‎‎‎**`
         },
         {
            "name": ":grey_question: Help Commands",
            "value": `The following command will help you learn everything you need to know. 
            *${data.config.translateCmdShort} help commands*
            *${data.config.translateCmdShort} help modules*\n**‏‏‎ ‎‎‎‎‎‎**`
         },
         {
            "name": ":bell: Need Support",
            "value": `Need some extra Support, a little bit stuck. Join our [Support Server](https://discord.gg/hXaedzCQ8d)\n**‏‏‎ ‎‎‎‎‎‎**`
         }
      ],

      "footer": {
         "text": `RITA is developed by the RITA Bot Project`
      },
      "title": "THANK YOU FOR CHOOSING TO USE RITA."
   }});

};
