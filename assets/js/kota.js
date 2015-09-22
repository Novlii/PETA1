(function () {

/**
 * Form list.
 * @const
 */
var FORMS = ["sekolah", "siswa", "guru", "sarpras", "lulusan", "kompetensi"];

/**
 * Workspace element
 * @type {jQuery}
 */
var workspace;

/**
 * Form controllers
 * @type {Object.<string,function()>}
 */
var controllers = {};

/**
 * Parameters cache
 * @type {Object.<string,*>}
 */
var router, data;

/**
 * Rekapitulasi cache
 * @type {Object.<string,*>}
 */
var map = {};

/**
 * Modal list for this page
 * @enum {Array.<Modal.Dialog|Modal.Popup>}
 * @see Modal.Dialog
 * @see Modal.Popup
 */
var modals = {};

/**
 * Others cache
 * @type {Object.<string,*>}
 */
var caches = {
   jenjang: false,
   jenis: false
};

/**
 * Pagings.
 * @type {Object.<string, Modal.Navigation>}
 */
var navigations = {};

/**
 * filter
 * @type {Object.<string,*>}
 */
var filters = {
   limit: 10,
   page: 1,
   is_negeri: 1,
   keyword: ''
};

/**
 * format filter status
 * @type {Object.<string,*>}
 */
var status = [['0', 'Swasta'], ['1', 'Negeri']];

/**
 * format filter status
 * @type {Object.<string,*>}
 */
var MASTER_JENIS = [['', 'Seluruh Naungan'], ['dinas', 'Naungan Kemdikbud'], ['depag', 'Naungan Kemenag']];

var gmap, ib, markerCluster, markers = [];
/**
 * Perform initialization process
 */
function initialize(hash) {
   // workspace
   workspace = $('#js-workspace');

   // bind button aktivasi
   workspace.find('.js-aktivasi-btn').click(function() {
      window.location = Env.PARENT + '/aktivasi/';
   });

   // initialize map and markers
   var defaultPosition = new google.maps.LatLng(Env.GOOGLEMAP[0], Env.GOOGLEMAP[1]);
   gmap = new google.maps.Map(document.getElementById('gmap'), {
      center: defaultPosition,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      panControl: false,
      scrollwheel: false,
      streetViewControl: false,
      zoom: 11
   });

   // content infobox
   var content = $(['<div class="mapcard dinas"><div class="profil">',
                    '<img class="js-ib-img" src="' + (Env.STATIC_URL + '/assets/img/global/80/dinas.png') +'" />',
                    '<div class="msg"><h3><a class="js-ib-kota" href="javascript:"></a></h3>',
                    '<em class="green js-ib-nama"></em><br/><span class="js-ib-alamat"></span>',
                    '</div></div><div class="profil">',
                    '<div class="menu clear" style="padding-bottom:0px"><h4>Statistik</h4></div>',
                    '<ul class="menu"><li><span class="trio2 fl" style="padding-left:5px">Sekolah</span><span class="js-jml-sekolah">0</span></li>',
                    '<li><span class="trio2 fl" style="padding-left:5px">Siswa</span><span class="js-jml-siswa">0</span></li>',
                    '<li><span class="trio2 fl" style="padding-left:5px">Guru</span><span class="js-jml-guru">0</span></li>',
                    '<li><span class="trio2 fl" style="padding-left:5px">Sarpras</span><span class="js-jml-sarpras">0</span></li></ul>',
                    '</div><div class="profil">',
                    '<div class="menu clear" style="padding-bottom:0px"><h4>Kontak</h4></div>',
                    '<ul class="menu"><li><a class="ic-phone tips-ls js-ib-telp" title="Telepon Sekolah">-</a></li>',
                    '<li><a class="ic-mail tips-ls js-ib-email" title="Email Sekolah">-</a></li>',
                    '<li><a class="ic-link tips-ls js-ib-web" title="Website Sekolah">-</a></li></ul>',
                    '</div></div>'].join(''));

   ib = new InfoBox({
            alignBottom: true,
            content: content[0],
            closeBoxMargin: 'float: right; margin-top: 5px; margin-right: 5px;',
            closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',
            enableEventPropagation: false,
            infoBoxClearance: new google.maps.Size(5, 35),
            isHidden: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-32, -7)
         });

   // bind change position
   google.maps.event.addListener(gmap, 'click', function () {
      ib.close();
   });


   // TODO: set markers
   var marker;
   var position = new google.maps.LatLng(Env.LEMBAGA['lintang'], Env.LEMBAGA['bujur']);
   marker = new google.maps.Marker({
      draggable: false,
      position: position,
      icon: Env.STATIC_URL + '/assets/img/gmap/ic20-dinas.png',
      map: gmap
   });

   markers.push(marker);
   google.maps.event.addListener(marker, 'click', (function() {
      var total = [0, 0, 0, 0],
          telp  = '', email = '', situs = '';
      for (var i = 1; i <= 5; i ++) {
         total[0] += Env.REKAP[i].jml_sekolah[0] + Env.REKAP[i].jml_sekolah[1];
         for (var tingkat = 0; tingkat <= 12; tingkat++) {
            total[1] += Env.REKAP[i]['jml_siswa_l' + tingkat][0] + Env.REKAP[i]['jml_siswa_l' + tingkat][1] +
                         Env.REKAP[i]['jml_siswa_p' + tingkat][0] + Env.REKAP[i]['jml_siswa_p' + tingkat][1];
         }
         total[2] += Env.REKAP[i].jml_guru[0] + Env.REKAP[i].jml_guru[1];
         total[3] += Env.REKAP[i].jml_sarpras[0] + Env.REKAP[i].jml_sarpras[1];
      }

      // kontak
      if (Env.LEMBAGA.no_telpon && Env.LEMBAGA.no_telpon.length) {
         $.each(Env.LEMBAGA.no_telpon, function(index, value) {
            telp += (value != '' ? value : '-') + ((Env.LEMBAGA.no_telpon.length - 1) != index ? ', ' : '');
         });
      } else {
         telp = '-';
      }

      if (Env.LEMBAGA.email && Env.LEMBAGA.email.length) {
         $.each(Env.LEMBAGA.email, function(index, value) {
            email += (value != '' ? value : '-') + ((Env.LEMBAGA.email.length - 1) != index ? ', ' : '');
         });
      } else {
         email = '-';
      }

      if (Env.LEMBAGA.situs && Env.LEMBAGA.situs.length) {
         if(Env.LEMBAGA.situs.situs.length)$.each(Env.LEMBAGA.situs.situs, function(index, value) {
            situs += (value != '' ? value : '-') + ((Env.LEMBAGA.situs.situs.length - 1) != index ? ', ' : '');
         });
      } else {
         situs = '-';
      }

      // update content infobox
      content.find('.js-ib-kota').html(Env.LEMBAGA.kota[1]).attr('href', Env.BASE_URL);
      content.find('.js-ib-nama').html(Env.LEMBAGA.nama);
      content.find('.js-ib-alamat').html(Env.LEMBAGA.alamat);
      content.find('.js-jml-sekolah').html(total[0]);
      content.find('.js-jml-siswa').html(total[1]);
      content.find('.js-jml-guru').html(total[2]);
      content.find('.js-jml-sarpras').html(total[3]);
      content.find('.js-ib-telp').html(telp);
      content.find('.js-ib-email').html(email);
      content.find('.js-ib-web').html(situs);

      var logo =  Env.LEMBAGA.logo;
      content.find('.js-ib-img').each(function () {
         Html.Image(this).load(logo, Env.STATIC_URL + '/assets/img/global/80/dinas.png');
      });
      // open infobox
      ib.open(gmap, marker);
   }));

   // initialize table's paging navigation
   navigations['rekap'] = new Modal.Navigation( workspace.find('.js-navigation'), {
      limit        : filters.limit,
      limitOptions : [],
      callback     : function (page) {
         $.extend(filters, { page: page });
         render(caches.jenjang, caches.jenis, filters.page);
      }
   });

   // update table-view selector and label
   var option = Xtml.Option( workspace.find('.js-status-option') );
   option.populate(status, status[1][0]);
   option.change(function () {
      $.extend(filters, { page: 1, jenis: workspace.find('.js-filter').attr('rel'), is_negeri: this.rel });
      render(caches.jenjang, workspace.find('.js-filter').attr('rel'), filters.page);
   });

   // filter
   var jenis = window.location.search || '',
       jenis = jenis.replace(/\?jenis=/g, '') || '',
       jenis = (jenis == 'depag' ? 2 : jenis == 'dinas' ? 1 : 0);

   var naungan = Xtml.Option( workspace.find('.js-naungan') );
   naungan.populate(MASTER_JENIS, MASTER_JENIS[jenis][0]);
   naungan.change(function () {
      window.location = '/?jenis=' + this.rel;
   });

   // filter
   var filter = Xtml.Option( workspace.find('.js-filter') );
   filter.populate(MASTER_JENIS, MASTER_JENIS[hash['route'][2] == 'depag' ? 2 : hash['route'][2] == 'dinas' ? 1 : 0 ][0]);
   filter.change(function () {
      $.extend(filters, { page: 1, is_negeri: workspace.find('.js-status-option').attr('rel'), jenis: this.rel });
      render(caches.jenjang, this.rel, filters.page);
   });

   //refresh
   workspace.find('.js-reload').click(function () {
      render(caches.jenjang, caches.jenis, filters.page);
   });

   // keyword
   workspace.find('.js-search-keyword').keyup(function (e) {
      if (e.keyCode == 13) {
         workspace.find('.js-search-btn').click();
      }
   });

   // keyword
   workspace.find('.js-search-close').click(function (e) {
      $.extend(filters, {
         keyword : '',
         page    : 1
      });
      render(caches.jenjang, caches.jenis, filters.page);
   });

   // keyword's search button
   workspace.find('.js-search-btn').click(function () {
      $.extend(filters, {
            keyword : workspace.find('.js-search-keyword').val(),
            page    : 1
      });
      render(caches.jenjang, caches.jenis, filters.page);

      // clear value
      workspace.find('.js-search-keyword').val('');
   });

   // initialize modal tips
   modals['tips'] = initModals( workspace.find('.js-tips-modal') );

   // bind button to open table-action modal
   workspace.find('table').children('tbody').on('click', '.js-mod-tips-ajx', function () {
      onModalsOpen(modals['tips'], this);
   });
}

/**
 * Standart Dispatcher function
 */
function dispatch(hash) {
   // lazy initialization process
   if (typeof initialize == 'function') {
      initialize(hash);
      initialize = undefined;
   }

   // dispatch controller from hash
   // TODO: validate jenjang
   router = hash['route'];
   data   = hash['data'];
   if (router[0] && router[0].length) {
      new controllers['rekapitulasi']();
   } else {
      new controllers['home']();
   }
}

/**
 * Render all tables
 */
function render(jenjang, jenis, page) {
   // save previous
   caches.jenjang = jenjang;
   caches.jenis  = jenis;

   // total
   var total = {
      siswa:   	[0, 0],
      guru:    	[0],
      sarpras: 	[0, 0],
      lulusan: 	[0, 0, 0, 0],
      kompetensi: [0]
   };

    // get K_JENJANG
   var k_jenjang = Object.keys(Env.JENJANG).filter(function(item) {
      return Env.JENJANG[item][0] == jenjang;
   })[0];

   var params = {
         k_jenjang: k_jenjang,
         is_negeri: filters.is_negeri,
         keyword: filters.keyword,
         jenis: filters.jenis || caches.jenis || workspace.find('.js-filter').attr('rel'),
         page: page
   };

   // reset tables
   var sekolah    = workspace.find('.js-rekap-sekolah').children('tbody').empty(),
       siswa      = workspace.find('.js-rekap-siswa').children('tbody').empty(),
       guru       = workspace.find('.js-rekap-guru').children('tbody').empty(),
       sarpras    = workspace.find('.js-rekap-sarpras').children('tbody').empty(),
       lulusan    = workspace.find('.js-rekap-lulusan').children('tbody').empty(),
       kompetensi = workspace.find('.js-rekap-kompetensi').children('tbody').empty();

   Application.request(Env.BASE_URL + '/sekolah/', {data: params}, function (json) {
      // render tables
      $.each(json.sekolah.data, function(i, item) {
         var logo = item.logo;

         // render table sekolah
         var tr = $('<tr/>');
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td>' + item['alamat'] + '</td>')
           .append('<td>' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .appendTo(sekolah);

         // render table siswa
         var tr = $('<tr/>');
         var jml_siswa = [0, 0];
         for (var tingkat = 0; tingkat <= 12; tingkat++) {
            jml_siswa[0] += item['jml_siswa_l' + tingkat];
            jml_siswa[1] += item['jml_siswa_p' + tingkat];
         }
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td class="al"><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td class="al desc">' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .append('<td>' + Application.currency(jml_siswa[0]) + '</td>')
           .append('<td>' + Application.currency(jml_siswa[1]) + '</td>')
           .appendTo(siswa);

         // total sekolah
         total['siswa'][0] += jml_siswa[0];
         total['siswa'][1] += jml_siswa[1];

         // render table guru
         var tr = $('<tr/>');
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td class="al"><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td class="al desc">' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .append('<td>' + item['jml_guru'] + '</td>')
           .appendTo(guru);

         // total sekolah
         total['guru'][0] += item['jml_guru'];

         // render table sarpras
         var tr = $('<tr/>');
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td class="al"><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td class="al desc">' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .append('<td>' + item['jml_prasarana'] + '</td>')
           .append('<td>' + item['jml_sarana'] + '</td>')
           .append('<td>' + (item['jml_prasarana'] + item['jml_sarana']) + '</td>')
           .appendTo(sarpras);

         // total sarpras
         total['sarpras'][0] += (item['jml_prasarana']);
         total['sarpras'][1] += (item['jml_sarana']);

         // render table lulusan
         var tr = $('<tr/>');
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td class="al"><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td class="al desc">' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .append('<td>' + item['jml_lulusan_dunia_usaha'] + '</td>')
           .append('<td>' + item['jml_lulusan_wiraswasta'] + '</td>')
           .append('<td>' + item['jml_lulusan_mandiri'] + '</td>')
           .append('<td>' +
                       ((item['jml_lulusan_dunia_usaha'] + item['jml_lulusan_wiraswasta'] + item['jml_lulusan_mandiri']) > item['jml_lulusan_tahun_lalu'] ?
                        (item['jml_lulusan_dunia_usaha'] + item['jml_lulusan_wiraswasta'] + item['jml_lulusan_mandiri']) : item['jml_lulusan_tahun_lalu'])
                     + '</td>')
           .appendTo(lulusan);

         // total lulusan
         total['lulusan'][0] += (item['jml_lulusan_dunia_usaha']);
         total['lulusan'][1] += (item['jml_lulusan_wiraswasta']);
         total['lulusan'][2] += (item['jml_lulusan_mandiri']);
         total['lulusan'][3] += (item['jml_lulusan_tahun_lalu']);

         // render table kompetensi
         var tr = $('<tr/>');
         tr.append('<td>' + ((i + 1) + (filters.limit * (filters.page - 1))) + '</td>')
           .append('<td class="al"><div class="namecard js-render-kota"><img align="left" src="' + Env.STATIC_URL + '/assets/img/global/sekolah.png' + '" rel="' + logo + '">' +
                     '<h3><a class="tips-rs js-mod-tips-ajx mod-rm" href="javascript:">' + item['nama'] + '</a></h3>' +
                     '<span class="desc tips-ls" alt="show">' + (item['npsn'] || '') + '</span>' +
                     '<input type="hidden" class="js-sekolahId" value="'+ item['sekolah_id'] +'"/></div></td>')
           .append('<td class="al desc">' + (item['is_negeri'] ? 'Negeri' : 'Swasta') + '</td>')
           .append('<td>' + item['jml_kompetensi'] + '</td>')
           .appendTo(kompetensi);

         // total kompetensi
         total['kompetensi'][0] += item['jml_kompetensi'];

      });

      // fail load img
      workspace.find('.js-render-kota img').each(function () {
         var logo = $(this).attr('rel');
         Html.Image(this).load(logo, Env.STATIC_URL + '/assets/img/global/sekolah.png');
      });

      // update siswa
      workspace.find('.js-siswa-total-l').html(Application.currency(total['siswa'][0]));
      workspace.find('.js-siswa-total-p').html(Application.currency(total['siswa'][1]));
      // update guru
      workspace.find('.js-guru-total').html(Application.currency(total['guru'][0]));

      // update sarpras
      workspace.find('.js-sarpras-prasarana').html(Application.currency(total['sarpras'][0]));
      workspace.find('.js-sarpras-sarana').html(Application.currency(total['sarpras'][1]));
      workspace.find('.js-sarpras-total').html(Application.currency(total['sarpras'][0] + total['sarpras'][1]));

      // update lulusan
      workspace.find('.js-lulusan-pegawai').html(Application.currency(total['lulusan'][0]));
      workspace.find('.js-lulusan-wiraswasta').html(Application.currency(total['lulusan'][1]));
      workspace.find('.js-lulusan-mandiri').html(Application.currency(total['lulusan'][2]));
      workspace.find('.js-lulusan-total').html(
         Application.currency((total['lulusan'][0] + total['lulusan'][1] + total['lulusan'][2]) > total['lulusan'][3] ?
         (total['lulusan'][0] + total['lulusan'][1] + total['lulusan'][2]) : total['lulusan'][3]));

      // update kompetensi
      workspace.find('.js-kompetensi-total').html(Application.currency(total['kompetensi']));

      // redraw navigation
      navigations['rekap'].redraw(page, json.sekolah.total);

      // update total
      workspace.find('.js-total').html(json.sekolah.total);

      // update search info
      workspace.find('.js-search-label').html(filters.keyword);
      workspace.find('.js-search-info').css('display', filters.keyword != '' ? '' : 'none');
   });

}

/**
 * Controller description for no hasbanga
 */
controllers['home'] = function() {
   // show div(s)
   workspace.find('.js-menu-btn').hide();
   workspace.find('.js-aktivasi-btn').show();
   workspace.find('.namecard').addClass('on');

   // on load complete
   var parent = workspace.find('#js-pagediv-index');
   parent.siblings('.js-pagediv').hide();
   parent.show();

   // fail load image
   workspace.find('a.namecard img').each(function () {
      Html.Image(this).load(Env.LEMBAGA.logo, Env.STATIC_URL + '/assets/img/global/80/dinas.png');
   });
};

/**
 * Render map jenjang
 */
function maping(jenjang, data) {
   // delete prev marker
   for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
     }

   if (markerCluster)
      markerCluster.clearMarkers();

   // reset markers
   markers = [];
   var content = $(['<div class="mapcard ' + jenjang + '"><div class="profil">',
                    '<img class="js-ib-img" src="' + (Env.STATIC_URL + '/assets/img/global/sekolah.png') +'" />',
                    '<div class="msg"><h3><a class="js-ib-nama" href="javascript:"></a></h3>',
                    '<em class="green js-ib-npsn"></em><br/><span class="js-alamat"></span>',
                    '</div></div><div class="profil">',
                    '<div class="menu clear" style="padding-bottom:0px"><h4>Statistik</h4></div>',
                    '<ul class="menu"><li><span class="trio2 fl" style="padding-left:5px">Siswa</span><span class="js-jml-siswa">0</span></li>',
                    '<li><span class="trio2 fl" style="padding-left:5px">Guru</span><span class="js-jml-guru">0</span></li>',
                    '<li><span class="trio2 fl" style="padding-left:5px">Sarpras</span><span class="js-jml-sarpras">0</span></li></ul>',
                    '</div></div>'].join(''));

   ib.setContent(content[0]);

   // set markers
   var marker;
   $.each(data, function(i, item) {
      var position = new google.maps.LatLng(item.lintang, item.bujur);
       marker = new google.maps.Marker({
         draggable: false,
         position:  position,
         icon:      Env.STATIC_URL + '/assets/img/gmap/ic20-' + jenjang + '.png',
         map:       gmap
      });

      // save marker
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
         return function() {
            Application.request(Env.BASE_URL + '/sekolah/fetch?sekolah_id=' + item.sekolah_id, false, function (json) {
               content.find('.js-alamat').html(json.sekolah.alamat + '<br/>' + json.sekolah.kota[1] +
                                              ' - ' + json.sekolah.propinsi[1] +'<br/>' + json.sekolah.kode_pos);
               content.find('.js-jml-siswa').html(json.rekap.jml_siswa_l + json.rekap.jml_siswa_p);
               content.find('.js-jml-guru').html(json.rekap.jml_guru);
               content.find('.js-jml-sarpras').html(json.rekap.jml_prasarana + json.rekap.jml_sarana);
            });

            content.find('.js-ib-nama').html(item.nama)
                                       .attr('href', 'http://siap-online.com/' + item.sekolah_id + '/sekilas')
                                       .attr('target', '_blank');
            content.find('.js-ib-npsn').html(item.sekolah_id);
            var logo =  item.logo;
            content.find('.js-ib-img').each(function () {
               Html.Image(this).load(logo, Env.STATIC_URL + '/assets/img/global/sekolah.png');
            });
            // open infobox
            ib.open(gmap, marker);
         };
      })(marker, i));
   });

   // Marker Cluster
   markerCluster = new MarkerClusterer(gmap, markers);
}

