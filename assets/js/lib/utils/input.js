/**
 * @fileoverview SIAP PPDB input fields.
 * @author rudy@jayantara.co.id (Rudy Susanto)
 */

/**
 * @namespace
 */
Input = {};

/**
 * Create single input
 * @param {Object}   configs
 * @param {String}   configs.type
 * @param {String}   configs.name
 * @param {String}   [configs.value]
 * @param {Number}   [configs.length]
 * @param {Number}   [configs.min]
 * @param {Number}   [configs.max]
 * @param {Object}   [configs.options]
 * @return jQuery
 */
Input.create = function (configs) {
   var input;

   // string input
   if (configs.type == 'string') {
      // normalize configs
      configs.value  = configs.value || typeof configs.value == 'number' ? String(configs.value) : '';
      configs.length = Number(configs.length) || false;

      // check length
      if (configs.length && configs.value.length > configs.length)
         configs.value = configs.value.substr(0, configs.length);

      // use textarea for long string
      if (configs.length >= 100) {
         input = $('<textarea name="' + configs.name + '" rows="2">' + configs.value + '</textarea>')
         // apply maxlength
         .blur(function () { $(this).keyup() })
         .keyup(function () {
            if (this.value.length > configs.length) {
               this.value = this.value.substr(0, configs.length);
            }
         });

      // use input[text] for short string
      } else {
         input = $('<input type="text" name="' + configs.name + '" value="' + configs.value + '" />');
         // apply maxlength
         configs.length && input.attr('maxlength', configs.length);
      }

   // integer input
   } else if (configs.type == 'int') {
      // normalize configs
      configs.value = configs.value || typeof configs.value == 'number' ? String(configs.value) : '';
      configs.min   = Number(configs.min);
      configs.max   = Number(configs.max);

      // create input
      input = $('<input type="text" name="' + configs.name + '" value="' + configs.value + '" style="width: 100px;" />')
      // attach keyup event handler
      .keyup(function () {
         var max = false;

         if (this.value) {
            // sanitize to integer
            var val = Number( this.value.replace(/[^\d]/g, '') ).toString();
            // apply value constraint
            if (val) {
               // apply style for max boundaries
               if (configs.max && val >= configs.max) {
                  val = '';
                  max = true;
               }
            }
            // replace value if different
            if (this.value !== val)
               this.value = val;
         }

         // is max
         $(this).css('border-color', max ? 'red' : '');
      })
      // attach blur event handler
      .blur(function () {
         var max = false;

         if (this.value) {
            // sanitize to integer
            var val = Number( this.value.replace(/[^\d]/g, '') ).toString();
            // apply value constraint
            if (val) {
               // apply style for max boundaries
               if (configs.max && val >= configs.max) {
                  val = '';
                  max = true;
               }
               // apply style for min boundaries
               if (configs.min && val <= configs.min) {
                  val = configs.min.toString()
               }
            }
            // replace value if different
            if (this.value !== val)
               this.value = val;
         }

         // is max
         $(this).css('border-color', max ? 'red' : '');
      })
      // trigger blur event to check initial value
      .blur();

   // decimal input
   } else if (configs.type == 'number' || configs.type == 'float') {
      // normalize configs
      configs.value = configs.value || typeof configs.value == 'number' ? String(configs.value) : '';
      configs.min   = Number(configs.min);
      configs.max   = Number(configs.max);

      // create input
      input = $('<input type="text" name="' + configs.name + '" value="' + configs.value + '" />')
      // attach keyup event handler
      .keyup(function () {
         var max = false, min = false;

         if (this.value) {
            // sanitize to decimal
            var val = this.value.replace(/,/g, '.')
                                .replace(/[^\d\.]/g, '')
                                .replace(/^\./, '0.')
                                .replace(/^(\d+(\.\d*)?).*$/, '$1');
            // apply value constraint
            if (val) {
               // apply style for max boundaries
               if (configs.max && val > configs.max) {
                  // val = '';
                  max = true;
               }
               // apply style for min boundaries
               if (configs.min && val < configs.min) {
                  min = true;
               }
            }

            // // replace value if different
            // if (this.value !== val)
               // this.value = val;
         }

         // is max
         var msg = max ? 'Nilai Lebih dari batas nilai maksimum ' + configs.max
                       : min ? 'Nilai kurang dari batas nilai minimum ' + configs.min : '';
         $(this).css('border-color', max ? 'red' : min ? 'red' : '').attr('title', msg);
      })
      // attach blur event handler
      .blur(function () {
         var max = false, min = false;

         if (this.value) {
            // sanitize to decimal
            var val = Number(this.value).toString();
            // apply value constraint
            if (val) {
               // apply style for max boundaries
               if (configs.max && val >= configs.max) {
                  val = '';
                  max = true;
               }
               // apply style for min boundaries
               if (configs.min && val <= configs.min) {
                  val = configs.min.toString()
               }
            }
            // replace value if different
            // if (this.value !== val)
               // this.value = val;
         }

         // is max
         // $(this).css('border-color', max ? 'red' : '');
      })
      // trigger blur event to check initial value
      .blur();

   // date input
   } else if (configs.type == 'date') {
      // create date input
      var dd = $('<select name="' + configs.name.replace(/(\]?)$/, '_dd$1') + '" style="width: 66px;" />');
      var mm = $('<select name="' + configs.name.replace(/(\]?)$/, '_mm$1') + '" style="width: 66px;" />');
      var yy = $('<select name="' + configs.name.replace(/(\]?)$/, '_yy$1') + '" style="width: 116px;" />');

      // split date
      configs.value = String(configs.value).split('-')
      configs.min   = String(configs.min).split('-');
      configs.max   = String(configs.max).split('-');

      // normalize configs
      configs.value = configs.value.length == 3 && configs.value || '';
      configs.max   = configs.max.length == 3 && Number(configs.max[0])
                    ? configs.max : [(new Date).getFullYear(), 1, 1];
      configs.min   = configs.min.length == 3 && Number(configs.min[0])
                    ? configs.min : [(new Date).getFullYear() - 30, 1, 1];

      // map month string
      var mmMap = ',Jan,Feb,Mar,Apr,Mei,Jun,Jul,Agu,Sep,Okt,Nov,Des'.split(',');

      // populate date
      dd.append('<option value="">-</option>');
      for (var i = 1, ipad; i <= 31; i++) {
         ipad = i < 10 ? '0' + i : i;
         dd.append('<option value="' + ipad + '"' + (i == configs.value[2] ? ' selected="selected">' : '>') +
            ipad + '</option>');
      }
      // populate month
      mm.append('<option value="">-</option>');
      for (var i = 1, ipad; i <= 12; i++) {
         ipad = i < 10 ? '0' + i : i;
         mm.append('<option value="' + ipad + '"' + (i == configs.value[1] ? ' selected="selected">' : '>') +
            mmMap[i] + '</option>');
      }
      // populate year
      yy.append('<option value="">-</option>');
      for (var i = Number(configs.max[0]); i >= Number(configs.min[0]); i--) {
         yy.append('<option value="' + i + '"' + (i == configs.value[0] ? ' selected="selected">' : '>') +
            i + '</option>');
      }

      // wrap date input
      input = $('<div />');
      input.append(dd).append('&nbsp;')
           .append(mm).append('&nbsp;')
           .append(yy).append('&nbsp;');

      // attach change event handler
      input.on('change', 'select', function () {
         // date values
         var d = Number(dd.val());
         var m = Number(mm.val());
         var y = Number(yy.val());
         // check values
         if ( m == 2 && y % 4 == 0 && d > 29 ) {
            dd.val('29');
         } else if ( m == 2 && y % 4 != 0 && d > 28 ) {
            dd.val('28');
         } else if ( ( m == 4 || m == 6 || m == 9 || m == 11 ) && d > 30 ) {
            dd.val('30');
         }
         // check constraint
         var val = new Date(yy.val() + '-' + mm.val() + '-' + dd.val());
         var min = new Date(configs.min.join('-'));
         var max = new Date(configs.max.join('-'));
         if (min && val.getTime() < min.getTime()) {
            dd.val(configs.min[2]);
            mm.val(configs.min[1]);
            yy.val(configs.min[0]);
         } else if (max && val.getTime() > max.getTime()) {
            dd.val(configs.max[2]);
            mm.val(configs.max[1]);
            yy.val(configs.max[0]);
         }
      });

      // trigger change event to check initial value
      dd.change();

   // enumeration input
   } else if (configs.type == 'enum') {
      // create input
      input = $('<select name="' + configs.name + '" />');
      // populate options
      $.each(configs.options || [], function (key, value) {
         input.append('<option value="' + key + '"' + (key == configs.value ? ' selected="selected"' : '') +
                      '>' + value + '</option>');
      });
   }

   return input;
};

