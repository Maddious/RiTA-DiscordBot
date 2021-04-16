// -------
// Colors
// -------

const colors = {
<<<<<<< Updated upstream
   err: 13107200,
   error: 13107200,
   info: 41215,
   ok: 5299300,
   warn: 16764928
=======
   info: 41215,
   warn: 16764928,
   err: 13107200,
   error: 13107200,
   ok: 5299300
>>>>>>> Stashed changes
};

// ----------
// Get color
// ----------

exports.get = function get (color)
{

   if (Object.prototype.hasOwnProperty.call(
      colors,
      color
   ))
   {

      return colors[color];

   }
   if (isNaN(color))
   {

      return colors.warn;

   }
   return color;

};

// ------------------------------------
// Convert RGB color to decimal number
// ------------------------------------

exports.rgb2dec = function rgb2dec (rgb)
{

   // eslint-disable-next-line no-bitwise
   return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];

};
