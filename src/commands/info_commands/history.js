// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

// -------------------
// Available Settings
// -------------------

function getHistory (data)
{

   // ---------------
   // V1.0.0 History
   // ---------------

   const v100History = function v100History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.0.0**\n` +
      "```md\n" +
      `# Version 1.0.1 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.2 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.3 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.4 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.5 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.6 - Release Date: 12/07/2019 \n` +
      `# Version 1.0.7 - Release Date: 13/07/2019 \n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.1.0 History
   // ---------------

   const v110History = function v110History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.1.0**\n` +
      "```md\n" +
      `# Version 1.1.0 - Release Date: 13/07/2019 \n` +
      `# Version 1.1.1 - Release Date: 13/07/2019 \n` +
      `# Version 1.1.2 - Release Date: 13/07/2019 \n` +
      `# Version 1.1.3 - Release Date: 14/07/2019 \n` +
      `# Version 1.1.4 - Release Date: 15/07/2019 \n` +
      `# Version 1.1.5 - Release Date: 27/07/2019 \n` +
      `# Version 1.1.6 - Release Date: 27/07/2019 \n` +
      `# Version 1.1.7 - Release Date: 07/09/2019 \n` +
      `# Version 1.1.8 - Release Date: 09/09/2019 \n` +
      `# Version 1.1.9 - Release Date: 14/03/2020 \n` +
      `# Version 1.1.10 - Release Date: 31/03/2020 \n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };


   // ---------------
   // V1.2.0 History
   // ---------------

   const v120History = function v120History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.0**\n` +
      "```md\n" +
      `# Version 1.2.0 - Release Date: 31/03/2020 \n` +
      `# Version 1.2.0-1 - Release Date: 31/03/2020 \n` +
      `# Version 1.2.0-2 - Release Date: 31/03/2020 \n` +
      `# Version 1.2.0-3 - Release Date: 31/03/2020 \n\n` +
      "```\n";


      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.2.1 History
   // ---------------

   const v121History = function v121History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.1**\n` +
      "```md\n" +
      `# Version 1.2.1 - Release Date: 13/09/2020 \n` +
      `# Version 1.2.1-01/11 - Was not published. \n` +
      `# Version 1.2.1-12 - Release Date: 13/09/2020 \n` +
      `# Version 1.2.1-13 - Release Date: 14/09/2020 \n` +
      `# Version 1.2.1-14 - Release Date: 14/09/2020 \n` +
      `# Version 1.2.1-15 - Release Date: 14/09/2020 \n` +
      `# Version 1.2.1-16 - Release Date: 14/09/2020 \n` +
      `# Version 1.2.1-17 - Release Date: 14/09/2020 \n` +
      `# Version 1.2.1-18 - Release Date: 23/09/2020 \n` +
      `# Version 1.2.1-19 - Release Date: 23/09/2020 \n` +
      `> Version 1.2.1-20 - Was not published. \n` +
      `# Version 1.2.1-21 - Release Date: 30/09/2020 \n` +
      `# Version 1.2.1-22 - Release Date: 30/09/2020 \n` +
      `# Version 1.2.1-23 - Release Date: 05/10/2020 \n` +
      `# Version 1.2.1-24 - Release Date: 05/10/2020 \n` +
      `# Version 1.2.1-25 - Release Date: 07/10/2020 \n` +
      `# Version 1.2.1-26 - Release Date: 08/10/2020 \n` +
      `# Version 1.2.1-27 - Release Date: 10/10/2020 \n` +
      `# Version 1.2.1-28 - Release Date: 10/10/2020 \n` +
      `# Version 1.2.1-29 - Release Date: 17/04/2020 \n` +
      `# Version 1.2.1-30 - Release Date: 22/04/2020 \n` +
      `> Version 1.2.1-31 - Was not published. \n` +
      `# Version 1.2.1-32 - Release Date: 24/04/2021 \n` +
      `# Version 1.2.1-33 - Release Date: 24/04/2021 \n` +
      `# Version 1.2.1-34 - Release Date: 24/04/2021 \n` +
      `# Version 1.2.1-35 - Release Date: 24/04/2021 \n` +
      `# Version 1.2.1-36 - Release Date: 25/04/2021 \n` +
      `# Version 1.2.1-37 - Release Date: 25/04/2021 \n` +
      `# Version 1.2.1-38 - Release Date: 25/04/2021 \n` +
      `# Version 1.2.1-39 - Release Date: 25/04/2021 \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.2.2 History
   // ---------------

   const v122History = function v122History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.2**\n` +
      "```md\n" +
      `# Version 1.2.2 - Release Date: 25/04/2021 \n` +
      `# Version 1.2.2-1 - Release Date: 26/04/2021 \n` +
      `# Version 1.2.2-2 - Release Date: 26/04/2021 \n` +
      `# Version 1.2.2-3 - Release Date: 26/04/2021 \n` +
      `# Version 1.2.2-4 - Release Date: 14/05/2021 \n` +
      `# Version 1.2.2-5 - Release Date: 15/05/2021 \n` +
      `> Version 1.2.2-6 - Was not published. \n` +
      `# Version 1.2.2-7 - Release Date: 24/05/2021 \n` +
      `# Version 1.2.2-8 - Release Date: 24/05/2021 \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.2.3 History
   // ---------------

   const v123History = function v123History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.3**\n` +
      "```md\n" +
      `# Version 1.2.3 - Release Date: 24/05/2021 \n` +
      `# Version 1.2.3-1 - Release Date: 27/05/2021 \n` +
      `# Version 1.2.3-2 - Release Date: 27/05/2021 \n` +
      `# Version 1.2.3-3 - Release Date: 28/05/2021 \n` +
      `# Version 1.2.3-4 - Release Date: 02/06/2021 \n` +
      `# Version 1.2.3-5 - Release Date: 03/06/2021 \n` +
      `# Version 1.2.3-6 - Release Date: 03/06/2021 \n` +
      `# Version 1.2.3-7 - Release Date: 05/06/2021 \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.2.4 History
   // ---------------

   const v124History = function v124History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.4**\n` +
      "```md\n" +
      `# Version 1.2.4 - Release Date: 09/06/2021 \n` +
      `# Version 1.2.4-1 - Release Date: 10/06/2021 \n` +
      `# Version 1.2.4-2 - Release Date: 11/06/2021 \n` +
      `# Version 1.2.4-3 - Release Date: 12/06/2021 \n` +
      `# Version 1.2.4-4 - Release Date: 13/06/2021 \n` +
      `# Version 1.2.4-5 - Release Date: 14/06/2021 \n` +
      `# Version 1.2.4-6 - Release Date: 16/06/2021 \n` +
      `# Version 1.2.4-7 - Release Date: 17/06/2021 \n` +
      `# Version 1.2.4-8 - Release Date: 22/06/2021 \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // ---------------
   // V1.2.5 History
   // ---------------

   const v125History = function v125History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.5**\n` +
      "```md\n" +
      `# Version 1.2.5 - Release Date: 05/07/2021 \n` +
      `# Version 1.2.5-1 - Was not published. \n` +
      `# Version 1.2.5-2 - Release Date: 13/07/2021 \n` +
      `# Version 1.2.5-3 - Release Date: 15/07/2021 \n` +
      `# Version 1.2.5-4 - Release Date: 01/09/2021 \n` +
      `# Version 1.2.5-5 - Release Date: 05/09/2021 \n` +
      `# Version 1.2.5-6 - Release Date: 07/09/2021 \n` +
      `# Version 1.2.5-7 - Release Date: 08/09/2021 \n` +
      `# Version 1.2.5-8 - Release Date: 09/09/2021 \n` +
      `# Version 1.2.5-9 - Release Date: 12/09/2021 \n` +
      `# Version 1.2.5-10 - Release Date: 15/09/2021 \n` +
      `# Version 1.2.5-11 - Was not published. \n` +
      `# Version 1.2.5-12 - Release Date: 23/09/2021 \n` +
      `# Version 1.2.5-13 - Was not published. \n` +
      `# Version 1.2.5-14 - Release Date: 24/09/2021 \n` +
      `# Version 1.2.5-15 - Was not published \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   const v126History = function v126History (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**V1.2.6**\n` +
      "```md\n" +
      `# Version 1.2.6 - Release Date: 01/10/2021 \n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };


   const guilds = function guilds (data)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `**Guilds Stats**\n` +
      "```md\n" +
      `# RITA Was Born - 12/07/19 \n` +
      `# Unified RITA Launched - 01/04/2021 \n` +
      `# 100 Guilds - 25/04/2021 \n` +
      `# Discord Verified - 27/05/2021 \n` +
      `# 200 Guilds - 04/06/2021  / 300 Guilds - 08/06/2021\n` +
      `# 400 Guilds - 11/06/2021 / 500 Guilds - 14/06/2021\n` +
      `# 600 Guilds - 19/06/2021 / 700 Guilds - 21/06/2021\n` +
      `# 800 Guilds - 24/06/2021 / 900 Guilds - 27/06/2021\n` +
      `# 1000 Guilds - 29/06/2021 / 1100 Guilds - 01/07/2021\n` +
      `# 1200 Guilds - 04/07/2021 / 1300 Guilds - 07/07/2021\n` +
      `# 1400 Guilds - 09/07/2021 / 1500 Guilds - 11/07/2021\n` +
      `# 1600 Guilds - 14/07/2021 / 1700 Guilds - 17/07/2021\n` +
      `# 1800 Guilds - 19/07/2021 / 1900 Guilds - 21/07/2021\n` +
      `# 2000 Guilds - 24/07/2021 / 2100 Guilds - 26/07/2021\n` +
      `# 2200 Guilds - 28/07/2021 / 2300 Guilds - 30/07/2021\n` +
      `# 2400 Guilds - 02/08/2021 / 2500 Guilds - 03/08/2021\n` +
      `# 2600 Guilds - 05/08/2021 / 2700 Guilds - 08/08/2021 \n` +
      `# 2800 Guilds - 09/08/2021 / 2900 Guilds - 11/08/2021 \n` +
      `# 3000 Guilds - 13/08/2021 / 3100 Guilds - 15/08/2021 \n` +
      `# 3200 Guilds - 17/08/2021 / 3300 Guilds - 18/08/2021 \n` +
      `# 3400 Guilds - 19/08/2021 / 3500 Guilds - 22/08/2021 \n` +
      `# 3600 Guilds - 23/08/2021 / 3700 Guilds - 25/08/2021 \n` +
      `# 3800 Guilds - 26/08/2021 / 3900 Guilds - 27/08/2021 \n` +
      `# 4000 Guilds - 28/08/2021 / 4100 Guilds - 30/08/2021 \n` +
      `# 4200 Guilds - 31/08/2021 / 4300 Guilds - 01/09/2021 \n` +
      `# 4400 Guilds - 03/09/2021 / 4500 Guilds - 05/09/2021 \n` +
      `# 4600 Guilds - 06/09/2021 / 4700 Guilds - 07/09/2021 \n` +
      `# 4800 Guilds - 09/09/2021 / 4900 Guilds - 10/09/2021 \n` +
      `# 5000 Guilds - 11/09/2021 / 5100 Guilds - 13/09/2021 \n` +
      `# 5200 Guilds - 14/09/2021 / 5300 Guilds - 15/09/2021 \n` +
      `# 5400 Guilds - 16/09/2021 / 5500 Guilds - 18/09/2021 \n` +
      `# 5600 Guilds - 19/09/2021 / 5700 Guilds - 21/09/2021 \n` +
      `# 5800 Guilds - 22/09/2021 / 5900 Guilds - 23/09/2021 \n` +
      `# 6000 Guilds - 25/09/2021 / 6100 Guilds - 26/09/2021 \n` +
      `# 6200 Guilds - 27/09/2021 / 6300 Guilds - 29/09/2021 \n` +
      `# 6400 Guilds - 30/09/2021 / \n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validHistory = {
      "1.0": v100History,
      "1.1": v110History,
      "1.2.0": v120History,
      "1.2.1": v121History,
      "1.2.2": v122History,
      "1.2.3": v123History,
      "1.2.4": v124History,
      "1.2.5": v125History,
      "1.2.6": v126History,
      "guild": guilds
   };

   const historyParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validHistory,
      historyParam
   ))
   {

      return validHistory[historyParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params}\`** is not a valid history option. \nPlease use 1.0 / 1.1 / 1.2.0 / 1.2.1 / 1.2.2 / 1.2.3 / 1.2.4 / 1.2.5 / 1.2.6`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `Rita Was Born on the **12/07/19** and Verified on the **27/05/21**\n` +
      "```md\n" +
      `--------------- Version 1.0 --------------- \n` +
      `# Version 1.0.0 - Release Date: 12/07/2019 \n` +
      `* There were 7 iterations of this Version\n\n` +
      "```\n" +
      "```md\n" +
      `--------------- Version 1.1 --------------- \n` +
      `# Version 1.1.0 - Release Date: 13/07/2019 \n` +
      `* There were 11 iterations of this Version\n\n` +
      "```\n" +
      "```md\n" +
      `--------------- Version 1.2 --------------- \n` +
      `# Version 1.2.0 - Release Date: 31/03/2020 \n` +
      `# Version 1.2.1 - Release Date: 13/09/2020 \n` +
      `# Version 1.2.2 - Release Date: 25/04/2021 \n` +
      `# Version 1.2.3 - Release Date: 24/05/2021 \n` +
      `# Version 1.2.4 - Release Date: 09/06/2021 \n` +
      `# Version 1.2.5 - Release Date: 05/07/2021 \n` +
      `# Version 1.2.6 - Release Date: 01/10/2021 \n` +
      `* There are ?? iterations of this Version\n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return getHistory(data);

};
