/**
 * @fileoverview Calendar class
 * @author rudy@jayantara.co.id (Rudy Susanto)
 */

/**
 * Calendar class
 * @param {Object.<string, *>} settings
 */
function Calendar(settings) {

/**
 * Calendar json data
 * @type {Object}
 */
var calendar;

/**
 * Calendar mapper object, for easy data access
 * @type {Object}
 */
var calmapper;

/**
 * Calendar fetching status:
 *  0 => not fetched;
 *  1 => fetching;
 *  2 => fetched;
 * -1 => error fetching calendar;
 * @type {number}
 */
var status = 0;

/**
 * Server time
 * @type {Date}
 */
var serverTime;

/**
 * Calendar expiry status
 * @type {boolean}
 */
var expired;

/**
 * Calendar expiry timer
 * @type {setTimeout()}
 */
var expiredTimer;

/**
 * Function execution queue.
 * @type {Array.<function()>}
 */
var queue = [];

//----------------------------------------------------------------------------------------------------------------------
// private methods
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constuctor
 */
function initialize() {
   // fetch();
}

/**
 * Fetch calendar from server.
 * @param {function {}} callback
 */
function fetch(callback) {
   $.ajax({
      url      : settings.url,
      dataType : 'json',
      success  : function (json, httpStatus, xhr) {
         // fetching calendar succeeded
         if (json && !json.error) {

            // server time (in UTC)
            serverTime = new Date( xhr.getResponseHeader('Date') );
            serverTime = new Date( serverTime.getUTCFullYear() + '/' + (serverTime.getUTCMonth() + 1) + '/' +
                                   serverTime.getUTCDate() + ' ' + serverTime.getUTCHours() + ':' +
                                   serverTime.getUTCMinutes() );

            // server time (in local timezone)
            serverTime = new Date( serverTime.getTime() + ( Number(settings.timezone) || 0 ) * 3600000 );

            // save calender information for later use
            calendar = json;

            // mapping calendar object
            calmapper = {};
            // iterate jalur list
            $.each(calendar || [], function (a, jenjang) {
               calmapper[a] = {};
               // iterate jenjang list
               $.each(jenjang || [], function (b, pref) {
                  calmapper[a][b] = {};
                  // iterate tahap list
                  $.each(pref && pref.tahap || [], function (c, tahap) {
                     calmapper[a][b][c] = {};
                     // iterate menu list
                     $.each(tahap.menu || [], function (d, menu) {
                        var disabled = isDisabled(serverTime, menu.is_tampil, menu.is_aktif,
                           menu.wkt_buka, menu.wkt_tutup);
                        // map current menu
                        calmapper[a][b][c][menu.id] = {
                           is_tampil : menu.is_tampil,
                           is_aktif  : menu.is_aktif,
                           wkt_buka  : menu.wkt_buka,
                           wkt_tutup : menu.wkt_tutup,
                           statis    : menu.statis,
                           data      : menu.data,
                           disabled  : disabled
                        };
                        // iterate submenu list
                        $.each(menu.child || [], function (e, submenu) {
                           // map current menu
                           calmapper[a][b][c][menu.id + '-' + submenu.id] = {
                              is_tampil : submenu.is_tampil,
                              is_aktif  : submenu.is_aktif,
                              wkt_buka  : submenu.wkt_buka,
                              wkt_tutup : submenu.wkt_tutup,
                              statis    : submenu.statis,
                              data      : submenu.data,
                              disabled  : disabled || isDisabled(serverTime, submenu.is_tampil, submenu.is_aktif,
                                 submenu.wkt_buka, submenu.wkt_tutup)
                           };
                        });
                     });
                  });
               });
            });

            // execute callback
            callback(true);

         // error fetching calendar
         } else {
            callback(false);
         }
      }
   });
}

/**
 * Checks if menu (which represent controller) is disabled for current conditions.
 * @param {new Date} serverTime
 * @param {boolean} isTampil
 * @param {boolean} isAktif
 * @param {new Date|string|number} wktBuka
 * @param {new Date|string|number} wktTutup
 * @return {boolean}
 */
function isDisabled(serverTime, isTampil, isAktif, wktBuka, wktTutup) {
   if (!isTampil) {
      return true;
   } else if (!isAktif) {
      return true;
   } else if (wktBuka && wktTutup) {
      return compareDate(serverTime, sanitizaDate(wktBuka)) < 0 || compareDate(serverTime, sanitizaDate(wktTutup)) > 0;
   } else if (wktBuka) {
      return compareDate(serverTime, sanitizaDate(wktBuka)) < 0;
   } else if (wktTutup) {
      return compareDate(serverTime, sanitizaDate(wktTutup)) > 0;
   } else {
      return false;
   }
}

/**
 * Sanitize date.
 * @param {new Date|string|number} date
 * @return {new Date|boolean}
 */
function sanitizaDate(date) {
   var strRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}( \d{1,2}:\d{1,2}(:\d{1,2})?)?$/;
   var numRegex = /^\d+$/;

   if (typeof date == 'string') {
      if (strRegex.test(date)) {
         date = date.replace(/-/g, '/');
      } else if (numRegex.test(date)) {
         date = Number(date);
      }
   }

   // convert to Date object
   date = new Date(date);

   return !!date.getTime() && date;
}

