/**
 * @fileoverview version.js
 * @author rudy@jayantara.co.id (Rudy Susanto)
 */
Version = {

   /**
    * Version string.
    * @public
    * @type {string}
    */
   ID: "201505251213",

   /**
    * Compose url with current version string.
    * @public
    * @param {string} file
    * @return {string}
    */
   url: function (file) {
      return file.replace(/(\.[a-z]{2,4})$/, '.' + this.ID + '$1');
   }
};

