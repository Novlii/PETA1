/*
 * Custom Html
 * Description: fancy replacement of native html element
 */
Xtml = {};

/*
 * Option
 */
Xtml.Option = function (select) {
   // select
   select = $(typeof select == 'string' ? '#' + select : select);
   select.hasClass('js-select') || select.addClass('js-select');

   // check options
   var widget = $(select).next('.js-options');
   if (!widget.length) {
      widget = $('<div class="tips-modal menu rnd3 js-options"><div class="point"></div><ul></ul></div>').insertAfter(select);
   }

   // onclick select
   select.unbind('click').click(function () {
      var select = $(this);
      var widget = select.next('.js-options');

      // hide if visible
      if (widget.is(':visible')) {
         widget.hide();

      // show if hidden
      } else {
         widget.show();
         widget.offset({ left: select.offset().left, top: select.offset().top + select.outerHeight() + 10 })
            .children('.point').css({ left: 0, width: select.innerWidth() });
      }
   });

   // onchange handler
   var onchange = function () {};

   return {
      populate: function (options, selected, extra) {
         var html = '';
         var val = false;

         if (extra) {
            if (extra instanceof Array) {
               html += '<li' + (extra[0] == selected ? ' class="on"' : '') +
                       '><a href="javascript:" rel="' + extra[0] + '">' + extra[1] + '</a></li>';
               if (extra[0] == selected) {
                  val = extra;
               }
            } else if (extra instanceof Object) {
               for (key in extra) {
                  html += '<li' + (key == selected ? ' class="on"' : '') +
                          '><a href="javascript:" rel="' + key + '">' + extra[key] + '</a></li>';
                  if (key == selected) {
                     val = [key, extra[key]];
                  }
                  break;
               }
            }
         }

         if (options instanceof Array) {
            for (var i = 0; i < options.length; i++) {
               html += '<li' + (options[i][0] == selected ? ' class="on"' : '') +
                       '><a href="javascript:" rel="' + options[i][0] + '">' + options[i][1] + '</a></li>';
               if (options[i][0] == selected) {
                  val = options[i];
               }
            }
         } else if (options instanceof Object) {
            for (key in options) {
               html += '<li' + (key == selected ? ' class="on"' : '') +
                       '><a href="javascript:" rel="' + key + '">' + options[key] + '</a></li>';
               if (key == selected) {
                  val = [key, options[key]];
               }
            }
         }

         select.empty()
               .attr('rel', val ? val[0] : '')
               .html(val ? '<span class="js-value">' + val[1] + '</span>'
                         : '<span class="js-value" style="width: 50px"></span>');

         widget.find('ul').empty()
               .html(html);

         // onclick widget
         widget.find('a').click(function () {
            var o = $(this);
            var li = o.closest('li');

            // currently selected
            if (li.hasClass('on'))
               return;

            var widget = o.closest('.js-options');
            var select = widget.prev('.js-select');

            // apply value
            widget.hide();
            select.empty()
                  .attr('rel', o.attr('rel'))
                  .html('<span class="js-value">' + o.html() + '</span>');
            li.addClass('on').siblings().removeClass('on');

            // execute onchange handler
            onchange.apply( select.get(0) );
         });
      },

      // onchange
      change: function (fn) {
         onchange = fn;
      }
   };
};

/**
 * PagingOption
 * @param {String|Element} button
 * @param {String} modalPosition
 * @return {Object}
 */
