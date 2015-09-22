/**
 * @fileoverview Create modal
 * @author rudy@jayantara.co.id (Rudy Susanto)
 */

/**
 * @namespace
 */
Modal = {};

/**
 * Create dialog-type modal
 * @constructor
 * @param {string|HTMLElement|jQueryElement} content to be attached to popup
 */
Modal.Dialog = function (content, id) {
   var wrapper, content, initialized;

   // generate unique id
   id = id || ('js-div-dialog-' + (new Date).getTime());

   if ( $('#' + id).length ) {
      // get previously-create wrapper & content
      wrapper = $('#' + id).hide();
      content = wrapper.find('.menu').children();

      // set flag
      initialized = true;

   } else {
      // create wrapper
      var wrapper = $('<div id="' + id + '" class="tips-modal rnd3">' +
                      '<div class="point p-ff p-t" style="height: 10px; left: 0; right: 0; top: 0;"></div>' +
                      '<div class="menu"></div></div>').hide();

      // attach to document.body
      wrapper.appendTo(document.body);

      // sanitize content
      content = $(content);

      // insert content
      wrapper.find('.menu').append(content);

      // set flag
      initialized = false;
   }

   /**
    * Expose ID
    * @type {string}
    */
   this.id = id;

   /**
    * Referred (clicked) element
    * @type {jQuery}
    */
   this.ref = false;

   /**
    * Expose content
    * @type {jQuery}
    */
   this.content = content;

   /**
    * Expose flag
    * @type {boolean}
    */
   this.initialized = initialized;

   /**
    * Show modal
    * @param {jQuery|HTMLElement} o
    */
   this.show = function (o) {
      var o      = $(o);
      var offset = o.offset();

      // set referenced button
      this.ref = o;

      // to be able to calculate dimension correctly, div content needs to be visible and NOT wrapped!
      wrapper.show().offset({ left: 0, top: 0 });

      // recalculate wrapper width and position
      var width = Math.max( wrapper.outerWidth(), o.outerWidth() ) - /* substract paddings and borders */ 22;
      var left  = offset.left;
      var top   = offset.top + o.outerHeight() + /* spaces */ 10;

      wrapper.css({ width: width }).offset({ left: left, top: top });
   };

   /**
    * Hide modal
    */
   this.hide = function () {
      wrapper.hide();
   };
};

/**
 * Create popup-type (lightbox) modal
 * @constructor
 * @param {string|HTMLElement|jQueryElement} content to be attached to popup
 */
Modal.Popup = function (content, id) {
   var wrapper, content, initialized;

   // generate unique id
   id = id || ('js-div-popup-' + (new Date).getTime());

   if ( $('#' + id).length ) {
      // get previously-create wrapper & content
      wrapper = $('#' + id).hide();
      content = wrapper.find('.js-modalbox-content').children();

      // set flag
      initialized = true;

   } else {
      // create wrapper
      wrapper = $('<div id="' + id + '" class="modalbox clear">' +
                  '<div style="display: table; position: absolute; width: 100%; height: 100%; left: 0; top: 0">' +
                  '<div class="js-modalbox-content" style="display: table-cell; vertical-align: middle">' +
                  '</div></div></div>').hide();

      // attach to document.body
      wrapper.appendTo(document.body);

      // sanitize content
      content = $(content);

      // insert content
      wrapper.find('.js-modalbox-content').append(content);

      // set flag
      initialized = false;
   }

   /**
    * Expose ID
    * @type string
    */
   this.id = id;

   /**
    * Expose content
    * @type jQueryElement
    */
   this.content = content;

   /**
    * Expose flag
    * @type boolean
    */
   this.initialized = initialized;

   /**
    * Show modal
    */
   this.show = function () {
      $(document.body).css('overflow', 'hidden');
      wrapper.show();
   };

   /**
    * Hide modal
    */
   this.hide = function () {
      wrapper.hide();

      var body = $(document.body);
      body.children('.modalbox:visible').length || body.css('overflow', '');
   };
};