/**
 * Populate input group for info to a <div> element.
 * @param {jQuery} div
 * @param {Array.<Object.<string, *>>} params
 */
Input.populateInfoGroup = function (div, params) {
   // container
   var table = $('<table class="tbl-form full vt" />');
   // flag
   var cascadeFlag = false;
   // iterate nilai items
   $.each(params, function (i, item) {
      var tr, input, cascade1, value1, cascade2, value2;

      // exception: cascade select
      if (item.key == 'k_propinsi' || item.key == 'k_kota') {
         if (!cascadeFlag) {
            // create element
            cascade1 = $('<select name="info[k_propinsi]" style="width: 97%;" />');
            cascade2 = $('<select name="info[k_kota]" style="width: 97%;" />');
            // get value
            $.each(params, function () {
               if (this.key == 'k_propinsi')
                  value1 = this.value;
               else if (this.key == 'k_kota')
                  value2 = this.value;
            });
            // populate cascade
            Html.CascadeOptions({
               selects  : [ cascade1, cascade2 ],
               options  : [ Master.get('propinsi'), Master.get('kota') ],
               extras   : [ ['', '-'], ['', '-'] ],
               initials : [ value1 || false, value2 || false ]
            });
            // append to table
            tr = $('<tr><td><div class="half fl"><label class="req">Provinsi</label><br></div>' +
               '<div class="half fl"><label class="req">Kota / Kabupaten</label><br></div></td></tr>');
            tr.find('div').eq(0).append(cascade1);
            tr.find('div').eq(1).append(cascade2);
            table.append(tr);
            // update flag
            cascadeFlag = true;
         }

      // normal input
      } else {
         tr = $('<tr><td><div><label' + (item.required ? ' class="req">' : '>') +
            item.label + '</label><br></div></td></tr>');
         input = Input.create({
            type    : item.type,
            name    : 'info[' + item.key + ']',
            value   : item.value,
            length  : item.length,
            min     : item.min,
            max     : item.max,
            options : item.opsi
         });

         input.css('width',
            item.type == 'enum' ? '98.5%' :
            item.type != 'date' ? '95%' : '');

         tr.find('div').append(input);
         table.append(tr);
      }
   });

   // append container to the <div>
   if (params && params.length) {
      div.append('<h3 class="section-title hr" style="margin: 0;">Data Tambahan</h3>' +
         '<div class="box-cont section"></div>');
      div.find('div').append(table);
   }
};

