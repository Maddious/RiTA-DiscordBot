// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const auth = require("../../core/auth");
const db = require("../../core/db");
const {oneLine} = require("common-tags");

// -------------------
// Available Settings
// -------------------

function remoteInvite (data)
{

   // --------------
   // Create Invite
   // --------------

   async function targetServerInvite (data)
   {

      if (data.message.isDev)
      {

         const targetID = data.cmd.num;
         const target = data.message.client.guilds.cache.get(targetID);

         if (target === undefined)
         {

            data.text =
            `__**Invite - Target Server Invite**__\n\n` +
            `Targeted server: \`Unknown\`\n` +
            `Targeted ID: \`${data.cmd.num}\`\n\n` +
            `Invalid Server ID or RITA is no longer in this server.\n\n`;
            data.color = "warn";
            return sendMessage(data);

         }

         const bot = target.members.cache.get(data.message.client.user.id);
         const perms = bot.permissions.serialize();
         const msg =
         `__**Invite - Create Target Server Invite**__\n\n` +
         `Targeted server: \`${target.name}\`\n` +
         `Targeted ID: \`${target.id}\`\n\n`;

         // Try system channel
         if (perms.CREATE_INSTANT_INVITE === true)
         {

            console.log(`${perms.CREATE_INSTANT_INVITE}`);
            let defaultChannel = "";
            Override: if (target.systemChannel)
            {

               if (target.systemChannel.permissionsFor(target.me).has("CREATE_INSTANT_INVITE"))
               {

                  defaultChannel = target.systemChannel;
                  break Override;

               }

            }

            // If not able to use system channel find another
            if (defaultChannel === "")
            {

               defaultChannel = target.channels.cache.find((channel) => channel.type === "text" && defaultChannel === "" && channel.permissionsFor(target.me).has("CREATE_INSTANT_INVITE"));

            }

            // Invite settings
            const invite = await defaultChannel.createInvite({
               "maxAge": 0,
               "maxUses": 1,
               "reason": "Remote Support",
               "temporary": true,
               "unique": false
            },).
               catch(console.log);

            const inviteLink = invite ?
               `Here's your invite: ${invite}` :
               "There has been an error during the creation of the invite.";
            data.text = msg + inviteLink;

            // Save invite to DB
            db.updateServerTable(
               targetID,
               "invite",
               invite.url,
               function error (err)
               {

                  if (err)
                  {

                     return logger(
                        "error",
                        err,
                        "command",
                        data.message.channel.guild.name
                     );

                  }

               }
            );

         }
         else if (perms.CREATE_INSTANT_INVITE === false)
         {

            const inviteLink = `Can not get an invite link for this server\n`;
            data.color = "warn";
            data.text = msg + inviteLink;

         }
         data.color = "info";
         return sendMessage(data);

      }

      data.text = ":cop:  This Command is for bot developers only.\n";
      return sendMessage(data);

   }

   // console.log(`DEBUG: Valid Perms`);
   const validPerms = {
      "server": targetServerInvite
   };


   // console.log(`DEBUG: Has Perms`);
   const permParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validPerms,
      permParam
   ))
   {

      return validPerms[permParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid \`invite\` option. Use ` +
      `${data.config.translateCmdShort} help dev\` to learn more.`;

   // -------------
   // Send message
   // -------------

   // console.log(`DEBUG: Send Data`);
   return sendMessage(data);

}

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "info";
      data.text = `Invite ${data.message.client.user} `;
      data.text += `\`v${data.config.version}\` to your server\n\n`;
      data.text += `No Fuss simple quick invite:\n`;
      data.text += `${auth.invite}\n\n`;
      data.text += `Use the following for the most basic permissions she needs to function.\n`;
      data.text += `https://ritabot.gg/invite-min\n\n`;
      data.text += `Use the following for all the permissions she needs to function 100%\n`;
      data.text += `https://ritabot.gg/invite-max\n\n`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------
   // console.log(`DEBUG: Get Perms`);
   return remoteInvite(data);

};
