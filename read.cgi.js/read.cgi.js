/*
var NODEJS = "http://nodessl.open2ch.net:8880"; //http
var NODEJS = "https://nodessl.open2ch.net:2083"; //https-test

*/
var NODEJS = "https://nodessl.open2ch.net:8443";

var speech;
var speechUtt;
var pm = getUrlVars();

var storage = {};

$(function(){
	$("button").click(function(e){
		e.preventDefault();
	});
});

//地図機能
(function() {

	function get_geo(){
		if (!navigator.geolocation){
			alert("navigator.geolocation の対応しているブラウザを使用してください。");
		}else{
			let option = {
			  enableHighAccuracy: true,
			  maximumAge: 1,
			  timeout: 10000
			};
		let current = 'current-position';
			navigator.geolocation.getCurrentPosition(
			  function(position){ geo_success(current, position); },
			  function(error){ geo_err(current, error); },
			  option
			);
		}
	}

	function geo_success(id, position) {

		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		let query = window.btoa(lat + "," + lon);
		    query = query.replace(/==/,"");

		//          var url = "https://maps.google.co.jp/maps?q="+query +"&output=embed&z=16";
		  let url = "/lib/yahoomap/?q="+query + "&p=p";
		  let google = "https://www.google.com/maps?q="+query;

		//          var html = '<iframe frameborder=0 src='+url+' width="200" height="200"></iframe>';
		  let html = '<div style="padding:5px;border:1pt dotted black;text-align:center;margin-top:3px">' + 
		             '<div style="background:#333333;color:white;padding:3px">地図プレビュー</div>' + 
		             '<div style="padding:10px">' + 
		             '<input class=useMap type=button value="この地図を使う" code="#map('+query+')"> ' + 
		             '<input class=mapClose type=button value="やめる">' + 
		             '</div>' + 
		             '<iframe scrolling=no frameborder=0 src="'+url+'" width="320" height="250"></iframe>' + 
		             '</div>';

		$("#map").html(html);
		moveToMiddle($("#map"));
	}

	function geo_err(id, error){
		let e = "";
		if (error.code == 1) { //1＝位置情報取得が許可されてない（ブラウザの設定）
			e = "位置情報が許可されてません";
		}
		if (error.code == 2) { //2＝現在地を特定できない
			e = "現在位置を特定できません";
		}
		if (error.code == 3) { //3＝位置情報を取得する前にタイムアウトになった場合
			e = "位置情報を取得する前にタイムアウトになりました";
		}
			alert("GPSエラー：" + e);
	}

	function show_map() {

		let lat = "35.685175";
		let lon = "139.7528";
		let query = window.btoa(lat + "," + lon);
		    query = query.replace(/==/,"");

		let url = "/lib/yahoomap/?q="+query + "&p=p";
		let google = "https://www.google.com/maps?q="+query;
		
		let html = '<div class="mapEditer" style="background:white;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);' + 
		           'padding:5px;border:1pt dotted black;text-align:center;margin-top:3px">' + 
		           '<div style="font-size:9pt;background:#000044;color:white;padding:3px">地図エディタ' + 
		'<div style="font-size:8pt;display:inline-block;float:right" ><a href=# class=mapClose><font color=white>閉</font></a></div>' + 
		           '</div>' + 
		           '<div style="padding:10px">' + 
		           '<input class=useMap type=button value="この地図を使う" code="#map('+query+')"> ' + 
		           '<input class=mapClose type=button value="やめる">' + 
		           '</div>' + 
		           '<iframe scrolling=no frameborder=0 src="'+url+'" width="320" height="250"></iframe>' + 
		           '</div>';

		$("#map").html(html);
	}


	$(function(){
		$("#map_bt").click(function(){
			if($(".mapEditer").is(":visible")){
				$("#map").html("");
			} else {
				show_map();
			}
		})


		$("#gps").click(function(){
			if(confirm("位置情報を取得します。よいですか？\n※プレビューで確認してね。\n")){
				get_geo();
			}
		});

		$("#MESSAGE").change(function(){
			if(!$(this).val().match("#map([\d\.]+,[\d\.]+)")){
				$("#map").html("");
			}
		})

		$(document).on("click",".useMap",function(){
			let code = $(this).attr("code");
			let texts = $("#MESSAGE").val() ? $("#MESSAGE").val().split("\n") : [];
			    texts.push(code);
			$("#MESSAGE").val(texts.join("\n"))
				$(this).prop("disabled",true);
		});

		$(document).on("click",".mapClose",function(e){
			if(!$(this).val().match(/#map\([^\)]+\)/)){
				let text = $("#MESSAGE").val();
				    text = text.replace(/#map\([^\)]+\)/g,"");
				$("#MESSAGE").val(text);
				$("#map").html("");
			}
		  e.preventDefault();
		});
	})
}());



// 「ここから新しい投稿」機能
(function(){

	function compareFunc(a, b) {
		return a - b;
	}

	function kokomade_new_func(){
		let last_res = storage[bbs + "/" + key];
		let new_res = server_resnum - last_res;
		let $news = $("<div class='attayo' style='cursor:pointer;border:1px solid #ddd;padding:10px;background:#fff;position:fixed;bottom:30;left:0;border-radius:0 0 10px 0'>" + 
			"前回から<b>"+new_res+"</b>件の新着レス！<font size=1 color=#999>（タップで新着から表示）</font>" + 
			"</div>");
		$("body").append($news);

		$news.click(function(){
			moveToTop($(".new_kokokara"));
			$(".attayo").stop().fadeOut("slow");
		});

		$news.animate({hoge:1},1000*10,function(){
				$(this).fadeOut("slow",function(){
				$(this).remove();
			});
		});

		let resnums = $("dt.mesg").filter(function(i,a){
				return parseInt($(this).attr("res")) > last_res;
			}).map(function(i,a){
				return $(this).attr("res");
		})

		let sort = resnums.sort(compareFunc);
		let from = sort[0];
		let to = sort[resnums.length-1];

		$("dt.mesg").filter(function(i,a){
			return parseInt($(this).attr("res")) > last_res;
		}).map(function(i,a){
				$(this).find(".num").css("color","red");
		})

		$("dt.mesg[res="+from+"]").before( "<a class='new_kokokara'></a>" );

		$(".mesg[res="+to+"]").on("inview",function(){
				$(".attayo").stop().fadeOut("slow");
				$(this).animate({count:0},{duration:1000*5,complete:function(){
					$news.fadeOut("fast");
					$(".num").css("color","");
					$(".kokokara_new,.kokomade_new").slideUp("fast");
				}});
				$(this).unbind("inview");
				$("body").trigger("UPDATE_HISTORY");
		});

		$("dt.mesg[res="+from+"]").on("inview",function(){
			$("body").prop("IS_KOKOKARA_DONE",1);
			let $kokokara = $("<div class=kokokara_new style='border:1px solid #eeeeee;padding:5px;margin-bottom:2px;background:#ffeeee'>" + 
			"↓ここから新着</div>").hide();
			$("dt.mesg[res="+from+"]").before( $kokokara );
				$kokokara.fadeIn("fast");
				$(this).unbind("inview");
		});
	}

	function setup(){

		$(document).on("inview","nn",function(){
			if(!$(this).prop("on")){
				$(this).prop("on",1).animate({count:0},{duration:1000*5,complete:function(){
					$(this).contents().unwrap();
				}});
			}
		});

		storage = gethashStorage("hist");
		let last_res = storage[bbs + "/" + key];

		if(storage[bbs + "/" + key]){
			let new_res = server_resnum - last_res;
			if(new_res > 0){
				kokomade_new_func();
			}
		}
	
	$("body").bind("UPDATE_HISTORY",function(){
			let bbskey = bbs +"/"+key;
			sethashStorage("hist",bbskey,server_resnum,50);
		});
	}

	$(function(){
		setup();
	})

}());

/* 安価通知を消す */
(function(){
	function deleteAnk(val,time){
		var param = {q:val,t:time};
		$.ajax({
			data : param,
			type:'POST',
			url : "/ajax/history/del_ank.cgi",
			success:function(res){
				;
			}
		})
	}

	$(function(){
		$(".delank").click(function(e){
			e.preventDefault();
			$(this).parents(".ankaview").slideUp("fast",function(){
				$("AnkaNum").text("0");
				$(".AnkaList").html("");
			});
			deleteAnk($(this).attr("val"),$(this).attr("time"));
		})
	});
}());


/*バルス*/
var doneValus = false;
$(function(){
	$(".valus_res").on("inview",function(event, isInView, visiblePartX, visiblePartY){
		if(isInView && !doneValus){
			doneValus=1;
			$("#is_valus_after").val(0);
				setTimeout(function(){
				doValus();
				},1000);
		}
	})
});

/*お絵描きツール*/
var isOekakiDone = 1;
var oekaki = (function(){

	var _this = this;

	$(function(){
		$(".dis").hide();
		$("#oekaki_plugin").change(function(){
			update_dis();
		})
		update_dis();
	})

	function setKoraboLink(){

		$(document).on("mouseover", ".opic", function(){ 
			$(this).css("cursor","pointer") 
		});

		$(document).on("click", ".opic", function(){
			if(confirm("この画像とコラボするとね？？\n(他の人が描いた絵をベースに追記できる機能でござる☆)")){

				$("#parent_pid").val($(this).attr("pid"));

				/* 画像をローカル画像に差し替える(編集可能化) */

				var local_image_url = $(this).attr("src").replace("https://.+open2ch.net","");

				var _this = this;

				if($("#oekakiCanvas").is(":visible")){
					$('body').scrollTo('#sketch',{},function(){
						$('#sketch').sketch().setBaseImageURL( local_image_url );
					});
				} else {
					$('body').scrollTo('#oekakiCanvas',{},function(){
						$("#oekakiMode").attr("checked","true");
						$("#oekakiCanvas").show();
						$('#sketch').sketch().setBaseImageURL( local_image_url );
					});
				}

				/* サイズを一致させる */

				var size = $(this).width() + "x" + $(this).height();
				$("#canvasSize").val(size).trigger("change");

			}
		})
	}

	function setPaletColor(color){
		$("#colorPicker").spectrum("set", color);
	}

	function rgb2color(rgb){
		var hex_rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/); 
		function hex(x) {return ("0" + parseInt(x).toString(16)).slice(-2);}
		if (hex_rgb) {
			return "#" + hex(hex_rgb[1]) + hex(hex_rgb[2]) + hex(hex_rgb[3]);
		} else {
			return rgb;
		}
	}

	function color2rgb(color){
		color = color.replace(/^#/, '');
		var r = parseInt(color.substr(0, 2), 16);
		var g = parseInt(color.substr(2, 2), 16);
		var b = parseInt(color.substr(4, 2), 16);
		var code = ([r,g,b]).join(",");
		return "rgb("+code+")";
	}


	this.isOekakiDone = 0;


	this.init_oekaki = function(){

		$(".opic").css({cursor:"pointer"});
		setKoraboLink();
		var doc = document;
		var body = doc.body;
		/* ツール：戻る*/
		var back_actions = [];

		$("#backButton").click(function(){

			if( $('#sketch').sketch().actions.length ){
				back_actions.push( $('#sketch').sketch().actions.pop() );
				$("#prevButton").prop("disabled","");
				$('#sketch').sketch().redraw();
			} else {
				alert("no history");
			}
		});



		if(getCookie("oekakiMode") == 1){
			$("#oekakiCanvas").css("visibility","visible");
		}

		//別窓機能
		if(getCookie("oekaki_window")){
			$("#oekakiCanvas").addClass("oekaki_betumado");
			$("#oekaki_window").prop("checked",true);
		}

		$("#oekaki_window").click(function(){
			if($("#oekakiCanvas").hasClass("oekaki_betumado")){
				$("#oekakiCanvas").removeClass("oekaki_betumado")
			} else {
				$("#oekakiCanvas").addClass("oekaki_betumado")
			}
			setCookie("oekaki_window",$(this).is(":checked") ? 1 : 0);
		});


		$("#prevButton").click(function(){

			if( back_actions.length ){
				$('#sketch').sketch().actions.push( back_actions.pop() );
				$('#sketch').sketch().redraw();
			} else {
				alert("no history");
			}

			if( !back_actions.length ){
				$("#prevButton").prop("disabled","true");
			}

			funcFilUpload();
			funcDragAndDrop();

		});

		/* キーで戻る*/

		$(document).keydown(function(e){
			if( e.which === 90 && e.ctrlKey ){
				$('#sketch').sketch().actions.pop();
				$('#sketch').sketch().redraw();
			}
		}); 


		/*お絵かきモード*/
		var sketch = $('#sketch').sketch();

		sketch.bind("startPainting", function(){
			is_oekaki_focus = 1;
			is_oekaki_done = 0;
			horyu_counter = 0;
			$("horyu").html(horyu_counter);
		});

		sketch.bind("stopPainting", function(){
			is_oekaki_done = 1;
			horyu_counter = 0;
		});


		sketch.bind("mousedown", function(){
			_this.isOekakiDone = 1;
			
			back_actions = [];
			$("#prevButton").prop("disabled","true");
			
		});

		/*スマホ用*/

		sketch.get(0).addEventListener("touchend", function(){
			_this.isOekakiDone = 1;
		});

		$("#colorPicker").spectrum({
			palette: [
			["#000000","#1d2b53","#7e2553","#008751",],
			["#ab5236","#5f574f","#c2c3c7","#fff1e8"],
			["#ff004d","#ffa300","#ffec27","#00e436"],
			["#29adff","#83769c","#ff77a8","#ffccaa"],
			["#FFFFFF"]],
			showAlpha: true,
			showPalette: true,
			change: function(color) {
				changeColorPicker()
			}
		});

		/* スマホは発動しないので直指定 */
		if(isSmartPhone == 1){
			$("#colorPicker").bind("change",function(e){
				changeColorPicker()
			});
		}

		function changeColorPicker(){
			var color = $("#colorPicker").next().find(".sp-preview-inner").css("background-color");
			$('#sketch').sketch("color",color);
		}
		

		$('#sketch').css("background","#FFF");
		$('#sketch').prop("bgcolor","#FFF");
		$('#sketch_honban').hide();

		$("#bgcolorPicker").spectrum({
			color: "#FFFFFF",
			showPalette: true,
			move:setBGColor,
			change:setBGColor
		});

		function setBGColor(){
			var color = $("#bgcolorPicker").next().find(".sp-preview-inner").css("background-color");

			$('#sketch').css("background",color);
			$('#sketch').prop("bgcolor",color);

		}

		if(isSmartPhone == 1){
			$("#bgcolorPicker").bind("change",function(e){
				setBGColor()
			});
			$("#bgcolorPicker").spectrum("set", "#FFF");
		}


		/* ツール関連 */

		$("#psize").change(function(){
			$('#sketch').sketch("size",$(this).val());
		});

		$("#kesu").click(function(){
			$("[data-tool=eraser]").click();
		});

		$("#spoit").click(function(){
			$("[data-tool=spoit]").click();
		});

		$("#fill").click(function(){
			$("[data-tool=fill]").click();
		});




		$("#saveButton").click(function(){
			if(_this.isOekakiDone){
				var link = document.createElement('a');
				link.download = ["open2ch",new Date().getTime()].join("-") + ".png";
				link.href = $('#sketch_honban').get(0).toDataURL("image/png");
				link.click();
			} else {
				alert("まだ何も描かれていないようだ。。");
			}
		});


		/* ツール：クリアボタン */

		$("#clearButton").click(function(){
			if(confirm("お絵かきをクリアします。よろしいですか？")){
				$('#sketch').sketch().clear();
				_this.isOekakiDone = 0;
			}
		});

		$("#kaku").click(function(){
			$("[data-tool=marker]").click();
		});

		if(getCookie("oekakiMode") == 1){
			openOekaki();
		}

		$("#closeOekaki").click(function(e){
			closeOekaki(1);
			e.preventDefault();
		})

		function openOekaki(is_cookie){
			$("#oekakiCanvas").fadeIn("fast").css("visibility","visible");
			if(is_cookie){
				setCookie("oekakiMode",1);
			}
		}

		function closeOekaki(is_cookie){
			$("#oekakiCanvas").fadeOut("fast").css("visibility","hidden");
			if(is_cookie){
				setCookie("oekakiMode",0);
			}
		}

		$("#oekakiMode").click(function(){
			if( $("#oekakiCanvas").is(":visible") ){
				closeOekaki(1);
			} else {
				openOekaki(1);
			}
		})

		$("#oekakiMode").change(function(){
			if($(this).prop("checked") && $("#oekaki_plugin").prop("checked") ){
				loadOekakiEx();
			}
		});


		/* サイズ変更 */
		$("#canvasSize").change(function(){
			var size = $(this).val().split("x");

			var ctx = $("#sketch").get(0).getContext('2d');
			var ctx2 = $("#sketch_honban").get(0).getContext('2d');

			$(ctx.canvas).animate({ 
				width : size[0],
				height : size[1],
			}, "fast",function(){
				ctx.canvas.width = size[0];
				ctx.canvas.height = size[1];
				ctx2.canvas.width = size[0];
				ctx2.canvas.height = size[1];
				$("#sketch").sketch().redraw();
			});
		});

		$(".toolBt").bind("touchstart mousedown",function(){
			$(".toolBt").removeClass("selectedTool");
			$(this).addClass("selectedTool");
			$(this).find("input").trigger("click");
		})
	}

	this.redrawHonban = function(){
		var ctx = $('#sketch_honban').get(0).getContext('2d');
		ctx.fillStyle = $("#sketch").prop("bgcolor");
		ctx.fillRect(0,0,$(this).width(),$(this).height());
		ctx.drawImage($('#sketch').get(0),0,0);
	}

/*お絵描き画像うｐ関連*/
	/* Drag-And-Drop */
	function funcDragAndDrop(){
		var droppable = $("#sketch");
		var cancelEvent = function(event) {
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
		var handleDroppedFile = function(event) {
			cancelEvent(event);
			var file = event.originalEvent.dataTransfer.files[0];
			$("#sketch").css("border","");
			setFile(file);
			return false;
		}

		var handleDragOver = function(event){
			cancelEvent(event);
			$("#sketch").css("border","2pt dashed #444");
			return false;
		}
		droppable.bind("dragover", handleDragOver);
		droppable.bind("dragenter", cancelEvent);
		droppable.bind("drop", handleDroppedFile);
	}

	/* File-Select*/
	function funcFilUpload(){
		$('#upImage').click(function() {
			$('input[name=photo]').trigger('click');
		});
		$('input[name=photo]').change(function(e) {
			var file = e.target.files[0];
			setFile(file);
		});
	}

	function setFile(file){
		var img = new Image();
		var ctx = $("#sketch").get(0).getContext('2d');
		var fileReader = new FileReader();
		fileReader.onload = function(event) {
			$(img).attr('src', event.target.result);
		}
		fileReader.readAsDataURL(file);
		img.onload = function() {
			fitImage(ctx, img);
			$('#sketch').sketch().setBaseImageURL($("#sketch").get(0).toDataURL());

			_this.isOekakiDone = 1;
		};
	}

	function fitImage(ctx, img) {
	 var r;
	 if (img.width / ctx.canvas.width > img.height / ctx.canvas.height) 
	  r = ctx.canvas.width / img.width
	 else 
	  r = ctx.canvas.height / img.height;
	 if (r > 1) r = 1;
	 putImage(ctx, img, 0.5, 0.5, r);
	}

	function putImage(ctx, img, rx, ry, ratio) {
	 var w = img.width * ratio;
	 var h = img.height * ratio;
	 var x = (ctx.canvas.width - w) * clamp(rx, 0, 1);
	 var y = (ctx.canvas.height - h) * clamp(ry, 0, 1);
	 ctx.drawImage(img, x, y, w, h);
	}

	function clamp(num, min, max) {
	 if (min < num) {
	  if (num < max) {
	   return num;
	  }
	  return max;
	 }
	 return min;
	}


/* <お絵かき高機能モード */

		function loadOekakiEx(){
	/*	var url = "http://let.st-hatelabo.com/Fxnimasu/let/hJmd88Dl4M4W.bookmarklet.js"; */
			var url = "//open.open2ch.net/lib/oekakiex/oekakiex.v5.js?v20191218_v11";

			$(".dis").show();
			$(".toolBt").hide();


			$.ajaxSetup({cache: true});
			$.getScript(url);
		}


	$(function(){
		$("#oekaki_plugin").click(function(){
			loadOekakiEx();
		});
		$("#oekaki_plugin").change(
			function(){
				setCookie("oekaki_ex",$(this).prop("checked") ? "1" : "0");

				if(!$(this).prop("checked")){
					alert("ページを再読み込みすると、高機能モードが解除されます。");
				}
		});

		if(getCookie("oekaki_ex") == 1){

			$("#oekaki_plugin").prop("checked",true);
			if(getCookie("oekakiMode")){
				loadOekakiEx();
			}
		}
	});

		//整合性調整
		$("body").bind("OEKAKI_EX_INIT",function(){
				$('#sketch').sketch().bgcolor = "#FFFFFF";
				$("#prevButton").hide();
				$("#clearButton").val("消");
				$("#goBtn").val("進む");
				$("#psize").css("margin-right","5px");
				$("#psize").after($("#goBtn,#backButton"));
				$("#canvasSize2").trigger("change");
		});

	$(document).on("change","#scaleSelect",function(){
		if($(this).val() > 1){
			$("#_canvas").css("text-align","");
		} else {
			$("#_canvas").css("text-align","center");
		}
	});




	return this;



}());





function update_dis(){
	if($("#oekaki_plugin").is(":checked")){
		$(".dis").show();	
		$(".toolBt").hide();
	}
}



/*背景動画*/
$(function(){


	$("#useBGVideo").change(function(){
		
		setCookie("useBGVideo", $(this).is(':checked') ? "on" : "off");

		if(!$(this).is(":checked")){
			removeBGVideo();
		}
	});

	setInterval(check_bg_tag,3000);

})


function check_bg_tag(){
	if(!$("#useBGVideo").is(':checked')){
		return;
	}
	var $bgvideos = $("bgvideo:not(.checked)");
	$bgvideos.addClass("checked");
	if($bgvideos.length){
		var $bgvideo = $("bgvideo:last");
		playBGVideo($bgvideo.attr("vid"));
	}
}



/*草機能*/
$(function(){
	$(".kusaButton").click(function(e){
		e.preventDefault();
		if(!$(this).hasClass("done")){
			var count = parseInt($("kusa").html())+1;
			updateKusa(count);
			nodejs_pushKusa();
			$(this).addClass("done").css({"background":"#ddd"});
		}
	});
});


var preKusa = 0;


function updateKusa(count){
	$("kusa").html(count);
	var w =[];


	function kusaMatome(n,emoji,text){
		var limit = parseInt(count/n);
		for(var i=0;i<limit;i++){
			w.push("<span title='"+(i+1)*n+""+text+"'>"+emoji+"</span>");
		}
		count = count % n;
	}


	var list = [
		[10000,"💩","うこん"],
		[1000,"🍑","おけつ"],
		[100,"🥒","きうり"],
	];

	$(list).each(function(i,a){
		if(count >= a[0]){
			kusaMatome(a[0],a[1],a[2]);
		}
	})

	for(var i=0;i<count;i++){
		w.push("w");
	}

	$("w").html(w.reverse().join(""));

/*
	if(preKusa > 0 && preKusa < count){

		var diff = count - preKusa;

		var kusa = $("<div style='opacity:.5;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);user-select: none;-moz-user-select: none;-ms-user-select: none'>" + 
								 "<div style='white-space: nowrap'><font style='font-size:80pt'>草+" + diff+ "</font></div>" + 
								 "<div align=center><font style='font-size:40pt'>" + count + "</font></div>" + 
								 "</div>"
								);


		kusa.hide();
		$("body").append(kusa);

		kusa.fadeIn("fast");
		kusa.animate({count:0},{duration:1000,complete:function(){
			$(this).fadeOut("fast",function(){$(this).remove()});
		}});

	}

	preKusa = count;
*/

}

/*スレ主コマンド用*/

$(function(){

	$(".admin_command").change(function(){
		$("#MESSAGE").val(
			$("#MESSAGE").val() + $(".admin_command option:selected").val()
		);

		$("#MESSAGE").focus();

	});


})



/*アイコンクリック*/
$(function(){
	$(".faceicon img").live("mouseover",function(){
		$(this).css("border","solid 3px #fed7eb");
		$(this).addClass("faceicon_colored");
	});

	$(".faceicon_colored").live("mouseout",function(){
		$(this).css("border","solid 3px #d7ebfe");
		$(this).removeClass("faceicon_colored");
	});

});




/*設定ボタン関連*/

$(function(){

	$(".settingButton_pc").click(function(){

		if($(".options-1").is(":visible")){
			$(".options-1,.options-2").slideUp("fast");
			$($(this).find("img")).attr("src","//open.open2ch.net/image/icon/setting_on.gif");
			localStorage.offSetting_pc = 1;
		} else {
			$(".options-1,.options-2").slideDown("fast");
			$($(this).find("img")).attr("src","//open.open2ch.net/image/icon/setting_off.gif");
			localStorage.offSetting_pc = 0;
		}
	});

	if( localStorage.offSetting_pc == 1 ){
		$(".settingButton_pc").click();
	}


});

/*検索を目立たせる*/

$(function(){

	$("body").append("<style>hit{background:yellow}</style>");

	if(pm["id"] || pm["q"] ){
		updateHit()
	}

})

function updateHit(){

	var query = decodeURI(pm["id"] || pm["q"]);

	var count = 0;
	$(".id,.mesg").filter(function(obj,i){
		if( !$(this).prop("d") ){
			var html = $(this).html();
			query.split(/ |　/).filter(function(word){
				var pattern=new RegExp(word,["gi"]);
				html = html.replace(pattern,Replacer);
			});
			$(this).html(html).prop("d","1");
			count++;
		};
	});

}

function getUrlVars()
{
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;
    hash  = url.slice(1).split('&');    
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('='); 
        vars[array[0]] = array[1];
    }

    return vars;
}

function Replacer(str,offset,s){
	var greater=s.indexOf('>',offset);
	var lesser=s.indexOf('<',offset);
	if(greater<lesser||(greater!=-1&&lesser==-1)){
		return str;
	} else {
		return'<hit>'+str+'</hit>';
	}
}




$(function() {
	if ('SpeechSynthesisUtterance' in window) {
		speech = eval("speechSynthesis");
		speechUtt = eval("new SpeechSynthesisUtterance()");
	}
});

var voice_did = {};
var speching = 0;
var orgVoice;
var speechQue = [];

$("body").append("<style>.reading{background:yellow}</style>");

function speechLoop(){


	if(speching){
		return;
	}


	var obj = speechQue.shift();

	if(obj){
		var text = obj.text;

		console.log(obj);

		$(".reading").removeClass("reading");
		$("kome[num="+obj.n+"]").addClass("reading");

		text = text.replace(/件|\r\n|\r|\n/g,"");
		text = text.replace(/彡\(ﾟ\)\(ﾟ\)/g,"やきうのおにいちゃん");
		text = text.replace(/彡\(゜\)\(゜\)/g,"やきうのおにいちゃん");
		text = text.replace(/((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))/g,"");
		text = text.replace(/>>/g,"");


		if(isSmartPhone == 0){
				var voices = speech.getVoices();
				if(text.match(/^(?:[\u30A0-\u30FF]|[ｦ-ﾟ]|[0-9a-zA-Z０-９Ａ-Ｚａ-ｚ]|[>%=/\@;:\(\)\!\?,\.\-"']|[「」（）、。！？ー\s])+$/)){
				  voice = speechSynthesis.getVoices().find(function(voice){
				    return voice.name === 'Google português do Brasil';
				  });

				} else {
					voice = voices[0];
				}	
				if(voice){
						speechUtt.voice = voice;
				}
		}

			var max = 100 - (20 * speechQue.length);

			if(max<0){
				max = 5;
			}

			if(new String(text).length > max){
				text = text.substring(0,max) + "りゃく";
			}

			speechUtt.lang = 'ja-JP';
			speechUtt.text = text;
			speech.speak(speechUtt);
			speching=1;
			speechUtt.onend = function(event) {
				speech.cancel();
				speching = 0;
				$(".reading").removeClass("reading");
				if(speechQue){
					speechLoop();
				}
			}
	}
}

/* 音声再生 */
$(function(){

	if(speech && speechUtt){

		$(document).on("change","#allow_yomi",function(){
			speechUtt.text = $(this).prop("checked") ? "このスレを読みまふ" : "読むのを止めまふ。またつかってね！";
			speech.speak(speechUtt);
		});

		$(document).on("change","#use_yomi",function(){

			var sub = isSmartPhone == 1 ? "次回からは画面うえの新着読上げチェックしたら読み上げるでふ" 
			                            : "スレに新着コメがあったら読み上げるでふ";

			speechUtt.text = $(this).prop("checked") ? ("読みモードをおんにしまふ。" + sub) 
				                                       : "読みモードをおふにしまふ。またつかってね！";

			speech.speak(speechUtt);
			$("#allow_yomi").prop("checked",true).trigger("checked");

		});





		$("body").bind("UPDATE_NEWRES",function(event,res){

			$("body").trigger("UPDATE_HISTORY");

		if( 
				(isSmartPhone == 0 && $("#use_yomi").prop("checked")) ||
				(isSmartPhone == 1 && $("#allow_yomi").prop("checked"))
		){

			var dds = [];
			var dd = $(res).find("kome").each(function(){
					var num = $(this).attr("num");
					var text = $(this).text();
					console.log(num + ":" + text)

					speechQue.push({text:text,n:num});
					speechLoop();
			});
		}
		

			if(!isSmartPhone){
				setTimeout(function(){
						$(".new_audio").each(function(i){
							$(this).removeClass("new_audio").trigger("click");
						});
					},1000);
			}
		});
	} else {

		$(document).on("change","#allow_yomi",function(){
			if($(this).prop("checked")){
				alert("無念速報：音声読み上げに対応していないブラウザのようだ。。");
				$(".view_yomi_on").hide();
				$("#allow_yomi").prop("checked",false);

				$("#use_yomi").prop("checked",false).trigger("change");
		

			}
		});


	}
})


/* バルス強化版 */
function doValus(){

	if( $("#is_valus_after").val() != 1 ){

		var shakes = ["shake","shake-hard","shake-horizontal","shake-vertical","shake-opacity"];
		var all_shake = shakes[Math.floor(Math.random()*shakes.length)];

		var valu_shakes = ["shake-chunk","shake-chunk","shake-chunk","shake-opacity","shake-crazy","shake-hard"];
		var valus_shake = valu_shakes[Math.floor(Math.random()*valu_shakes.length)];


		$(".valus_res").addClass(valus_shake);

		setTimeout(function(){

			$('html').addClass(all_shake);
			$(".valus").css('background','#FFCCCC');
			var s = document.createElement('script');
			s.setAttribute('src','//open.open2ch.net/lib/bomb/bomb.v3.js?v181126_v4');
			document.body.appendChild(s);

		},2500);

	}
}

$(function(){
	$("body").bind("valus",doValus);
});



/* */

/*
$(function(){
	$("textarea").focus(function(){
		if(!$("#formfix").is(":checked")){
			$("#formdiv").css({
				"bottom":"0",
				"position":"fixed",
				"backgroundColor":"#DDD",
				"padding":"2px",
				"border":"1pt dotted #999"
			});
			$(".social").hide();
			$("#wCloseButtonDiv").show();
		}
	});


	$("#wcloseButton").click(function(e){
		e.preventDefault();

		if(!$("#formfix").is(":checked")){

			$("#formdiv").slideDown("slow",function(){
				$("#wCloseButtonDiv").hide();
				$("#formdiv").css({
						"bottom":"",
						"position":"",
						"backgroundColor":"",
						"padding":"",
						"border":""
				}).show();
				$(".social").show();
				$("#wCloseButtonDiv").hide();
			});

		}
	});

	$("#submit_button").click(function(){
		if(!$("#formfix").is(":checked")){

			$("#formdiv").slideDown("slow",function(){
				$("#wCloseButtonDiv").hide();
				$("#formdiv").css({
						"bottom":"",
						"position":"",
						"backgroundColor":"",
						"padding":"",
						"border":""
				}).show();
				$(".social").show();
				$("#wCloseButtonDiv").hide();
			});
		}
	});
})
*/


/* 入力中は自動更新を一時停止 */
var is_update_que = 0;
var is_textarea_focus = 0;

var is_oekaki_focus = 0;
var is_oekaki_done = 0;

var pretext;
var MAX_HORYU_TIME = 3;
var horyu_counter = 0;

$(function(){


	setInterval(function(){

		if(is_textarea_focus == 1){
			if(pretext == $("[name=MESSAGE]").val()){

				if(horyu_counter >= MAX_HORYU_TIME || $("[name=MESSAGE]").val() == ""){
					horyu_counter = 0;
					is_textarea_focus = 0;
					auto_horyu_off();
				} else {
					horyu_counter++;
					$("horyu").html(horyu_counter);

				}

			} else {
				horyu_counter = 0;
			}
			pretext = $("[name=MESSAGE]").val();

		} 


		if(is_oekaki_done == 1){

			if(horyu_counter >= MAX_HORYU_TIME ){
				is_oekaki_focus = 0;
				horyu_counter = 0;
				is_oekaki_done = 0;
				auto_horyu_off();
			} else {
				horyu_counter++;
				$("horyu").html(horyu_counter);
			}

		}


	},1000);

	$("[name=MESSAGE]").bind("keyup keydown",function(){

		if(!event.ctrlKey){
			horyu_counter = 0;
			$("horyu").html(0);
			if($("[name=MESSAGE]").val() && is_textarea_focus == 0 && !$("#noWait").is(":checked")){
				is_textarea_focus = 1;
			}
		}
		
	});

	var keyup_timer;



	$("[name=MESSAGE]").blur(function(){
		auto_horyu_off();
	});
})

function auto_horyu_off(flag){

	is_textarea_focus = 0;
	is_oekaki_done = 0;
	horyu_counter = 0;
	pretext = "";

	$("#new_alert_pending").slideUp("fast",function(){
		$(this).remove();
	});

	if(flag == "quick"){
		update_res("now");
	} else {
		setTimeout(function(){
			if($('#autoOpen').is(':checked') && is_update_que == 1){
				update_res("now");
			}
		},500);
	}

}

/* 履歴 */

var is_history_updating = 0;

$(function(){
	$("#history_add").click(function(e){

			e.preventDefault();

			if( is_history_updating ){
				return false;
			}

			is_history_updating =1;


			var $this = $(this);
			var action = {"update":"更新", "new":"追加"};


			$(".history_res")
				.html("<img src=//open.open2ch.net/image/loading.gif> 履歴を更新中")
				.fadeIn("fast");

				setTimeout(function(){
					$.ajax({
						type: "POST",
						url    : "/ajax/add_history.cgi",
						data   :  $("#form1").serialize(),
						cache  : false,
						success: function(res){

							var res = action[res] ? "<a href=//open2ch.net/test/history.cgi>履歴</a>を" + action[res] + "したよ！(ﾟ∀ﾟ)ノ</a>" 
																		: "エラー。なんかおかしいみたい。。(；∀；)";

							$(".history_res").html( "<font color=red>" + res + "</font>");
							setTimeout(function(){
								$(".history_res").fadeOut("fast",function(){ is_history_updating = 0 })


							},5000);

/*
							$(".history_res").html( "<font color=red>" + res + "</font>");
							setTimeout(function(){
								$(".history_res").slideUp("fast",function(){ is_history_updating = 0 })
								$("#history_add").css({"color":"white","cursor":"hand"});
							},5000);
*/


						}
					});
				},300);
	});
});



/* 投票チェックボックス機能 */

$(function(){
	setTimeout(function(){
		if ( new String($("[name=mail]").val()).match(/投票/) ){
			$(".ratingBt").prop("checked",true);
		}
	},100);
	$(".ratingBt").click(function(){
		if ($(this).prop("checked")){
			$("[name=mail]").val( $("[name=mail]").val() + "投票") ;
		} else {
			var val = $("[name=mail]").val();
			val = new String(val).replace(/投票/,"");
			$("[name=mail]").val(val);
		}
		$("[name=mail]").trigger("change");
	});
})



/* 新着レス関連 */

function moveToBottom(target){
	var speed = 400;
	var position = target.offset().top - (window.innerHeight) + target.height();
	$('body,html').stop(true,false).animate({scrollTop:position}, speed, 'swing');
}

function moveToMiddle(target,_speed){
	var speed = _speed ? parseInt(_speed) : 400;
	var position = target.offset().top - (window.innerHeight/2) + (target.height()/2);
	$('body,html').stop(true,false).animate({scrollTop:position}, speed, 'linear');
}

function moveToTop(target,_speed){
	var speed = _speed ? parseInt(_speed) : 400;
	var position = target.offset().top - 50;
	$('body,html').stop(true,false).animate({scrollTop:position}, speed, 'linear');
}


$(function(){

	$("body").append("<div id='ninja_popup'><p></p></div>");
	var my_tooltip = $("#ninja_popup");

	/* アラート自体をおせるように。*/
	$("#new_alert")
	.bind("click",function(e){
		e.preventDefault();
		moveToMiddle($("#new_res_end"));
	});


	$("#gotoNewRes").css("color","lightblue");

	$("#get_newres_button").click(function(e){
		e.preventDefault();
		$("#get_newres_button").fadeOut("fast");
		update_res();
	});

	if(getCookie("autoOpen") == ""){
		$("#autoOpen").attr("checked",true).trigger("change");
	}


	if($("#autoOpen").is(':checked')){
		$("#new_alert_link").hide();
	} else {
		$("#new_alert_link").show();
	}




})


/* レス取得機能 */
$(function(){
	$("ares a").live("click",function(e){
		e.preventDefault();

		$(this).parent().find(".plus").remove();

		if($(this).attr("open")){
			$(this).removeAttr("open");
			var parent = $(this).parent().parent().parent();
			$(parent).find(".aresdata").fadeOut("fast",function(){$(this).remove()});
			return;
		}

		$(this).attr("open","1");
		var resnum = $(this).attr("val");
		var parent = $(this).parent().parent().parent();

		$(parent).find(".aresdata").remove();
		$(parent).append("<div class=aresdata><areshtml style='display:table-cell'></areshtml></div>");
		$(parent).find(".aresdata").hide();

		var query = "resnum=" + resnum + "&s=" + server_resnum;

		$.ajax({
			type: "GET",
			url    : "/ajax/get_ares.v1.cgi/" + bbs + "/" + key + "/",
			data   :query,
			cache  : true,
			success: function(res){

				$(parent).find("areshtml").html( res );
				$(parent).find(".aresclose").show();

				$(parent).find("areshtml").find("a").filter(function(){ 
					if($(this).html().match(/^&gt;&gt;\d+$/)){
						var _resnum = ( $(this).html().match(/^&gt;&gt;(\d+)$/) )[1];
						if(resnum == _resnum){
							$(this).css({"background":"#FF6666","color":"white"});
						}
					} 
				});
					$(parent).find(".aresdata").fadeIn("fast");
			}
		});


	});

})


/* フォーム固定 */
var cachekey;
var ignores = {};
var ignores_array;
var IGNORE_MAX = 50;

function updateIgnore(){
	if(!Object.keys(ignores).length){
		return;
	}

	ignores = {};
	ignores_array.map(function(e){
		ignores[e] = 1;
	})

	jQuery.each(ignores, function(key, val) {
		if(key !== "???"){
			$(".id"+key + "[ignored!='1']").fadeOut("fast").attr("ignored",1);
		}
	});

	var length = ignores_array.length;
	$("#clear_ignore").html("無視設定をクリア(" + length + "件)").show();
}

$(function(){
	cachekey = "ignv3:"+bbs;
	ignores_array = getStorage(cachekey) ? JSON.parse(getStorage(cachekey)) : new Array();

	ignores_array.map(function(e){
		ignores[e] = 1;
	})

	$("#clear_ignore").click(function(e){
		e.preventDefault();
		if(confirm("無視設定をクリアします。\nよろしいですか？")){
			delStorage(cachekey);
			ignores = new Object();
			ignores_array = new Array();

			$(".mesg").fadeIn("fast").removeAttr("ignored");
			$(this).hide();
		}
	});

	$("._id").each(function(){
		var id = $(this).attr("val");
		if(id !== "???"){
			$(this).after(" <a href=# class=ignore val="+id+">×</a>");
		}
	});

	var res;
	if(Object.keys(ignores).length){
		updateIgnore();
	}

	$(".ignore").live("click",function(e){

		e.preventDefault();
		var ID = $(this).attr("val");
		var _ID = ID.replace(/\./g,"");

		if(ignores[ID]){

			var message = "ID:" + ID + " の無視設定を解除します。\nよろしいですか？";

			if( confirm(message) ){ /* 解除 */
				delete ignores[_ID];
				ignores_array = ignores_array.filter(function(e){return e!==_ID});

				$(".id"+_ID).slideDown().removeAttr("ignored");
				updateIgnore();
				if( ignores_array.length ){
					setStorage(cachekey,JSON.stringify(ignores_array))
				} else {
					delStorage(cachekey)
				}

			}
		} else { /*無視*/

			var message = "ID:" + ID + " を無視設定します。\nよろしいですか？";
			if( confirm(message) ){
				ignores[_ID] = 1;
				ignores_array.unshift(_ID);


				if(ignores_array.length > IGNORE_MAX){
					ignores_array.length = IGNORE_MAX;
				}

				setStorage(cachekey,JSON.stringify(ignores_array));
				updateIgnore();
			}
		}

	})

});

$(function(){
	$("#formfix").click(function(){
		var flag = $(this).prop("checked") ? "1" : "0";
		setCookie("fm_kotei",flag);
		setFormKotei(flag);
		$(this).dr;
	});

	if(getCookie("fm_kotei") == 1){
		$("#formfix").prop("checked",true);
		setFormKotei(1)
	}
});


/* 位置固定:移動関連 */
$(function(){
	$("body").append("<style>.bottomDiv{position:fixed}</style>");

	$("textarea").keydown(function(e){
		if(event.ctrlKey){
			if(e.keyCode === 13 && $(this).val()){

				$("#form1").submit();
				return false;
			}
		}
	});
	
});


$(function(){
	
	if(isSmartPhone == 1){
		return;
	}


})

var is_mouseEventInit;
var mouse;

function mouseEventInit(){

	let is_moving;
	let clickOffsetTop;
	let clickOffsetLeft;

	let e = $("#formdiv").get(0);
//	let e = $("#oekakiCanvas").get(0);

	if(is_mouseEventInit){
		return;
	}

	is_mouseEventInit = 1;

	$(document).on("click",".closeKoteiWindow",function(){
		$("#formfix").prop("checked",false);
		setCookie("fm_kotei","");
		setFormKotei(0)
	});


	$(document).on("mousedown",".ddWindow",function(evt){
		is_moving = 1;
		$("body").css({
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});

		$("#MESSAGE").after("<div class=pata style='position:absolute;width:100%' align=center></div>")

		let icons = ["anime_matanki01","anime_matanki02"];

		for(let i=0;i<(1+Math.floor(Math.random()*12));i++){

			let icon = icons[Math.floor(Math.random()*icons.length)];
			let img = $("<img class='_pata' style='position:relative;top:-60' src=//image.open2ch.net/image/icon/2ch/"+icon+".gif>");
			img.hide();
			$(".pata").append(img);
			img.css("animation-duration", "1." + Math.floor(Math.random()*10) + "s");
			img.fadeIn("fast");

		}

		mouse = 'down';
		$(e).css({"opacity":".8","box-shadow":"2px 2px 4px gray"});

		evt = (evt) || window.event;
		clickOffsetTop = evt.clientY - e.offsetTop;
		clickOffsetLeft = evt.clientX - e.offsetLeft;
	});

	$(document).mouseup(function(){
		if(is_moving && $("#formfix").is(":checked") ){
			$(e).css({"opacity":"1","box-shadow":""});
			$(".pata").remove();
			let posi = e.style.top + ":" + e.style.left;
			localStorage.formPosition = posi;
			mouse = 'up';
			$("body").css({
				"-moz-user-select": "",
				"-webkit-user-select": "",
				"-ms-user-select": ""
			});
			is_moving = 0;
		}
	});

	$(document).mousemove(function(evt){
		if($("#formfix").is(":checked")){
			evt = (evt) || window.event;
			if(mouse == 'down'){
				if( (evt.clientY - clickOffsetTop > 0)  && 
						(evt.clientY - clickOffsetTop) + $(e).outerHeight() < window.innerHeight + 100
					){
					e.style.top = evt.clientY - clickOffsetTop + 'px';
				}
				if( (evt.clientX - clickOffsetLeft > -30) &&
						((evt.clientX - clickOffsetLeft)+$(e).outerWidth() < window.innerWidth + 30)
				){
					e.style.left = evt.clientX - clickOffsetLeft + 'px';
				}
			}
		}
	});

}

var koteiTimer;

function setFormKotei(flag){

	mouseEventInit();

	$(".closeKoteiWindow_div").remove("");

	if(flag == 1){
		$("#formdiv").hide();


		$("#formdiv").css({
			"backgroundColor":"#DDD",
			"padding":"2px",
			"border":"1px solid #999",
			"border-radius":"3px",
			"z-index" : 10000
		});

		if(isSmartPhone == 1){
			$("#formdiv").css({
				"position":"fixed",
				"bottom":0,
				"width":"100%"
			});
			$("#formdiv").show();
		} else {

			$(".formDivDefault").after("<p class=closeKoteiWindow_div><button class=closeKoteiWindow>別窓リセット</button></p>");

			$("#formdiv").prepend($(
			"<div class=ddWindow style='border-radius:3px;font-size:0pt;background:#449;color:#007;padding:4px;cursor: move !important;'>"+
			"<div style='width:95%;text-align:center;display: inline-block;'>&nbsp;</div>"+
			"<div style='display: inline-block;'><img class=closeKoteiWindow src=//open.open2ch.net/image/icon/svg/batu_white_v2.svg width=10 height=10 style='cursor:pointer;paddnig:3px'></div>" + 
			"</div>"
			))

			if(koteiTimer){
				clearTimeout(koteiTimer);
				koteiTimer = null;
			}

			koteiTimer = setTimeout(function(){
				$(document).on("mouseleave","#formdiv",function(){

					$("#formdiv").stop(true).animate({"hoge":1},{duration:3000,complete:function(){
						if($('[name="MESSAGE"]').text() == ""){
							$(this).animate({"opacity":".3"},"fast");
						}
					}});
				});

				$("#formdiv").trigger("mouseleave");

				$(document).on("mouseover","#formdiv",function(){
					if(mouse !== 'down'){
						$(this).stop(true).css({"opacity":"1"});
					}
				});

				$('[name="MESSAGE"]').focus(function(){
						$("#formdiv").stop(true).css({"opacity":"1"});
				})

				$(document).on("keydown","#formdiv",function(){
					$("#formdiv").stop(true).css({"opacity":"1"});
				});
			},1000);

			$("#formdiv").css({
				"position":"fixed",
				"top": (window.innerHeight - $("#formdiv").outerHeight()) - 30,
				"left":30,
			});

			if(localStorage.formPosition){
				var posi =localStorage.formPosition;
				var p = posi.split(":");
				$("#formdiv").css({top:p[0],left:p[1]});
			}

			$("#formdiv").show();
			$("body").append($("#formdiv"));


		}



	} else {

		if(koteiTimer){
			clearTimeout(koteiTimer);
			koteiTimer = null;
		}

		localStorage.removeItem('formPosition');
		
		$("#formdiv").css({opacity:"1"});
		$(document).off("mouseleave mouseover keydown","#formdiv");

		$(".ddWindow").remove();


		$("#formdiv").css({
				"top":"",
				"position":"",
				"backgroundColor":"",
				"padding":"",
				"border":"",
				"border-radius":"",

		});

		if(isSmartPhone == 1){
			$("#formdiv").css({"width":""});
		} else {
			$(".formDivDefault").append($("#formdiv"));
		}

		$("#formdiv").show();
	}
}



/* </フォーム固定> */


var hour = new Date().getHours();
var sec = 1000*10;
var defTitle;
var selectedID = {};

$(function(){

/*
	$(document).on("click","img.lazy",function(){
		$(this).lazyload(
			{	effect : "fadeIn",
				effectspeed: 500,
				threshold: 300
			})
	});
*/

	$("iframe[data-src]").lazy(
		{	effect : "fadeIn",
			effectspeed: 500,
			threshold: 300
		}
	);



	$("img.lazy").lazy(
		{	effect : "fadeIn",
			effectspeed: 500,
			threshold: 300
		}
	);



});


function updateIDSelected(callback){

	$(".id").each(function(){
		var id = $(this).attr("val");
		var isSelected;
		if( selectedID[id] ){
			selectedID[id] = 1;
			$(this).css({"color":"red","fontWeight":"bold","background":"#FFEEEE"});
		} else {
			$(this).css({"color":"black","fontWeight":"normal","background":""});
		}
	});

	callback();
}


function updateTuhoNum(){
	var nums = [];
	$(".tchk:checked").each(function(){
		nums.push($(this).attr("value"));
	});
	$("[name=res_num]")
		.val(nums.join(","))
		.trigger("change");
}

function tuhoOpend(){
}

function tuhoClosed(){

}

function viewCheckbox(callback){
	$("dt").each(function(){
		if(!$(this).hasClass("tuho")){
			$(this).addClass("tuho");
			/* Num */
			{
				var $obj = $(this).find(".num");
				var $chk = $("<input class=tchk type=checkbox value='"+ $obj.attr("val") +"'>");
				$chk.change(function(){
					callback();
				});
				$obj.before($chk);
			}
		}
	});
}

function closeCheckbox(){
	$(".tchk").each(function(){
		$(this).remove();
	});

	$("dt").each(function(){
		$(this).removeClass("tuho");
	});

	/* ID選択解除 */
	selectedID = [];
}

function tuhoIDUpdate(){

	var ids = [];
	$(Object.keys(selectedID)).each(function(){
		ids.push( "ID:" + this )
	});
	$("[key=idbox]").val( ids.join("\n") );
	$("[key=idbox]").trigger("change");

}

function IDSelectInit(callback){
	$(".id").click(function(e){

		var id = $(this).attr("val");

		if(selectedID[id]){
			delete selectedID[id];
		} else {
			selectedID[id] = 1;
		}

		updateIDSelected(callback);
		e.preventDefault();
	});
}

/*安価機能*/
$(function(){

	$(".num").live("click",function(e){ 


		if($('#MESSAGE').val()){
			$('#MESSAGE').val(jQuery.trim( $('#MESSAGE').val() ));
		}

		var is_ai = $(this).parent().parent().find("ai").html() ? 1 : 0;
		var text = ($('#MESSAGE').val() ? $('#MESSAGE').val() + "\n" : $('#MESSAGE').val()) + ">>" + $(this).attr("val") + "\n";

		if(is_ai){ text += "!ai " }


		if($(".mainBox").css("display") !== "block"){

			$('#MESSAGE').focus();
			$('#MESSAGE').val( text )


			if($("#formdiv").css("position") !== "fixed"){

				
			}
			e.preventDefault();
		}
	});
})

$(function(){

	$(document).on("click",".closeTuhoWindow",function(){
		$("#tuhoButton").click()
	});

});


function tuhoInit(){
	$(window).on('beforeunload', function() {
		if($(".mainBox").css("display") == "block"){
			return '削除依頼がしとらんよ。このまま移動してよかとね？';
		}
	});
	$(".num").click(function(e){
		if($(".mainBox").css("display") == "block"){
			$(this).parent().find(".tchk").trigger("click");
			e.preventDefault();
		}
	});
	$("[name=res_num_all],[name=res_num],#tuhoComment").bind("change keyup",function(){
		$button = $("#tuhoForm").find("[type=submit]");
		if( $("[name=res_num_all]").prop('checked') || $("[name=res_num]").val() || $("#tuhoComment").val() ){
			$button.removeAttr("disabled");
		} else {
			$button.attr("disabled" ,true);
		}
	})

	$("[name=res_num_all]").click(function(){
		if($("[name=res_num_all]").prop('checked')){
			$("[name=res_num]").attr("disabled" ,true);
		} else {
			$("[name=res_num]").removeAttr("disabled");
		}
	})

	$("#tuhoForm").submit(function(e){
		e.preventDefault();
		var $form = $(this);
		var $win = $("#tuhoWindow");

		$form.find("[type=submit]").attr("disabled",true);
		$("#tuhoLoading").html("<img src='//image.open2ch.net/image/loading.gif'>&nbsp;");

		$.ajax({
				type: "POST",
				url    : "/ajax/tuho_submit.cgi",
				data   :  $form.serialize(),
				cache  : false,
				success: function(res){

					$("#tuhoLoading").html("");
					alert("通報しました。削除人の対応まで、今しばらくおまちください。m(_ _)m");

					$(".mainBox").fadeOut("fast",function(){

						$win.hide();
						closeCheckbox();
						tuhoClosed();
						IDSelectionClear();
						isCheckboxOpened = "";

						$form.get(0).reset();
						$("[name=res_num]").removeAttr("disabled");
						$("#tuhoLoading").html("");
						
						$("#menu").val("");

					});
				}
		})
	});


}


var isCheckboxOpened = 0;

function IDSelectionClear(){
	$(".id").unbind("click");
}

function menuInit(){

	$mainWin = $(".mainBox");
	$mainWin.hide();

	$("#tuhoButton").click(function(){
		var win = $("#tuhoWindow");
		if( $(win).css("display") == "none"){
			$mainWin.fadeIn();
			if(isCheckboxOpened == 0){
				isCheckboxOpened = 1;
				viewCheckbox(function(){updateTuhoNum()});
				IDSelectInit(function(){tuhoIDUpdate()});
			}
			tuhoOpend();
			$(win).show();
		} else {
			tuhoClosed();
			$mainWin.fadeOut(function(){
				$(win).hide();
			});
			closeCheckbox();
			IDSelectionClear();
			isCheckboxOpened = "";
		}
	});
}


var isNodeJS;
var updateChecktimer;

$(document).ready(function() {

	tuhoInit();

	defTitle = document.title;
	if ("WebSocket" in window && is_update_disable == 0) {
		isNodeJS = 1;
		nodejs_connect();
	}
	/* WebSocketに未対応のブラウザは更新チェックしない。*/


	oekaki.init_oekaki();
	matomeInit();
	menuInit();

	$("#autoOpen").change(function(){
		setCookie("autoOpen", $(this).is(':checked') ? "1" : "0");

		if($(this).is(':checked')){

			if($("#get_newres_button").is(":visible") == 1){
				$("#get_newres_button").trigger("click");
			}
			$("#new_alert_link").slideUp();
		} else {
			$("#new_alert_link").slideDown();
		}

	});



	$("#auto_scroll").change(function(){
		setCookie("auto_scroll", $(this).is(':checked') ? "1" : "0");
	});


	$("#new_alert_hide").change(function(){
		setCookie("new_alert_hide", $(this).is(':checked') ? "1" : "0");

		if($(this).is(':checked')){
			if($('#new_alert_link').is(":visible")){
				$('#new_alert').fadeOut();
			}
		} else {
			if($('#new_alert_link').is(":visible")){
				$('#new_alert').fadeIn();
			}
		}

	});

	$("[name=no_nusi]").change(function(){
		setCookie("no_nusi", $(this).is(':checked') ? "1" : "0");
	});


	if(getCookie("no_nusi") == 1){
		$("[name=no_nusi]").prop("checked",true);
	}


	$("#ajaxSubmit").change(function(){
		setCookie("submitMode", $(this).is(':checked') ? "1" : "0");
	});

	$("#noWait").change(function(){
		setCookie("noWait", $(this).is(':checked') ? "1" : "0");
	});


	if(getCookie("useMap") == "on"){
		$("#gps").show();
	}

	$("#useMap").change(function(){
		setCookie("useMap", $(this).is(':checked') ? "on" : "off");

		if($(this).is(":checked") ){
			$("#gps").show();
		} else {
			$("#gps").hide();
		}

	});


	$("#useAnka").change(function(){
		setCookie("useAnka", $(this).is(':checked') ? "on" : "off");
		$(".ankaview_div").show();

		if($(this).is(":checked") && parseInt($("AnkaNum").text()) > 0 ){
			$(".ankaview").hide().slideDown("fast");
		} else {
			$(".ankaview").slideUp("fast");
		}

	});



	$("#noSoundAlert").change(function(){
		setCookie("noSoundAlert", $(this).is(':checked') ? "1" : "0");
	});

	$("#alertRes").change(function(){
		setCookie("alertRes", $(this).is(':checked') ? "1" : "0");
	});
	

	$('#form1').submit(function() {



/* お絵描きデータ生成 */

		if( (oekaki.isOekakiDone == 1) && 
		    $("#oekakiCanvas").is(":visible") && 
		    ($('#sketch').sketch().actions.length || $('#sketch').sketch().baseImageURL) && 
		    $("[name=oekakiData]").val() == ""){


		oekaki.redrawHonban();

		$("#submit_button,#resSubmit").prop("disabled",true);

			var img = new Image();

			var source_id = "#sketch";
	
			if(!$("#oekaki_plugin").is(":checked")){
				source_id = "#sketch_honban";
			}

			var source = $(source_id).get(0).toDataURL("image/png");

			img.src = source;
			img.onload = function(){

			var _source = new String(source).replace(/^data:image\/png;base64,/, '');
					$("[name=oekakiData]").val(_source);
					$('#form1').submit(); 
			}
		
			return false;
		}


		var isAjaxMode = $('#ajaxSubmit').is(':checked');
		if(isAjaxMode){ submit_form() };

		return isAjaxMode ? false : true;
	});

	$("#reuse_req_button").click(function(){

		$(this).prop("disabled",true);
		$(this).after("<img src=/image/loading.gif id=reuse_req_loading>");
		setTimeout(function(){reuse_request()},500);
	});
});


/* まとめLink */

function matomeInit(){
	var query = {
		bbs : bbs,
		key : key,
	};
	$("#matomeLinks").hide().css("lineHeight","12pt");
	$("#showMatome").click(function(){
			if($(this).text() == "まとめ表示"){
				$(this).hide();
				$("#matomeLoading").show();
				$.ajax({
					type: "POST",
					url    : "/ajax/get_matome.cgi",
					data   : query,
					cache  : false,
					success: function(res){
					setTimeout(function(){
								$("#matomeLinks").prepend(res).slideDown();
								$("#matomeLoading").hide();
								$("#showMatome").text("閉じる").show();
						},500);
					}
				});
			} else {
					$("#matomeLinks").slideUp("normal",function(){
						$(this).html("").hide();
						$("#showMatome").text("まとめ表示");
					});
			}
	});

}


function reuse_request(){

	var query = {
		bbs : bbs,
		key : key,
		type: "repair",
		guid: "on"
	};

	$.ajax({
		type: "POST",
		url    : "/ajax/call_request.cgi?guid=on",
		data   : query,
		cache  : false,
		success: function(res){

			if(res.match(/success/)){ /* 投稿成功 */

				count = (res.split(":"))[1];
				$("#reuse_count").html("現在、"+count+"人がこのスレ復活を望んでいます。。");

				setTimeout(function(){
					$("#reuse_req_done").html("ご依頼ありがとうございます。<br>復活リクエストを受け付けました！<br><font color=darkgreen>◆復活人</font>がすぐに確認を行いますのでしばらくお待ちください。。");
				},100);

			} else {
				$("#reuse_req_done").html("既にリクエスト済みか、なんか変です。。");
			}

			$("#reuse_req_button").css("display","none");
			$("#reuse_req_loading").css("display","none");
			$("#reuse_req_done").slideDown("slow");


		}
	});


}



/* フォーム送信関連 */

var submit_flag = 0;
function submit_form(){

	$("body").trigger("SUBMIT_SEND_PRE_START");




	$("#submit_button,#resSubmit").prop("disabled",true);
	$("#loading_bar").slideDown('fast');

/*
	var img = "https://image.open2ch.net/image/read.cgi/image.cgi?" + bbs + "/" + key;
	$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
*/

	$("#status").html("投稿中...");


	var query = {
		FROM : $('[name=FROM]').val(),

		mail : $('[name=mail]').val(),
		sage : ($("[name=sage]").is(':checked') ? 1 : 0),
		ninja : ($("[name=ninja]").is(':checked') ? 1 : 0),
		rating : ($("[name=rating]").is(':checked') ? 1 : 0),
		no_nusi : ($("[name=no_nusi]").is(':checked') ? 1 : 0),

		MESSAGE : $('#MESSAGE').val(),
		bbs : bbs,
		key : key,
		submit : "書",
		mode   : "ajax",
		zitumeiMode : ($("#zitumeiMode").is(':checked') ? 1 : 0),
		timelineMode : ($("#timelineMode").is(':checked') ? 1 : 0),

		parent_pid : $('#parent_pid').val(),

		twfunc   : ($("#twfunc").is(':checked') ? 1 : 0),
		twid     : ($("#twid").is(':checked') ? 1 : 0),
		twsync   : ($("#twsync").is(':checked') ? 1 : 0),

		oekakiMode : ($("#oekakiCanvas").is(":visible") ? 1 : 0),
		oekakiData : ($("#oekakiCanvas").is(":visible") ? $("[name=oekakiData]").val() : "")
	};


			console.log("submit-func");
			is_textarea_focus = 0;
			counter = MAX_HORYU_TIME;

			$("#new_alert_pending").slideUp("fast",function(){
				$(this).remove();
			});



	$.ajax({
		type: "POST",
		url    : "/test/bbs.cgi",
		data   : query,
		cache  : false,
		error  : function(res){
			alert("投稿失敗！\n今はサーバがおかしいみたい。。少し待ってから投稿してみよう！");
			$("#submit_button,#resSubmit").prop("disabled",false);
			$("#loading_bar").slideUp('fast');
		},

		success: function(res){

			$(".dlink").remove();

 /* 投稿成功、新規書き込みを読み込む */

			if(res.match(/success/)){

				$('#MESSAGE').val("");
				$('#oekakiData').val("");
				$("#parent_pid").val("");

				$(".admin_command").val("");



				if($('#sketch').is(":visible")){
					$('#sketch').sketch().clear();

					/* honbanを更新するため呼び出し */
					oekaki.redrawHonban();
				}

/*
				var img = "https://image.open2ch.net/image/read.cgi/image.cgi?mode=done&" + bbs + "/" + key;
				$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
*/
				$("#status").html("投稿完了しました!");
				submit_flag = 1;

				setTimeout(function(){
					$("#submit_button,#resSubmit").prop("disabled",false);
					$("#loading_bar").slideUp('fast');
				},1000);

			} else {
				alert("投稿失敗。。\n"+res);
				$("#submit_button,#resSubmit").prop("disabled",false);
				$("#loading_bar").slideUp('fast');
			}
		}
	});
}

function update_res(flag){

	submit_flag = 0;
	is_update_que = 0;

	var query = "l=" + local_resnum + "&s=" + server_resnum;

	if( $("#get_newres_button").is(":visible") ){
		$("#get_newres_button").slideUp("fast");
	}

	if(flag == "now" || $('#autoOpen').is(':checked') == false){
		$('#new_alert').fadeOut("fast");
	} else {
		setTimeout(function(){
			$('#new_alert').fadeOut("slow");
		},2000);
	}


	local_resnum = server_resnum;
	nodejs_set_resnum(local_resnum);


	
	if(local_resnum >= parseInt(max_resnum*0.9) && !$(".next_thread_div").is(":visible")){
		$(".next_thread_div").slideDown("fast");
	}

	if(local_resnum >= max_resnum && !$(".over_thread_div").is(":visible")){
		$(".over_thread_div").slideDown("fast");
	}

	if(local_resnum == max_resnum){
		startHanabi();
	}



	$.ajax({
		type: "GET",
		url    : "/ajax/get_res.v7.cgi/" + bbs + "/" + key + "/",
		data   :query,
		cache  : true,
		success: function(res){

			if(res.match(/success/)){
				/* update時に最新情報を同時に取得 */

				var html = (res.split(""))[1];

				var already = {};

				$(html).find("a").filter(function(){
					if( m = $(this).html().match(/^&gt;&gt;(\d+)$/) ){
						var resnum = m[1];
						if(!already[resnum]){
							if( ! $("ares[num="+resnum+"]").find(".aresdiv").length ){
									var ares = '<div class="aresdiv">'+
									'<span class="aresspan"><font size=2><a class="aresa" val="'+resnum+'" href="#" >' +
									'<img class="aresicon" width=12 height=12 src="//open.open2ch.net/image/icon/ank.svg">' + 
									'<count></count>件</a></font></span></div>';
									$("ares[num="+resnum+"]").append(ares);
							}

							if( $("[num="+resnum+"]") ){
								$("[num="+resnum+"] div").show();
								var count = parseInt($("[num="+resnum+"] count").html() || 0) + 1;
								$("[num="+resnum+"] count").html(count);

								if( $("[num="+resnum+"] plus").html() ){
									var count = parseInt($("[num="+resnum+"] plus").html()) + 1;
									$("[num="+resnum+"] plus").html(count);
								} else {
									$("[num="+resnum+"] .aresa").after("<font class=plus color=red>+<plus>1</plus></font>");
								}
							}

							already[resnum]=1;
						}
					}
				})
	if( $("#use_autoaudio").prop("checked") ){ html = html.replace('class="audio"','class="audio new_audio"'); }

	html = html.replace(/class="pic lazy oekaki"/g,'class="openpic hide"');
	html = html.replace(/class="pic lazy imgur"/g,'class="imgurpic"');
	html = html.replace(/class="iyoutube"/g,'class="youtubeiframe"');


	if(pageMode == "sp"){
		html = html.replace(/名無しさん＠おーぷん/g,'名無し');
	}

	var htmls = html.split("<sp />").map(function(e){

		var id = $(e).attr("uid");
		var _html;

		if(pageMode == "sp"){
			_html = "<li><dl class=hide><section>" + e + "</section></dl></li>";
		} else { /* PC */
			_html = "<dl class=hide>" + e + "</dl>";
		}

		var html_obj = $(_html);

		if(ignores[id]){
			html_obj.attr("ignored",1)
		}

		$(".thread").append(html_obj);

	});



	if(html.match(/imgurpic/)){
		$(".imgurpic").each(function(){
			var org = $(this).attr("data-src");
			$(this).attr("src",org).removeClass("imgurpic");
		})
	}

	if(html.match(/youtubeiframe/)){
		$(".youtubeiframe").each(function(){
			var org = $(this).attr("data-src");
			var param = $(this).attr("param");
			var embed = "https://www.youtube.com/embed/" + org + (param ? "?" + param : "");
			$(this).attr("src",embed).removeClass("youtubeiframe");


		})
	}

	/* お絵描き遅延 */
	if(html.match(/openpic/)){
		$(".openpic").after("<div class=grid><img src=https://image.open2ch.net/image/icon/svg/loading.v2.svg width=100 height=100></div>");
		setTimeout(function(){
			$(".grid").fadeOut("fast",function(){
				$(this).remove();
				$(".openpic").addClass("pic lazy").fadeIn("slow",function(){
						var org = $(".openpic").attr("data-src");
						$(".openpic").attr("src",org);
						$(this).removeClass("openpic");
						
				});
			});
		},(isSmartPhone ? 5000 : 3000) );
	}

	$(".thread").find("dl:hidden").not("[ignored=1]").slideDown("fast",function(){
		if( $("#auto_scroll").is(":checked") ){
			moveToMiddle($(".thread dl:last"),500);
		}
	});

	document.title = defTitle;

			} else {
				;;
			}

		updateIgnore();

/* 音声置換処理(PC用) */

				$("body").trigger("UPDATE_NEWRES",[html]);


		}


	});


}

$(function(){
	$(document).on("click",".grid",function(){
		e.preventDefault();
		e.stopPropagation();
		return false;
	})
})

/* nodeJS-alert機能 */

function call_update_alert(_server_resnum){

		is_update_que = 1;

		server_resnum = _server_resnum;
		var diff = server_resnum - local_resnum;

/* 更新があった時 */
		if( diff > 0 ){

			if(!$("#new_alert_hide").is(":checked")){
				$('#new_alert').fadeIn('fast');
			}


			$('#now_max').html(diff);
			document.title = "(+" + diff + ")" + defTitle;

			if(!$('#noSoundAlert').is(':checked')){
				if(isSmartPhone == "0"){
					soundManager.play('res');
				}
			}



/* 延期機能 */

			if( !$('#formfix').is(':checked') && 
					!$("#noWait").is(":checked") &&
					( is_textarea_focus == 1 || is_oekaki_focus == 1) ){

				 var mode = is_textarea_focus ? "入力中" : "お絵描き中";

				if(!$("#new_alert_pending").is(":visible")){
					$("#new_alert").append("<div id='new_alert_pending' style='margin-top:3px;color:pink;font-size:8pt'>" + 
						"※"+mode+"の為、保留中 <horyu>0</horyu>/"+ MAX_HORYU_TIME +"秒</div>");
				}

				return;
			}


			if( $('#autoOpen').is(':checked') || 
					submit_flag == 1
				){
					update_res();

			} else {

				$("#get_newres_button").val("新着レスを表示する("+diff+"件)").fadeIn("fast");

			}


			if($('#alertRes').is(':checked')){
					alert("◆お知らせ◆\n新規レスが" + diff + "件ついたよ！");
			}
		}
}

/* Node.js関連 */

var socket;
var sockID;

function setSureConter(count){
	var preNinzu = parseInt($(".sureNinzu").prop("count"));
	var diff = count - preNinzu;

	if( preNinzu > 0){
		if(diff !== 0){
			var diff_div = $("<div>"+(diff > 0 ? "+" : "") + diff+"</div>");

			var is_up = diff > 0 ? 1 : 0;

			$(".lbox_face").attr("src","https://open.open2ch.net/image/icon/svg/kao_" + (is_up ? "happy" : "sad") + ".svg")
										 .stop().animate({n:1},{duration:5000,complete:function(){
												$(this).attr("src","https://open.open2ch.net/image/icon/svg/face.svg");
											}});
			

			$(diff_div).css({"opacity":".8","position":"absolute","top":"-2px","right":"10px","color": (is_up ? "red" : "blue")});

			$(diff_div).addClass("ldiff").hide();
			$(".ninzuDiff").append(diff_div);
			$(diff_div).fadeIn("fast",function(){
				$(this).animate({hoge:1},{duration:2000,complete:function(){
					$(this).fadeOut("fast",function(){ $(this).remove()});
				}})
			});
			




		}
	}

	$(".sureNinzu").prop("count",count)

	if(diff !== 0){
		$(".sureNinzu").fadeOut("fast",function(){ $(this).html(count).fadeIn("fast")})
	} else {
		$(".sureNinzu").html(count);
	}


	if(!$(".lbox").is(":visible")){
		$(".lbox").fadeIn("fast");
	}
}

function setSureTotalConter(count){

	var preCount = parseInt($(".sureTotal").prop("count"));
	var diff = count - preCount;

	if( preCount > 0){
		if(diff !== 0){
			var diff_div = $("<div>"+(diff > 0 ? "+" : "") + diff+"</div>");
			$(diff_div).css({"position":"absolute","top":"-2px","right":"6px","color": (diff > 0? "red" : "blue")});

			$(diff_div).addClass("ldiff").hide();
			$(".pvDiff").append(diff_div);
			diff_div.fadeIn("fast",function(){
				$(this).animate({hoge:1},{duration:2000,complete:function(){
					$(this).fadeOut("fast",function(){ $(this).remove()});
				}})
			});


		}
	}

	$(".sureTotal").prop("count",count)


	if(diff){
		$(".sureTotal").prop("count",count).fadeOut("fast",function(){
			$(this).html(count).fadeIn("fast");
		})
	} else {
		$(".sureTotal").html(count);
	}

}

$(function(){

	$("#retry_button").live("click",function(e){
		socket.socket.reconnect();
		$(this).attr("disabled",true);

		setTimeout(function(){
			if(onConnect_nodejs == 0){
				alert("接続できません。時間を空けてから再度ためしてみてください。");
				$("#retry_button").removeAttr("disabled");
			}
		},3000);

	});

});


var retry = 0;
var onConnect_nodejs = 0;
var max_socket_reconnects = 6;

function nodejs_connect(){


	"use strict";
	socket = io.connect(NODEJS,{
		'max reconnection attempts' : max_socket_reconnects
		}
	);

	socket.on("reconnecting", function(delay, attempt) {
	  if (attempt === max_socket_reconnects) {
	    setTimeout(function(){ socket.socket.reconnect(); }, 5000);
	    return console.log("Failed to reconnect. Lets try that again in 5 seconds.");
	  }
	});

	socket.on('error', function(reason) {
		socket.disconnect();
		io.sockets = [];
		console.log("error! cannot connect.");

	});


	socket.on('disconnect',function(){
		onConnect_nodejs = 0;

		setTimeout(function(){
			if($("#disconnect").is(":visible") == 0 && onConnect_nodejs == 0){
				$("body").append(
					"<div id='disconnect' align=center></div>"
				);
				socket.socket.reconnect();
			}
		},1000);
	});


	socket.on('connect',function(){
		onConnect_nodejs = 1;

		if($("#disconnect").is(":visible") == 1){

			$("#disconnect").remove();

			$("body").append(
				"<div id='connected' align=center>" + 
				"<font color=green>再接続成功。自動更新を再開したよ！</font>" + 
				"</div>"
			);

			$("#connected").css({
			"z-index" : "1000",
			"border-bottom": "1px solid #cceecc",
			"fontSize":"9pt",
			"padding":"5px",
			"background": "#eeffee",
			"position": "fixed",
			"width":"100%",
			"top":"0px",
			"left":"0px"
			});

			setTimeout(function(){
				$("#connected").slideUp("fast",function(){$(this).remove()});
			},2000);

		}
		
		socket.emit('set', bbs,key,local_resnum,getCookie("a"));
	});


	/* u:updated */
	socket.on('u',function(_server_resnum){
		call_update_alert(_server_resnum);
	});

	/* stc:setTotalCounter */
	socket.on('stc',function(count){
		setSureTotalConter(count);
	});
	
	/* sc:setCounter */
	socket.on('sc',function(count){
		setSureConter(count);
	});

	/*su:setCounterUpdate*/
	socket.on('c',function(res){
		if(res["p"]){
			setSureTotalConter(res["p"]);
		}
		if(res["n"]){
			setSureConter(res["n"]);
		}

		if(res["k"]){
			updateKusa(res["k"]);
		}
	});

	/*au:ankaUpdate*/
	socket.on('au',function(_from,_to){

		var ankaListHTML = $(".AnkaList").html();
		var ankaLists = ankaListHTML ? ankaListHTML.split("、") : [];
		var url = "/test/read.cgi/" + bbs + "/" + key + "/" + _from;
		var ank = '<span><a class="_ank closeOther vw ankbold" href="'+url+'" url="'+url+'">'+_from+'</a></span>';

		if(ankaLists.length > 20){
			ankaLists.length = 20;
		}

		ankaLists.unshift(ank);

		console.log("useAnka" + $("#useAnka").is(":checked"));

		if($("#useAnka").is(":checked")){

				console.log("visibke>>" + $(".ankaview_div").is(":visible"));

			if(	$(".ankaview_div").is(":visible") == false || $(".ankaview").is(":visible") == false){

				$(".ankaview").hide();
				$(".ankaview_div").show();

				$("AnkaNum").text(parseInt($("AnkaNum").text())+1);
				$(".AnkaList").html(ankaLists.join("、"));;
				$(".ankaview").slideDown("fast")


			} else {
				$(".ankaShake").fadeOut(500,function(){
					$("AnkaNum").text(parseInt($("AnkaNum").text())+1);
					$(".AnkaList").html(ankaLists.join("、"));;
					$(this).fadeIn("fast");

				});
			}

				console.log(ankaLists);

		} else {
			$("AnkaNum").text(parseInt($("AnkaNum").text())+1);
			$(".AnkaList").html(ankaLists.join("、"));;
		}

		if(!$('#noSoundAlert').is(':checked') && $("#useAnka").is(":checked") ){
			if(isSmartPhone == "0"){
				soundManager.play('anka');
			}
		}



	});


	/*ru:ratingUpdated*/
	socket.on('ru',function(updated){
		updateRating(updated);
	});

	/* sc:setKusa */
	socket.on('sk',function(count){
		updateKusa(count);
	});


}

function nodejs_pushKusa(){
	socket.emit('sk', bbs,key);
}


function nodejs_set_resnum(_local_resnum){
	socket.emit('sr',_local_resnum );
}

/* Twitter */

var twitterCheckTimerID;

$(function(){
	twitterInit();
});

function twitterInit(){

	$(document).on("click","#twsync",function(e){
		setCookie("twsync",$(this).attr("checked") ? 1 : 0);
	});

	$(document).on("click","#twid",function(e){
		setCookie("twid",$(this).attr("checked") ? 1 : 0);
	});

	if(getCookie("tw") && getCookie("twfunc") == 1){
		$("#twfunc").attr("checked",true);

		loadTwitterUserInfo({"noanime":true},function(){
			var twkeys = ["twsync","twid","twicon"];
			for(var i in twkeys){
				var key = twkeys[i];
				if(getCookie(key) == 1){
					$("#"+key).attr("checked",true);
				}
			};
		});
	}

	$(document).on("click","#twitter_logout",function(e){
		$.ajax({
				type: "POST",
				url:'/auth/twitter_logout.cgi',
				success: function(res){
					$("#twfunc").removeAttr("logined");
					$("#twfunc").attr("checked",false);
					twInfoClose(true);
				}
		});
		return false;
	});

	$("#twfunc").click(function(){
		if($(this).prop("checked") == true){
			if($(this).attr("logined") != "true"){
				if(getCookie("tw")){
					loadTwitterUserInfo();
				} else {
					window.open("https://open2ch.net/auth/twitter_login.cgi","miniwin","width=600,height=400");
					$(this).attr("checked",false);


					if(twitterCheckTimerID){
						clearInterval(twitterCheckTimerID);
					}

					twitterCheckTimerID = setInterval(twitterLoginChecker,1000);
				}
			} else {
				$("#twinfo").slideDown();
			}
		} else {
			twInfoClose();
		}

	});


}

function loadTwitterUserInfo(obj,callback){

	$.ajax({
			type: "POST",
			dataType : "json",
			url:'/ajax/twitter/get_info.cgi',
			success: function(data){


				var url = "https://twitter.com/" + data.screen_name;
				setCookie("twfunc",1);

				$("#twfunc").attr("logined","true");

				var icon = "<a href="+url+">" + "<img boredr=0 width=14 height=14 src=" + data.profile_image_url + ">@" + data.screen_name + "</a>";

				$("#twinfo").append(
					"<div class=twview>" + 
					"<div style='margin-bottom:3px'>" + 
					"TwitterID:&nbsp;" + icon + 
					"<div style='padding:3px;float:right'><a href=# id=twitter_logout>Twitter連携を解除する</a></div>" + 
					"</div>" + 
					"<input name=twsync id=twsync type=checkbox><label for=twsync>Twitterに同時投稿</label>" + 
					"&nbsp;&nbsp;&nbsp;" + 
					"<input name=twid id=twid type=checkbox><label for=twid>IDをTwitterIDにする</label>" + 
					"</div>"
				);
				
				if(obj && obj["noanime"]){
					$("#twinfo").hide().fadeIn();
				} else {
					$("#twinfo").hide().slideDown();
				}

				if(callback){
					callback();
				}

			}
	});
}

function twitterLoginChecker(){
	if(getCookie("tw")){
		clearInterval(twitterCheckTimerID);
		loadTwitterUserInfo();
		$("#twfunc").attr("checked",true);
	}
}

function twInfoClose(flag){
	$("#twinfo").slideUp("fast",function(){
		if(flag){
			$("#twinfo").html("");
		}
	});
	delCookie("twfunc");
}