/**
 * Error-modal singleton
 */
Modal.Error = new function () {

   /**
    * Error-modal ID
    * @const
    */
   var ID = 'js-div-popup-error';

   /**
    * Error-modal HTML content
    */
   var HTML = '<div id="' + ID + '" class="modalbox mod-confirm clear">' +
              '<div style="display: table; position: absolute; width: 100%; height: 100%; left: 0; top: 0">' +
              '<div style="display: table-cell; vertical-align: middle">' +
              '<div class="modalbox-dialog rnd5 sdw" style="width: 400px">' +
              '<a class="modalbox-cls js-div-popup-btn-close" href="javascript:"></a>' +
              '<div class="modalbox-cont">' +
              '<div class="freearea"><h2 class="title-big"><span style="color: #C00;">Peringatan</span></h2></div>' +
              '<div class="box-cont"><div class="box-cont hr"><div class="ic32 ic24-error lbl normal">' +
              '<p><span class="js-div-popup-message" style="display: table-cell; height: 25px; vertical-align: middle;"></span></p></div>' +
              '<div class="viewer desc js-div-popup-viewer" style="background-color: transparent;"></div></div>' +
              '<form class="ac" onsubmit="return false;"><button class="js-div-popup-btn-close">OK</button></form>' +
              '</div></div></div></div></div></div>';

   /**
    * Error-modal popup
    * @type jQueryElement
    */
   var wrapper;

   /**
    * Error-modal message title box
    * @type jQueryElement
    */
   var boxTitle;

   /**
    * Error-modal message description box
    * @type jQueryElement
    */
   var boxDescription;

   /**
    * Error-modal close button
    * @type jQueryElement
    */
   var btnClose;

   /**
    * Cache scope
    */
   var _this = this;

   /**
    * Error-modal initialization function
    * @type {Function|Boolean}
    */
   var initialize = function () {
      // this is a run-once function
      initialize = false;

      // create popup
      wrapper = $(HTML).hide().appendTo(document.body);

      // get elements
      boxTitle       = wrapper.find('.js-div-popup-message');
      boxDescription = wrapper.find('.js-div-popup-viewer');
      btnClose       = wrapper.find('.js-div-popup-btn-close');
   };

   /**
    * Default error message title
    * @public
    */
   this.defaultTitle = 'Terjadi kegagalan koneksi ke server SIAP Online.';

   /**
    * Default error message description (HTML)
    * @public
    */
   this.defaultDescription = ['<em>', '</em>'].join(
      'Silakan mengulangi kembali beberapa saat lagi.<br />' +
      'Bila masih terjadi kegagalan, Anda dapat meminta bantuan secara online ' +
      'ke layanan <a href="http://produk.siap-online.com/pesan-anda/">Bantuan Pengguna</a> SIAP.'
   );

   /**
    * Show error-modal
    * @public
    * @param {String} [title] - Error message title
    * @param {String} [description] - Error message description (HTML)
    * @param {Function} [callback] - Error callback to be called after popup closed by user
    */
   this.show = function (title, description, callback) {
      initialize && initialize();

      btnClose.unbind('click').click(function () {
         _this.hide();
         if (typeof callback == 'function')
            callback(true);
      });

      boxTitle.html('<strong>' + (title || this.defaultTitle) + '</strong>');

      if (typeof description == 'undefined')
         description = this.defaultDescription;

      description ? boxDescription.html(description).show()
                  : boxDescription.hide();

      $(document.body).css('overflow', 'hidden');
      wrapper.show();
   };

   /**
    * Hide error-modal
    */
   this.hide = function () {
      initialize && initialize();
      wrapper.hide();

      var body = $(document.body);
      body.children('.modalbox:visible').length || body.css('overflow', '');
   };
};



/**
 * Confirm-modal singleton
 */
