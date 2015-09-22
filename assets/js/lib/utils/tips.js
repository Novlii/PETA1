var Tips = {
   // parse unparsed tooltips
   scan: function () {
      var div     = $('#js-div-tips'),
          timer   = false,
          timeout = 4000;

      // check div availability
      if (!div.length) {
         div = $( '<div id="js-div-tips" class="tips-msg rnd5 sdw" style="display: none;">' +
                  '<div class="msg"></div></div>' )
                  .appendTo(document.body)

                  // autohide on leave (when showing sticky tips)
                  .mouseleave(function () {
                     clearTimeout(timer);
                     div.hide();
                  });
      }

      // search unparsed tooltips
      $('.tips, .tips-ls, .tips-rs, .tips-m').not(div).each(function () {
         var o = $(this),
             title  = o.attr('title'),
             sticky = o.hasClass('tips-on'),
             klass  = o.hasClass('tips-ls') ? 'tips-ls' :
                      o.hasClass('tips-rs') ? 'tips-rs' :
                      o.hasClass('tips-m') ? 'tips-m' : 'tips-m';

         if (o.children('.tips-msg').length) {
            title = o.children('.tips-msg').eq(0).html();
            o.children('.tips-msg').remove();
         }

         o.removeAttr('title');
         o.removeClass('tips tips-ls tips-rs tips-m tips-on');

         o.hover(function () {
            if (!title)
               return;

            // disable autohide first
            clearTimeout(timer);

            // to be able to calculate dimension correctly, div content needs to be visible and NOT wrapped!
            div.find('.msg').html(title);
            div.show()
               .removeClass('tips-ls tips-rs tips-m tips-r')
               .offset({ left: 0, top: 0 });

            var offset        = o.offset(),
                viewportWidth = $(window).width(),
                divClass      = klass,
                divWidth      = div.outerWidth(),
                divHeight     = div.outerHeight(),
                divLeft,
                divTop;

            if (klass == 'tips-ls') {
               divLeft = Math.floor(offset.left - divWidth - 12);
               divTop  = Math.floor(offset.top - divHeight / 2 + o.outerHeight() / 2);

            } else if (klass == 'tips-rs') {
               divLeft = Math.floor(offset.left + o.outerWidth() + 12);
               divTop  = Math.floor(offset.top - divHeight / 2 + o.outerHeight() / 2);

            } else if (klass == 'tips-m') {
               divLeft = Math.floor(offset.left - divWidth / 2 + o.outerWidth() / 2);
               divTop  = Math.floor(offset.top + o.outerHeight() + 12);

               // check position againts viewport
               if (offset.left + divWidth >= viewportWidth) {
                  divClass = 'tips-r';
                  divLeft  = Math.floor(offset.left - divWidth + 23 + o.outerWidth() / 2);
               }
            }

            div.addClass(divClass)
               .offset({ left: divLeft, top: divTop });

            // set autohide
            timer = setTimeout(function () {
               div.hide();
            }, timeout);

         }, function () {
            if (!sticky) {
               clearTimeout(timer);
               div.hide();
            }
         });
      });
   },

   // hide tips if visible
   hide: function () {
      $('#js-div-tips').hide();
   }
};


/*
 * Modal Tips class
 */
Tips.Modal = function (options) {
   // merge with default options
   options = $.extend({
      id: 'js-div-modal-' + Math.ceil(Math.random() * 1000),
      content: ''
   }, options || {});

   // create modal tips
   var div = $( '<div' + (options.id ? ' id="' + options.id + '"' : '') +
                ' class="tips-modal rnd3" style="display: none;">' +
                '<div class="point" style="height: 9px; left: 10px; top: -9px; width: 16px;"></div>' +
                '<div class="menu"></div></div>' );

   // append to document tree
   div.appendTo(document.body);

   // add content
   div.find('.menu').append(options.content);

   // referred element
   var ref;

   // public methods
   this.show = function (o) {
      var o = $(o),
          offset = o.offset(),
          left = Math.floor(offset.left - 19 + o.outerWidth() / 2),
          top = Math.floor(offset.top + o.outerHeight() + 12);

      div.show().offset({ left: left, top: top });
      ref = o;
   };

   this.hide = function () {
      div.hide();
   };

   this.getRef = function () {
      return ref;
   };
};


/**
 * Paging and limit navigation bar
 */
Tips.Navigation = function (parent, options) {
   // merge with default options
   options = $.extend({
      id: 'js-div-navigation-' + Math.ceil(Math.random() * 1000),
      limit: 5,
      page: 1,
      total: 1,
      limitOption: {},
      callback: function () {},
   }, options || {});

   var page  = options.page,
       total = options.total,
       limit = options.limit,
       pages = Math.ceil(total / limit),
       limitOption = options.limitOption,
       limitButton, limitSelect,
       pageButton, pageSelect;

   // TODO: toooo much page number -_-
   pages = Math.min(50, pages);
   page  = Math.min(page, pages);

   var div = $( '<div class="nav-cont rnd5 clear">' +
                '<div class="fr nav-group"><div class="nav"><a class="prev js-paging-nav" rel="-1"></a>' +
                '<a class="paging js-paging"></a><a class="next js-paging-nav" rel="1"></a></div></div>' +
                '<div class="fr nav clear"><a class="paging js-select js-select-limit"></a></div></div>' );

   // append to document tree
   div.appendTo(parent);

   // limit options
   if (limitOption) {
      limitButton = div.find('.js-select-limit').show();
      limitSelect = Xtml.Option(limitButton);
      limit || $.each(limitOption, function (key, value) {
         limit = key;
         return false;
      });
      limitSelect.populate(limitOption, limit);
      limitSelect.change(function () {
         options.callback(limitButton[0].rel, 1);
      });

   // no limit options
   } else  {
      limitButton = div.find('.js-select-limit').hide();
   }

   // paging
   pageButton = div.find('.js-paging');
   pageSelect = Xtml.PagingOption(pageButton);
   pageSelect.populate(pages, page);
   pageSelect.change(function () {
      options.callback(limitButton[0].rel, pageButton[0].rel);
   });

   // public methods
   this.show = function (o) {
      div.show();
   };

   this.hide = function () {
      div.hide();
   };

   this.refresh = function (_limit, _total, redraw, page) {
      if (redraw || _limit != limit) {
         limit = _limit;
         total = _total || 0;
         pages = Math.ceil(total / Number(limit));
         page  = Number(page) || 1;

         // update page
         pageButton[0].rel = page;
         pageSelect.populate(pages, page);
      }
   };
};