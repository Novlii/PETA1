Html = {};

/*
 * Html.Option
 */
Html.Option = function (select) {
   if (typeof select == 'string')
      select = document.getElementById(select);

   return {
      populate: function (options, selected, extra) {
         var html = '';

         if (extra) {
            if (extra instanceof Array) {
               html += '<option value="' + extra[0] + '">' + extra[1] + '</option>';
            } else if (extra instanceof Object) {
               for (key in extra) {
                  html += '<option value="' + key + '">' + extra[key] + '</option>';
                  break;
               }
            }
         }

         if (options instanceof Array) {
            for (var i=0; i<options.length; i++) {
               html += '<option value="' + options[i][0] +
                       (options[i][0] == selected ? '" selected="selected">' : '">') +
                       options[i][1] + '</option>';
            }
         } else if (options instanceof Object) {
            for (key in options) {
               html += '<option value="' + key +
                       (key == selected ? '" selected="selected">' : '">') +
                       options[key] + '</option>';
            }
         }

         select.innerHTML = html;
      }
   };
};

/*
 * Cascade Options (require Html.Option and *unfortunately* jQuery)
 * TODO: config.limits still not working
 */
Html.CascadeOptions = function (config) {
   var cache = {};

   config = $.extend({
      selects:          [],
      options:          [],
      optionsFormatter: [],
      limits:           [],
      initials:         [],
      extras:           [],
      callbacks:        []
   }, config || {});

   function initialize() {
      $.each(config.selects, function (i, item) {
         config.selects[i] = $(item).change(function () {
            var chain = true;

            if (typeof config.callbacks[i] == 'function') {
               chain = !!config.callbacks[i](this.value);
            }

            config.selects[i + 1] && chain && populate(i + 1, this.value);
         });
      });

      populate(0);
   }

   function populate(i, parentValue) {
      parentValue = parentValue || '';

      if (typeof config.options[i] == 'string') {
         var url = config.options[i].replace('{value}', parentValue);

         if (!cache[url]) {
            $.ajax({
               url: url,
               dataType: 'json',
               success: function (json) {
                  if (typeof config.optionsFormatter[i] == 'function') {
                     cache[url] = config.optionsFormatter[i](json);
                  } else {
                     cache[url] = json;
                  }

                  Html.Option(config.selects[i][0]).populate(
                     cache[url],
                     config.initials[i],
                     config.extras[i]
                  );

                  config.initials[i] && (config.initials[i] = false);

                  config.selects[i + 1] && populate(i + 1, config.selects[i].val());
               }
            });

         } else {
            Html.Option(config.selects[i][0]).populate(
               cache[url],
               config.initials[i],
               config.extras[i]
            );

            config.initials[i] && (config.initials[i] = false);

            config.selects[i + 1] && populate(i + 1, config.selects[i].val());
         }

      } else {
         Html.Option(config.selects[i][0]).populate(
            i ? config.options[i][parentValue] : config.options[i],
            config.initials[i],
            config.extras[i]
         );

         config.initials[i] && (config.initials[i] = false);

         config.selects[i + 1] && populate(i + 1, config.selects[i].val());
      }
   }

   initialize();
};

/*
 * Image loader
 */
Html.Image = function (img, src, defsrc) {
   if (typeof img == 'string')
      img = document.getElementById(img);

   return {
      // check image and load it if available, or (optionally) use default image if unavailable
      load: function (src, defsrc) {
         if (src) {
            var tmp = new Image();
            tmp.onload = function () {
               img.src = tmp.src;
            };
            if (defsrc) tmp.onerror = function () {
               img.src = defsrc;
            };
            tmp.src = src;
         } else if (defsrc) {
            img.src = defsrc;
         }
      },

      // prefech (typically large) image
      prefetch: function (src) {
         var tmp = new Image();
         tmp.src = src;
      }
   };
};