Xtml.PagingOption = function (button, modalPosition) {
   /**
    * Maximum visible pages
    * @const
    */
   var MAX_VISIBLE_PAGES = 40;

   /**
    * PagingOption modal
    * @type Element
    */
   var modal;

   /**
    * Options container
    * @type Element
    */
   var pagebox;

   /**
    * Options navigation
    * @type Element
    */
   var pagenav;

   /**
    * Maximum pages to be shown
    * @type Number
    */
   var maxPages = 0;

   /**
    * Maximum pagebox height (in pixels)
    * @type Number
    */
   var maxPageboxHeight;

   /**
    * Callback function after changing current page
    * @type Function
    */
   var callback = function () {};

   /**
    * Toggle PagingOption modal
    */
   function onToggleModal() {
      // hide if currently visible
      if (modal.is(':visible')) {
         modal.hide();

      // but, only show if maximum page > 1
      } else if (maxPages > 1) {
         resetScrollModal();

         // show
         modal.show();

         // top
         if (modalPosition == 'top') {
            modal.offset({
               left: button.offset().left + button.outerWidth() - modal.outerWidth(),
               top: button.offset().top - 10 - modal.outerHeight()
            });

            modal.children('.point').removeClass('p-t').addClass('p-b').css({
               bottom: 0,
               right: 0,
               top: '',
               width: button.outerWidth()
            });

            // BUGFIX modal position bug
            modal.offset({
               left: button.offset().left + button.outerWidth() - modal.outerWidth(),
               top: button.offset().top - 10 - modal.outerHeight()
            });

         // default
         } else {
            modal.offset({
               left: button.offset().left + button.outerWidth() - modal.outerWidth(),
               top: button.offset().top + button.outerHeight() + 10
            });

            modal.children('.point').removeClass('p-b').addClass('p-t').css({
               bottom: '',
               right: 0,
               top: 0,
               width: button.outerWidth()
            });
         }
      }
   };

   /**
    * Reset scroll to current page
    */
   function resetScrollModal() {
      var page      = pagebox.find('li.on').attr('rel'),
          marginTop = 0 - (Math.ceil(Number(page) / MAX_VISIBLE_PAGES) - 1) * maxPageboxHeight;

      pagebox.css('margin-top', marginTop);
   }

   /**
    * Scroll PagingOption modal up or down
    * @param {String} direction - Accepted value is "up" or "down"
    */
   function onScrollModal(direction) {
      var marginTop = parseInt( pagebox.css('margin-top') );

      // scroll up
      if (direction == 'up') {
         marginTop = Math.min(0, marginTop + maxPageboxHeight);
         pagebox.css('margin-top', marginTop);

      // scroll down
      } else if (direction == 'down') {
         marginTop = Math.max(0 - (Math.ceil(maxPages / MAX_VISIBLE_PAGES) - 1) * maxPageboxHeight,
                              marginTop - maxPageboxHeight);

         pagebox.css('margin-top', marginTop);
      }
   }

   /**
    * Change current page
    * @param {Number} page
    */
   function onPageChange(page) {
      // apply value
      button.empty()
            .attr('rel', page)
            .html('<span class="js-value">Hal ' + (page || 1) + ' dari ' + (maxPages || 1) + '</span>');

      // execute onchange handler
      callback.apply( button.get(0) );
   }

   // check modal
   modal = button.next('.js-options');

   if ( !modal.length ) {
      modal = $( '<div class="tips-modal rnd3 js-options"><div class="point"></div>' +
                 '<div class="tips-modal-cont"><div class="nav-pages"><div class="nav-no"></div></div>' +
                 '<div class="nav-pages-nav"><a class="act ic-p-u tips-ls" href="javascript:" rel="up"></a>' +
                 '<a class="act ic-p-d tips-ls" href="javascript:" rel="down"></a></div></div></div>' )
                 .insertAfter(button);
   }

   // set elements
   pagebox = modal.find('.nav-no');
   pagenav = modal.find('.nav-pages-nav');

   // set max pagebox height
   maxPageboxHeight = parseInt( modal.find('.nav-pages').css('max-height') );

   // sanitize paging button
   button = $(typeof button == 'string' ? '#' + button : button).addClass('js-paging');

   // bind click event on button
   button.unbind('click').click(onToggleModal);

   // bind click event on "prev" and "next" buttons
   button.siblings('.js-paging-nav').unbind('click').click(function () {
      // do nothing if maximum page < 2
      if (maxPages < 2) {
         return;
      }

      // get rel attributes
      var diff = Number($(this).attr('rel'));
      var page = Number(button.attr('rel')) + diff;

      // apply new page value if it's in range
      if (page >= 1 && page <= maxPages) {
         modal.hide();
         pagebox.find('li.on').removeClass('on');
         pagebox.find('li[rel=' + page + ']').addClass('on');
         onPageChange( page );
      }
   });

   // bind click event on modal
   pagebox.off('click', 'li').on('click', 'li', function () {
      var o = $(this);

      if (!o.hasClass('on')) {
         modal.hide();
         pagebox.find('li.on').removeClass('on');
         o.addClass('on');
         onPageChange( Number(o.attr('rel')) );
      }
   });

   // bind click event on scroll button
   pagenav.off('click', 'a').on('click', 'a', function () {
      onScrollModal(this.rel);
   });

   return {
      /**
       * Populate pages
       * @param {Number} _maxPages - Maximum pages to be shown
       * @param {Number} selected - Current page
       */
      populate: function (_maxPages, selected) {
         var html = '';
         var val = false;

         // update maximum pages
         maxPages = _maxPages;

         for (var i = 1; i <= maxPages; i++) {
            if (i > 10 && i % 10 == 1) {
               html += '</ul><ul>';
            }
            html += '<li rel="' + i + '"' + (i == selected ? ' class="on">' : '>') + i + '</li>';
            if (!val || i == selected) {
               val = i;
            }
         }

         button.empty()
               .attr('rel', val || '')
               .html('<span class="js-value">Hal ' + (val || 1) + ' dari ' + (maxPages || 1) + '</span>');

         pagebox.find('ul').remove();
         pagebox.append('<ul>' + html + '</ul>');

         maxPages <= MAX_VISIBLE_PAGES ? pagenav.hide() : pagenav.show();
         resetScrollModal();
      },

      /**
       * Update callback function
       * @param {Function} fn
       */
      change: function (fn) {
         if (typeof fn == 'function')
            callback = fn;
      }
   };
};

