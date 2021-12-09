// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

module.exports = function run (data)
{

   data.color = "info";
   data.text = "```md\n" +
      `# ---------------------- Stat  Changes ---------------------- \n` +
      `* RITA has boomed so much since she was launched and now has \n\n` +
      `  - Transalted over 26 Million messages\n` +
      `     - Across 10k Servers \n` +
      `         - For 1.1 Million Users \n\n` +
      "```\n" +

      "```md\n" +
      `# ---------------------- Major Changes ---------------------- \n` +
      `* CS same language now works \n` +
      `* Join/Leave logs can be seperated from error logs\n` +
      `* Task ID added to tasks Printout \n` +
      `* Shard Command has been update to show new stats. \n` +
      "```" +

      "```md\n" +
      `# ------------------------ Bug Fixes ------------------------ \n` +
      `* Local hosted users persist and react command fixed \n` +
      `* Fixed invalid channel message \n` +
      `* Various Permission Errors \n` +
      `* Error messages show Task ID \n` +
      `* Ignore same chan translation of GIF and images. \n` +
      `* Fixed translate for me command \n` +
      "```" +

      "```md\n" +
      `# --------------------- Command Changes --------------------- \n` +
      `* !tr updatelink has been added \n` +
      `* !tr tasks [#chan/me] has been added \n` +
      `* !tr reactpersist has been added \n` +
      `* !tr flagpersist has been added \n` +
      `* !tr checkperms has been replaced with !tr check \n` +
      `* !tr stop task [id] - Removes a task by its given ID \n` +
      `* !tr settings langdetect has been added \n` +
      `* !tr settings tags [all/everyone/none] has been added \n` +
      `  - none - No tags are disabled \n` +
      `  - everyone - Attention tags are disabled \n` +
      `  - all - All tags are disabled \n` +
      "```" +

      "```md\n" +
      `# -------------------- Database  Changes -------------------- \n` +
      `* data.message.server[0] is built on every message event \n` +
      `* The following columns have been added \n` +
      `  - servertags - manages the server tags variable \n` +
      `  - servername - stores a local copy of the server name \n` +
      `  - reactpersist - manages the react persist variable \n` +
      `  - flagpersist - manages the flag persist variable \n` +
      `  - menupersist - manages the menu persist variable \n` +
      `  - landdetect - manages the language detection variable \n` +
      `  - whitelisted - NOT IN USE, Yet! \n` +
      "```" +

      "```md\n" +
      `# ---------------------- Misc. Changes ---------------------- \n` +
      `* Help menu updated \n` +
      `* Owner variable is now more reliable on messages \n` +
      `* Source language added to embed on/off messages as setting \n` +
      `* Owner, Admin & Channel Manager stored in message object \n` +
      `* servertags & langdetect added to settings and check commands \n` +
      "```\n";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);


};
