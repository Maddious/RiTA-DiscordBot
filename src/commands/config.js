const botSend = require("../core/send");

// =============
// Command Test 1
// =============

exports.embed = function(data)
{
  const langList = [
     "Yoruba","Zulu"
  ];

  var output = "**```Embeded Messages```**\n";

  langList.forEach(lang =>
  {
     var end = ",  ";
     if (lang === "Zulu")
     {
        end = ".";
     }
     output += "`" + lang + "`" + end;
  });

  data.color = "info";
  data.text = output;

  return botSend(data);
};