/*
 * Grouped option (act like select with optgroup)
 */
Xtml.GroupOption = function (select) {
   // select
   select = $(typeof select == 'string' ? '#' + select : select);
   select.hasClass('js-select') || select.addClass('js-select');

   // check options
   var widget = $(select).next('.js-options');
   if (!widget.length) {
      widget = $('<div class="tips-modal menu rnd3 js-options"><div class="point"></div><ul></ul></div>').insertAfter(select);
   }

   // onclick select
   select.unbind('click').click(function () {
      var select = $(this);
      var widget = select.next('.js-options');

      // marked
      if ( widget.hasClass('js-rendered') ) {
         widget.is(':visible') ? widget.hide() : widget.show();

      // never shown
      } else {
         widget.offset({ left: select.position().left, top: '25px' })
            .children('.point').css({ left: 0, width: select.innerWidth() });
         widget.addClass('js-rendered').show();
      }
   });

   // onchange handler
   var onchange = function () {};

   return {
      // group option cannot use extra option, at least not yet
      populate: function (optgroups, selected, extra) {
         var html = '';
         var val = false;

         for (label in optgroups) {
            html += '<ul><li><h4>'+label+'</h4><ul>';
            if (optgroups[label] instanceof Array) {
               for (var i=0; i<optgroups[label].length; i++) {
                  html += '<li' + (optgroups[label][i][0] == selected ? ' class="on"' : '') +
                          '><a href="javascript:" rel="' + optgroups[label][i][0] + '">' + optgroups[label][i][1] + '</a></li>';
                  if (optgroups[label][i][0] == selected) {
                     val = optgroups[label][i];
                  }
               }
            } else if (optgroups[label] instanceof Object) {
               for (key in optgroups[label]) {
                  html += '<li' + (key == selected ? ' class="on"' : '') +
                          '><a href="javascript:" rel="' + key + '">' + optgroups[label][key] + '</a></li>';
                  if (key == selected) {
                     val = [key, optgroups[label][key]];
                  }
               }
            }
            html += '</ul></li></ul>';
         }

         select.empty()
               .attr('rel', val ? val[0] : '')
               .html(val ? '<span class="js-value">' + val[1] + '</span>'
                         : '<span class="js-value" style="width: 50px"></span>');

         widget.find('ul').remove();
         widget.append(html);

         // onclick widget
         widget.find('a').click(function () {
            var o = $(this);
            var li = o.closest('li');

            // currently selected
            if (li.hasClass('on'))
               return;

            var widget = o.closest('.js-options');
            var select = widget.prev('.js-select');

            // apply value
            widget.hide();
            select.empty()
                  .attr('rel', o.attr('rel'))
                  .html('<span class="js-value">' + o.html() + '</span>');
            widget.find('li.on').removeClass('on');
            li.addClass('on');

            // execute onchange handler
            onchange.apply( select.get(0) );
         });
      },

      // onchange
      change: function (fn) {
         onchange = fn;
      }
   };
};