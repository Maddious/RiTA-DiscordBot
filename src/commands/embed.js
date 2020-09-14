/* eslint-disable no-undef */
//const botSended = require("../core/send");
var embedVar = "on";

// -------------------------
// Proccess settings params
// -------------------------

//module.exports = {
//   embedVar,
//   b2bVar
//}

module.exports.getEmbedVar = function()
{
   return embedVar;
};
module.exports.run = function(data)
{
   //
   // Command allowed by admins only
   //

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";
      return sendBox(data);
   }

   //
   // Error if settings param is missing
   //

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

      return sendBox(data);
   }

   // --------------------------------------
   // Embed Messages
   // --------------------------------------

   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      embedVar = commandVariable1;
      var output =
      "**```Embedded Message Translation```**\n" +
      `Embedded Message Translation is now turned : ${embedVar}\n\n`;

      data.color = "info";
      data.text = output;
      return sendBox(data);
   }


   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid embed option.";
   return sendBox(data);
}

const sendBox = function(data)
{
   if (data.author)
   {
      data.author = {s
         name: data.author.username,
         //eslint-disable-next-line camelcase
         icon_url: data.author.displayAvatarURL
      };
   }

   if (data.text && data.text.length > 1)
   {
      data.channel.send({
         embed: {
            title: data.title,
            fields: data.fields,
            author: data.author,
            color: colors.get(data.color),
            description: data.text,
            footer: data.footer
         }
      }).then(() =>
      {
         sendEmbeds(data);
         sendAttachments(data);
      }).catch(err =>
      {
         var errMsg = err;
         logger("dev", err);

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
            errMsg = `@${badUser.username}#${badUser.discriminator}\n` + err;

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
      });
   }
   else if (data.attachments.array().length > 0)
   {
      sendAttachments(data);
   }
};