/**
 * @fileoverview Application class
 * @author kukuh
 */
(function () {

/**
 * Controllers cache
 * @type {Object.<string, function ()>}
 */
var controllers = {};

/**
 * Preferences cache
 * @type {Object.<string, *>}
 */
var preferences = {};

/**
 * Environment variable cache
 * @type {Object.<string, (string|number)>}
 */
var env = {};

/**
 * Wrapper DOM (parent)
 * @type {jQuery}
 */
var wrapper;

/**
 * Workspace DOM (default layout)
 * @type {jQuery}
 */
var workspaceDefault;

/**
 * Left-menu DOM.
 * @type {jQuery}
 */
var topmenu;

/**
 * Dialogues.
 * @type {Object.<string, Modal.Dialog>}
 */
var dialogs = {};

/**
 * Response caches.
 * @type {Object.<string, *>}
 */
var responses = {};

/**
 * Other caches.
 * @type {Object.<string, *>}
 */
var caches = {};

/**
 * Slice given hash string into array
 * @param {string=} hash
 * @return {Object.<string, Array.<string>>}
 */
function sliceHashString(hash) {
   var result, anchor;

   // init result
   result = {
      route: [],
      data: [],
      anchor: ''
   };

   // replace param
   hash.replace(/\?force_desktop=1/,'');

   // validate hash string
   hash.match(/^#!\//) || (hash = '');

   // extract anchor
   anchor = hash.replace(/^#!\/[^#]+/, '');

   // slice hash string
   hash = hash.replace(/^#!\//, '').replace(/\/$/, '').replace(anchor, '').split('/');

   // divide hash array into route and data parts.
   for (var i = 0, isDataPart; i < hash.length; i++) {
      if (isDataPart) {
         result.data.push(hash[i]);
      } else if (hash[i] == 'p') {
         isDataPart = true;
         continue;
      } else {
         result.route.push(hash[i]);
      }
   }

   // anchor
   result.anchor = anchor.replace('#', '');

   return result;
}

/**
 * Scroll page to an element.
 * @param {jQuery|string} el
 */
function scrollToElement( el ) {
   if (typeof el === 'string') {
      el = $(el);
   }
   if (el.length) {
      $('html, body').animate({
         scrollTop: el.offset().top
      }, 0);
   }
}

/**
 * ...
 */
function fetchModule(route, data, anchor) {
	var domain = window.location.hostname;

   if ( !route[0] )
      route[0] = domain == 'bpsdmpk.kemdikbud.go.id' ? 'cari' : 'index';

   // domain bpsdmk di redirect ke cari
   if (route[0] && domain == 'bpsdmpk.kemdikbud.go.id')
   	route[0] = 'cari';

   route[0] = route[0].replace(/\?force_desktop=1/,'');

   // route adalah number digit nuptk
   if ( (/^\d+$/).test( route[0] ) ) {
      app.setCache('ptkId', route[0]);
      route[0] = 'detail';
   }

   // page properties
   var pageDivPrefix = 'js-pagediv-';
   var pageDivId     = pageDivPrefix + route[0];
   var pageDiv       = wrapper.find('#' + pageDivId);
   var pageDivUrl    = Env.STATIC_URL + Version.url('html/' +  route[0] + '.html');
   var pageSrcId     = route[0];
   var pageSrcUrl    = Env.STATIC_URL + Version.url('js/' +  route[0] + '.js');
   var pageSubDiv    = false;
   var pageSubSrcId  = false;
   var pageSubSrcUrl = false;

   // load page template
   pageDiv.length || $.ajax({
   url : pageDivUrl,
   type: 'GET',
   success: function(response) {
      workspaceDefault.html(response);
      pageDiv = wrapper.find('#' + pageDivId);
   }
   });

   // show loading
   app.ux.showLoading( 'Memuat halaman ' +route.join('/') );
   // load page script
   $LAB.script(pageSrcUrl).wait(function () {
      var loops    = 0;
      var maxLoops = 200;
      var interval = 100;
      var timer    = setInterval(function () {

         // abort if template unavailable after (maxLoops * interval) milliseconds
         if (++loops > maxLoops) {
            clearInterval(timer);
            app.debug("Failed to load resource " + pageSrcUrl + " (timeout " + (maxLoops * interval) + "ms).");

            // hide loading
            app.ux.hideLoading();

            return;
         }
         // execute controller if template available
         if (pageDiv.length) {
            clearInterval(timer);
            if (typeof controllers[pageSrcId] == 'function') {
               controllers[pageSrcId]({
                  route    : route,
                  data     : data,
                  callback : function (child) {
                     if (typeof child == 'string') {
                        pageSubDiv    = wrapper.find('#' + pageDivPrefix + route[0] + '-' + child);
                        pageSubSrcId  = route[0] + '-' + child;
                        pageSubSrcUrl = Env.STATIC_URL + Version.url('js/' +  pageSubSrcId + '.js');

                        // load subpage if available
                        $LAB.script(pageSubSrcUrl).wait(function () {
                           if (typeof controllers[pageSubSrcId] == 'function') {
                              controllers[pageSubSrcId]({
                                 route    : route,
                                 data     : data,
                                 callback : function () {
                                    // show template div
                                    pageDiv.siblings().hide();
                                    pageDiv.show();

                                    // update left menu
                                    app.ui.updateTopMenu(route);

                                    // hide loading
                                    app.ux.hideLoading();

                                    // go to anchor
                                    if (anchor) {
                                       scrollToElement( pageDiv.find('a[name=' + anchor + ']') );
                                    }

                                    // google analytics
                                    app.trackPageview();
                                 }
                              });

                           // no subcontroller available!
                           } else {
                              app.debug('Cannot find controller "' + pageSubSrcId + '" on resource ' +
                                 pageSubSrcUrl + '.');

                              // hide loading
                              app.ux.hideLoading();
                           }
                        });
                     } else {
                        // show template div
                        pageDiv.siblings().hide();
                        pageDiv.show();
                        // update top menu
                        app.ui.updateTopMenu(route);

                        // hide loading
                        app.ux.hideLoading();

                        // go to anchor
                        if (anchor) {
                           scrollToElement( pageDiv.find('a[name=' + anchor + ']') );
                        }

                        // google analytics
                        app.trackPageview();
                     }
                  }
               });

            // no controller available!
            } else {
               app.debug('Cannot find controller "' + pageSrcId + '" on resource ' + pageSrcUrl + '.');

               // hide loading
               app.ux.hideLoading();
            }
         }

      }, interval);
   });
}

/**
 * Class definition
 * @type Object
 */
var app = {

   /**
    * Register new controller.
    * @param {string} id
    * @param {function()} controller
    */
   addController: function (id, controller) {
      if (typeof controller == 'function')
         controllers[id] = controller;
   },

   /**
    * Get preference values.
    * @param {string} path Variable path from topmost preference object
    */
   getPreference: function (path) {
      var pref, undef;

      if (typeof path == 'string') {
         path = path.split('.');
         pref = preferences;

         for (var i = 0; i < path.length; i++) {
            pref = pref[ path[i] ];
            if (pref === undef || pref === null) {
               break;
            }
         }

         return pref;
      }

      return undef;
   },

   /**
    * Set preference values.
    * @param {string} path Variable path to be set
    * @param {*} value
    */
   setPreference: function (path, value) {
      var pref;

      if (typeof path == 'string') {
         path = path.split('.');
         pref = preferences;

         for (var i = 0; i < path.length; i++) {
            if (i < path.length - 1) {
               if (typeof pref[ path[i] ] != 'object' || pref[ path[i] ] === null)
                  pref[ path[i] ] = {};
            } else {
               pref[ path[i] ] = value;
            }

            pref = pref[ path[i] ];
         }
      }
   },

   /**
    * Get environment variable.
    * @param {string} name
    */
   getEnv: function (name) {
      return env[name];
   },

   /**
    * Get cached data.
    * @param {string} name
    * @return {*}
    */
   getCache: function (name) {
      return caches[name];
   },

   /**
    * Get cached data.
    * @param {string} name
    * @param {*} data
    */
   setCache: function (name, data) {
      caches[name] = data;
   },

   /**
    * Single Ajax call
    * @param {string} url
    * @param {?Object} configs
    * @param {?function(Object)} callback
    */
   request: function (url, configs, callback) {
      // merge configs with default values
      configs = $.extend({
         type: 'GET',
         data: {}
      }, configs || {});

      // retrieve data from cache if available
      if (responses[url] && configs.type.toUpperCase() == 'GET') {
         Util.isFunction(callback) && callback( responses[url] );
         return;
      }

      // flag
      var success = false;

     // send request
      $.ajax({
         url: url,
         type: configs.type,
         data: configs.data,
         dataType: 'json',
         success: function (json) {
            // save responses
            responses[url] = json;

            // execute callback function (if any)
            Util.isFunction(callback) && callback(json);

            // update flag
            success = true;
         },
         error: function () {},
         complete: function (xhr, status) {
            if ( !success && Util.isFunction(callback) )
               callback();
         }
      });
   },

   /**
    * Handler for onhashchange events
    * @param {?string} hash
    */
   onHashChange: function (hash) {
      // slice hash
      hash = sliceHashString( String(hash || window.location.hash) );

      var kota = window.location.pathname.replace(/\//g,'');

      // extract jenjang, jalur and tahap values
      var code = String(hash.route[0]).match(/^(\d{2})(?:(\d{2})(\d{2})?)?$/) || [];
      for (var i = 0; code[i] && i < code.length; i++)
         code[i] = String( Number(code[i]) );

      // fetching module
      fetchModule(hash.route, hash.data, hash.anchor);
   },

   /**
    * Application initialization procedure
    */
   init: function () {
      // cache environment variables
      $.each(window['Env'] || [], function (key, value) {
         env[key] = value;
      });

      // cache important DOMs
      wrapper           = $('#js-wrapper');
      workspaceDefault  = $('#js-workspace');
      topmenu           = $('#js-topmenu').empty();

      // listen for onhashchange events
      window.onhashchange = function () {
         app.onHashChange();
      };

      // intercept hashbang (#!) links, so clicking same URL will reload the page
      $(document).on('click', 'a[href^="#!"]', function (e) {
         e.preventDefault();
         var aHash = $(this).attr('href');
         var wHash = window.location.hash;
         if (aHash != wHash) {
            window.location = aHash;
         } else {
            app.onHashChange(aHash);
         }
      });

      if ($.cookie('hideanno') != '1') { $('#anno-max').show().prev().hide().closest('blockquote').css({'background':'#FFFFED'}); }
      $(document).on('click', 'a[data-act=openit], a[data-act=closeit]', function(e){
         e.preventDefault();
         var $a = $(this).closest('blockquote');
         var $p = $(this).closest('div');
         if($(this).is('a[data-act=closeit]')){
            $p.slideUp(500,function(){$(this).prev().fadeIn(500); $a.css({'background':'#FFFFCC'})});
            if ($.cookie('hideanno') != '1') $.cookie('hideanno', '1', { expires: 15});
         }else{
            $p.hide().next().slideDown(500);
            $a.css({'background':'#FFFFED'});
         }
      });
   },

   /**
    * Application starting point.
    * This is the method that should be executed first in order to start application.
    */
   start: function () {
      // set ID
      ID = window.location.pathname.replace(/\//g,'');

      // show splash screen
      this.ux.showLoading();

      // check application dependencies
      if (!('onhashchange' in window)) {
         this.debug("Stopped: Browser unsupported / window['onhashchange'] unavailable.");
         return;
      }

      // initialize application
      app.init();
      // execute
      app.onHashChange();
   },

   /**
    * Debug log
    * @param {string} msg
    */
   debug: function (msg) {
      if (typeof Cookie == 'object' && Cookie.get && Cookie.get('ppdb_debug')) {
         console.log('[PPDB Debug] ' + msg);
      }
   },

   /**
    * Asychronous Google Anaytics tracker.
    * @param {string} page - Page URL to track or log.
    */
   trackPageview: function (page) {
     ga('send', 'pageview', window.location.hash);
   }
};


/**
 * User-interface rendering functions.
 * @type {Object.<string, function()>}
 */
app.ui = {
   /**
    * Render left menu based on current status
    * @param {Array.<string>} route
    */
   updateTopMenu: function (route) {
      // aliases
      var TOP_MENU = [
                        // {"id":"tentang","label":"Tentang","template":"\/tentang.html"},
                        // {"id":"nuptk","label":"NUPTK","template":"\/nuptk.html"},
                        // {"id":"eds","label":"EDS","template":"\/eds.html"},
                        // {"id":"register","label":"Registrasi","template":"\/register.html"},
                        {"id":"unduh","label":"Formulir","template":"\/unduh.html"},
                        {"id":"alur","label":"Prosedur","template":"\/alur.html"},
                        {"id":"kontak","label":"Kontak","template":"\/kontak.html"},
                      ];

      // build html fragment
      var html = '';
      // beranda
      html += '<a href="#!/index" ' + (route[0] == 'index' ? ' class="on"' : '') +'>Beranda</a> <a>|</a>';

      // static side menu
      $.each(TOP_MENU || [], function (key, item) {
         html += '<a href="#!/' + item.id + '" ' + (route[0] == item.id ? ' class="on"' : '') +'>'+ item.label +'</a> <a>|</a>';
      });
      html += '<a href="http://prodep.tendik.net/">ProDep</a> <a>|</a>'
            + '<a href="http://padamu.siap.web.id/">Login</a>';

      // apply html
      topmenu.empty().append(html);
   },

 };


/**
 * User experience (UX) functions.
 */
app.ux = (function (body) {
   // save loading-progress dom for later use
   var loading = body.children('#js-loading');

   return {

      // show loading progress
      showLoading: function (text) {
         loading.find('.js-loading-text').html(text);
         loading.show();
      },

      // hide loading progress
      hideLoading: function () {
         loading.hide();
      }
   };
})( $(document.body) );


// Expose application to the global object
window.Application = app;

})();