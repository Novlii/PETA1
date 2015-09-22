/**
 * @fileoverview SIAP PPDB reusable scripts.
 * @author rudy@jayantara.co.id (Rudy Susanto)
 */

/**
 * @namespace
 */
Reusable = {};

/**
 * Print biodata siswa
 * @param {jQuery} div
 * @param {Object.<string, *>} params
 */
Reusable.printSiswa = function (div, params) {
   // sekolah value
   var sekolah = params.sekolah.nama;
   params.is_luar && ( sekolah += '<br />' + params.sekolah.kota[1] + ', Provinsi ' + params.sekolah.propinsi[1] );

   // row template
   var template = '<li><span style="width: 150px;">#label#</span><span style="width: 340px;">#value#</span></li>';

   // build html fragment
   var html = '<ul class="direktori-tbl stat-format section">' +
              '<li class="caption"><span>Biodata Siswa</span></li>' +
              template.replace('#label#', 'Nama Lengkap').replace('#value#', '<b class="med">' + params.nama + '</b>') +
              template.replace('#label#', 'Nomor Peserta').replace('#value#', '<b class="med green">' + params.siswa_id + '</b>') +
              template.replace('#label#', 'Jenis Kelamin').replace('#value#', params.kelamin[1]) +
              template.replace('#label#', 'Tempat, Tanggal Lahir').replace('#value#', params.tmp_lahir + ', ' + params.tgl_lahir[1]) +
              template.replace('#label#', 'Alamat').replace('#value#', params.alamat_lengkap) +
              template.replace('#label#', 'Sekolah').replace('#value#', sekolah) +
              template.replace('#label#', 'Tahun Lulus').replace('#value#', params.thn_lulus) +
              '</ul>';

   // apply html fragment
   div.append(html);
};

/**
 * Print info tambahan
 * @param {jQuery} div
 * @param {Object.<string, *>} params
 */
Reusable.printInfo = function (div, params) {
   if (!params)
      return;

   // row template
   var template = '<li><span style="width: 150px;">#label#</span><span style="width: 340px;">#value#</span></li>';

   // build html fragment
   var html = '';
   $.each(params || [], function (i, item) {
      if (!html) {
         html = '<ul class="direktori-tbl stat-format section">' +
                '<li class="caption"><span>Info Tambahan</span></li>';
      }
      html += template.replace('#label#', item[1])
                      .replace('#value#', typeof item[3] == 'number' ? item[3] : item[3] || '-');
   });
   html && ( html += '</ul>' );

   // apply html fragment
   div.append(html);
};

/**
 * Print nilai
 * @param {jQuery} div
 * @param {Object.<string, *>} params
 */
Reusable.printNilai = function (div, params) {
   // row template
   var template = '<li><span style="width: 150px;">#label#</span><span style="width: 340px;">#value#</span></li>';

   // build html fragment
   var html = '';
   $.each(params || [], function (key) {
      var temp = '';
      $.each(this || [], function () {
         if (!temp) {
            temp = '<ul class="direktori-tbl stat-format section">' +
                   '<li class="caption"><span>' + key + '</span></li>';
         }
         temp += template.replace('#label#', this[2])
                         .replace('#value#', typeof this[3] == 'number' ? this[3] : this[3] || '-');
      });
      temp && ( temp += '</ul>' );
      html += temp;
   });

   // apply html fragment
   div.append(html);
};

/**
 * Print nilai rapor
 * @param {Element}  div
 * @param {Object}   params
 */
Reusable.printRapor = function (div, params) {
   // html collector
   var html = '';

   if (params) {
      html = '<h2>Nilai Rapor</h2><table class="tbl-data">';

      // forge head
      html += '<tr><th>&nbsp;</th>';
      $.each(params.periode || [], function (i, periode) {
         html += '<th style="text-align: center;">' + periode[1] + '</th>';
      });
      html += '</tr>';

      // forge body
      $.each(params.pelajaran || [], function (j, pelajaran) {
         html += '<tr><th>' + pelajaran[1] + '</th>';
         $.each(params.periode || [], function (i, periode) {
            html += '<td style="text-align: center;">' + params.data[String(periode[0])][String(pelajaran[0])] + '</td>';
         });
         html += '</tr>';
      });

      // close table
      html += '</table>';
   }

   // append html to div
   div.append(html);
};

