<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>SIAP Online Provinsi</title>
    <link rel="stylesheet" type="text/css" href="assets/css/global.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/icon.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/warn.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/table.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/font/MuseoSans_500.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/dapendik.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/sekolah.css" media="all" />
    <link rel="stylesheet" type="text/css" href="assets/css/override.css" media="all" />
    <link type="text/css" rel="stylesheet" href="assets/css/map.css"/>

    <script type="text/javascript">
        Env = {};
        Env.BASE_URL    = '';
        Env.STATIC_URL  = 'assets/';
        Env.MAINTENANCE = false;
        /*
         * Fail-safe console object
         */
        window.console || (window.console = {});
        window.console.log || (window.console.log = function () {});
        /*
         * LAB.js (LABjs :: Loading And Blocking JavaScript)
         * v2.0.3 (c) Kyle Simpson
         * MIT License
         */
        (function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);

        // load version file
        // load version file
        $LAB.script(Env.STATIC_URL + 'version/version.' + (new Date).getTime() + '.js').wait(function () {
            // load core libraries
            $LAB.script(Env.STATIC_URL + Version.url('js/lib/json2.min.js')).wait()
                .script(Env.STATIC_URL + Version.url('js/lib/jquery/jquery-1.8.3.min.js')).wait()
                .script(Env.STATIC_URL + Version.url('js/lib/jquery/jquery.cookie.min.js')).wait()
                .script(Env.STATIC_URL + Version.url('js/lib/autocomplete/jquery.autocomplete.min.js'))
                .script(Env.STATIC_URL + Version.url('js/lib/utils/master.js'))
                .script(Env.STATIC_URL + Version.url('js/lib/utils/util.js'))
                .script(Env.STATIC_URL + Version.url('js/lib/utils/html.js'))
                // load Application class
                .script(Env.STATIC_URL + Version.url('js/app.js')).wait(function () {
                    $(function () {
                        // start application
                        Application.start();

                        // global header
                        $('#global-header').find('a').click(function () {
                            var menu = $(this),
                                menus = menu.siblings('a'),
                                className = menu.attr('class').replace(/^.*(js-[a-z]+-menu).*$/, '$1'),
                                subs = menu.siblings('.tips-modal'),
                                sub = subs.filter('.' + className.replace('menu', 'submenu'));

                            if (sub.is(':visible')) {
                                sub.slideUp();
                                menu.removeClass('on');
                            } else {
                                subs.not(sub).slideUp();
                                menus.not(menu).removeClass('on');
                                sub.css('left', menu.position().left).slideDown();
                                menu.addClass('on');
                            }
                        });

                    });
                });
        });
    </script>
</head>
<body>
<div id="global-header">
    <div class="head-global sdw clear">
        <div class="fl">
            <a href="http://produk.siap-online.com/"><span class="logo">SIAP</span></a>
            <a class="js-komunitas-menu" href="javascript:;"><span>Komunitas</span></a>
            <a class="js-sekolah-menu" href="javascript:;"><span>Sekolah</span></a>
            <a class="js-dinas-menu" href="javascript:;"><span>Departemen</span></a>
            <a class="" href="http://visibel.siap-online.com/"><span>Pustaka</span></a>
            <a class="js-psb-menu" href="javascript:;"><span>PPDB</span></a>
            <div class="tips-modal js-komunitas-submenu">
                <div class="menu"> <ul> <li><a href="http://siapku.com/#!">Portal</a></li> <li><a href="http://siapku.com/#!/users">Direktori Anggota</a></li> <li><a href="http://siapku.com/#!/groups">Direktori Komunitas</a></li>  <li><a href="http://wacana.siap-online.com">Wacana</a></li>  </ul> </div>
            </div>
            <div class="tips-modal js-sekolah-submenu">
                <div class="menu"> <ul> <li><a href="http://siap-online.com/sekolah/#!/sekolah">Portal</a></li> <li><a href="http://siap-sekolah.com/">Web Sekolah</a></li> </ul> </div>
            </div>
            <div class="tips-modal js-dinas-submenu">
                <div class="menu"> <ul> <li><a href="http://siap-online.com/dinas/#!/kota">Portal Departemen</a></li> <li><a href="http://siap-dinas.com/">Web Departemen</a></li> </ul> </div>
            </div>
            <div class="tips-modal js-psb-submenu">
                <div class="menu"> <ul> <li><a href="http://siap-ppdb.com">Portal</a></li> </ul> </div>
            </div>
        </div>
        <div class="fr">
            <a href="https://paspor.siap-online.com/cas/login"><span>mendaftar / login</span></a>
        </div>
    </div>
</div>
<!-- dasbor user -->
<div class="wrap sdw-l" id="js-workspace">
</div>

<div class="foot-global">
    <div class="sdw-h"> <span><span></span></span></div>
    <div class="section">
        <table>
            <tr>
                <td class="telkom"><a href="http://www.telkom.co.id/" target="_blank"></a></td>
                <td class="slogan">Layanan ini diselenggarakan oleh PT. TELKOM INDONESIA untuk dunia pendidikan di Indonesia.<br />
                    Mari kita majukan bangsa Indonesia, melalui pemanfaatan Teknologi Informasi yang tepat guna <br />
                    pada dunia pendidikan Indonesia.</td>
                <td class="version"><em>Sistem Informasi Aplikasi Pendidikan<br />versi 2.0.0 Beta</em></td>
                <td class="siap-sml"></td>
            </tr>
        </table>
    </div>
    <div align="center" class="section sml">
        <a href="http://produk.siap-online.com/" target="_blank">SIAP Online</a> &nbsp;|&nbsp;
        <a href="http://produk.siap-online.com/pesan-anda/" target="_blank">Bantuan pengguna</a> &nbsp;|&nbsp;
        <a href="http://produk.siap-online.com/produk/siap-online/ketentuan-layanan-siap-online/" target="_blank">Ketentuan layanan</a>
    </div>
</div>
</body>
</html>