/**
 * Get input group values for info.
 * @param {Element}  div
 * @param {Object}   params
 * @return {Object}
 */
Input.getInfoGroupValues = function (div, params) {
   // values
   var values = {};
   // flag
   var cascadeFlag = false;

   // iterate nilai items
   $.each(params, function (i, item) {
      // exception: cascade select
      if (item.key == 'k_propinsi' || item.key == 'k_kota') {
         if (!cascadeFlag) {
            // get values
            values['info[k_propinsi]'] = div.find('[name="info[k_propinsi]"]').val();
            values['info[k_kota]']     = div.find('[name="info[k_kota]"]').val();
            // update flag
            cascadeFlag = true;
         }

      // date input
      } else if (item.type == 'date') {
         values['info[' + item.key + ']'] =
            div.find('[name="info[' + item.key.replace(/(\]?)$/, '_yy$1') + ']"]').val() + '-' +
            div.find('[name="info[' + item.key.replace(/(\]?)$/, '_mm$1') + ']"]').val() + '-' +
            div.find('[name="info[' + item.key.replace(/(\]?)$/, '_dd$1') + ']"]').val();

      // normal input
      } else  {
         values['info[' + item.key + ']'] = div.find('[name="info[' + item.key + ']"]').val();
      }
   });

   return values;
};

