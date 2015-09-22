/**
 * Cookie management class
 * Based on cookies script example by PPK, http://www.quirksmode.org/js/cookies.html
 */

/**
 * @namespace
 */
Cookie = {};

/**
 * Set value of a cookie name
 * @function
 * @param {String} name
 * @param {String} value
 * @param {Number} [days] - How many days after cookie will be available.
 * @param {String} [domain] - Set domain which cookie will be available.
 */
Cookie.set = function (name, value, days, domain) {
   var date, expires;

   if (days) {
      date = new Date();
      date.setDate(date.getDate() + days);
      expires = '; expires=' + date.toUTCString();
   } else {
      expires = '';
   }

   if (domain) {
      domain = '; domain=' + domain;
   } else {
      domain = '';
   }

   document.cookie = name + '=' + value + expires + '; path=/' + domain;
};

/**
 * Get value from a cookie name
 * @function
 * @param {String} name
 * @return {String|null}
 */
Cookie.get = function (name) {
   var cookies = document.cookie.split(';');

   name = name + '=';
   for (var i = 0, cookie; i < cookies.length; i++) {
      cookie = cookies[i].replace(/^\s+/, '');
      if (cookie.indexOf(name) == 0)
         return cookie.substr(name.length);
   }

   return null;
};

/**
 * Remove a cookie name
 * @function
 * @param {String} name
 */
Cookie.clear = function (name) {
   Cookie.set(name, '', -1);
};