// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]


// -------------
// Command Code
// -------------

module.exports = function run (data)
{

   data.channel.createWebhook("debug", "https://i.imgur.com/wSTFkRM.png").
      then((webhook) => console.log(`Created webhook ${webhook}`)).
      catch(console.error);

   // ----------------
   // Execute setting
   // ----------------

   return run(data);


};