/**
 * Print input group confirmation for info
 * @param {Element}  source
 * @param {Element}  conf
 * @param {Object}   params
 */
Input.printInfoGroupConf = function (source, conf, params) {
   // html collector
   var html = '<ul class="direktori-tbl stat-format section">' +
              '<li class="caption"><span>Data Tambahan</span></li>';

   // flag
   var cascadeFlag = false;
   // iterate nilai items
   $.each(params, function (i, item) {
      var value;

      // exception: cascade select
      if (item.key == 'k_propinsi' || item.key == 'k_kota') {
         if (!cascadeFlag) {
            // update flag
            cascadeFlag = true;

            // append html
            html += '<li><span style="width: 150px;">Kota / Kabupaten</span><span style="width: 340px;">' +
                    source.find('[name="info[k_kota]"]').find('option:selected').text() + ', Provinsi ' +
                    source.find('[name="info[k_propinsi]"]').find('option:selected').text() + '</span></li>';
            // update flag
            cascadeFlag = true;
         }

      } else {
         // date input
         if (item.type == 'date') {
            value = source.find('[name="info[' + item.key.replace(/(\]?)$/, '_yy$1') + ']"] :selected').text() + ' ' +
                    source.find('[name="info[' + item.key.replace(/(\]?)$/, '_mm$1') + ']"] :selected').text() + ' ' +
                    source.find('[name="info[' + item.key.replace(/(\]?)$/, '_dd$1') + ']"] :selected').text();
         // enumeration input
         } else if (item.type == 'enum') {
            value = source.find('[name="info[' + item.key + ']"]').find(':selected').text();
         // normal input
         } else {
            value = source.find('[name="info[' + item.key + ']"]').val();
         }

         // append html
         html += '<li><span style="width: 150px;">' + item.label + '</span><span style="width: 340px;">' +
                 value + '</span></li>';
      }
   });

   // close html
   html += '</ul>';

   // append html to div
   if (params && params.length) {
      conf.append(html);
   }
};

/**
 * Populate rapor group for info to a <div> element.
 * @param {jQuery} div
 * @param {Array.<Object.<string, *>>} params
 */
Input.populateRaporGroup = function (div, params) {
   // container
   var table = $('<table class="tbl-data full section"><thead></thead><tbody></tbody></table>');
   var thead = table.find('thead');
   var tbody = table.find('thead');
   // tr
   var tr;

   // iterate headers
   tr = $('<tr/>').append('<th width="75">Periode</th>');
   $.each(params.pelajaran || [], function (i, pelajaran) {
      pelajaran.type != 'sum' && tr.append('<th>' + pelajaran.label + '</th>');
   });
   thead.append(tr);

   // iterate items
   var counter = 0;
   $.each(params.periode || [], function (i, periode) {
      if (periode.type != 'sum') {
         tr = $('<tr/>').append('<td>' + periode.nama + '</td>');
         $.each(params.pelajaran || [], function (j, pelajaran) {
            if (pelajaran.type != 'sum') {
               var input = Input.create({
                  type  : 'float',
                  name  : 'rapor[' + i + '][' + j + ']',
                  value : params.data && params.data[i] && params.data[i][j],
                  min   : pelajaran.min,
                  max   : pelajaran.max
               });
               var td = $('<td/>').append(input);
               tr.append(td);
            }
         });
         tbody.append(tr);
         counter++;
      }
   });

   // append container to the <div>
   if (counter) {
      div.append('<h3 class="section-title hr" style="margin: 0;">Nilai Rapor</h3>' +
         '<div class="box-cont"></div>');
      div.find('div').append(table);
   }
};