Modal.Confirm = new function () {

   /**
    * Confirm-modal ID
    * @const
    */
   var ID = 'js-div-popup-confirm';

   /**
    * Confirm-modal HTML content
    */
   var HTML = '<div id="' + ID + '" class="modalbox mod-confirm clear">' +
              '<div style="display: table; position: absolute; width: 100%; height: 100%; left: 0; top: 0">' +
              '<div style="display: table-cell; vertical-align: middle">' +
              '<div class="modalbox-dialog rnd5 sdw" style="width: 400px">' +
              '<a class="modalbox-cls js-div-popup-btn-no" href="javascript:"></a>' +
              '<div class="modalbox-cont">' +
              '<div class="freearea"><h2 class="title-big">Konfirmasi</h2></div>' +
              '<div class="box-cont"><div class="box-cont hr"><div class="ic32 ic24-warn lbl normal">' +
              '<p><span class="js-div-popup-message" style="display: table-cell; height: 25px; vertical-align: middle;"></span></p></div>' +
              '<div class="viewer desc js-div-popup-viewer"></div></div>' +
              '<form class="ac" onsubmit="return false;">' +
              '<button class="js-div-popup-btn-yes">Ya</button> <button class="js-div-popup-btn-no">Tidak</button>' +
              '</form>' +
              '</div></div></div></div></div></div>';

   /**
    * Confirm-modal popup
    * @type jQueryElement
    */
   var wrapper;

   /**
    * Confirm-modal message title box
    * @type jQueryElement
    */
   var boxTitle;

   /**
    * Confirm-modal message description box
    * @type jQueryElement
    */
   var boxDescription;

   /**
    * Confirm-modal "Yes" button
    * @type jQueryElement
    */
   var btnYes;

   /**
    * Confirm-modal "No" button
    * @type jQueryElement
    */
   var btnNo;

   /**
    * Cache scope
    */
   var _this = this;

   /**
    * Confirm-modal initialization function
    * @type {Function|Boolean}
    */
   var initialize = function () {
      // this is a run-once function
      initialize = false;

      // create popup
      wrapper = $(HTML).hide().appendTo(document.body);

      // get elements
      boxTitle       = wrapper.find('.js-div-popup-message');
      boxDescription = wrapper.find('.js-div-popup-viewer');
      btnYes         = wrapper.find('.js-div-popup-btn-yes');
      btnNo          = wrapper.find('.js-div-popup-btn-no');
   };

   /**
    * Default confirm message title
    * @public
    */
   this.defaultTitle = 'Apakah anda yakin?';

   /**
    * Default confirm message description (HTML)
    * @public
    */
   this.defaultDescription = '';

   /**
    * Show confirm-modal
    * @public
    * @param {String} [title] - Confirm message title
    * @param {String} [description] - Confirm message description (HTML)
    * @param {Function} [callback] - Confirm callback to be called after popup closed by user
    */
   this.show = function (title, description, callback) {
      initialize && initialize();

      btnYes.unbind('click').click(function () {
         _this.hide();
         if (typeof callback == 'function')
            callback(true);
      });

      btnNo.unbind('click').click(function () {
         _this.hide();
         if (typeof callback == 'function')
            callback(false);
      });

      boxTitle.html('<strong>' + (title || this.defaultTitle) + '</strong>');

      description ? boxDescription.html(description).show()
                  : boxDescription.hide();

      $(document.body).css('overflow', 'hidden');
      wrapper.show();
   };

   /**
    * Hide confirm-modal
    */
   this.hide = function () {
      initialize && initialize();
      wrapper.hide();

      var body = $(document.body);
      body.children('.modalbox:visible').length || body.css('overflow', '');
   };
};



/**
 * Custom-modal singleton
 */