/**
 * Controller description for hashbang: #!/{jenjang}/{form}
 */
controllers['rekapitulasi'] = function() {
   var jenjang = router[0],
       form    = router[1] || FORMS[0],
       jenis   = router[2] || "",
       page    = 1;

   // show div(s)
   workspace.find('.js-aktivasi-btn').hide();
   workspace.find('.js-menu-btn').show();

   // set current active icon
   workspace.find('.icj-' + jenjang).addClass('on');
   workspace.find('.icj-' + jenjang).siblings('.icj').removeClass('on');
   workspace.find('.namecard').removeClass('on');

   // build sub menu
   // TODO: print directly on index.html
   var app = workspace.find('.js-app-menu').empty();
   var ul  = $('<ul/>');

   ul.append('<li><a href="#!/'+ jenjang +'/sekolah" rel="sekolah">Data Sekolah</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/siswa" rel="siswa">Data Siswa</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/guru" rel="guru">Data Guru</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/sarpras" rel="sarpras">Data Sarpras</a></li>');

   if (jenjang == 'smk')
   ul.append('<li><a href="#!/'+ jenjang +'/lulusan" rel="lulusan">Data Kelulusan</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/kompetensi" rel="kompetensi">Data Kompetensi Keahlian</a></li>');

   ul.appendTo(app);

   // get K_JENJANG
   var k_jenjang = Object.keys(Env.JENJANG).filter(function(item) {
      return Env.JENJANG[item][0] == jenjang;
   })[0];

   // update label
   workspace.find('.js-jenjang').html(Env.JENJANG[k_jenjang][1]);
   workspace.find('.js-crumb').html('<a class="ic lbl">Peta Pendidikan</a>' +
                                    '<a class="ic ic-p-r lbl" href="' + Env.PARENT + '">' + Env.LEMBAGA.propinsi[1] + '</a>' +
                                    '<a class="ic ic-p-r lbl" href="/">' + Env.LEMBAGA.kota[1] + '</a>' +
                                    '<span class="ic ic-p-r lbl">'+ Env.JENJANG[k_jenjang][1] +'</span>');
    // select submenu
   app.find('a[rel='+form+']').closest('li').addClass('on');
   app.find('a[rel='+form+']').siblings('li').removeClass('on');


   // render rekapitulasi
   if (jenjang != caches.jenjang)
      render(jenjang, jenis, page);

   // render map jenjang
   if (map[jenjang]) {
      // fetch from cache
      maping(jenjang, map[jenjang]);
   } else {
      // request from server
      map[jenjang] = [];
      Application.request(Env.BASE_URL + '/location/index?k_jenjang=' + k_jenjang, false, function (json) {
         map[jenjang] = json.location;
         maping(jenjang, map[jenjang]);
      });
   }

   // tutup infobox maping
   ib.close();

   // on load complete
   var parent = workspace.find('#js-pagediv-detil'),
       child  = workspace.find('#js-pagediv-detil-' + form);

   parent.siblings('.js-pagediv').hide();
   parent.show();
   child.siblings('.js-child-div').hide();
   child.show();
};

