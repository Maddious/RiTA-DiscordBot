// -----------------
// Global variables
// -----------------

/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */
// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const auth = require("../../core/auth");
const db = require("../../core/db");
const oneLine = require("common-tags").oneLine;

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

      if (auth.devID.includes(data.message.author.id))
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

         if (perms.CREATE_INSTANT_INVITE === true)
         {

            let defaultChannel = "";
            target.channels.cache.forEach((channel) =>
            {

               Override: if (target.systemChannel)
               {

                  if (target.systemChannel.permissionsFor(target.me).has("SEND_MESSAGES"))
                  {

                     defaultChannel = target.systemChannel;
                     break Override;

                  }


               }
               else if (channel.type === "text" && defaultChannel === "")
               {

                  if (channel.permissionsFor(target.me).has("SEND_MESSAGES"))
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

            const inviteLink = invite ?
               `Here's your invite: ${invite}` :
               "There has been an error during the creation of the invite.";
            data.text = msg + inviteLink;

            db.saveInvite(
               targetID,
               invite.url,
               // eslint-disable-next-line consistent-return
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
      `${data.config.translateCmdShort} help invite\` to learn more.`;

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
      data.text += `${auth.invite}`;

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
