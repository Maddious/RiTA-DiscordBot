const botSend = require("../core/send");
var embedvar = true;
var b2bvar = true;
//const cmd = config.translateCmdShort;

// =============
// Command Test 1
// =============

exports.embed = function(data)
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
   // Set Embeded Value - On or Off
   //
   
   var output =
   "**```Embeded Message Command Here```**\n" +
   `Embeded Messages Activate : ${embedvar}`;

   data.color = "info";
   data.text = output;
   return botSend(data);
};

exports.b2b = function(data)
{
   var output = "**```Bot 2 Bot Command Here```**\n";

   data.color = "info";
   data.text = output;
   return botSend(data);
};
