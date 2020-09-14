const botSend = require("../core/send");
const auth = require("../core/auth");
var embedVar = "on";

module.exports.getEmbedVar = function(data)
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

   //
   // Execute setting
   //

   embedSettings(data);
};

// ===================
// Available Settings
// ===================

const embedSettings = function(data)
{
     const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      embedVar = commandVariable1;
      var output =
      "**```Bot to Bot Translation```**\n" +
      `Bot Message translation is now turned : ${embedVar}\n\n`;
      console.log(embedVar);

      data.color = "info";
      data.text = output;
      console.log(output);
      console.log("----------------- Data -----------------");
      console.log(data);
      console.log("----------------- Data -----------------");
      return botSend(data);
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid b2b option.";
   return botSend(data);
};