/**
 * Print prestasi
 * @param {Element}  div
 * @param {Object}   params
 */
Reusable.printPrestasi = function (div, params) {
   // html collector
   var html = '<h2>Prestasi Siswa</h2>';
   var bidang = false;
   // iterate nilai items
   $.each(params || [], function (i, item) {
      bidang = item.bidang || false;
      // forge html
      html += '<table class="tbl-data">' +
              '<tr><th colspan="2">Prestasi ke-' + (i + 1) + '</th></tr>' +
              (bidang ?
                 [
                 '<tr><th width="120"> &nbsp; &nbsp; <em>Jenis Prestasi</em></th><td>' + bidang[1] + '</td></tr>',
                 '<tr><th> &nbsp; &nbsp; <em>Wilayah</em></th><td>' + item.wilayah[1] + '</td></tr>',
                 '<tr><th> &nbsp; &nbsp; <em>Peringkat</em></th><td>' + item.tingkat[1] + '</td></tr>'
                 ].join('')
              : '') +
              '<tr><th width="120"> &nbsp; &nbsp; <em>Nilai Prestasi</em></th><td>' + item.n_bobot + '</td></tr>' +
              '<tr><th> &nbsp; &nbsp; <em>Tanggal Piagam</em></th><td>' + (item.tgl_piagam != null ? item.tgl_piagam[1] : '-') + '</td></tr>' +
              '<tr><th> &nbsp; &nbsp; <em>Keterangan</em></th><td>' + item.keterangan + '</td></tr>' +
              '</table>';
   });

   // append html to div
   div.append(html);
};

/**
 * Print info pendataan
 * @param {jQuery} div
 * @param {Object.<string, *>} params
 * @param {string=} timezone
 */
Reusable.printData = function (div, params, timezone) {
   if (!params)
      return;

   // normalize timezone
   timezone = ' ' + (timezone || '');

   // row template
   var template = '<li><span style="width: 150px;">#label#</span><span style="width: 340px;">#value#</span></li>';

   // build html fragment
   var html = '<ul class="direktori-tbl stat-format section">' +
              '<li class="caption"><span>Info Pendataan</span></li>' +
              template.replace('#label#', 'Lokasi Pendataan').replace('#value#', params.lokasi) +
              template.replace('#label#', 'Operator').replace('#value#', params.operator) +
              template.replace('#label#', 'Waktu').replace('#value#', (params.wkt_data && params.wkt_data[1] || '') + timezone) +
              '</ul>';

   // apply html fragment
   div.append(html);
};

/**
 * Print info pendaftaran
 * @param {Element}  div
 * @param {Object}   params
 * @param {String}   [timezone]
 */
Reusable.printDaftar = function (div, params, timezone) {
   if (params && params.daftar) {
      // sanitize timezone
      timezone = timezone || '';

      // collect pilihan
      var pilihan = [];
      $.each(params.pilihan || [], function (key, item) {
         pilihan.push('<tr><th width="120">Pilihan ke-' + key  + '</th><td>' + item.label + '</td></tr>');
         if (params.multi) {
            $.each(item.nilai || [], function () {
               pilihan.push('<tr><th> &nbsp; &nbsp; <em>' + this[2] + '</em></th><td>' + this[3] + '</td></tr>');
            });
            pilihan.push('<tr><th> &nbsp; &nbsp; <em>Nilai Akhir</em></th><td>' + item.n_akhir + '</td></tr>');
         }
      });

      // append html to div
      div.append(
         '<h2>Info Pendaftaran</h2><table class="tbl-data">' +
         '<tr><th width="120">Nomor Pendaftaran</th><td>' + params.daftar.no_daftar + '</td></tr>' +
         '<tr><th>Kode Verifikasi</th><td>' + (params.daftar.token || '-') + '</td></tr>' +
         '<tr><th>Lokasi Daftar</th><td>' + params.daftar.lokasi + '</td></tr>' +
         '<tr><th>Operator</th><td>' + params.daftar.operator + '</td></tr>' +
         '<tr><th>Waktu</th><td>' + (params.daftar.wkt_daftar == null ? '-' : params.daftar.wkt_daftar[1]) +
         ' ' + timezone + '</td></tr>' +
         (params.multi ? '' : '<tr><th>Nilai Akhir</th><td>' + params.daftar.n_akhir + '</td></tr>') +
         '</table>' +
         (pilihan.length ? '<h2>Pilihan Sekolah</h2><table class="tbl-data">' + pilihan.join('') + '</table>' : '')
      );

      if (params.terima) div.append(
         '<h2>Status</h2><table class="tbl-data">' +
         '<tr><th width="120">' + params.terima.diterima[1] + ' di</th><td>' + params.terima.label + '</td></tr>' +
         (params.terima.no_urut && params.terima.kapasitas && params.terima.jml_diterima
            ? ( '<tr><th>Peringkat</th><td>' + params.daftar.no_urut + ' dari ' + params.terima.jml_diterima + '</td></tr>' +
                '<tr><th>Daya Tampung</th><td>' + params.terima.kapasitas + '</td></tr>' )
            : ''
         ) +
         '</table>'
      );
   }
};

