/**
 * Util namespace.
 */
Util = {};


// TYPE CHECKING

Util.isArray     = function (x) { return x instanceof Array; }
Util.isFunction  = function (x) { return typeof x == 'function'; }
Util.isNumber    = function (x) { return typeof x == 'number'; }
Util.isObject    = function (x) { return typeof x == 'object'; }
Util.isString    = function (x) { return typeof x == 'string'; }
Util.isUndefined = function (x) { return typeof x == 'undefined'; }


// STRING MANIPULATION

/**
 * Pad a string to a certain length with another string.
 * @param {string|number} str
 * @param {number} len
 * @param {(string|number)=} pad
 */
Util.strPad = function (str, len, pad) {
   if ( Util.isNumber(str) || Util.isString(str) ) {
      // cast to string
      str = String(str);

      // sanitize pad string
      if ( Util.isNumber(pad) )
         pad = String(pad);
      else if ( !Util.isString(pad) )
         pad = ' ';
      else if ( !pad.length )
         pad = ' ';
      else if ( pad.length > 1 )
         pad = pad[0];

      // pad string
      while (str.length < len)
         str = pad + str;
   }

   return str;
};
