/* eslint-disable no-undef */
const botSend = require("../core/send");
var embedVar = "on";

// -------------------------
// Proccess settings params
// -------------------------

//module.exports = {
//   embedVar,
//   b2bVar
//}

module.exports.getEmbedVar = function(data)
{
   return embedVar;
};
module.exports.value = function(data)
{
   //
   // Command allowed by admins only
   //

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";
      return botSend(data);
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

      return botSend(data);
   }

   // --------------------------------------
   // Embed Messages
   // --------------------------------------

   const embed = function(data)
   {
      const commandVariable1 = data.cmd.params.split(" ")[1].toLowerCase();

      if (commandVariable1 === "on" || commandVariable1 === "off")
      {
         embedVar = commandVariable1;
         var output =
         "**```Embedded Message Translation```**\n" +
         `Embedded Message Translation is now turned : ${embedVar}\n\n`;

         data.color = "info";
         data.text = output;
         botSend(data);
      }

      data.color = "error";
      data.text =
         ":warning:  **`" + commandVariable1 +
         "`** is not a valid embed option.";
      botSend(data);
   }
};