/**
 * Compare two date Object
 * @param {new Date} dateA
 * @param {new Date} dateB
 * @return {number}
 */
function compareDate(dateA, dateB) {
   return dateA.getTime() - dateB.getTime();
}

//----------------------------------------------------------------------------------------------------------------------
// public methods
//----------------------------------------------------------------------------------------------------------------------

/**
 * Add new function to queue.
 * @param {function()} fn
 */
this.addExecutionQueue = function (fn) {
   if (typeof fn == 'function') {
      // on progress
      if (status == 1) {
         queue.push(fn);
      // not fetched or expired
      } else if (status < 1 || expired) {
         status = 1;
         queue.push(fn);
         fetch(function (fetchStatus) {
            // set status
            status = fetchStatus ? 2 : -1;
            // set expiry status timer
            if (settings.expires) {
               clearTimeout(expiredTimer);
               expiredTimer = setTimeout(function () { expired = true }, settings.expires);
            }
            // execute queue items
            while (queue.length) {
               queue.shift()(expired);
               // while at it, reset expiry status
               expired = false;
            }
         });
      // fetched
      } else {
         fn(false);
      }
   }
};

/**
 * Get active tahap for particular jalur and jenjang.
 * @param {number} jalur
 * @param {number} jenjang
 * @return {number|boolean}
 */
this.getTahapActive = function (jalur, jenjang) {
   return calendar && calendar[jalur] && calendar[jalur][jenjang] && calendar[jalur][jenjang]['aktif'] || false;
}

/**
 * Get maximum tahap for particular jalur and jenjang.
 * @param {number} jalur
 * @param {number} jenjang
 * @return {number|boolean}
 */
this.getTahapMax = function (jalur, jenjang) {
   return calendar && calendar[jalur] && calendar[jalur][jenjang] && calendar[jalur][jenjang]['maks'] || false;
}

/**
 * Get tahap information.
 * @param {number} jalur
 * @param {number} jenjang
 * @param {number} tahap
 * @return {Object.<string, *>|boolean}
 */
this.getTahapData = function (jalur, jenjang, tahap) {
   return calendar && calendar[jalur] && calendar[jalur][jenjang] && calendar[jalur][jenjang]['tahap']
      && calendar[jalur][jenjang]['tahap'][tahap] || false;
}

/**
 * Get current server time against wkt_pengumuman.
 * @param {number} jalur
 * @param {number} jenjang
 * @param {number} tahap
 * @param {number} code
 * @return {boolean}
 */
this.isPengumuman = function (jalur, jenjang, tahap, code) {
   var data = calendar && calendar[jalur] && calendar[jalur][jenjang] && calendar[jalur][jenjang]['tahap']
      && calendar[jalur][jenjang]['tahap'][tahap] || false;

   // hasil tes
   if (data && code) {
      data = data && data['tes'] && data['tes'][code];
   }

   return data && data['wkt_pengumuman'] && compareDate(serverTime, sanitizaDate(data['wkt_pengumuman'])) > 0;
};

/**
 * Get calendar detail for current menu.
 * @param {number} jalur
 * @param {number} jenjang
 * @param {number} tahap
 * @param {string} id
 * @return {Object.<string, *>|boolean}
 */
this.getMenuStatus = function (jalur, jenjang, tahap, id) {
   return calmapper && calmapper[jalur] && calmapper[jalur][jenjang] && calmapper[jalur][jenjang][tahap]
      && calmapper[jalur][jenjang][tahap][id] || false;
};

//----------------------------------------------------------------------------------------------------------------------
// execute "constructor"
//----------------------------------------------------------------------------------------------------------------------

initialize();

};