/**
 * Print info pengajuan pendaftaran
 * @param {Element}  div
 * @param {Object}   params
 * @param {String}   [timezone]
 */
Reusable.printAjuanDaftar = function (div, params, timezone) {
   // sanitize timezone
   timezone = timezone || '';

   // collect pilihan
   var pilihan = [];
   $.each(params.ajuan_pilihan, function (key, item) {
      pilihan.push('<tr><th width="120">Pilihan ke-' + key  + '</th><td>' + item.label + '</td></tr>');
      if (params.multi) {
         $.each(item.nilai || [], function () {
            pilihan.push('<tr><th> &nbsp; &nbsp; <em>' + this[2] + '</em></th><td>' + this[3] + '</td></tr>');
         });
         pilihan.push('<tr><th> &nbsp; &nbsp; <em>Nilai Akhir</em></th><td>' + item.n_akhir + '</td></tr>');
      }
   });

   // append html to div
   div.append(
      '<h2>Info Pengajuan Pendaftaran</h2><table class="tbl-data">' +
      '<tr><th>Kode Verifikasi</th><td>' + (params.ajuan_daftar.token || '-') + '</td></tr>' +
      '<tr><th>IP Lokasi</th><td>' + params.ajuan_daftar.ip_lokasi + '</td></tr>' +
      '<tr><th>Waktu</th><td>' + (params.ajuan_daftar.wkt_ajuan == null ? '-' : params.ajuan_daftar.wkt_ajuan[1]) +
      ' ' + timezone + '</td></tr>' +
      (params.multi ? '' : '<tr><th>Nilai Akhir</th><td>' + params.ajuan_daftar.n_akhir + '</td></tr>') +
      '</table>' + html +
      '<h2>Pilihan Sekolah</h2><table class="tbl-data">' + pilihan.join('') + '</table>'
   );
};

/**
 * Print info pendaftaran
 * @param {Element}  div
 * @param {Object}   params
 * @param {String}   [timezone]
 */
// TODO printDaftar: function (div, params, timezone) {},
Reusable.printPendataanDaftar = function (div, params, timezone) {
   // collect pilihan
   var pilihan = [];
   $.each(params.pilihan || [], function (key, item) {
      pilihan.push('<tr><th width="120">Pilihan ke-' + key  + '</th><td>' + item.label + '</td></tr>');
      if (params.multi) {
         $.each(item.nilai || [], function () {
            pilihan.push('<tr><th> &nbsp; &nbsp; <em>' + this[2] + '</em></th><td>' + this[3] + '</td></tr>');
         });
         pilihan.push('<tr><th> &nbsp; &nbsp; <em>Nilai Akhir</em></th><td>' + item.n_akhir + '</td></tr>');
      }
   });

   // sanitize timezone
   timezone = timezone || '';
   // append html to div
   div.append(
      '<h2>Info Pendaftaran</h2><table class="tbl-data">' +
      '<tr><th width="120">Nomor Pendaftaran</th><td>' + params.daftar.no_daftar + '</td></tr>' +
      '<tr><th>Kode Verifikasi</th><td>' + (params.daftar.token || '-') + '</td></tr>' +
      '<tr><th>Lokasi Daftar</th><td>' + params.daftar.lokasi + '</td></tr>' +
      '<tr><th>Operator</th><td>' + params.daftar.operator + '</td></tr>' +
      '<tr><th>Waktu</th><td>' + (params.daftar.wkt_daftar == null ? '-' : params.daftar.wkt_daftar[1]) +
      ' ' + timezone + '</td></tr>' +
      (params.multi ? '' : '<tr><th>Nilai Akhir</th><td>' + params.daftar.n_akhir + '</td></tr>') +
      '</table>' +
      (pilihan.length ? '<h2>Pilihan Sekolah</h2><table class="tbl-data">' + pilihan.join('') + '</table>' : '')
   );

   if (params.terima) div.append(
      '<h2>Status</h2><table class="tbl-data">' +
      '<tr><th width="120">' + params.terima.diterima[1] + ' di</th><td>' + params.terima.label + '</td></tr>' +
      (params.terima.no_urut && params.terima.kapasitas && params.terima.jml_diterima
         ? ( '<tr><th>Peringkat</th><td>' + params.daftar.no_urut + ' dari ' + params.terima.jml_diterima + '</td></tr>' +
             '<tr><th>Daya Tampung</th><td>' + params.terima.kapasitas + '</td></tr>' )
         : ''
      ) +
      '</table>'
   );
};

