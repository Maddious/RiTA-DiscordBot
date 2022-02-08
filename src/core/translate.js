// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const translate = require("rita-google-translate-api");
const db = require("./db");
const botSend = require("./send");
const fn = require("./helpers");
const auth = require("../core/auth");

// ------------------------------------------
// Fix broken Discord tags after translation
// (Emojis, Mentions, Channels, Urls)
// ------------------------------------------


function discordPatch (string)
{

   // eslint-disable-next-line no-useless-escape
   const urlRegex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/giu;

   // let regexFix = string.replace(/:[^\s]*?:/gmi);

   let match = string.match(/<.*?>/gmiu);
   let everyonePing = string.match(/@everyone|@here/giu);
   let urlMatch = string.match(urlRegex);
   let codeMatch = string.match(/`[^`]+`/g);
   let bigBlock = string.match(/```[^`]+```/g);

   let regexFix = string.replace(/<.*?>/gmiu, "<>").
      replace(urlRegex, "{}").
      replace(/@everyone/g, "[]").
      replace(/@here/g, "[]").
      replace(/（/g, "(").
      replace(/）/g, ")");
   if (!urlMatch)
   {

      urlMatch = [];

   }

   if (!everyonePing)
   {

      everyonePing = [];

   }
   if (!match)
   {

      match = [];

   }
   for (let i = 0; i < match.length; i += 1)
   {

      const str = match[i];
      if (!str.match(/<:.*?:([0-9])>/))
      {

         const text = str.slice(1, -1);
         const textMatch = text.match(/[a-z\s.!,()0-9]/gi);
         if (textMatch)
         {

            if (textMatch.length === text.length)
            {

               match[i] = text;

            }

         }

      }


   }

   if (!codeMatch)
   {

      codeMatch = [];

   }
   if (!bigBlock)
   {

      bigBlock = [];

   }

   for (let i = 0; bigBlock.length > i; i += 1)
   {

      let string = bigBlock[i];
      string = string.replace(/`/g, "");
      const searchString = codeMatch[i];

      if (string === searchString.replace(/`/g, ""))
      {

         codeMatch.splice(i, 1);
         // removes the false match from array cause im too annoyed to find a correct regexp solution
         regexFix = regexFix.replace(bigBlock[i], ")(");

      }


   }
   regexFix = regexFix.replace(/`[^`]+`/g, "()");

   const result = {
      match,
      "text": regexFix,
      // eslint-disable-next-line sort-keys
      "original": string,
      "url": urlMatch,
      // eslint-disable-next-line sort-keys
      "memberPing": everyonePing,
      // eslint-disable-next-line sort-keys
      "code": {
         "one": codeMatch,
         "three": bigBlock
      }


   };
   return result;

}

function translateFix (string, matches)
{

   let text = string;

   for (const obj of matches.match)
   {

      text = text.replace(/<\s*?>/i, obj);

   }
   for (const obj of matches.url)
   {

      text = text.replace(/{\s*?}/i, obj);

   }
   for (const obj of matches.memberPing)
   {

      text = text.replace(/\[\s*?\]/i, obj);

   }
   for (const obj of matches.code.one)
   {

      text = text.replace(/\(\s*?\)/, obj);

   }
   for (const obj of matches.code.three)
   {

      text = text.replace(/\)\s*?\(/, obj);

   }
   return text;


}
// ---------------------------------------------------------------------------
// Retranslation function using auto if it thinks it is in the wrong language
// ---------------------------------------------------------------------------

async function reTranslate (matches, opts)
{

   const OPTIONS = {
      "from": "auto",
      "to": opts.to


   };
   const res = await translate(matches.text, OPTIONS);
   return translateFix(res.text, matches);

}

// ---------------------------------------
// Get user color for translated response
// ---------------------------------------

// eslint-disable-next-line func-style
function getUserColor (data, callback)
{

   const fw = data.forward;
   const txt = data.text;
   const ft = data.footer;
   const usr = data.message.author;
   const msg = data.message;

   data.forward = fw;
   data.text = txt;
   data.footer = ft;
   data.message.author = usr;
   data.message = msg;


   callback(data);

}

// --------------------------
// Translate buffered chains
// --------------------------

function bufferSend (arr, data)
{

   const sorted = fn.sortByKey(
      arr,
      "time"
   );
   sorted.forEach((msg) =>
   {

      data.text = msg.text;
      data.color = msg.color;
      data.message.author = msg.author;
      data.showAuthor = true;
      data.message = msg;

      // -------------
      // Send message
      // -------------
      console.log(`Transalte 1`);
      botSend(data);

   });

}

// eslint-disable-next-line no-unused-vars
function bufferChains (data, from, guild)
{

   const translatedChains = [];

   data.bufferChains.forEach(async (chain) =>
   {

      const chainMsgs = chain.msgs.join("\n");
      const to = data.translate.to.valid[0].iso;
      const matches = await discordPatch(chainMsgs);

      translate(
         matches.text,
         {
            from,
            to
         }
      ).then((res) =>
      {

         /*
         if (res.error && res.error === true)
         {

            const col = "errorcount";
            const id = "bot";
            db.increaseServersCount(col, id);
            // console.log("DEBUG: API Error Found");
            return;

         }
         */

         // Language you set it to translate to when setting up !tr channel command
         const langTo = to;

         // Detected language from text
         const detectedLang = res.from.language.iso;
         // Language you set when setting up !tr channel command
         const channelFrom = from;
         if (detectedLang === langTo)
         {

            return;

         }
         else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {

            return;

         }

         const output = translateFix(res.text, matches);

         getUserColor(
            chain,
            function getUserColor (gotData)
            {

               translatedChains.push({
                  "author": gotData.message.author,
                  "color": gotData.color,
                  "text": output,
                  "time": chain.time
               });

               if (fn.bufferEnd(
                  data.bufferChains,
                  translatedChains
               ))
               {

                  bufferSend(
                     translatedChains,
                     data
                  );

               }

            }
         );

      });

   });

}

// ---------------------
// Invalid lang checker
// ---------------------

function invalidLangChecker (obj, callback)
{

   if (obj && obj.invalid && obj.invalid.length > 0)
   {

      return callback();

   }

}

// --------------------
// Update server stats
// --------------------

function updateServerStats (message)
{

   if (message.channel.type === "text")
   {

      db.increaseStatsCount("translation", message.channel.guild.id);
      db.increaseServersCount("count", message.channel.guild.id);

   }

}

// ----------------
// Run translation
// ----------------

module.exports = function run (data) // eslint-disable-line complexity
{

   // -------------------------
   // Report invalid languages
   // -------------------------

   invalidLangChecker(
      data.translate.from,
      function invalidLangChecker ()
      {

         data.color = "warn";
         data.text = `:warning:  Cannot translate from \`${
            data.translate.from.invalid.join("`, `")}\`.`;

         // -------------
         // Send message
         // -------------

         botSend(data);

      }
   );

   invalidLangChecker(
      data.translate.to,
      function invalidLangChecker ()
      {

         data.color = "warn";
         data.text = `:warning:  Cannot translate to \`${
            data.translate.to.invalid.join("`, `")}\`.`;

         // -------------
         // Send message
         // -------------

         botSend(data);

      }
   );

   // -------------------------------------
   // Stop if there are no valid languages
   // -------------------------------------

   if (
      data.translate.to.valid.length < 1 ||
      data.translate.from.valid && data.translate.from.valid.length < 1
   )
   {

      return;

   }

   // --------------------------------
   // Handle value of `from` language
   // --------------------------------

   let from = data.translate.from;

   if (from !== "auto")
   {

      from = data.translate.from.valid[0].iso;

   }

   // ---------------
   // Get guild data
   // ---------------

   let guild = null;

   if (data.message.channel.type === "text")
   {

      guild = data.message.channel.guild;

   }

   // ----------------------------------------------
   // Translate multiple chains (!translate last n)
   // ----------------------------------------------

   if (data.bufferChains)
   {

      return bufferChains(
         data,
         from,
         guild
      );

   }

   // -----------------------------
   // Multi-translate same message
   // -----------------------------

   const translateBuffer = {};

   if (data.translate.multi && data.translate.to.valid.length > 1)
   {

      // ------------------------------------------
      // Stop if user requested too many languages
      // ------------------------------------------

      if (data.translate.to.valid.length > 6)
      {

         data.text = "Too many languages specified";
         data.color = "error";

         // -------------
         // Send message
         // -------------

         return botSend(data);

      }

      // --------------------
      // Buffer translations
      // --------------------

      const bufferID = data.message.createdTimestamp;

      data.color = null;

      data.text = "";

      translateBuffer[bufferID] = {
         "count": 0,
         "len": data.translate.to.valid.length,
         "text": "",
         update (newMsg)
         {

            this.count += 1;
            this.text += newMsg;

            if (this.count === this.len)
            {

               data.text = this.text;
               data.color = data.member.displayColor;
               data.showAuthor = true;
               getUserColor(
                  data,
                  botSend
               );

            }

         }
      };

      data.translate.to.valid.forEach(async (lang) =>
      {

         const matches = await discordPatch(data.translate.original);
         translate(
            matches.text,
            {
               from,
               "to": lang.iso
            }
         ).then((res) =>
         {

            /*
            if (res.error && res.error === true)
            {

               const col = "errorcount";
               const id = "bot";
               db.increaseServersCount(col, id);
               // console.log("DEBUG: API Error Found");
               return;

            }
            */

            // Language you set it to translate to when setting up !tr channel command
            const langTo = lang.iso;

            // Detected language from text
            const detectedLang = res.from.language.iso;
            // Language you set when setting up !tr channel command
            const channelFrom = from;
            if (detectedLang === langTo)
            {

               return;

            }
            else if (detectedLang !== channelFrom && channelFrom !== "auto")
            {

               return;

            }

            const title = `\`\`\`LESS\n ${lang.name} (${lang.native}) \`\`\`\n`;
            const output = `\n${title}${translateFix(res.text, matches)}\n`;
            return translateBuffer[bufferID].update(
               output,
               data
            );

         });

      });
      return;

   }

   // ------------------------
   // Send single translation
   // ------------------------

   const opts = {
      from,
      "to": data.translate.to.valid[0].iso
   };

   const fw = data.forward;
   const ft = data.footer;

   // --------------------
   // Split long messages
   // --------------------

   const textArray = fn.chunkString(
      data.translate.original,
      1500
   );

   textArray.forEach(async (chunk) =>
   {

      const matches = await discordPatch(chunk);
      translate(
         matches.text,
         opts
      ).then(async (res) =>
      {

         /*
         if (res.error && res.error === true)
         {

            const col = "errorcount";
            const id = "bot";
            db.increaseServersCount(col, id);
            // console.log("DEBUG: API Error Found");
            return;

         }
         */

         res.text = translateFix(res.text, matches);

         const langTo = opts.to;

         // Detected language from text
         const detectedLang = res.from.language.iso;
         // Language you set when setting up !tr channel command
         const channelFrom = from;

         if (detectedLang === langTo && res.text === data.message.content)
         {

            try
            {

               if (data.message.client.channels.cache.get(data.forward).guild.id === data.message.client.channels.cache.get(data.message.channel.id).guild.id)
               {

                  // console.log("DEBUG: Cross Server Checker - Same Server, Same language");
                  return;

               }

            }
            catch (err)
            {

               // console.log(
               //   `Translate Message Error, Same language Failure, translate.js = Line 638 - SERVER: ${data.message.guild.id}`,
               //   err
               // );

               // console.log(`Translate Message Error, Same language Failure, translate.js = Line 638 - SERVER: ${data.message.guild.id}`);


            }

            // console.log("DEBUG: Cross Server Checker - Diffrent Server, Same language");

         }
         else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {

            // eslint-disable-next-line require-atomic-updates
            res.text = await reTranslate(matches, opts);


         }

         updateServerStats(data.message);
         data.forward = fw;
         data.footer = ft;
         data.color = data.member.displayColor;
         data.text = res.text;
         data.showAuthor = true;
         data.detectedLang = detectedLang;
         if (auth.messagedebug === "4")
         {

            console.log(`MD4: ${data.message.guild.name} - ${data.message.guild.id} - ${data.message.createdAt}\nMesssage User - ${data.message.author.tag}\nMesssage Content - ${data.message.content}\nTranslated from: ${detectedLang} to: ${langTo}\n----------------------------------------`);

         }
         if (auth.messagedebug === "2")
         {

            console.log(`MD2: ${data.message.guild.name} - ${data.message.guild.id} - ${data.message.createdAt}`);

         }
         if (data.footer)

         {

            if (data.message.server[0].langdetect === true)
            {

               data.footer.text += `\nSource Language: ${detectedLang}`;

            }

         }
         return getUserColor(
            data,
            botSend
         );

      });

   });

};
