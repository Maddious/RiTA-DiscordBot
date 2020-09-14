const botSend = require("../core/send");
const auth = require("../core/auth");
var embeddedVar = "on";

module.exports.getEmbeddedVar = function(data)
{
   return embeddedVar;
};
module.exports.run = function(data)
{
  const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

  if (commandVariable1 === "on" || commandVariable1 === "off")
  {
     embeddedVar = commandVariable1;
     var output =
     "**```Embedded Message Translation```**\n" +
     `Embedded Message Translation is now turned : ${embeddedVar}\n\n`;

     data.color = "info";
     data.text = output;
     return botSend(data);
  }

  data.color = "error";
  data.text =
     ":warning:  **`" + commandVariable1 +
     "`** is not a valid embed option.";
  return botSend(data);
};
