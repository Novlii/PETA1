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
var router;

/**
 * Domain list
 * @type {Object.<string,*>}
 */
var domains = {};

/**
 * Rekapitulasi cache
 * @type {Object.<string,*>}
 */
var rekapitulasi = {
	'tk'  : {},
	'sd'  : {},
	'smp' : {},
	'sma' : {},
	'smk' : {}
};

/**
 * Others cache
 * @type {Object.<string,*>}
 */
var caches = { jenjang: false, jenis: false };

/**
 * format filter status
 * @type {Object.<string,*>}
 */
var MASTER_JENIS = [['', 'Seluruh Naungan'], ['dinas', 'Naungan Kemdikbud'], ['depag', 'Naungan Kemenag']];

var option, filter;
/**
 * Perform initialization process
 */
function initialize() {
   // workspace
   workspace = $('#js-workspace');

   // bind button aktivasi
   workspace.find('.js-aktivasi-btn').click(function() {
      window.location = Env.BASE_URL + '/aktivasi/';
   });

   // set preference(s)
   $.each(Env.DINAS, function(i, item) {
      domains[item.kota[0]] = item.domain;
   });

   // initialize map and markers
   var map, marker, markers, ib;
   var defaultPosition = new google.maps.LatLng(Env.GOOGLEMAP[0], Env.GOOGLEMAP[1]);
   map = new google.maps.Map(document.getElementById('gmap'), {
      center:            defaultPosition,
      mapTypeId:         google.maps.MapTypeId.ROADMAP,
      panControl:        false,
      scrollwheel:       false,
      streetViewControl: false,
      zoom:              Env.GOOGLEMAP[2]
   });

   // prepare infobox
   var content = $(['<div class="mapcard dinas"><div class="profil">',
                    '<img class="js-ib-img" src="' + (Env.STATIC_URL + '/assets/img/global/avatar-dinas.png') +'" />',
                    '<div class="msg"><h3><a class="js-ib-kota" href="javascript:"></a></h3>',
                    '<em class="green js-ib-nama"></em><table class="tbl-data full"><tbody>',
                    '<tr><td>Sekolah</td><td class="ar"><a class="js-ib-sekolah">0</a></td></tr>',
                    '<tr><td>Siswa</td><td class="ar"><a class="js-ib-siswa">0</a></td></tr>',
                    '<tr><td>Guru</td><td class="ar"><a class="js-ib-guru">0</a></td></tr>',
                    '<tr><td>Sarpras</td><td class="ar"><a class="js-ib-sarpras">0</a></td></tr>',
                    '</tbody></table></div></div></div></div>'].join(''));

   ib = new InfoBox({
            alignBottom:            true,
            content:                content[0],
            closeBoxMargin:         'float: right; margin-top: 5px; margin-right: 5px;',
            closeBoxURL:            'http://www.google.com/intl/en_us/mapfiles/close.gif',
            enableEventPropagation: false,
            infoBoxClearance:       new google.maps.Size(5, 35),
            isHidden:               false,
            maxWidth:               0,
            pixelOffset:            new google.maps.Size(-32, -7)
         });

   // bind change position
   google.maps.event.addListener(map, 'click', function () {
      ib.close();
   });

   // set markers
   $.each(Env.DINAS, function(i, item) {
      var position = new google.maps.LatLng(item.lintang, item.bujur);
       marker = new google.maps.Marker({
         draggable: false,
         position:  position,
         icon:      Env.STATIC_URL + '/assets/img/gmap/ic20-dinas.png',
         map:       map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
         return function() {
            var jml_siswa = 0;
            for (var tingkat = 0; tingkat <= 12; tingkat++) {
               jml_siswa += ( +Env.DINAS[i].rekap['jml_siswa_l' + tingkat][0] ) + ( +Env.DINAS[i].rekap['jml_siswa_l' + tingkat][1] ) +
                            ( +Env.DINAS[i].rekap['jml_siswa_p' + tingkat][0] ) + ( +Env.DINAS[i].rekap['jml_siswa_p' + tingkat][1]);
            }

            var base_url = Env.BASE_URL.substring(Env.BASE_URL.indexOf('.') + 1);

            // update content infobox
            content.find('.js-ib-kota').html(Env.DINAS[i].kota[1]).attr('href', 'http://' + domains[Env.DINAS[i]['kota'][0]] + '.' + base_url);
            content.find('.js-ib-nama').html(Env.DINAS[i].nama);
            content.find('.js-ib-sekolah').html(Application.currency( ( +Env.DINAS[i].rekap['jml_sekolah'][0] ) + ( +Env.DINAS[i].rekap['jml_sekolah'][1] ) ) );
            content.find('.js-ib-siswa').html(Application.currency( jml_siswa ));
            content.find('.js-ib-guru').html(Application.currency( ( +Env.DINAS[i].rekap['jml_guru'][0] ) + ( +Env.DINAS[i].rekap['jml_guru'][1] ) ));
            content.find('.js-ib-sarpras').html(
               Application.currency( ( ( +Env.DINAS[i].rekap['jml_prasarana'][0] ) +  ( +Env.DINAS[i].rekap['jml_prasarana'][1] ) ) +
                                    ( ( +Env.DINAS[i].rekap['jml_sarana'][0] ) + ( +Env.DINAS[i].rekap['jml_sarana'][1] ) ) )
            );

            var logo =  Env.DINAS[i].logo;
            content.find('.js-ib-img').each(function () {
               Html.Image(this).load(logo, Env.STATIC_URL + '/assets/img/global/avatar-dinas.png');
            });

            // open infobox
            ib.open(map, marker);
         };
      })(marker, i));
   });

   // filter
   option = Xtml.Option( workspace.find('.js-filter') );
   option.populate(MASTER_JENIS, MASTER_JENIS[0][0]);
   option.change(function () {
   	var jenjang = router[0],
       	 form    = router[1] || FORMS[0],
       	 jenis   = this.rel;
   	window.location = '/#!/' + jenjang + '/' + form + '/' + jenis;
   });

   // filter
   var naungan = window.location.search || '',
   	 naungan = naungan.replace(/\?jenis=/g, '') || '',
   	 naungan = (naungan == 'depag' ? 2 : naungan == 'dinas' ? 1 : 0);

   filter = Xtml.Option( workspace.find('.js-naungan') );
   filter.populate(MASTER_JENIS, MASTER_JENIS[naungan][0]);
   filter.change(function () {
   	window.location = '/?jenis=' + this.rel;
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

   // validate router
   router = hash['route'];
   var jenjang = Object.keys(Env.JENJANG).filter(function(item) {
      return Env.JENJANG[item][0] == router[0];
   });

   // dispatch controller from hash
   if (jenjang.length) {
      new controllers['rekapitulasi']();
   } else {
      new controllers['home']();
   }
}

/**
 * Render all tables
 */
function render(jenjang, jenis, data) {
   // save previous jenjang
   caches.jenjang = jenjang;
   caches.jenis  = jenis;

   // selected
   option.populate(MASTER_JENIS, MASTER_JENIS[(jenis == 'dinas' ? 1 : jenis == 'depag' ? 2 : 0)][0]);

   // total
   var total = {
      sekolah: 	[0, 0],
      siswa:   	[0, 0, 0, 0],
      guru:    	[0, 0],
      sarpras: 	[0, 0],
      lulusan: 	[0, 0, 0, 0],
      kompetensi: [0, 0]
   };

   // reset tables
   var sekolah    = workspace.find('.js-rekap-sekolah').children('tbody').empty(),
       siswa      = workspace.find('.js-rekap-siswa').children('tbody').empty(),
       guru       = workspace.find('.js-rekap-guru').children('tbody').empty(),
       sarpras    = workspace.find('.js-rekap-sarpras').children('tbody').empty(),
       lulusan    = workspace.find('.js-rekap-lulusan').children('tbody').empty(),
       kompetensi = workspace.find('.js-rekap-kompetensi').children('tbody').empty();
       base_url   = Env.BASE_URL.substring(Env.BASE_URL.indexOf('.') + 1);

   // render tables
   console.log(data); 
   $.each(data, function(i, item) {
      // render table sekolah
      var tr = $('<tr/>');
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(item['jml_sekolah'][0]) + '</td>')
        .append('<td>' + Application.currency(item['jml_sekolah'][1]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/sekolah' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '')  + '">' +
                Application.currency(item['jml_sekolah'][0] + item['jml_sekolah'][1]) + '</a></td>')
        .appendTo(sekolah);

      // total sekolah
      total['sekolah'][0] += item['jml_sekolah'][0];
      total['sekolah'][1] += item['jml_sekolah'][1];

      // render table siswa
      var tr = $('<tr/>');
      var jml_siswa = [0, 0, 0, 0];
      for (var tingkat = 0; tingkat <= 12; tingkat++) {
         jml_siswa[0] += item['jml_siswa_l' + tingkat][0];
         jml_siswa[1] += item['jml_siswa_p' + tingkat][0];
         jml_siswa[2] += item['jml_siswa_l' + tingkat][1];
         jml_siswa[3] += item['jml_siswa_p' + tingkat][1];
      }
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(jml_siswa[0]) + '</td>')
        .append('<td>' + Application.currency(jml_siswa[1]) + '</td>')
        .append('<td>' + Application.currency(jml_siswa[2]) + '</td>')
        .append('<td>' + Application.currency(jml_siswa[3]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/siswa' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '') + '">' +
                Application.currency(jml_siswa[0]+jml_siswa[1]+jml_siswa[2]+jml_siswa[3]) + '</a></td>')
        .appendTo(siswa);

      // total siswa
      total['siswa'][0] += jml_siswa[0];
      total['siswa'][1] += jml_siswa[1];
      total['siswa'][2] += jml_siswa[2];
      total['siswa'][3] += jml_siswa[3];

      // render table guru
      var tr = $('<tr/>');
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(item['jml_guru'][0]) + '</td>')
        .append('<td>' + Application.currency(item['jml_guru'][1]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/guru' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '') + '">' +
                Application.currency(item['jml_guru'][0] + item['jml_guru'][1]) + '</a></td>')
        .appendTo(guru);

      // total guru
      total['guru'][0] += item['jml_guru'][0];
      total['guru'][1] += item['jml_guru'][1];

      // render table sarpras
      var tr = $('<tr/>');
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(item['jml_prasarana'][0] + item['jml_prasarana'][1]) + '</td>')
        .append('<td>' + Application.currency(item['jml_sarana'][0] + item['jml_sarana'][1]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/sarpras' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '') + '">' +
                Application.currency((item['jml_prasarana'][0] + item['jml_prasarana'][1]) +
                (item['jml_sarana'][0] + item['jml_sarana'][1])) + '</a></td>')
        .appendTo(sarpras);

      // total sarpras
      total['sarpras'][0] += (item['jml_prasarana'][0] + item['jml_prasarana'][1]);
      total['sarpras'][1] += (item['jml_sarana'][0] + item['jml_sarana'][1]);

      // render table lulusan
      var tr = $('<tr/>');
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(item['jml_lulusan_dunia_usaha'][0] + item['jml_lulusan_dunia_usaha'][1]) + '</td>')
        .append('<td>' + Application.currency(item['jml_lulusan_wiraswasta'][0] + item['jml_lulusan_wiraswasta'][1]) + '</td>')
        .append('<td>' + Application.currency(item['jml_lulusan_mandiri'][0] + item['jml_lulusan_mandiri'][1]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/lulusan' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '') + '">' +
                Application.currency(((item['jml_lulusan_dunia_usaha'][0] + item['jml_lulusan_dunia_usaha'][1]) +
                (item['jml_lulusan_wiraswasta'][0] + item['jml_lulusan_wiraswasta'][1]) +
                (item['jml_lulusan_mandiri'][0] + item['jml_lulusan_mandiri'][1])) >
                (item['jml_lulusan_tahun_lalu'][0] + item['jml_lulusan_tahun_lalu'][1]) ?
                ((item['jml_lulusan_dunia_usaha'][0] + item['jml_lulusan_dunia_usaha'][1]) +
                (item['jml_lulusan_wiraswasta'][0] + item['jml_lulusan_wiraswasta'][1]) +
                (item['jml_lulusan_mandiri'][0] + item['jml_lulusan_mandiri'][1])) :
                (item['jml_lulusan_tahun_lalu'][0] + item['jml_lulusan_tahun_lalu'][1])) + '</a></td>')
        .appendTo(lulusan);

      // total lulusan
      total['lulusan'][0] += (item['jml_lulusan_dunia_usaha'][0] + item['jml_lulusan_dunia_usaha'][1]);
      total['lulusan'][1] += (item['jml_lulusan_wiraswasta'][0] + item['jml_lulusan_wiraswasta'][1]);
      total['lulusan'][2] += (item['jml_lulusan_mandiri'][0] + item['jml_lulusan_mandiri'][1]);
      total['lulusan'][3] += (item['jml_lulusan_tahun_lalu'][0] + item['jml_lulusan_tahun_lalu'][1]);

      // render table kompetensi
      var tr = $('<tr/>');
      tr.append('<td>' + (i + 1) + '</td>')
        .append('<td nowrap="nowrap" class="al"><a class="tips-rs" href="http://' + domains[item['kota'][0]] + '.' + base_url + '">' +
                item['kota'][1] + '</a></td>')
        .append('<td>' + Application.currency(item['jml_kompetensi'][0]) + '</td>')
        .append('<td>' + Application.currency(item['jml_kompetensi'][1]) + '</td>')
        .append('<td><a title="lihat data sekolah" class="tips-ls" href="http://' + domains[item['kota'][0]] + '.' + base_url + '/#!/'+ jenjang +'/kompetensi' + (caches.jenis && caches.jenis != '' ? '/' + caches.jenis : '') + '">' +
                Application.currency(item['jml_kompetensi'][0] + item['jml_kompetensi'][1]) + '</a></td>')
        .appendTo(kompetensi);

      // total kompetensi
      total['kompetensi'][0] += item['jml_kompetensi'][0];
      total['kompetensi'][1] += item['jml_kompetensi'][1];
   });

   // update total rekapitulasi
   // update sekolah
   workspace.find('.js-sekolah-negeri').html(Application.currency(total['sekolah'][0]));
   workspace.find('.js-sekolah-swasta').html(Application.currency(total['sekolah'][1]));
   workspace.find('.js-sekolah-total').html(Application.currency(total['sekolah'][0] + total['sekolah'][1]));

   // update siswa
   workspace.find('.js-siswa-negeri-l').html(Application.currency(total['siswa'][0]));
   workspace.find('.js-siswa-negeri-p').html(Application.currency(total['siswa'][1]));
   workspace.find('.js-siswa-swasta-l').html(Application.currency(total['siswa'][2]));
   workspace.find('.js-siswa-swasta-p').html(Application.currency(total['siswa'][3]));
   workspace.find('.js-siswa-total').html(Application.currency(total['siswa'][0] + total['siswa'][1] + total['siswa'][2] + total['siswa'][3]));

   // update guru
   workspace.find('.js-guru-negeri').html(Application.currency(total['guru'][0]));
   workspace.find('.js-guru-swasta').html(Application.currency(total['guru'][1]));
   workspace.find('.js-guru-total').html(Application.currency(total['guru'][0] + total['guru'][1]));

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
   workspace.find('.js-kompetensi-negeri').html(Application.currency(total['kompetensi'][0]));
   workspace.find('.js-kompetensi-swasta').html(Application.currency(total['kompetensi'][1]));
   workspace.find('.js-kompetensi-total').html(Application.currency(total['kompetensi'][0] + total['kompetensi'][1]));
}

/**
 * Controller description for no hasbanga
 */
controllers['home'] = function() {
   // show div(s)
   workspace.find('.js-menu-btn').hide();
   workspace.find('.js-aktivasi').show();
   workspace.find('.namecard').addClass('on');

   // on load complete
   var parent = workspace.find('#js-pagediv-index');
   parent.siblings('.js-pagediv').hide();
   parent.show();
};

/**
 * Controller description for hashbang: #!/{jenjang}/{form}
 */
controllers['rekapitulasi'] = function() {
   var jenjang = router[0],
       form    = router[1] || FORMS[0],
       jenis   = router[2] || "",
       k_jenis = jenis ? jenis : '';

   // show div(s)
   workspace.find('.js-aktivasi').hide();
   workspace.find('.js-menu-btn').show();

   // set current active icon
   workspace.find('.icj-' + jenjang).addClass('on');
   workspace.find('.icj-' + jenjang).siblings('.icj').removeClass('on');
   workspace.find('.namecard').removeClass('on');

   // build sub menu
   // TODO: print directly on index.html
   var app = workspace.find('.js-app-menu').empty();
   var ul  = $('<ul/>');

   ul.append('<li><a href="#!/'+ jenjang +'/sekolah' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="sekolah">Data Sekolah</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/siswa' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="siswa">Data Siswa</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/guru' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="guru">Data Guru</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/sarpras' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="sarpras">Data Sarpras</a></li>');

   if (jenjang == 'smk')
   ul.append('<li><a href="#!/'+ jenjang +'/lulusan' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="lulusan">Data Kelulusan</a></li>')
     .append('<li><a href="#!/'+ jenjang +'/kompetensi' + (k_jenis != '' ? '/' + k_jenis : '') + '" rel="kompetensi">Data Kompetensi Keahlian</a></li>');

   ul.appendTo(app);

   // get K_JENJANG
   var k_jenjang = Object.keys(Env.JENJANG).filter(function(item) {
      return Env.JENJANG[item][0] == jenjang;
   })[0];

   // update label
   workspace.find('.js-jenjang').html(Env.JENJANG[k_jenjang][1]);
   workspace.find('.js-crumb').html('<a class="ic lbl">Peta Pendidikan</a>' +
                                    '<a class="ic ic-p-r lbl" href="/">' + Env.LEMBAGA.propinsi[1] + '</a>' +
                                    '<span class="ic ic-p-r lbl">'+ Env.JENJANG[k_jenjang][1] +'</span>');
    // select submenu
   app.find('a[rel='+form+']').closest('li').addClass('on');
   app.find('a[rel='+form+']').siblings('li').removeClass('on');

   workspace.find('.js-form').html(
		form == 'sekolah' ? 'Sekolah' : form == 'siswa' ? 'Siswa' : form == 'guru' ? 'Guru' :
		form == 'sarpras' ? 'Sarpras' : form == 'lulusan' ? 'Kelulusan' : 'Kompetensi Keahlian');


   // render rekapitulasi
   jenis = jenis ? jenis : 'semua';
   if (rekapitulasi[jenjang][jenis]) {
      // fetch from cache
      if (jenjang != caches.jenjang || jenis != caches.jenis)
         render(jenjang, jenis, rekapitulasi[jenjang][jenis]);
   } else {
      // request from server
      rekapitulasi[jenjang][jenis] = {};
      Application.request(Env.BASE_URL + '/statistik/?k_jenjang=' + k_jenjang + '&jenis=' + k_jenis, false, function (json) {
         rekapitulasi[jenjang][jenis] = json.rekap;
         render(jenjang, jenis, rekapitulasi[jenjang][jenis]);
      });
   }

   // on load complete
   var parent = workspace.find('#js-pagediv-detil'),
       child  = workspace.find('#js-pagediv-detil-' + form);

   parent.siblings('.js-pagediv').hide();
   parent.show();
   child.siblings('.js-child-div').hide();
   child.show();
};

/**
 * Run Application
 */
Application.run(dispatch);

})();