Modal.Custom = new function () {

   /**
    * Custom-modal ID
    * @const
    */
   var ID = 'js-div-popup-custom';

   /**
    * Custom-modal HTML content
    */
   var HTML = '<div id="' + ID + '" class="modalbox mod-confirm clear">' +
              '<div style="display: table; position: absolute; width: 100%; height: 100%; left: 0; top: 0">' +
              '<div style="display: table-cell; vertical-align: middle">' +
              '<div class="modalbox-dialog rnd5 sdw">' +
              '<a class="modalbox-cls js-div-popup-btn-close" href="javascript:"></a>' +
              '<div class="modalbox-cont">' +
              '<div class="freearea"><h2 class="title-big js-div-popup-header"></h2></div>' +
              '<div class="box-cont"><div class="box-cont hr"><div class="ic32 ic24-warn lbl normal js-div-popup-icon">' +
              '<p><span class="js-div-popup-message" style="display: table-cell; height: 25px; vertical-align: middle;"></span></p></div>' +
              '<div class="viewer desc js-div-popup-viewer" style="background-color: #FFF"></div></div>' +
              '<form class="ac" onsubmit="return false;"></form>' +
              '</div></div></div></div></div></div>';

   /**
    * Custom-modal popup
    * @type jQueryElement
    */
   var wrapper;

   /**
    * Custom-modal header/title
    * @type jQueryElement
    */
   var boxHeader;

   /**
    * Custom-modal message title box
    * @type jQueryElement
    */
   var boxTitle;

   /**
    * Custom-modal message description box
    * @type jQueryElement
    */
   var boxDescription;

   /**
    * Custom-modal close button
    * @type jQueryElement
    */
   var btnClose;

   /**
    * Custom-modal icon css
    * @type jQueryElement
    */
   var iconCss;

   /**
    * Custom-modal buttons container
    * @type jQueryElement
    */
   var buttonsCt;

   /**
    * Cache scope
    */
   var _this = this;

   /**
    * Custom-modal initialization function
    * @type {Function|Boolean}
    */
   var initialize = function () {
      // this is a run-once function
      initialize = false;

      // create popup
      wrapper = $(HTML).hide().appendTo(document.body);

      // get elements
      boxHeader      = wrapper.find('.js-div-popup-header');
      boxTitle       = wrapper.find('.js-div-popup-message');
      boxDescription = wrapper.find('.js-div-popup-viewer');
      btnClose       = wrapper.find('.js-div-popup-btn-close');
      iconCss        = wrapper.find('.js-div-popup-icon');
      buttonsCt      = wrapper.find('form');
   };

   /**
    * Default modal header/title
    * @public
    */
   this.defaultHeader = 'Informasi';

   /**
    * Default custom message title
    * @public
    */
   this.defaultTitle = '';

   /**
    * Default custom message description (HTML)
    * @public
    */
   this.defaultDescription = '';

   /**
    * Default modal header/title
    * @type Number
    * @public
    */
   this.defaultWidth = 400;

   /**
    * Show custom-modal
    * @public
    * @param {Object} [options]
    * @param {String} [options.header] - Modal header/title
    * @param {String} [options.iconCss] - Custom message icon css
    * @param {String} [options.title] - Custom message title
    * @param {String} [options.description] - Custom message description (HTML)
    * @param {Number} [options.width] - Custom width
    * @param {Array.<Object>} [options.buttons] - Button list
    * @param {String} [options.buttons.label] - Button's label
    * @param {Function} [options.buttons.callback] - Button's callback
    */
   this.show = function (options) {
      initialize && initialize();

      options = $.extend({}, options || {});

      btnClose.unbind('click').click(function () {
         _this.hide();
      });

      buttonsCt.hide().empty();
      $.each(options.buttons || [], function (i, item) {
         $('<button>' + item.label + '</button>')
            .appendTo(buttonsCt)
            .click(function () {
               _this.hide();
               if (typeof item.callback == 'function')
                  item.callback();
            });

         buttonsCt.show();
      });

      boxHeader.html(options.header || this.defaultHeader);
      boxTitle.html('<strong>' + (options.title || this.defaultTitle) + '</strong>');
      iconCss.removeAttr('class').addClass('ic32 lbl normal js-div-popup-icon ' + (options.iconCss || 'ic24-info'));

      options.description ? boxDescription.html(options.description).show()
                          : boxDescription.hide();

      // width
      wrapper.find('.modalbox-dialog').width(options.width || this.defaultWidth);

      $(document.body).css('overflow', 'hidden');
      wrapper.show();
   };

   /**
    * Hide custom-modal
    */
   this.hide = function () {
      initialize && initialize();
      wrapper.hide();

      var body = $(document.body);
      body.children('.modalbox:visible').length || body.css('overflow', '');
   };
};



