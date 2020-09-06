/* eslint-disable no-undef */
/* eslint-disable complexity */
const colors = require("./colors");
const fn = require("./helpers");
const db = require("./db");
const logger = require("./logger");
const discord = require("discord.js");
//
//const webhooks = new discord.WebhookClient(`id`, `token?`);
//
const handleError = function(err)
{
   //
   // Error for long messages
   //

   if (err.code && err.code === 50035)
   {
      data.channel.send(":warning:  Message is too long.");
   }
   //
   // Handle error for users who cannot recieve private messages
   //

   if (err.code && err.code === 50007 && data.origin)
   {
      const badUser = data.channel.recipient;
      var errMsg = `@${badUser.username}#${badUser.discriminator}\n` + err;
      db.removeTask(data.origin.id, `@${badUser.id}`, function(er)
      {
         if (er)
         {
            return logger("error", er);
         }

         return data.origin.send(
            `:no_entry: User ${badUser} cannot recieve direct messages ` +
             `by bot because of **privacy settings**.\n\n__Auto ` +
             `translation has been stopped. To fix this:__\n` +
             "```prolog\nServer > Privacy Settings > " +
             "'Allow direct messages from server members'\n```"
         );
      });
   }

   logger("error", errMsg);
};

module.exports = function(data)
{
   //
   // Send Data to Channel
   //
   const sendBox = function(data)
   {
      if (data.author)
      {
         data.author = {
            name: data.author.username,
            // eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }
      // Reassign default parameters - If any are blank.
      const channel = data.channel;
      let color = colors.get(data.color);
      let avatarURL;
      if (data.author && data.author.icon_url)
      {
         avatarURL = data.author.displayAvatarURL;
      }
      if (!channel) {return console.log("Channel not specified.");}
      if (!color) {color = "d9a744";} // This is an optional variable. Therefore the default HEX color will be whatever you post there. Mine will be d9a744
      if (!avatarURL) {avatarURL = data.author;} // This is also an optional variable, you can change the default to any icon.

      // We want to remove spaces from color & url, since they might have it on the sides.
      // color = color.replace(/\s/g, "");
      // avatar = avatar.replace(/\s/g, "");

      // This is the start of creating the webhook
      channel.fetchWebhooks() // This gets the webhooks in the channel
         .then(webhook =>
         {
            // Fetches the webhook we will use for each hook
            const foundHook = webhook.find("name", "Webhook"); // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.
            // This runs if the webhook is not found.
            if (!foundHook)
            {
               channel.createWebhook("Webhook", "https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png") // Make sure this is the same thing for when you search for the webhook. The png image will be the default image seen under the channel. Change it to whatever you want.
                  .then(webhook =>
                  {
                     // Finally send the webhook
                     webhook.send(data.text, {
                        "username": data.author.name,
                        "avatarURL": data.author.icon_url
                     })
                        .catch(err =>
                        { // We also want to make sure if an error is found, to report it in chat.
                           handleError(err);
                           return channel.send("**Something went wrong when sending the webhook. Please check console.**");
                        });
                  });
            }
            else
            {
               // eslint-disable-next-line camelcase

               // That webhook was only for if it couldn't find the original webhook
               foundHook.send(data.text, { // This means you can just copy and paste the webhook & catch part.
                  "username": data.author.name,
                  "avatarURL": data.author.icon_url
               })


                  .catch(error =>
                  { // We also want to make sure if an error is found, to report it in chat.
                     handleError(error);
                     return channel.send("**Something went wrong when sending the webhook. Please check console.**");
                  });
            }
         });

      // if (data.text && data.text.length > 1)
      // {
      //    data.channel.send({
      //       embed: {
      //          title: data.title,
      //          fields: data.fields,
      //          author: data.author,
      //          color: colors.get(data.color),
      //          description: data.text,
      //          footer: data.footer
      //       }
      //    }).then(() =>
      //    {
      //       sendHooks(data);
      //       //sendEmbeds(data);
      //       sendAttachments(data);
      //    }).catch(err =>
      //    {
      //       handleError(err);
      //       /*.then(() =>
      //       {
      //          discord.fetchWebhooks();
      //          webhooks.send(data.text, {
      //                username: data.author.username,
      //                avatarURL: data.author.displayAvatarURL
      //             });*/

      //       //
      //       // Webhooks
      //       //
      //    });
      // }

      // Functions
      /*function hook(channel, title, message, avatar) { // This function uses quite a few options. The last 2 are optional.*/
   };


   //
   // Resend embeds from original message
   // Only if content is forwared to another channel
   //
   const sendEmbeds = function(data)
   {
      if (data.forward && data.embeds && data.embeds.length > 0)
      {
         const maxEmbeds = data.config.maxEmbeds;

         if (data.embeds.length > maxEmbeds)
         {
            sendBox({
               channel: data.channel,
               text: `:warning:  Cannot embed more than ${maxEmbeds} links.`,
               color: "warn"
            });

            data.embeds = data.embeds.slice(0, maxEmbeds);
         }

         for (let i = 0; i < data.embeds.length; i++)
         {
            data.channel.send(data.embeds[i].url);
         }
      }
   };

   //
   // Resend attachments
   //

   const sendAttachments = function(data)
   {
      if (!data.attachments && !data.attachments.array().length > 0) {return;}
      var attachments = data.attachments.array();

      if (data.forward && attachments && attachments.length > 0)
      {
         const maxAtt = data.config.maxEmbeds;

         if (attachments.length > maxAtt)
         {
            sendBox({
               channel: data.channel,
               text: `:warning:  Cannot attach more than ${maxAtt} files.`,
               color: "warn"
            });
            attachments = attachments.slice(0, maxAtt);
         }

         for (let i = 0; i < attachments.length; i++)
         {
            const attachmentObj = new discord.Attachment(
               attachments[i].url,
               attachments[i].filename
            );
            data.channel.send(attachmentObj);
         }
      }
   };

   //
   // Analyze Data and determine sending style (system message or author box)
   //

   //eslint-disable-next-line complexity
   /*module.exports = function (data)*/
   {
      var sendData = {
         title: data.title,
         fields: data.fields,
         config: data.config,
         channel: data.message.channel,
         color: data.color,
         text: data.text,
         footer: data.footer,
         embeds: data.message.embeds,
         attachments: data.message.attachments,
         forward: data.forward,
         origin: null,
         bot: data.bot
      };
   }


   //
   // Notify server owner if bot cannot write to channel
   //

   if (!data.canWrite)
   {
      const writeErr =
        ":no_entry:  **Translate bot** does not have permission to write at " +
        `the **${sendData.channel.name}** channel on your server **` +
        `${sendData.channel.guild.name}**. Please fix.`;

      return sendData.channel.guild.owner
         .send(writeErr)
         .catch(err => logger("error", err));
   }

   if (data.forward)
   {
      const forwardChannel = data.client.channels.get(data.forward);

      if (forwardChannel)
      {
         //
         // Check if bot can write to destination channel
         //

         var canWriteDest = true;

         if (forwardChannel.type === "text")
         {
            canWriteDest = fn.checkPerm(
               forwardChannel.guild.me,
               forwardChannel,
               "SEND_MESSAGES"
            );
         }

         if (canWriteDest)
         {
            sendData.origin = sendData.channel;
            sendData.channel = forwardChannel;
         }

         //
         // Error if bot cannot write to dest
         //
         else
         {
            sendData.footer = null;
            sendData.embeds = null;
            sendData.color = "error";
            sendData.text =
                ":no_entry:  Bot does not have permission to write at the " +
                `<#${forwardChannel.id}> channel.`;

            return sendBox(sendData);
         }
      }

      //
      // Error on invalid forward channel
      //
      else
      {
         sendData.footer = null;
         sendData.embeds = null;
         sendData.color = "error";
         sendData.text = ":warning:  Invalid channel.";
         return sendBox(sendData);
      }
   }

   if (data.showAuthor)
   {
      sendData.author = data.message.author;

      if (data.author)
      {
         sendData.author = data.author;
      }
   }

   return sendBox(sendData);
};