/**
 * Get input group values for rapor.
 * @param {Element}  div
 * @param {Object}   params
 * @return {Object}
 */
Input.getRaporGroupValues = function (div, params) {
   // values
   var values = {};

   // iterate through params
   $.each(params.periode || [], function (i, periode) {
      if (periode.type != 'sum') {
         $.each(params.pelajaran || [], function (j, pelajaran) {
            if (pelajaran.type != 'sum') {
               values['rapor[' + i + '][' + j + ']'] = div.find('[name="rapor[' + i + '][' + j + ']"]').val();
            }
         });
      }
   });

   return values;
};

/**
 * Print input group confirmation for rapor
 * @param {Element}  source
 * @param {Element}  conf
 * @param {Object}   params
 */
Input.printRaporGroupConf = function (source, conf, params) {
   // html collector
   var html = '<ul class="direktori-tbl stat-format section full" style="display: table;">' +
              '<li class="caption full"><span>Nilai Rapor</span></li>';

   // iterate nilai headers
   html += '<li class="full"><span style="width: 150px;"><b>Periode</b></span>';
   $.each(params.pelajaran || [], function (i, pelajaran) {
      if (pelajaran.type != 'sum')
         html += '<span><b>' + pelajaran.label + '</b></span>';
   });
   html += '</li>';

   // iterate items
   var counter = 0;
   $.each(params.periode || [], function (i, periode) {
      if (periode.type != 'sum') {
         html += '<li class="full"><span>' + periode.nama + '</span>';
         $.each(params.pelajaran || [], function (j, pelajaran) {
            if (pelajaran.type != 'sum') {
               html += '<span>' + source.find('[name="rapor[' + i + '][' + j + ']"]').val() + '</span>';
            }
         });
         html += '</li>';
         counter++;
      }
   });

   // close html
   html += '</ul>';

   // append html to div
   if (counter)
      conf.append(html);
};

/**
 * Populate input group for nilai.
 * @param {jQuery} div
 * @param {Object.<string.Array.<Object.<string, *>>>} params
 * @param {Object.<string.Array.<Object.<string, *>>>} readonlyParams
 */
Input.populateNilaiGroup = function (div, params, readonlyParams) {
   var isEmpty = true;

   // iterate through params
   $.each(params || [], function (label, list) {
      // container
      var table = $('<table class="tbl-form full vt" />');
      // slot
      var slot = [[], []];
      // iterate nilai items
      $.each(list, function (i, item) {
         var div = $('<div class="half fl"><label>' + item[1].nama + '</label><br></div>');
         var input = Input.create({
            type    : item[1].type,
            name    : 'nilai[' + item[0] + ']',
            value   : item[2],
            length  : item[1].length,
            min     : item[1].min,
            max     : item[1].max,
            options : item[1].opsi
         });

         input.css('width',
            item[1].type == 'enum' ? '97%' :
            item[1].type != 'date' ? '89%' : '');

         div.append(input);
         slot[i % 2].push(div);

         isEmpty = false;
      });

      for (var i = 0, tr; i < slot[0].length; i++) {
         tr = $('<tr><td></td></tr>');
         tr.find('td').append( slot[0][i] );
         tr.find('td').append( slot[1][i] || '' );
         table.append(tr);
      }

      // append container to the <div>
      div.append('<h3 class="section-title hr" style="margin: 0;">' + label + '</h3>' +
         '<div class="box-cont section"></div>');
      div.find('div').append(table);
   });

   if (isEmpty) $.each(readonlyParams || [], function (label, list) {
      // container
      var table = $('<table class="tbl-form full vt" />');
      // slot
      var slot = [[], []];
      // iterate nilai items
      $.each(list, function (i, item) {
         var div = $('<div class="half fl"><label>' + item[1] + '</label><br></div>');
         var input = Input.create({
            type  : 'number',
            name  : 'nilai[' + item[0] + ']',
            value : item[3]
         });

         input.attr({
            disabled: 'disabled',
            readonly: 'readonly'
         }).css({
            opacity: .5,
            width: '89%'
         });

         div.append(input);
         slot[i % 2].push(div);
      });

      for (var i = 0, tr; i < slot[0].length; i++) {
         tr = $('<tr><td></td></tr>');
         tr.find('td').append( slot[0][i] );
         tr.find('td').append( slot[1][i] || '' );
         table.append(tr);
      }

      // append container to the <div>
      div.append('<h3 class="section-title hr" style="margin: 0;">' + label + '</h3>' +
         '<div class="box-cont section"></div>');
      div.find('div').append(table);
   });
};