/**
 * Create navigation (paging) modal
 * @constructor
 * @param {string|HTMLElement|jQueryElement} parent Navigation container
 * @param {Object} options Options/configurations to be applied to modal
 */
Modal.Navigation = function (parent, options) {
   // private properties
   var wrapper,
       limitButton,
       limitSelect,
       pagingButton,
       pagingSelect;

   // merge with default options
   options = $.extend({
      page          : 1,
      total         : 0,
      limit         : false,
      limitOptions  : {},
      modalPosition : 'bottom',
      callback      : function () {}
   }, options || {});

   // create container
   wrapper = $('<div class="nav-cont clear">' +
               '<div class="fr nav-group"><div class="nav"><a class="prev js-paging-nav" rel="-1"></a>' +
               '<a class="paging js-paging"></a><a class="next js-paging-nav" rel="1"></a></div></div>' +
               '<div class="fr nav clear"><a class="paging js-select js-select-limit"></a></div></div>');

   // append to parent dom
   wrapper.appendTo(parent);

   /**
    * Render limit options content
    */
   function renderLimitOptions () {
      var optionsIsAvailable = false;

      // check limit button
      limitButton || ( limitButton = wrapper.find('.js-select-limit') );

      // check limit options
      $.each(options.limitOptions, function (key, value) {
         optionsIsAvailable = true;
         return false;
      });

      // do only if limit options is available
      if (optionsIsAvailable) {
         limitButton.show();
         limitSelect = Xtml.Option(limitButton, options.modalPosition);
         limitSelect.populate(options.limitOptions, options.limit);
         limitSelect.change(function () {
            var page  = 1;
            var limit = limitButton[0].rel;

            options.page = page;
            options.limit = limit;
            options.callback(page, limit);
         });

      // else, hide limit button
      } else {
         limitButton.hide();
      }
   }

   /**
    * Render paging options content
    */
   function renderPagingOptions () {
      var maxPage;

      // check paging button
      pagingButton || ( pagingButton = wrapper.find('.js-paging') );

      // sanitize value
      options.page = Number(options.page) >= 1 ? Number(options.page) : 1;
      options.total = Number(options.total) >= 0 ? Number(options.total) : 0;
      options.limit = Number(options.limit) >= 1 ? Number(options.limit) : 1;

      // set maximum page number
      maxPage = Math.max(Math.ceil(options.total / options.limit), 1);

      // check page number
      options.page = Math.min(options.page, maxPage);

      // paging select
      pagingSelect = Xtml.PagingOption(pagingButton, options.modalPosition);
      pagingSelect.populate(maxPage, options.page);
      pagingSelect.change(function () {
         var page = pagingButton[0].rel;
         options.callback(page);
      });
   }

   // render options
   renderLimitOptions();
   renderPagingOptions();

   /**
    * Show modal
    */
   this.show = function () {
      wrapper.show();
   };

   /**
    * Hide modal
    */
   this.hide = function () {
      wrapper.hide();
   };

   /**
    * Redraw navigation
    * @param {Number} [page]
    * @param {Number} [total]
    * @param {Number} [limit]
    */
   this.redraw = function (page, total, limit) {
      // override value
      page && (options.page = page);
      total && (options.total = total);
      limit && (options.limit = limit);

      // re-render options
      renderLimitOptions();
      renderPagingOptions();
   };
};



/**
 * Create image thumbnail modal
 * @constructor
 * @param {Object} configs thumbnail configuration values
 * @param {String} [configs.id]
 * @param {String} [configs.imageLarge] image url address
 * @param {String} [configs.imageTitle] thumbnail title
 * @param {String} [configs.imageDesc] thumbnain image description
 * @param {Number} [configs.width] image width
 * @param {Number} [configs.height] image height
 */
