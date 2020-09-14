const botSend = require("../core/send");
const auth = require("../core/auth");

module.exports = function(data)
{
  const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

  if (commandVariable1 === "on" || commandVariable1 === "off")
  {
     embedVar = commandVariable1;
     var output =
     "**```Embedded Message Translation```**\n" +
     `Embedded Message Translation is now turned : ${embedVar}\n\n`;

     data.color = "info";
     data.text = output;
     botSended(data);
  }

  data.color = "error";
  data.text =
     ":warning:  **`" + commandVariable1 +
     "`** is not a valid embed option.";
  botSended(data);
};
