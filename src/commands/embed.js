const colors = require("../core/colors");
var embedVar = "off";
const db = require("../core/db");


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
         ":warning:  Missing `embed` parameter. Use `" +
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
      console.log (commandVariable1);
      return db.updateEmbedVar(
         data.message.channel.guild.id,
         commandVariable1,
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            var output =
            "**```Bot to Bot Translation```**\n" +
            `Bot Message translation is now turned : ${commandVariable1}\n\n`;
            data.color = "info";
            data.text = output;
            return data.message.channel.send({
               embed: {
                  description: data.text,
                  color: colors.get(data.color)
               }
            });
         }
      );
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid embed option.\n";
   return data.message.channel.send({
      embed: {
         description: data.text,
         color: colors.get(data.color)
      }
   });
};