Modal.Thumbnail = function (configs) {
   var wrapper;

   // sanitize configs
   configs = $.extend({
      id         : '',
      imageLarge : '',
      imageTitle : '',
      imageDesc  : '',
      width      : false,
      height     : false
   }, configs || {});

   // generate unique id
   configs.id = configs.id || ('js-div-thumbnail-' + (new Date).getTime());

   // get previously-created wrapper
   if ( $('#' + configs.id).length ) {
      wrapper = $('#' + configs.id).hide();

   // or create new wrapper
   } else {
      wrapper = $('<div id="' + configs.id + '" class="modalbox clear">' +
                  '<div style="display: table; position: absolute; top: 0; left: 0; width: 100%; height: 100%">' +
                  '<div class="js-modalbox-content" style="display: table-cell; vertical-align: middle">' +
                  '<div class="modalbox-dialog rnd5 sdw js-modalbox" style="display: table;">' +
                  '<a class="modalbox-cls js-modalbox-close" href="javascript:"></a>' +
                  '<div class="modalbox-cont">' +
                  '<div class="head-cat rnd5 rnd-t" style="min-height: 55px">' +
                  '<h2 class="fl">' + configs.imageTitle + '</h2>' +
                  '</div><div class="freearea ac clear">' +
                  '<img class="sdw scr-thumb" src="' + configs.imageLarge +
                  (configs.width ? '" width="' + configs.width : '') +
                  (configs.height ? '" height="' + configs.height : '') + '" />' +
                  '</div><div class="pointed-t" style="width: 120px"></div>' +
                  '<div class="box-cont"><div class="nav-cont rnd3"><div class="nav normal clear">' +
                  '<p>' + configs.imageDesc + '</p>' +
                  '</div></div></div></div></div></div></div></div>').hide();

      // attach to document.body
      wrapper.appendTo(document.body);

      // handle close button
      wrapper.find('.js-modalbox-close').click(function () {
         hide();
      });
   }

   /**
    * Hide modal
    */
   function hide() {
      wrapper.hide();

      var body = $(document.body);
      body.children('.modalbox:visible').length || body.css('overflow', '');
   }

   /**
    * Expose ID
    * @type string
    */
   this.id = configs.id;

   /**
    * Show modal
    */
   this.show = function () {
      $(document.body).css('overflow', 'hidden');
      wrapper.show();
   };

   /**
    * Expose hide function
    * @function
    */
   this.hide = hide;
};



/**
 * Image zoom
 */
$(document).on('click', '.js-zoom, .js-zoom img', function (e) {
   e.stopPropagation();

   var o     = $(this).closest('.js-zoom'),
       id    = 'js-div-zoom',
       modal = $('#' + id);

   // initialize zoom modal for first use
   if (!modal.length) {
      modal = $( '<div id="' + id + '" class="modalbox imgbox clear js-modalbox">' +
                 '<div style="display: table; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">' +
                 '<div style="display: table-cell; vertical-align: middle;">' +
                 '<div class="modalbox-dialog sdw" style="display: table; margin: 0 auto;">' +
                 '<img style="display: block;" />' +
                 '</div></div></div></div>' ).appendTo(document.body);

      modal.click(function () {
         $(this).closest('.modalbox').hide();

         var body = $(document.body);
         body.children('.modalbox:visible').length || body.css('overflow', '');
      });
   }

   // check source image
   var source = o.find('img');
   if (!source.length)
      return;

   // load image
   modal.find('img').attr('src', source.attr('src'));

   // show modal
   $(document.body).css('overflow', 'hidden');
   modal.show();
});

// close modal click event occurs outside modal dialog
$(document).ready(function () {
   $('html').mouseup(function (e) {
      if ( $(e.target).closest('.tips-modal').length == 0 )
         $('.tips-modal:visible').hide();
   });
});