/**
 * Print info pengajuan pendaftaran into div
 * @param {Element}  div
 * @param {Object}   params
 * @param {String}   [timezone]
 */
// TODO printDaftar: function (div, params, timezone) {},
Reusable.printPengajuanDaftar = function (div, params, timezone) {
   // collect pilihan
   var pilihan = [];
   $.each(params.ajuan_pilihan, function (key, item) {
      pilihan.push('<tr><th width="120">Pilihan ke-' + key  + '</th><td>' + item.label + '</td></tr>');
      if (params.multi) {
         $.each(item.nilai || [], function () {
            pilihan.push('<tr><th> &nbsp; &nbsp; <em>' + this[2] + '</em></th><td>' + this[3] + '</td></tr>');
         });
         pilihan.push('<tr><th> &nbsp; &nbsp; <em>Nilai Akhir</em></th><td>' + item.n_akhir + '</td></tr>');
      }
   });

   // collect extra data
   var html = '';
   if (params.ajuan_info) {
      html = '<h2>Data Tambahan</h2><table class="tbl-data">';
      // iterate nilai items
      $.each(params.ajuan_info, function (i, item) {
         // forge html
         html += '<tr><th width="120">' + item[1] + '</th><td>' + item[3] + '</td></tr>';

      });
      // close html
      html += '</table>';
   }


   // sanitize timezone
   timezone = timezone || '';
   // append html to div
   div.append(
      '<h2>Info Pengajuan Pendaftaran</h2><table class="tbl-data">' +
      '<tr><th>Kode Verifikasi</th><td>' + (params.ajuan_daftar.token || '-') + '</td></tr>' +
      '<tr><th>IP Lokasi</th><td>' + params.ajuan_daftar.ip_lokasi + '</td></tr>' +
      '<tr><th>Waktu</th><td>' + (params.ajuan_daftar.wkt_ajuan == null ? '-'  : params.ajuan_daftar.wkt_ajuan[1]) +
      ' ' + timezone + '</td></tr>' +
      (params.multi ? '' : '<tr><th>Nilai Akhir</th><td>' + params.ajuan_daftar.n_akhir + '</td></tr>') +
      '</table>' + html +
      '<h2>Pilihan Sekolah</h2><table class="tbl-data">' + pilihan.join('') + '</table>'
   );

};

/**
 * Print info pendataan into div
 * @param {Element}  div
 * @param {Object}   params
 * @param {String}   [timezone]
 */
Reusable.printPengajuanData = function (div, params, timezone) {
   // sanitize timezone
   timezone = timezone || '';
   // append html to div
   div.append(
      '<h2>Info Pengajuan Pendataan</h2><table class="tbl-data">' +
      '<tr><th width="120">Kode Verifikasi</th><td>' + (params.ajuan_data.token || '-') + '</td></tr>' +
      '<tr><th>IP Lokasi</th><td>' + params.ajuan_data.ip_lokasi + '</td></tr>' +
      '<tr><th>Waktu</th><td>' + (params.ajuan_data.wkt_data == null ? '-' : params.ajuan_data.wkt_data[1]) +
      ' ' + timezone + '</td></tr></table>'
   );
};