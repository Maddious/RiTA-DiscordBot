// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const sendMessage = require("../../core/command.send");

// ----
// Ban
// ----

module.exports.ban = function ban (data)
{

   // -------------
   // Command Code
   // -------------

   if (data.message.isAdmin === true)
   {


      const user = data.message.mentions.users.first();
      // If we have a user mentioned
      if (user)
      {

         // Now we get the member from the user
         const member = data.message.guild.members.cache.get(user.id);
         // If the member is in the guild
         if (member)
         {

            member.
               ban("Banned By RITA Ban Command").
               then(() =>
               {

                  // We let the message author know we were able to kick the person
                  data.text = `Successfully banned ${user.tag}\n`;
                  return sendMessage(data);

               }).
               catch((err) =>
               {

                  // An error happened
                  // This is generally due to the bot not being able to kick the member,
                  // Either due to missing permissions or role hierarchy
                  data.text = "I was unable to ban that user.\nThis is generally due to the bot missing permissions or role hierarchy.\n";
                  console.log(err);
                  return sendMessage(data);
                  // Log the error

               });

         }
         else
         {

            // The mentioned user isn't in this guild
            data.text = "That user isn't in this guild!\n";
            return sendMessage(data);

         }
         // Otherwise, if no user was mentioned

      }
      else
      {

         data.text = "You didn't mention the user to ban!\n";
         return sendMessage(data);

      }

   }
   else
   {

      data.text = ":cop:  This command is reserved for server admins and owners only.\n";
      return sendMessage(data);

   }

};

// ------
// Unban
// ------

module.exports.unban = function unban (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Unban");

   data.color = "ok";
   data.text = `Unban`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----
// Mute
// -----

module.exports.mute = function mute (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Mute");

   data.color = "ok";
   data.text = `Mute`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -------
// Unmute
// -------

module.exports.unmute = function unmute (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Unmute");

   data.color = "ok";
   data.text = `Unmute`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -------------
// Delete by ID
// -------------

module.exports.deleteid = function deleteid (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Delete Message by ID");

   const msgID = data.cmd.num;
   data.message.delete().catch((err) => console.log(
      "DEBUG: Command Message Deleted By ID Error 1, Mod.js = ",
      err
   ));
   if (data.message.isDev)
   {

      return data.message.guild.channels.cache.get(data.message.channel.id).messages.fetch(msgID).then((message) => message.delete());

   }

};

// -----
// Kick
// -----

module.exports.kick = function kick (data)
{

   // -------------
   // Command Code
   // -------------
   if (data.message.isAdmin === true)
   {

      const user = data.message.mentions.users.first();
      // If we have a user mentioned
      if (user)
      {

         // Now we get the member from the user
         const member = data.message.guild.members.cache.get(user.id);
         // If the member is in the guild
         if (member)
         {

            member.
               kick("Kicked By RITA Kick Command").
               then(() =>
               {

                  // We let the message author know we were able to kick the person
                  data.text = `Successfully kicked ${user.tag}`;
                  return sendMessage(data);

               }).
               catch((err) =>
               {

                  // An error happened
                  // This is generally due to the bot not being able to kick the member,
                  // Either due to missing permissions or role hierarchy
                  data.text = "I was unable to ban that user.";
                  // Log the error
                  console.error(err);
                  return sendMessage(data);

               });

         }
         else
         {

            // The mentioned user isn't in this guild
            data.text = "That user isn't in this guild!";
            return sendMessage(data);

         }
         // Otherwise, if no user was mentioned

      }
      else
      {

         data.text = "You didn't mention the user to kick!";
         return sendMessage(data);

      }

   }
   else
   {

      data.text = ":cop:  This command is reserved for server admins and owners only.\n";
      return sendMessage(data);

   }

};
