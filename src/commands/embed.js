/* eslint-disable no-undef */
const botSended = require("../core/send");
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
      return botSended(data);
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

      return botSended(data);
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
      return botSended(data);
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid embed option.";
   return botSended(data);

};