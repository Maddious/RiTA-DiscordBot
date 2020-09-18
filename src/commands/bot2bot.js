const colors = require("../core/colors");
var bot2botVar = "off";


module.exports.getBot2botVar = function(data)
{
   return bot2botVar;
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
      return data.message.channel.send({
         embed: {
            description: data.text,
            color: colors.get(data.color)
         }
      });
   }

   //
   // Error if settings param is missing
   //

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `bot2bot` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

      return data.message.channel.send({
         embed: {
            description: data.text,
            color: colors.get(data.color)
         }
      });
   }

   //
   // Execute setting
   //

   bot2botSettings(data);
};



// ===================
// Available Settings
// ===================

const bot2botSettings = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      bot2botVar = commandVariable1;
      var output =
      "**```Bot to Bot Translation```**\n" +
      `Bot Message translation is now turned : ${bot2botVar}\n\n`;
      data.color = "info";
      data.text = output;
      return data.message.channel.send({
         embed: {
            description: data.text,
            color: colors.get(data.color)
         }
      });
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid bot2bot option.\n";
   return data.message.channel.send({
      embed: {
         description: data.text,
         color: colors.get(data.color)
      }
   });
};