/**
 * Get input group values for nilai.
 * @param {Element}  div
 * @param {Object}   params
 * @return {Object}
 */
Input.getNilaiGroupValues = function (div, params) {
   // values
   var values = {};

   // iterate through params
   $.each(params || [], function (label, list) {
      // iterate nilai items
      $.each(list, function (i, item) {
         // date input
         if (item[1].type == 'date') {
            values['nilai[' + item[0] + ']'] =
               div.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_yy$1') + ']"]').val() + '-' +
               div.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_mm$1') + ']"]').val() + '-' +
               div.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_dd$1') + ']"]').val();

         // normal input
         } else  {
            values['nilai[' + item[0] + ']'] = div.find('[name="nilai[' + item[0] + ']"]').val();
         }
      });
   });

   return values;
};

/**
 * Print input group confirmation for nilai
 * @param {Element}  source
 * @param {Element}  conf
 * @param {Object}   params
 * @param {Object}   readonlyParams
 */
Input.printNilaiGroupConf = function (source, conf, params, readonlyParams) {
   var html, isEmpty;

   isEmpty = true;

   html = '';
   $.each(params || [], function (label, list) {
      // append header and table
      html += '<ul class="direktori-tbl stat-format section">' +
              '<li class="caption"><span>' + label + '</span></li>';
      // iterate nilai items
      $.each(list, function (i, item) {
         var value;
         // date input
         if (item[1].type == 'date') {
            value = source.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_yy$1') + ']"] :selected').text() + ' ' +
                    source.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_mm$1') + ']"] :selected').text() + ' ' +
                    source.find('[name="nilai[' + item[0].replace(/(\]?)$/, '_dd$1') + ']"] :selected').text();
         // enumeration input
         } else if (item[1].type == 'enum') {
            value = source.find('[name="nilai[' + item[0] + ']"]').find(':selected').text();
         // normal input
         } else {
            value = source.find('[name="nilai[' + item[0] + ']"]').val();
         }

         // append html
         html += '<li><span style="width: 150px;">' + item[1].nama + '</span><span style="width: 340px;">' +
                 value + '</span></li>';
      });

      // close html
      html += '</ul>';

      isEmpty = false;
   });

   if (isEmpty) html = '';
   if (isEmpty) $.each(readonlyParams || [], function (label, list) {
      // append header and table
      html += '<ul class="direktori-tbl stat-format section">' +
              '<li class="caption"><span>' + label + '</span></li>';
      // iterate nilai items
      $.each(list, function (i, item) {
         var value = source.find('[name="nilai[' + item[0] + ']"]').val();

         // append html
         html += '<li><span style="width: 150px;">' + item[1] + '</span><span style="width: 340px;">' +
                 value + '</span></li>';
      });

      // close html
      html += '</ul>';
   });

   // append html to div
   conf.append(html);
};