/**
 * Initialize table-action modal
 * @param {Element} content DOM element to be attached to popup
 * @return {Modal.Dialog}
 */
function initModals(content) {
   var modal = new Modal.Dialog(content);

   return modal;
}

/**
 * Open table-action modal
 * @param {Modal.Dialog} modal
 * @param {Element} ref
 */
function onModalsOpen(modal, ref) {
   var currRow   = $( ref ).closest('tr'),
       sekolahID = currRow.find('.js-sekolahId').val();
   var telp  = '',
       email = '',
       situs = '',
       lokasi= '';

   Application.request(Env.BASE_URL + '/sekolah/fetch?sekolah_id=' + sekolahID, false, function (json) {
      var logo = json.sekolah.logo;
      modal.content.find('.namecard img').each(function () {
         Html.Image(this).load(logo, Env.STATIC_URL + '/assets/img/global/80/sekolah.png');
      });
      // update label
      modal.content.find('.js-modal-nama').html(json.sekolah.nama);
      modal.content.find('.js-modal-nama').html(json.sekolah.nama);
      modal.content.find('.js-modal-npsn').html(json.sekolah.npsn);
      modal.content.find('.js-modal-jenjang').html(Env.JENJANG[json.sekolah.jenjang[0]][1]);
      modal.content.find('.js-modal-status').html(json.sekolah.is_negeri == 0 ? 'Swasta' : 'Negeri');
      modal.content.find('.js-modal-alamat').html(json.sekolah.alamat + '<br/>' + json.sekolah.kota[1] +
           ' - ' + json.sekolah.propinsi[1] +'<br/>' + json.sekolah.kode_pos);
      modal.content.find('.js-modal-kepsek').html('Bapak Kepala Sekolah');
      modal.content.find('.js-modal-nip').html('99876987115232');

      // kontak
      if (json.profil.no_telpon && json.profil.no_telpon.length) {
         $.each(json.profil.no_telpon, function(index, value) {
            telp += (value != '' ? value : '-') + ((json.profil.no_telpon.length - 1) != index ? ', ' : '');
         });
      } else {
         telp = '-';
      }

      if (json.profil.email && json.profil.email.length) {
         $.each(json.profil.email, function(index, value) {
            email += (value != '' ? value : '-') + ((json.profil.email.length - 1) != index ? ', ' : '');
         });
      } else {
         email = '-';
      }

      if (json.profil.situs && json.profil.situs.length) {
         if(json.profil.situs.situs.length)$.each(json.profil.situs.situs, function(index, value) {
            situs += (value != '' ? value : '-') + ((json.profil.situs.situs.length - 1) != index ? ', ' : '');
         });
      } else {
         situs = '-';
      }

      modal.content.find('.js-modal-telp').html(telp);
      modal.content.find('.js-modal-email').html(email);
      modal.content.find('.js-modal-web').html(situs);

      //lokasi
      lokasi = (json.profil.lintang && json.profil.lintang.length ? json.profil.lintang + ', ' + json.profil.bujur : '-');
      modal.content.find('.js-modal-lokasi').html(lokasi);

      if (lokasi && lokasi != '-')
         modal.content.find('.js-maping-lokasi').show();
      else
         modal.content.find('.js-maping-lokasi').hide();

      modal.content.find('.js-maping-lokasi').click(function (){
         gmap.setZoom(14);
         gmap.setCenter(new google.maps.LatLng(json.profil.lintang, json.profil.bujur));
         $(window).scrollTop($('#gmap').offset().top);
      });

      modal.show(ref);
   });
}

/**
 * Run Application
 */
Application.run(dispatch);

})();
