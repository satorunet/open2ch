var OPT;
var ua = navigator.userAgent.toLowerCase();
var IS_BOT = ua.match(/bot|bing/) ? 1 : 0;


var SETTING = {};
$(function(){
	SETTING = gethashStorage("setting");
})

$(function(){

//	alert("deBUg");

	$(".clean_mode").change(function(){
		sethashStorage("setting","clean_mode",$(this).is(":checked") ? 1 : 0,100);
		clean_mode_func();
	})

	if(SETTING["clean_mode"] == 1){
		$(".clean_mode").prop("checked",true);
		clean_mode_func();
	}


	function clean_mode_func(){

		if($(".clean_mode").is(":checked")){

			$(".CLEAN").hide();

			$("clean_mode_after").append($(".clean_mode").parents("label"));
			$("gazo_up_after").append($(".gazo_up"));

		} else {

			$(".CLEAN").show();
			$("clean_mode_before").append($(".clean_mode").parents("label"));
			$("gazo_up_before").append($(".gazo_up"));


		}
	}
})



/* 録音init */
var RECORD_LOADED;
function record_load(callback){

	$.getScript("https://open.open2ch.net/lib/web-audio-recorder-js/mic.v11.js?v3",function(){
		$.getScript("https://open.open2ch.net/lib/web-audio-recorder-js/lib/WebAudioRecorder.v3.js",function(){
			RECORD_LOADED = 1;
			callback();
		});
	});
}

$(function(){
	$("#recordButton").click(function(e){

		if(!RECORD_LOADED){
			record_load(function(){
				console.log("record loaded");
				$("#recordButton").click();
				;
			});
		}
		e.preventDefault();
	})
})

/* 録音履歴 */
$(function(){
	$(".voice_del_link").hide();
	updateVoiceHistoryLink();
});

function updateVoiceHistoryLink(){
	if( window.localStorage){
		var voice_list = getListStorage("mic");

		if( voice_list.length && !$(".voiceHistory").html() ){
			$(".voice_del_link").show().prepend("<div style=' user-select: none;margin-top:4px;font-size:9pt' class=voiceHistory><a tabindex=-1 style='text-decoration:none' href=/setting/voice_history.cgi><font color=black>編集</font></a></div>");
		} else if( localStorage.voice == "" && $(".voiceHistory").html() ){
			$(".voiceHistory").remove();
			$(".voice_del_link").hide();
		}
	}
}



/* お絵描きinit */
var OEKAKI_INIT = 0;
var OEKAKI_EX = "https://open.open2ch.net/lib/oekakiex/o2oEXLite.js/o2oEXLite.v7.js?v5";
var isOekakiDone = 1;

function oekaki_load(callback){
	if(!OEKAKI_INIT && typeof(OEKAKI) == "undefined"){
		$("body").append(
			"<link rel='stylesheet' href='//open.open2ch.net/lib/oekaki/spectrum/spectrum.css?v2' />)"
		);
		$.getScript("https://open.open2ch.net/lib/oekaki/excanvas.compiled.js?20200201_v1",function(){
			$.getScript("https://open.open2ch.net/lib/oekaki/sketch.v9.js?20200201_v1",function(){
				$.getScript("https://open.open2ch.net/lib/hukuwarai/huku.v2.js?20200201_v1",function(){
					$.getScript("https://open.open2ch.net/lib/oekaki/spectrum/spectrum.v2.js?20200201_v1",function(){
						$.getScript("https://open.open2ch.net/lib/oekaki/js/oekaki.v1.js?20200201_v4",function(){
							OEKAKI.init_oekaki();
							OEKAKI_INIT = 1;
							callback();
						});
					});
				});
			});
		});
	} else {
		callback();
	}
}

/* 旧gitImageとの繋ぎこみ用 */
function initOekaki(ctx, img){
	if(OEKAKI_INIT){
		OEKAKI.setImage(ctx, img);


	} else {
		oekaki_load(function(){
			OEKAKI.setImage(ctx, img);
		});
	}
}

$(function(){
	$("#oekakiMode").click(function(e){
		oekaki_load(function(){
			OEKAKI.clicked();
		});
		e.preventDefault();
	})
	if(getCookie("oekakiMode") == 1){
		console.log("cookie:oekaki-on");
		oekaki_load(function(){
			OEKAKI.openOekaki();
		});
	}
})


/* Button-cookie */


//黒塗り
$(function(){
	$(document).on("click","k",function(e){
		$(this).find("n").contents().unwrap();
		$(this).contents().unwrap();
		e.preventDefault();
		e.stopPropagation();
	});

	$(document).on("mouseover","k",function(){
		$(this).addClass("o");
	});

	$(document).on("mouseout","k",function(){
		$(this).removeClass("o");
	});
})


$(function(){
	$(".image_bt").click(function(e){
		e.preventDefault();
		$("#form1 .fileSelect").click();
	});

	if(getCookie("use_yomi") == "true"){
		$("#use_yomi").prop("checked",true);
	}

	$("#use_yomi").change(function(){
		setCookie("use_yomi",$(this).prop("checked"));
	});



	if(getCookie("use_autoaudio") == "true"){
		$("#use_autoaudio").prop("checked",true);
	}

	$("#use_autoaudio").change(function(){
		setCookie("use_autoaudio",$(this).prop("checked"));
	});

	if(getCookie("skip_prevoice") == "true"){
		$("#skip_prevoice").prop("checked",true);
	}

	$("#skip_prevoice").change(function(){
		setCookie("skip_prevoice",$(this).prop("checked"));
	});
})


/* プレビューモード */
function aaa_core(_this){

		function updateSource(){
			var text = new String($("[name=MESSAGE]").val());
			    text = text.replace(/@aaa/i,"@AAA");

			var n = new String(text).indexOf("@AAA");
			var aa = text.substring(n,text.length);

			var _speed = aa.match(/@aaa:([\d\.]+)/i);
			var speed = 0.25;

			if(_speed){
				speed = _speed[1];
			}

			if(speed < 0.05){
				speed = 0.05;
			} else if(speed > 10){
				speed = 10;
			}

			aa = aa.replace(/@aaa(?::[\d\.]+|)/gi,"");
			aa = aa.replace(/^\n+|\n+$/,"");

			var aaa = $(aa.split("@@@")).map(function(i,a){
				a = a.replace(/^\n+/,"");
				return a;
			});

			return [aa,aaa,speed]
		}

		var r = updateSource();

		var aa = r[0];
		var aaa = r[1];
		var speed = r[2];

		var max = aaa.length;
		var count = 0;

		var preview = $(
			"<div key="+key+" class='aaa_div'>"+
			"<div class='aaa_view aa'></div>"+
			"<div class='aaa_thumb aaa aa'></div>" +
			"</div>"
		);

		preview.find(".aaa_thumb").text(aaa[0]).css({"opacity":0});;
		preview.find(".aaa_view").text(aaa[0]).css({"opacity":1});;

		preview.bind("start",function(){

			if($(_this).hasClass("stop_aaa")){
				return;
			}

			$(_this).addClass("playing_aaa");

			var timerID = setInterval(function(){
						if(max>count){
							count++
						} else {
							count = 0;
						}
				preview.find(".aaa_view").text(aaa[count]);
			},(1000*speed));

			$(_this).prop("timer",timerID);

		}).trigger("start");

 $(preview).on('inview', function(event, isInView){

    if (isInView && !SETTING["aaa_view"] && !$(_this).hasClass("playing_aaa")){
    	$(_this).trigger("start");
    }

    if (!isInView && $(_this).hasClass("playing_aaa")){
    	$(_this).trigger("stop");
    }
  });		

		preview.bind("stop",function(){
			clearInterval($(_this).prop("timer"));
			$(_this).removeClass("playing_aaa");
		});

		preview.bind("click",function(){
			if($(_this).hasClass("playing_aaa")){
				$(_this).addClass("stop_aaa"); //任意停止フラグ
				$(_this).trigger("stop");
			} else {
				$(_this).removeClass("stop_aaa");
				$(_this).trigger("start");
			}
		})

		$(_this).contents().wrapAll("<div class=aaa_hide></div>");

/*
		$(_this).parents(".aaa_box").find(".aaa_hide")
			.before(preview)
			.hide();
*/

		$(".aaa_preview_window").find(".aaa_div").remove();


		$(".aaa_preview_window").append(preview);

		$(_this).parents(".aaa_box").append($(_this));

		$(".aaa_box").attr("draggable","true");

}


$(function(){



	$(document).on("click",".aaa_preview_bt",function(e){

		console.log("unko");

		console.log("!aa\n"+body);

		e.preventDefault();

	});

	$("body").append(
		"<style>" + 
			".aaa_preview_window{cursor:pointer;user-select: none;position:fixed;text-align:left;display:inline-block;padding:5px;background:#F8F8F8;;box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 -2px 3px -1px #f5f5f5 inset; transition: .3s;}" + 
			".preview_box{background:#eee}"+ 
		"</style>"
	);


	$("body").bind("SUBMIT_SEND_PRE_START",function(){
		$(".live_aaa_preview").prop("checked",false).trigger("change");

	});

	
	$(document).on("click",".preview_close",function(e){
		$(".live_aaa_preview").prop("checked",false).trigger("change");
	
	});


	$(document).on("change",".live_aaa_preview",function(e){
		if($(this).is(":checked")){

			$(".aaa_preview_window").show();

			handle_preview();
			setPreviewPosition();

		} else {
			$(".aaa_preview_window").contents().remove();
			$(".aaa_preview_window").append($("<div><input class=preview_close type=button value='×'></div><div class=aaa_box></div>")).hide();
		}
	})


	function setPreviewPosition(){
			if(isSmartPhone == 1){
				$(".aaa_preview_window").css("top",$(".live_aaa_preview").position().top - $(window).scrollTop())
				$(".aaa_preview_window").css("right","10px");
			} else {
				$(".aaa_preview_window").css("top",$(".live_aaa_preview").position().top - $(window).scrollTop() + $(".live_aaa_preview").height())
				$(".aaa_preview_window").css("left",$(".aaa_preview_window").width() + 50)
			}
	}

	$("[name=MESSAGE]").bind("change paste keydown keyup",function(){

		if(
				$(".aa").is(":checked") &&
				$(this).val().match(/@AAA/i) && 
				!$(this).hasClass("onAAAPreview")
			){
			$(this).addClass("onAAAPreview");

			$(".form_menu").append(
				"<div style='margin-top:5px;margin-bottom:5px' class='aaa_preview_div'><label>" + 
				"<input checked class=live_aaa_preview type=checkbox value='on'>＠AAAぷれびゅー</label>" + 
//			"&nbsp;<input class=add_aaa_split type=button value='＠＠＠'>" + 
				"</div>"
			);
			$("body").append("<div class=aaa_preview_window draggable=true><div><input class=preview_close type=button value='×'></div><div class=aaa_box></div></div>");
			$(".live_aaa_preview").trigger("change");
		}

		if($(".aa").is(":checked") && $(this).val().match(/@AAA/i) && $(".live_aaa_preview").is(":checked")){
			$(".live_aaa_preview").trigger("change")
		}

		if( $(this).hasClass("onAAAPreview") && !$(this).val().match(/@AAA/i)){
			$(this).removeClass("onAAAPreview");
			$(".aaa_preview,.aaa_preview_div,.aaa_preview_window").remove();
		}
	});


	$(document).on("click",".add_aaa_split",function(e){
		var texts = $("[name=MESSAGE]").val().split("\n");
		texts.push("@@@");
		$("[name=MESSAGE]").val(texts.join("\n") + "\n").focus() ;
	});


	$(document).on("dragend",".aaa_preview_window",function(e){

		var toX = e.originalEvent.clientX - parseInt($(this).prop("dragX"));
		var toY = e.originalEvent.clientY;

		var ytLimit = 0;
		var ybLimit = parseInt($(window).height() - $(".aaa_preview_window").height());
		var xrLimit = parseInt($(window).width() - $(".aaa_preview_window").width());

		//限界調整
		if(toY < ytLimit ){ //上
			toY = ytLimit;
		} else if(toY > ybLimit ){ //下
			toY = ybLimit;
		}

		if(toX < 0){ //左
			toX = 0;
		} else if(toX > xrLimit){ //右
			toX = xrLimit;
		}

		$(".debug").html("x:" + toX + "/y:" + toY + ":wt:" + ytLimit + "/yb:" + ybLimit + "<br>xr:" + xrLimit);


		$(".aaa_preview_window").css({
			left: toX,
			top: toY,
			"transform":"",
		})

	});

	$(document).on("dragstart touchstart",".aaa_preview_window",function(e){

		$(this).prop({
			"dragX":e.originalEvent.offsetX,
			"dragY":e.originalEvent.offsetY,
			})
	});


})

function handle_preview(){
	$(".aaa_box").text($("[name=MESSAGE]").val());
	aaa_core($(".aaa_box"));
}

/* 長文コラボ機能 */
$(function(){

	$(document).on("click",".koraboLong",function(e){

		var key = ($(this).attr("key"));
		var n= $(this).attr("n");
		var texts = [];

		if(confirm(">>"+n+" の長文とコラボする？")){
			$.ajax({
				url: "https://cache.open2ch.net/long/v2/"+key+".txt",
				success: function(res){

					$(res).find("li").each(function(){
						texts.push($(this).text());
					});

					$(".pastebin").slideDown("fast");
					$("[name=pasteText]").val(texts.join("")).trigger("change");
					$("[name=MESSAGE]").val(">>" + n);


					moveToMiddle($(".pastebin"));

				}
			})
		}


		e.preventDefault();

	});


})

/* AAストック機能 */
var AA_LIST = {};


$(function(){

	$("body").append("<style>.aa-fav-div{margin:2px;background:#dddddd;padding:4px;display:inline-block}</style>");

	AA_LIST = gethashStorage("aa");

	$(document).on("click",".aa_clear",function(e){
		$("del_aa").html("");

		//安価維持
		var m = new String($("[name=MESSAGE]").val()).match(/^((>>\d+(?:\n|))+)/);
		var addAnka = "";
		if(m){
			m[0] = m[0].replace(/(\r\n|\r|\n)$/,"");
			addAnka = m[0] + "\n";
		}


		$("[name=MESSAGE]").val(addAnka).trigger("change");
		e.preventDefault();
	});


	$(document).on("change",".aa-select",function(e){

		if(!$(".aa").is(":checked")){
			$(".aa").click();
		}


		//安価はそのまま追記
		var m = new String($("[name=MESSAGE]").val()).match(/^((>>\d+(?:\n|))+)/);
		var addAnka = "";
		if(m){
			m[0] = m[0].replace(/(\r\n|\r|\n)$/,"");
			addAnka = m[0] + "\n";
		}

		var key = $(this).val();

		$(".aa_kanri").attr("href","/stamp/?q=" + key);

		if(!key){
			$("del_aa").html("");
			$("[name=MESSAGE]").val(addAnka).trigger("change");
			return;
		}

		var json = JSON.parse(AA_LIST[key]);
		var aa = LZString.decompressFromUTF16(json.data);
		    aa = aa.replace(/&lt;/g,"<");
		    aa = aa.replace(/&gt;/g,">");
		    aa = aa.replace(/&amp;/g,"&");

		var is_template = aa.match(/@(?:TEXT|TT)/i);

		//発言テンプレ機能
		if(is_template && $(".aa_talk").val()){
			aa = aa.replace(/(@(?:TEXT|TT))/gi,$(".aa_talk").val());
		}

		if(is_template){
			if(!$(".aa_talk").length){
				$("aa_talk_div").html("<input size=30 class=aa_talk placeholder='発言テンプレ'>")
			}
		} else {
			$(".aa_talk").remove();
		}



		$("[name=MESSAGE]").val(addAnka + aa).trigger("change");

		$("del_aa").html("&nbsp;<a class='aa_clear' href=#>クリア</a>");


	});
	
	$(document).on("change keydown keyup",".aa_talk",function(){
		$(".aa-select").trigger("change");
	})


	$("body").append(
		"<style>" + 
			".aa_regist{user-select: none;font-family:sans-serif;font-size:9pt;background:#F8F8F8;padding:2px;display:inline-block}" + 
			"._aa{width:80;padding:5px;user-select: none}" + 
		"</style>"
	);


	$(document).on("mouseover","._aa",function(e){
		$(this).css("color","blue");
	});

	$(document).on("mouseout","._aa",function(e){
		$(this).css("color","");
	});


	$(document).on("click",".aa_retry",function(e){
		$(this).parents("li,dl").find("._aa").click();
	});

	$(document).on("click",".aa_close",function(e){
		$(this).parents("li,dl").find(".aa_checking").removeClass("aa_checking");
		$(this).parents("li,dl").find(".aa_regist").remove();
	});




	$(document).on("click",".aa_ok",function(e){


		var body = $(this).parents("li,dl").find(".body");
		var html;

		console.log($(body).html());

		if( $(body).find(".aaa_div").length ){ // AAA
			html = $(body).find(".aaa_hide").html();
			html = html.replace(/@aaa/i,"@AAA");
			var n = new String(html).indexOf("@AAA");
			html = html.substring(n,html.length);
		} else { // AA
			html = body.html();
		}

		var res = html2AA(html);
		var aa = res.aa;
		var md5 = res.md5;
		var resnum = body.attr("rnum");
		var is_use = $(this).parents(".aa_regist").find(".is_use").is(":checked");
		var title = $(this).parents(".aa_regist").find(".title").val() || md5;

			var val = LZString.compressToUTF16(aa);
			var data = {
				"time": parseInt(new Date().getTime()/1000),
				"data":val,
				"bbskey": bbs + "/" + key + "/",
				"resnum": resnum,
				"fav": (is_use ? 1 : 0) ,
				"title" : title
			};
			var json = sethashStorage_json("aa",md5,data,1000);
			AA_LIST[md5] = json;

			var message = is_use ?  "※スタンプに登録したよ！<font color=red>すぐ使えるバイ。</font>" 
			                      : "※スタンプに登録したよ！使う時に有効にしてね！";

			$(this).parents("li,dl").find(".aa_checking").removeClass("aa_checking");

			$(this).parents(".aa_regist").html("<div>登録完了＞<a href='/stamp/'>AAスタンプ</a>"+
			                                   "<div>" + message+"</div>" + 
			                                   "<div align=center>" + 
			                                   "<input type=button class=aa_close value='閉じる'>" + 
			                                   "<input type=button class=aa_retry value='再設定'></div>"+
			                                   "</div>");

			
			//find(".aa_cancel").click();

			updateAAStamp();


	});


	$(document).on("click",".aa_del",function(e){

			var body = $(this).parents("li,dl").find(".body");
			var res = html2AA(body.html());
			var md5 = res.md5;
			delhashStorage("aa",md5);
			delete AA_LIST[md5];

			$(this).parents("li,dl").find(".aa_checking").removeClass("aa_checking");

			$(this).parents(".aa_regist").html("<div>削除完了＞<a href='/stamp/'>AAスタンプ</a>"+
			                                   "<div>AAスタンプから消しますた。</div>" + 
			                                   "<div align=center>" + 
			                                   "<input type=button class=aa_close value='閉じる'>" + 
			                                   "<input type=button class=aa_retry value='再設定'>" + 
			                                   "</div>"+
			                                   "</div>");
			updateAAStamp();
	});


	$(document).on("click",".aa_cancel",function(e){

		$(this).parents("li,dl").find(".aa_checking").removeClass("aa_checking");
		$(this).parents("li,dl").find(".aa_regist").remove();

		e.preventDefault();

	});





	$(document).on("click",".kopipe_aaa",function(e){

		$(".aa").attr("checked",true).trigger("change");

		var text;
		var type;
		if( $(this).parents("li,dl").find(".aaa_hide").length ){ // AAA
			text = $(this).parents("li,dl").find(".aaa_hide").contents().text();
			type = "AAA";
		} else { // AA
			text = $(this).parents("li,dl").find(".body").text();
			type = "AA";
		}

		$("[name=MESSAGE]").val(text).trigger("change"); 

		alert("コメント欄に"+type+"をコピペしますた。");

		e.preventDefault();

	});

	function aaa2gif_func(_this){
		var text = $(_this).parents("li,dl").find(".aaa_hide").contents().text();

		if($(_this).hasClass("gif")){
			alert("GIF生成済み");
			return;
		}

		var aid = $(_this).parents(".aa_regist").attr("aid");

		makeGIF(text,function(url){
			if(!$(_this).hasClass("gif")){
				$(_this).parents("div").after("<aaa_gif />");
				$(_this).addClass("gif");
			}
			var a = $("<a class=dl />");
			a.attr("href",url)
			 .attr("download", aid + ".gif");

			$(_this).parents(".aa_menu").find("aaa_gif").html(
				"<img title='クリックでダウンロード' style='border:1px solid #f9f9f9' src=" + url + "><br>※GIFダウンロード" 
			).wrapAll(a);
			
			$(_this).remove();

		});
	
	}

	function makeGIF(text,callback){


		// Gif
		var gif = new GIF({
		  workers: 2,
		  quality: 10,
		  background: "#FFFFFF",
//	  transparent: "0xFFFFFF",
		  
		});

		var time = new Date().getTime();

		var aaa = text;
		aaa = aaa.replace(/\r\n|\r/g,"\n");
		var h = aaa.match(/@AAA(:[\d\.]+)?\n([\s\S]*)/i);
		var aaa_header = h[1];
		var aaa_content = h[2];
		var aaa_datas = aaa_content.split("@@@");
		var speed;

		if(aaa_header){
			var d = aaa_header.match(/:([\d\.]+)/);
			speed = d[1];
			if(speed < 0.01){
				speed = 0.01
			} else if(speed > 10){
				speed = 10;
			}
		}

		var delay = speed * 100;
		var width = 0;
		var height = 0;
		var max_y_length = 0;

		$(aaa_datas).each(function(i,a){
			a = a.replace(/^\n*|\n*$/g,"");
			var text = new createjs.Text(a, "12pt Saitamaar");
			var size = text.getBounds();

		

			var texts = a.split("\n");
			console.log(texts);

			if(width<size.width){width=parseInt(size.width+4)}
			if(height<size.height){height=parseInt(size.height+4)}
			if(max_y_length<texts.length){max_y_length=texts.length}
		});
	
		height = height + (max_y_length*2);

		$(aaa_datas).each(function(i,a){
			a = a.replace(/^\n*|\n*$/g,"");

			var id = "canvas_"+i + "_" + new Date().getTime();
			var texts = a.split("\n");
			var canvas = $("<canvas class=gif_temp width="+width+" height="+height+" id="+id+" />");
			
			$("body").append(canvas);

			var stage = new createjs.Stage(id);
			var text = new createjs.Text(a, "12pt Saitamaar");
			text.textBaseline = "top";

			text.y = 3;
			text.x = 3;

			var shape = new createjs.Shape();
			shape.graphics.beginFill("#FFFFFF");
			shape.graphics.drawRect(0, 0, width, height);
			stage.addChild(shape);

			text.lineHeight = 16;
			stage.addChild(text);
			stage.update();

			gif.addFrame($("#"+id).get(0), {copy: true, delay: delay});

		});

		gif.on('finished', function(blob) {
			$(".gif_temp").remove();
			callback(URL.createObjectURL(blob));
			delete gif;
		});

		gif.render();


	}


	$(document).on("click",".aaa_2_gif",function(e){
		var _this = $(this);

		if(!$("body").hasClass("createJS")){

			$.getScript("https://open.open2ch.net/lib/aaa2gif/lib/gif.js?v2xx").done(function(script, textStatus){
				$.getScript("https://code.createjs.com/1.0.0/createjs.min.js").done(function(script, textStatus){
					$("body").addClass("aaa2gif_init");
					aaa2gif_func($(_this));
					return;
				});
			});
			$("body").addClass("createJS");
		}

		if($("body").hasClass("aaa2gif_init")){
			aaa2gif_func($(_this));
		}

		e.preventDefault();
	});

	$(document).on("click",".view_aaa_source",function(e){

		if(!$(this).hasClass("open_aaa_source")){

			var preview = "<div class='aa aaa_source_viewer' style='user-select: text;border:1px solid #ccc;padding:5px;background:white'>" + 
										"!AA\n" + 
										$(this).parents("li,dl").find(".aaa_hide").contents().text() + 
										"</div>"

			$(this).addClass("open_aaa_source");

			$(this).parents(".aa_regist").append(preview);

		} else {
			$(this).removeClass("open_aaa_source");
			$(this).parents(".aa_regist").find(".aaa_source_viewer").slideUp("fast",function(){
				$(this).remove();
			})
		}

		e.preventDefault();

	});

	function aa_init_check(callback){
		if(typeof(XXH) == "undefined"){
			$.getScript("https://open.open2ch.net/stamp/lib/xxhash-js/xxhash32-min.js",function(){
				callback();
			});
		} else {
			callback();
		}
	}

	$(document).on("click","._aa",function(e){

		var _this = this;

		aa_init_check(function(){

			var res = html2AA($(_this).parents("li,dl").find(".body").html());
		
			if(!res.aa){
				alert("空のAAみたい。。")
				return;
			}

			var md5 = res.md5;
			var is_already;
			var json;

			if(md5 in AA_LIST){
				is_already = 1;
				json = JSON.parse(AA_LIST[md5]);
			}

			if($(_this).hasClass("aa_checking")){
				$(_this).parent().find(".aa_cancel").click();
			} else {


				if($(_this).parents("li,dl").find(".aa_regist")){
					$(_this).parents("li,dl").find(".aa_regist").remove();
				}

				$(_this).addClass("aa_checking");

				var url = "/stamp/?q=" + md5;

				var input = $(
					"<div class=aa_regist aid="+md5+">" + 
					"<div clear=all><label><input type=checkbox checked class=is_use>すぐ使う</label>" + 
					"<div style='float:right;display:inline-block'>" + 
					"<a style='color:white;background:#555' href=# class=aa_cancel>閉</a></div>" + 
					"</div>" + 

					'<div style="white-space:nowrap">' + 
					"<input size=12 class=title placeholder='AAスタンプ名'>" + 
					"<input class='aa_ok' type=button value=" + (is_already ? "再登録" : "登録") + ">" + 
					(is_already ? "<input class='aa_del' type=button value='削除'>" : "") + 
					'</div>' + 

					"<div class='aa_menu'>" + 
					(is_already ? "<font color=red>登録済み</font>＞<a href="+url+" target=_blank>AAスタンプ</a>" 
					            : "<font color=#CCC>未登録</font>") + 
					"<div style='float:right;display:inline-block'><font size=1 color=#999>ID:" + md5 + "</div>" + 
					"<div>"+
					 "<a style='color:black' class='kopipe_aaa' href=#>コメ欄にコピペ</a> / " + 
					(res.aa.match(/@aaa/i) ? 
					"<a style='color:black' class='view_aaa_source' href=#>AAAソース表示</a><br>" +
					"<a style='color:black' class='aaa_2_gif' href=#>GIFに変換</a><br>" : "")+ 
					 "<div class=source_view_div></div>" + 
					 "</div>" + 

					"</div>");

				if(is_already){
					$(input).find(".title").val(json.title);
					$(input).find(".is_use").attr("checked", json.fav ? true : false);
				}

				$(_this).after(input)
			}


		});


	})

/*
		if(confirm("ID:" + md5 + "\nこのAAをゲットするぽ？") ){

			var val = LZString.compressToUTF16(aa);
			var data = {
				"time": parseInt(new Date().getTime()/1000),
				"data":val,
				"bbskey": bbs + "/" + key + "/",
				"resnum": $(_this).attr("rnum"),
				"fav":1,
			};
			var json = sethashStorage_json("aa",md5,data,1000);
			AA_LIST[md5] = json;

			addGetLink(_this);
		}
*/
			updateAAStamp();
})

function updateAAStamp(){
	var aa_fav_list = [];
	$(get_AA_favlist())
	.sort(function(_a,_b){ //Sort
		var a = JSON.parse(AA_LIST[_a]);
		var b = JSON.parse(AA_LIST[_b]);

		if (a.updated < b.updated){
			return 1;
		} else {
			return -1;
		}
	})
	.each(function(i,a){
		var json = JSON.parse(AA_LIST[a]);
		var text = "title" in json ? json.title : a;
		aa_fav_list.push("<option value='"+a+"'>" + text + "</option>");
	})

	$(".aa-fav-div").remove();

	if(aa_fav_list.length){
		$(".fav_aa").append( "<div class='aa-fav-div'>" + 
		                     "<select class='aa-select'>" + 
		                     "<option style='color:#999' value=''>AAスタンプ</option>" + 
		                     aa_fav_list+
		                     "</select><del_aa></del_aa>" +
		                     "&nbsp;<div style='display:inline-block;padding:2px;background:#EEE'>" + 
		                     "<a class=aa_kanri style='color:black' href=/stamp/ target=_blank>AA管理</a></div>" + 
		                     "<div><aa_talk_div /></div>" +
		                     "</div>"
		);
	}


}

function html2AA(html){

	var aa = html;
	aa = aa.replace(/\r\n|\n/g,"\n");
	aa = aa.replace(/<br>/g,"\n");
	aa = aa.replace(/<[^>]+>/g,"");
	aa = aa.replace(/\!AA\n/g,"\n");
	aa = aa.replace(/^(&gt;&gt;\d+(?:\n|))+/g,"");
	aa = aa.replace(/^\n+|\n+$/g,"");
	aa = aa.replace(/\!AA/g,"");

	//Empty-check
	var temp = aa;
	temp = temp.replace(/\s+/g,"");
	temp = temp.replace(/\n/g,"");

	if(!aa || !temp.length){
//	alert("空のようだ。")
		return {md5:"",aa:""};
	}

	var md5 = XXH.h32( aa, "open2ch" ).toString(16).toUpperCase();

	return {md5:md5,aa:aa};
}

function get_AA_favlist(){
	var keys = Object.keys(AA_LIST);
	return $.grep(keys,function(a){
		return JSON.parse(AA_LIST[a]).fav ? 1 : 0;
	});
}


function addGetLink(_this){
	var getLink = $("<div><font color=red>GET済：<a href='/stamp/'>AAスタンプ</a></font></div>");
	    getLink.hide();
	$(_this).parent().after(getLink);
	    getLink.slideDown("fast");
}

/* lzstring */
var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);






/* Dev */
$(function(){
	$(".closeDev").click(function(e){
		if($(".devContent").is(":visible")){
			$(".devContent").hide()
		} else {
			$(".devContent").show()
		}
		setCookie("devView",$(".devContent").is(":visible") ? "on" : "off");
		e.preventDefault();
	})
	if(getCookie("devView") == "off"){
		$(".devContent").hide();
	}
})


/* AAモード */
$(function(){

	$("[name=MESSAGE]").prop("_cols",$("[name=MESSAGE]").attr("cols"));
	$("[name=MESSAGE]").prop("_width",$("[name=MESSAGE]").css("width"));


	$(".aa").change(function(){
		setCookie("aa",$(this).is(":checked") ? "on" : "off");
		
		if($(this).is(":checked")){
			$("[name=MESSAGE]")
				.attr("placeholder","AA入力モード。ここにAAを入力してね。")
				.addClass("aa")
				.css("width","100%")
				.attr("cols",500);
			
		} else {
			$("[name=MESSAGE]").removeClass("aa")
			                   .attr("placeholder","")
			                   .css("width",$("[name=MESSAGE]").prop("_width"))
			                   .attr("cols",$("[name=MESSAGE]").prop("_cols"));
		}

	});

	if(getCookie("aa") == "on"){
		$(".aa").attr("checked",true).trigger("change");
	}


	if(SETTING["aa_mode"] == "off"){
		return;
	} else {
		$("body").append('<link rel="stylesheet" href="/lib/aa/css/aa.v6.css?20200128_xxxx" type="text/css"  />');
	}

	AA_filter($("body"))


	$("body").append("<style>" + 
	".aaa_div{display:inline-block;cursor:pointer}"+
	".aaa{position:relative}" + 
	".aaa_view{position:absolute}"+
	".playing_aaa{;}" +
	".over_aaa{background:#dddddd}" +
	".aaa_hide{display:none;background:#ddd}"+
	"</style>");

	$(document).on("mouseover",".aaa_div",function(){
		$(this).addClass("over_aaa");
	})

	$(document).on("mouseout",".aaa_div",function(){
		$(this).removeClass("over_aaa");
	})


})


function AA_filter(_this){

	if(SETTING["aa_mode"] == "off"){
		return;
	}

	$(_this).find(".body").each(function(){
			var resnum = $(this).attr("rnum");

			if($(this).text().match(/\!AA/i)){

				var target;

				if($(this).find(".talk").length > 0){
					target = $(this).find(".says");
				}	else {
					target = $(this);
				}

				$(target).addClass("AA");

				if($(this).text().match(/@AAA/i)){
					$(target).addClass("AAA");
				}


				var body = $(target).html();
					    body = body.replace(/<kome[^>]+>/g,"");
					    body = body.replace(/\!AA/gi,"");
					    body = body.replace(/<br>/g,"\n");
					    body = body.replace(/^\n*|\n*$/g,"");


				$(target).html(body);

				$(target).after("<div rnum="+resnum+" class='_aa'>!AA</div>");

				$(this).find(".hash,k,n").each(function(){
					$(this).contents().remove("b").unwrap();
				});
			}
	})

	//AAA処理
	$(_this).find(".AAA").each(function(i,a){

		var text = new String($(this).text());
		    text = text.replace(/@aaa/i,"@AAA");

		var n = new String(text).indexOf("@AAA");
		var no_aa = text.substring(0,n);
		var aa = text.substring(n,text.length);



		var _speed = aa.match(/@aaa:([\d\.]+)/i);
		var speed = 0.25;

		if(_speed){
			speed = _speed[1];
		}

		if(speed < 0.05){
			speed = 0.05;
		} else if(speed > 10){
			speed = 10;
		}


		aa = aa.replace(/@aaa(?::[\d\.]+|)/gi,"");
		aa = aa.replace(/^\n+|\n+$/,"");


		var aaa = $(aa.split("@@@")).map(function(i,a){
			a = a.replace(/^\n+/,"");
			return a;
		});

		var max = aaa.length;
		var count = 0;

		var preview = $(
			"<div key="+key+" class='aaa_div'>"+
			"<div class='aaa_view aa'></div>"+
			"<div class='aaa_thumb aaa aa'></div>" +
			"</div>"
		);


		preview.find(".aaa_thumb").text(aaa[0]).css({"opacity":0});;
		preview.find(".aaa_view").text(aaa[0]).css({"opacity":1});;



		preview.bind("start",function(){

			if($(this).hasClass("stop_aaa")){
				return;
			}

			$(this).addClass("playing_aaa");


			var timerID = setInterval(function(_this){
						if(max>count){
							count++
						} else {
							count = 0;
						}
				preview.find(".aaa_view").text(aaa[count]);
			},(1000*speed),this);

			$(this).prop("timer",timerID);

		})

 $(preview).on('inview', function(event, isInView){

    if (isInView && !SETTING["aaa_view"] && !$(this).hasClass("playing_aaa")){
    	$(this).trigger("start");
    }

    if (!isInView && $(this).hasClass("playing_aaa")){
    	$(this).trigger("stop");
    }
  });		


		preview.bind("stop",function(){
			clearInterval($(this).prop("timer"));
			$(this).removeClass("playing_aaa");
		});



		preview.bind("click",function(){

			if($(this).hasClass("playing_aaa")){
				$(this).addClass("stop_aaa"); //任意停止フラグ
				$(this).trigger("stop");

			} else {
				$(this).removeClass("stop_aaa");
				$(this).trigger("start");

			}
		})

//		$(this).before(preview);


		$(this).contents().wrapAll("<div class=aaa_hide></div>");


		$(this).parents("dl").find(".aaa_hide")
			.before(preview)
			.hide();

		if(no_aa){
			$(this).parents("dl").find(".aaa_div").before($("<div>"+no_aa+"</div>"))
		}


		$(this).parents("dt").append($(this));

		$(this).parents("dl").find("._aa")
			.text("@AAA");


		//$(this).remove();	


	});
}

/* コード送信機能 */

$(function(){

	var binLIMIT = 30;

	$("binmax").text(binLIMIT);

	$(".pasteCancel").click(function(){
		$(".pasteButton").click();
	})

	$(".pasteButton").click(function(){
		if($(".pastebin").is(":visible")){
			$(".pastebin").slideUp("fast");
			$("[name=pasteText]").val("").trigger("change");
		} else {
			$(".pastebin").slideDown("fast");
		}
	});

	$("body").bind("SUBMIT_SEND_PRE_START",function(){
		$(".binlist").html("");
	});


	$(document).on("click",".cancelBin",function(e){
		var url = $(this).attr("url");

		var message = $("[name=MESSAGE]").val();
		    message = message.replace(new RegExp("(?:\n|)" + url + "(?:\n|)"),"");
		$("[name=MESSAGE]").val(message);

		$(".binlist").html("");
		e.preventDefault();
	})


	$(".pasteSubmitButton").click(function(e){

		if($("[name=pasteText]").val() == ""){
			alert("空は投稿できましぇん。");
			return;
		}

		if($("[name=MESSAGE]").val().match(/https:\/\/pastebin.com/)){
			alert("長文のURLは1回の投稿に1個まで。");
			return;
		}


		if( parseInt($("binlen").text()) < binLIMIT){
			alert("文字数が足りないです。もうちょっとかいてね。");
			return;
		}

		$(this).prop("disabled",true);
		var data = {
			q: $("[name=pasteText]").val(),
			v: "1",
		};

		$.ajax({
			type: 'POST',
			url : "/ajax/pastebin/post.cgi",
			data : data,
			dataType :"json",
			success : function(res){
				if(res.success == 1){


					$(".binlist").html(
					"<div style='padding:5px'><a target=_blank href="+res.url+">" + 
					"<img width=12 height=12 src=https://open.open2ch.net/image/icon/svg/memo.svg?vxxx3>&nbsp;" + 
					res.url + 
					"</a>" + 
					" <a href=# url="+res.url+" class=cancelBin>×</a></div>"
					);

					var texts = $("[name=MESSAGE]").val() ? $("[name=MESSAGE]").val().split("\n") : [];
					texts.push(res.url);
					$("[name=MESSAGE]").val(texts.join("\n"));
					$("[name=pasteText]").val("").trigger("change");
					$(".pasteSubmitButton").prop("disabled","");
				} else {

					alert("変換失敗！エラー：" + res.error);

				}
			}
		})
	});

	$("[name=pasteText]").bind("change keyup keydown paste",function(){

		//高さ調整
		var rows = $(this).attr("rows");
		var len = $(this).val().split("\n").length;
		var min = 5;
		var max = 30;
		var n;
		
		if(len > max){
			n = max;
		} else if(len < min){
			n = min
		} else {
			n = len+1
		}
		
		$(this).attr("rows",n);
		
		//文字量
		var texts = $("[name=pasteText]").val();
		    texts = texts.replace(/(\r\n|\r|\n)/g,"");

		$("binlen").text(texts.length);

	
	});
})




/* 可変コメント欄*/
$(function(){
		$("[name=MESSAGE]").bind("keyup change paste",function(){
			var n = $(this).val().split("\n").length;
			var to;
			var min = isSmartPhone == 1 ? 3 : 4;

			if(n < min){
				to = min
			} else if(n > 20){
				to = 20;
			} else {
				to = n+1;
			}
			$(this).attr("rows",to);
		})

})

/* 逆順モード */
$(function(){

	$("[name=reverse_mode]").click(function(){

		var val = ($(this).is(":checked") ? "on" : "");
		sethashStorage("setting","reverse_mode",val,100);

		SETTING["reverse_mode"] = val;

		if($(this).is(":checked")){
			setReverseMode();

			$('body,html').stop(true,false).animate({scrollTop:0}, 500, 'linear');


		} else {
			resetReverseMode();


			if(isSmartPhone == "1"){
				$('body').scrollTo($("#new_res"));
			} else {
				$('body').scrollTo($('[name=reverse_mode]'));
			}


		}
	});


	$(document).on("click",".yonda",function(){
		$("#history_add").click();
	});



	if(SETTING["reverse_mode"] == "on"){
		$("[name=reverse_mode]").attr("checked",true);
		setReverseMode();
	}
})

function resetReverseMode(){  //逆順戻す


	$("#auto_scroll").prop({"checked":true,"disabled":false});
	$("[for=auto_scroll]").prop("disabled",false).css("color","#000");


	if(isSmartPhone == "1"){
		$(".form").css("padding-bottom","10px");
		$(".yonda").remove();
	
		$(".preform").after($(".formset"));
		$("#threadFunction").before($(".history_res"));

	} else {
		$(".normalFormPosition").after($(".formset"));
		$(".normalYondaPosition").after($(".yonda"));


	}



	$(".thread").find(isSmartPhone == "1" ? "li" : "dl").each(function(){
		$(".thread").prepend($(this));
	});

	$(".reverseTemp").remove();


}

function setReverseMode(){
	$("#auto_scroll").prop({"checked":false,"disabled":true});
	$("[for=auto_scroll]").prop("disabled",true).css("color","#AAA");


	$(".thread").before($(".formset"));

	if(isSmartPhone == "1"){
		$(".form").css("padding-bottom","0px");
		$(".formset").find("hr").remove();
		$(".formset")
			.append($("<div style='margin:5px;text-align:right;'><input class=yonda type=button value='ここまでよんだ'></div>"))
			.append($(".history_res"))
			.append($("#new_alert_link"));

	} else {
		$(".formset")
			.after($("#new_alert_link"))
			.after($(".yonda"))
			.after("<hr class=reverseTemp>");

		$(".yonda").wrapAll("<div class=reverseTemp align=center />");
	}

	$(".thread").find(isSmartPhone == "1" ? "li" : "dl").each(function(){
		var resnum = $(this).attr("val");
			$(".thread").prepend($(this));
	});

	/* 10行以下の場合、1だけ上に入れる */
	var ichi = $(".thread").find((isSmartPhone == "1" ? "li" : "dl") + "[val=1]");
	var html = ichi.find(".nusi_message").html();

	$(".formset").before($(".thread").find((isSmartPhone == "1" ? "li" : "dl") + "[val=1]"));


	if(isSmartPhone !== 1){
		ichi.after("<hr class=reverseTemp>");
	}

}

/* アイコン非表示 */
$(function(){
	icon_filter($("body"))
})

function icon_filter(_this){


	if(SETTING["icon_size"] > 0){
		$(_this).find("[iconimg=1]").css(
			{ "width":SETTING["icon_size"],
				"height":SETTING["icon_size"],
				"border-radius":parseInt(SETTING["icon_size"]*2)
			})
	}

	if(SETTING["icon_view"] !== "off"){
		return;
	}

	$(_this).find(".body").each(function(){
		$(this).find("[iconimg=1]").remove()
	})
}

/* 絶対名無しモード */
$(function(){
	if(SETTING["nanasi_mode"] == "on"){
		$(".name").each(function(){
			nanasi_filter($(this));
		});
	}
	$(document).on("click","prename",function(e){
		if($(this).find("pp").is(":visible")){
			$(this).find("pp").remove();
		} else {
			$(this).append("<pp style='opacity:.8'>"+$(this).attr("text")+"</pp>");
		}
		e.preventDefault();
		e.stopPropagation();
	});
});

function nanasi_filter(_this){
	var pre = $(_this).text();
	var cap;
	var text = '<b>名無し</b><prename text="'+pre+'">＠</prename>';
	if(pre.match(/▲|▼/)){
		cap = pre.match(/((?:▲|▼).+)/);
		text += cap[0];
	}
	$(_this).html(text);
}


/* NG機能 */
//NG機能
var NGWORDS = {};
var NGREGEXP = null;

$(function(){

	var ng_list = getListStorage("ng");

	if(SETTING["aa_mode"] == "ng"){
		ng_list.push("!AA");
	}

	if(SETTING["icon_view"] == "ng"){
		ng_list.push("<icon>");
	}

	if(SETTING["aaa_view"] == "ng"){
		ng_list.push("@AAA");
	}


	if(ng_list){
		NGREGEXP = list2regexp(ng_list);
	}

	

});


/*
<dl style="margin:0px"><dt><div class="info hd"><a class="num" val="92">92</a> ：20/07/04 06:30:05 nPk<font size="2"><font color="red">主</font></font><db></db></div>
<div class="body" style="margin-left:15px;margin-bottom:5px"><div style="display:inline-block;margin-top:5px" class="ank_main" resnum=""><div class="ank_button" style="display:block"></div><div class="ank_result" style="display:block"><div> <div class="ank_kekka" num="1" val="0"> <div class="kekka_list"> <span class="kekka_per"><per>0</per>%</span> <div class="kekka_text"><text>うんこ</text></div> <span class="kekka_bar" style="width:0%">&nbsp;</span> </div> </div> </div> <div> <div class="ank_kekka" num="2" val="0"> <div class="kekka_list"> <span class="kekka_per"><per>0</per>%</span> <div class="kekka_text"><text>うんこ</text></div> <span class="kekka_bar" style="width:0%">&nbsp;</span> </div> </div> </div></div><div style="margin:5px;font-size:10pt"><font color="#99A"><total>0</total>票・<left sec="60">終了</left></font></div></div><br></div></dt></dl>
*/


function rating_filter(mado){

	console.log(mado.html());


	$(mado).find(".ank_main").each(function(){

		var base = $(this);
		var resnum = $(this).attr("resnum");
		var total = 0;
		var keys = ratings[resnum] || {};

		console.log(base);

		$(Object.keys(keys)).each(function(i,e){
			var val = keys[e];
			total += parseInt(val);
		});

		base.find("total").text(total);

		$(Object.keys(keys)).each(function(i,e){
			var num = e;
			var val = keys[e];
			var per = parseFloat( parseInt((val/total*100)*10)/10 );
			var ank_target = $(base).find(".ank_kekka[num="+num+"]");
			    ank_target.find("per").text(per);
			    ank_target.find(".kekka_bar").css("width",per + "%");
		});

		if(VOTED[bbs+key+resnum]){
			$(base).find(".ank_button").hide();
			var num = VOTED[bbs+key+resnum];
			$(base).find(".ank_result").show();
			var targetKekka = $(base).find(".ank_kekka[num="+num+"]");
			targetKekka.find("text").text( "✔" + targetKekka.find("text").text());
		} else {
			$(base).find(".ank_button").show();
		}

		

	})


}

/* url2info */
$(function(){

	/* 開いた後*/


	/* 開く前*/
	$("body").bind("SP_ANK_OPEN",function(e,mado){
		rating_filter($(mado));
	});


	$("body").bind("ANK_OPEN ARES_OPEN",function(e,mado){

		console.log(mado);

		icon_filter($(mado));

		url_info_handler($(mado))

		if(SETTING["nanasi_mode"] == "on"){
			$(mado).find(".name").each(function(){
				nanasi_filter($(this));
			});
		}

		AA_filter($(mado))

		rating_filter($(mado));


	});

})


$(function(){

/* URLマウスオーバーで見えるは廃止 */
/*
		if(isSmartPhone !== 1){

			$(document).on("mouseover",".url",function(e){

				$(this).addClass("over");

				var _this = $(this);
				url2info_request($(this),function(text){
					if($(_this).hasClass("over")){
							var div = $("<div class=uimo style='position:absolute'>" + text + "</div>").hide();
							$(_this).after(div);
							div.fadeIn("fast");
						}
				});
				e.preventDefault();
			});

			$(document).on("mouseleave mouseoout",".url",function(e){
				$(this).removeClass("over");
				$(".uimo").remove();
			});
		}
*/

		$("body").append(
			"<style>" + 
			".ufull{border:1px solid #ddd;padding:3px;background:#f5f5f5;border-radius:2px;margin:2px}"+
			".urlinfo{max-width:"+(isSmartPhone ==1 ? "90%" : "600px")+";font-size:10pt;color:#777;display:inline-block;padding:2px}" + 
			".uim{border-radius:3px;width:30px;height:30px;object-fit:cover;padding-right:2px}" + 
			".ufullim{width:100px;height:100px;object-fit:cover;float:left;margin-right:5px;}" + 
			".udetail{max-width:600px;margin-top:3px;user-select: none;-moz-user-select: none;-ms-user-select: none;line-height:12pt;font-size:"+(isSmartPhone==1?8:9)+"pt}"+
			".ut{overflow: hidden;white-space: nowrap;text-overflow:ellipsis;}" + 
			".utt{font-size:"+(isSmartPhone == 1 ? "7" : "9" )+"pt}" + 
			".ns{user-select: none;-moz-user-select: none;-ms-user-select: none ; font-size:"+(isSmartPhone == 1 ? "9" : "11" )+"pt}" +
			"</style>"
		);

		$(document).on("mouseover",".urlinfo",function(e){
			$(this).find(".utt").css("text-decoration","underline");
		});

		$(document).on("mouseout",".urlinfo",function(e){
			$(this).find(".utt").css("text-decoration","none");
		});

		url_info_handler($("body"))


/*
		$(".url").on("inview",function(){
			url_info_handler($(this))
			$(this).removeClass(".url");
		});
*/


})

function url_info_handler(_this){

		if(IS_BOT){
			return;
		}

		if(SETTING["url_view"] == "off"){
			return;
		}

		$(_this).find(".body").each(function(){


			var urls = $(this).find(".url");
			if(urls){
					$(this).find(".url:last").removeClass("url").on("inview",function(){
						var _this = $(this);
						url2info_request($(this),function(text){

			if(text.match(/ダイナモ/)){
				;
			} else {
				$(_this).html(text);
			}
						});
					});
			}
		});


}


function url2info_request(_this,callback){


		var url = $(_this).attr("href");
		var json = "https://cache02.open2ch.net/url2info/url2info.cgi/v20200206_v3/" + escape(url);

//		var json = "https://cache02.open2ch.net/url2info/url2info.cgi/v20200203_v7/" + escape(url);
//	var json = "https://cache.open2ch.net/lib/url2info/url2info.cgi/v200229_08/" + escape(url);
//	var json = "https://open.open2ch.net/lib/url2info/url2info.dev.cgi/v10/" + escape(url);

		if(url.match(/(i\.img|imgur|png|jpg|mp4|gif|pdf)$/)){
			return;
		}

		var xhr = $.get(json);
		xhr.done(function(data){

			var d = data.split("");
			var text;
			var details = d[2] ? d[2].split("") : [];
			details.length = 80;
			var detail = details.join("");
			text = "<div class='urlinfo ufull'>" + 
				(d[1] ? "<img class='lazy ns ufullim' src="+d[1]+">" : "")+ 
				"<div class='ut ns'>" + (d[2] ? "<b>" : "") +d[0]+"</b></div>" + 
				(d[2] ? "<div class='udetail'>"+detail+"</div>" : "") + 
				"<div style='margin-top:10px' class='ut utt'><font color=blue>"+url+"</font></div>" + 
				"</div>";
				callback(text);
		});


}


$(function(){
	//OPT = $("body").attr("dev") ? new Date().getTime() : "";
	OPT = "";
//OEKAKI_EX = "https://open.open2ch.net/lib/oekakiex/o2oEXLite.org.js?v5"+OPT;
});


var NODEJS = "https://nodessl.open2ch.net:8443";
//var NODEJS = "https://nodessl.open2ch.net:2083";
var speech;
var speechUtt;
var pm = getUrlVars();
var storage = {};

/*
var NODEJS = "http://nodessl.open2ch.net:8880"; //http
var NODEJS = "https://nodessl.open2ch.net:2083"; //https-test
*/


$(function(){
	$("body").append("<div class=header_alert style='z-index:10000;width:100%;position:fixed;top:0px;left:0px'><ngalert></ngalert></div>");
})


$(function(){
	if(NGREGEXP){
		$(".body").each(function(){
			ng_filter($(this));
		});
	}

	$(document).on("click",".show_ng",function(e){
		var target = $(this).parent().next();
		if($(target).hasClass("ng_hide")){
			$(target).removeClass("ng_hide");
		} else {
			$(target).addClass("ng_hide");
		}
		e.preventDefault();
	});
})

var NG_COUNT = 0;


function ng_filter(_this){

//	var body = $(_this).find(".body");
	var body = $(_this);

	if(!NGREGEXP){
		return;
	}

	var is_match = $(body).parent().html().match(NGREGEXP);

	if(is_match){

		if(SETTING["ng_action"] !== "hide_strong"){
			var $ng_alert = $("<div style='opacity:.9;text-align:center;display:inline-block;padding:5px;background:black;color:white'>" + 
			+ (++NG_COUNT) + "件NGの為、無視しました。</div>");
			$ng_alert.animate({count:0},{duration:1000*5,complete:function(){
				$(this).remove();
				NG_COUNT = 0
			}})
		}

		$("ngalert").html( $ng_alert );

		if(SETTING && "ng_action" in SETTING && SETTING["ng_action"].match(/hide/)){

			$(body).parents("li,dl").addClass("ng_hide");



		} else {

			$(body).html($(body).html().replace(NGREGEXP,"<ng>$1</ng>"));
			$(body).before(
				"<div class=ng>&nbsp;<img src=/image/icon/svg/hana.svg height=12>&nbsp;NG&nbsp;" + 
				'<a class=show_ng href=#>表示</a>' +
				"</div>");
			$(body).addClass("ng_hide");
		}
	}

}



//SK簡単入力機能
$(function(){
	$(".sk_button").click(function(e){
		var texts = $("[name=MESSAGE]").val() ? new String($("[name=MESSAGE]").val()).split("\n") : [];
		    texts.push($(".sk_button").attr("text"));
		$("[name=MESSAGE]").val(texts.join("\n"));
	});
});



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
			var option = {
			  enableHighAccuracy: true,
			  maximumAge: 1,
			  timeout: 10000
			};
		var current = 'current-position';
			navigator.geolocation.getCurrentPosition(
			  function(position){ geo_success(current, position); },
			  function(error){ geo_err(current, error); },
			  option
			);
		}
	}

	function geo_success(id, position) {

		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var query = window.btoa(lat + "," + lon);
		    query = query.replace(/==/,"");
		$(".map_iframe").get(0).contentWindow.set_pan(lat,lon);
	}

	function geo_err(id, error){
		var e = "";
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

		var lat = "35.685175";
		var lon = "139.7528";
		var query = window.btoa(lat + "," + lon);
		    query = query.replace(/==/,"");

		var url = "/lib/yahoomap/?q="+query + "&p=p";
		var google = "https://www.google.com/maps?q="+query;
		
		var html = '<div class="mapEditer" style="width:420px;background:white;position:fixed;top:20%;left:50%;' + 
		           'padding:5px;border:1pt solid #F2F2F2;text-align:center;margin-top:3px">' + 
		           '<div draggable=true class="mapEditerBar" style="cursor:move;font-size:9pt;background:#000044;color:white;padding:3px">地図エディタ（2019年10月迄）' + 
		'<div style="font-size:8pt;display:inline-block;float:right" ><a href=# class=mapClose><font color=white>閉</font></a></div>' + 
		           '</div>' + 

//	           '<div align=right><input type=text size="10"><input type="button" value="検索"></div>' + 


		           '<div>' + 

//		           '<div style="display:inline-block;vertical-align:middle"><input class="get_gps" style="margin-left:5px" type="image" title="現在地を取得" src="https://open.open2ch.net/image/icon/svg/gps.v2.svg">&nbsp;&nbsp;</div>'+



		           '<div style="display:inline-block;background:#FAFAFA;padding:5px">' + 

								 '<label style="padding:3px">描く<input type=checkbox class=map_draw value=1></label>' + 

							 '<input class="map_pin map_buttons" type=button value="ピン">' + 
							 '<input class="map_label map_buttons" type=button value="ラベル">' + 

			           '<input class=get_gps type=button value="現在地">' + 
//		           '<input class=searchButton type=button value="検索">' + 


/*							 '<label>落書きモード<input type=checkbox class=map_line value=1></label>' + */

		           '<input class="map_clear" type=button value="全消">' + 
		           '<input class="map_debug" type=button value="debug">' + 

		           '</div>' + 

		           '</div>' + 

		           '<iframe class=map_iframe scrolling=no frameborder=0 src="'+url+'" width="420" height="320"></iframe>' + 

		           '<div style="padding:5px" align=center>' + 
		           '<input style="background:#FFBBBB" class=useMap type=button value="地図を投稿" code="#map('+query+')"> ' + 
		           '<input class=mapClose type=button value="やめる">' + 
		           "<div style='float:right;display:inline-block'><label>検索<input class=searchButton checked type=checkbox></label></div>" + 

		           '</div>' + 


		           '</div>';

		$("#map").html(html);



	console.log($(".mapEditer").offset());


/*
		$(".mapEditer").css({
			top : parseInt($(".mapEditer").position().top),
			left : parseInt($(".mapEditer").position().left),
		})
*/


		console.log(parseInt($(".mapEditer").offset().top) + ":" + parseInt($(".mapEditer").offset().left));

	}


//var map_history = [];

	$(function(){
		//show_map();
	});

	$(document).on("change",".map_draw",function(){
		var val = $(this).is(":checked");
		$(".map_iframe").get(0).contentWindow.set_draw_mode(val);

		$(".map_buttons").prop("disabled",val ? true : "");

	});





	$(document).on("click",".searchButton",function(){
		$(".map_iframe").get(0).contentWindow.search_click();
	});


	$(document).on("click",".map_clear",function(){
		if(confirm("線やピンを全削除します。よろしいですか？")){
			$(".map_iframe").get(0).contentWindow.clear_all();
		}
	});


	$(document).on("change",".map_line",function(){
		$(".map_iframe").get(0).contentWindow.set_map_line($(this).is(":checked"));
	});



	$(document).on("click",".map_pin",function(){
		$(".map_iframe").get(0).contentWindow.update_item("pin");
	});

	$(document).on("click",".map_label",function(){
		$(".map_iframe").get(0).contentWindow.update_item("label");
	});



	$(document).on("click",".get_gps",function(e){
		get_geo();
		e.preventDefault();
	});



	$(function(){
		$("#map_bt").click(function(){
			if($(".mapEditer").is(":visible")){
				$("#map").html("");
			} else {
				show_map();
			}
		})


		$(document).on("click",".map_debug",function(){

				console.log($(".map_iframe").get(0).contentWindow.dumpData());

		});

		$("#MESSAGE").change(function(){
			if(!$(this).val().match("#map([\d\.]+,[\d\.]+)")){
				$("#map").html("");
			}
		})

		$(document).on("click",".useMap",function(){

		var res = $(".map_iframe").get(0).contentWindow.dumpData();

		if(res.info.size > 0 ){ //位置情報のみ


			var json = JSON.stringify(res);
			var data = LZString.compressToUTF16(json);
			var param = {
				version : "v1",
				data : data,
			};
			$.ajax({
				data : param,
				type:'POST',
				url : "https://cache02.open2ch.net/map/save_map.cgi",
				success:function(res){

					if(res.match(/success/)){

						var json = JSON.parse(res);
						var code = "[map:v1:"+json.key+"]";
						var texts = $("#MESSAGE").val() ? $("#MESSAGE").val().split("\n") : [];
						    texts.push(code);
						$("#MESSAGE").val(texts.join("\n"))
						$("#map").html("");


					} else {
						alert("なんか失敗した。。今はアップできないようだ・・・");
					}
				}
			})

		} else {

			var info = res.info;
			var latlng = info.lat + ":" + info.lon;
			var zoom = info.zoom;

			var code = "[map:"+latlng+":"+zoom+"]";

			var texts = $("#MESSAGE").val() ? $("#MESSAGE").val().split("\n") : [];
			    texts.push(code);
			$("#MESSAGE").val(texts.join("\n"))
			$("#map").html("");

		} 



				$(this).prop("disabled",true);
		});

		$(document).on("click",".mapClose",function(e){
			if(!$(this).val().match(/#map\([^\)]+\)/)){
				var text = $("#MESSAGE").val();
				    text = text.replace(/#map\([^\)]+\)/g,"");
				$("#MESSAGE").val(text);
				$("#map").html("");
			}
		  e.preventDefault();
		});

		$(document).on("dragend",".mapEditer",function(e){

			var toX = e.originalEvent.clientX - parseInt($(this).prop("dragX"));
			var toY = e.originalEvent.clientY;

			var ytLimit = 0;
			var ybLimit = parseInt($(window).height() - $(".mapEditer").height());
			var xrLimit = parseInt($(window).width() - $(".mapEditer").width());

			//限界調整
			if(toY < ytLimit ){ //上
				toY = ytLimit;
			} else if(toY > ybLimit ){ //下
				toY = ybLimit;
			}

			if(toX < 0){ //左
				toX = 0;
			} else if(toX > xrLimit){ //右
				toX = xrLimit;
			}

			$("body").append("<div class=debug style='background:white;position:fixed;bottom:0;left:0'></div>");
			$(".debug").html("x:" + toX + "/y:" + toY + ":wt:" + ytLimit + "/yb:" + ybLimit + "<br>xr:" + xrLimit);


			$(".mapEditer").css({
				left: toX,
				top: toY,
				"transform":"",
			})

		});

		$(document).on("dragstart",".mapEditer",function(e){

			$(this).prop({
				"dragX":e.originalEvent.offsetX,
				"dragY":e.originalEvent.offsetY,
				})
		});

	})
}());



// 「ここから新しい投稿」機能
(function(){

	function compareFunc(a, b) {
		return a - b;
	}

	function kokomade_new_func(){
		var last_res = storage[bbs + "/" + key];
		var new_res = server_resnum - last_res;
		var $news = $("<div class='attayo' style='cursor:pointer;border:1px solid #ddd;padding:10px;background:#fff;position:fixed;bottom:30;left:0;border-radius:0 0 10px 0'>" + 
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

		var resnums = $("dt.mesg").filter(function(i,a){
				return parseInt($(this).attr("res")) > last_res;
			}).map(function(i,a){
				return $(this).attr("res");
		})

		var sort = resnums.sort(compareFunc);
		var from = sort[0];
		var to = sort[resnums.length-1];

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
			var $kokokara = $("<div class=kokokara_new style='border:1px solid #eeeeee;padding:5px;margin-bottom:2px;background:#ffeeee'>" + 
			"↓ここから新着</div>").hide();


			if(SETTING["reverse_mode"] == "on"){
				$kokokara.text("↑ここから新着");
				$("dt.mesg[res="+from+"]").parent().after( $kokokara );
			} else {
				$("dt.mesg[res="+from+"]").before( $kokokara );

			}

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
		var last_res = storage[bbs + "/" + key];

		if(storage[bbs + "/" + key]){
			var new_res = server_resnum - last_res;
			if(new_res > 0){
				kokomade_new_func();
			}
		}
	
	$("body").bind("UPDATE_HISTORY",function(){
			var bbskey = bbs +"/"+key;
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

			$(".ankaFrom").contents().unwrap(".ankaFrom");
			$(".ankaTo").contents().unwrap(".ankaTo");
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
		[100000,"👑","おうかん"],
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

	$(".settingButton")
	.mouseover(function(){
		$(this).css("color","#00B")
	})
	.mouseout(function(){
		$(this).css("color","")
	})
	.click(function(){

		if($(".options").is(":visible")){
			$(".options").slideUp("fast");
			$(this).text("▼開");
			setStorage("offSetting",1);
		} else {
			$(".options").slideDown("fast");
			$(this).text("▲閉");
			setStorage("offSetting",0);
		}
	});

	if( getStorage("offSetting") == 1 ){
		$(".options").hide();
		$(".settingButton").text("▼開");
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

			if(html.match(/@AAA/i)){
				return ;
			}


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

		MAX_HORYU_TIME = is_oekaki_focus ? 10 : 3;

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

							var res = action[res] ? "<a href=/test/history.cgi>履歴</a>を" + action[res] + "したよ！(ﾟ∀ﾟ)ノ</a>" 
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

function moveToMiddleCall(target,_speed,callback){
	var speed = _speed ? parseInt(_speed) : 400;
	var position = target.offset().top - (window.innerHeight/2) + (target.height()/2);
	$('body,html').stop(true,false).animate({scrollTop:position,complete:callback}, speed, 'linear');
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
			url    : "/ajax/get_ares.v2.cgi/" + bbs + "/" + key + "/",
			data   :query,
			cache  : true,
			success: function(res){

				var html = $(res);

				$("body").trigger("ARES_OPEN",html);


				/* 無視設定の投稿を消す */
/*
				html.find("dt").each(function(i,a){
					var id = $(this).attr("val");
					alert(id);
					if( ignores[id] ){
						alert($(this).html());
					}
				})
*/

				$(parent).find("areshtml").html( html );

				$("body").trigger("ARES_OPENED");

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
var ignores_hash = {};
var ignores_array;
var IGNORE_MAX = 50;
var ignore_cache_key;

$(function(){
	ignore_cache_key = "ignv4" + bbs;
});

function updateIgnore(is_action){

	ignores_hash = {};
	ignores_array.map(function(key){
		ignores_hash[key] = 1;
		if(key !== "???"){
			
			var target = $("dl").find(".id"+key + "[ignored!='1']").parents("li,dl");
			    target.attr({"ignored":1,"uid":key});

			if(is_action){
				target.slideUp("fast");
			} else {
				target.hide();
			}

		}
	})

	/* 解除 */
	$("[ignored=1]").each(function(i,a){
		var uid = $(this).attr("uid");
		if(!ignores_hash[uid]){
			$(this).removeAttr("ignored").slideDown("fast");
		}

	});
	


	var length = ignores_array.length;

	if(length>0){
		$("#ignore_div").html(
			"<div class=ignore_box>" + 
			"<div>無視設定：" + length + "件</div>" + 

			"<a class=ignore_back href=#>一個戻す</a>&nbsp;" + 
			"<a class=clear_ignore href=#>全クリア</a>" + 
			"</div>").show();
	} else {
		$("#ignore_div").fadeOut("fast");
	}
}

$(function(){

	//ignores_array = localStorage[cachekey] ? JSON.parse(getStorage(cachekey)) : new Array();
	ignores_array = getListStorage(ignore_cache_key);

	ignores_array.map(function(e){
		ignores_hash[e] = 1;
	})

	$(document).on("click",".ignore_back",function(e){

		var array = getListStorage(ignore_cache_key);
		var id = array.shift();
		ignores_array = shiftListStorage(ignore_cache_key);
		updateIgnore();
		e.preventDefault();
	});


	$(document).on("click",".clear_ignore",function(e){
		e.preventDefault();
		if(confirm("無視設定をクリアします。\nよろしいですか？")){
			delStorage(ignore_cache_key);
			ignores_hash = {};
			ignores_array = [];
			updateIgnore();
			$("#ignore_div").fadeOut("fast");
		}
	});

	$("._id").each(function(){
		var id = $(this).attr("val");
		if(id !== "???"){
			$(this).after(" <a href=# class=ignore val="+id+">×</a>");
		}
	});

	var res;
	if(Object.keys(ignores_hash).length){
		updateIgnore();
	}

	$("body").append("<style>" + 
		".iok,.ino{cursor:pointer;font-size:8pt}" + 
		".ignore_check_over{padding:1px;background:#e2e2e2}" + 
		".ignore_check{display:inline-block;}" + 
		"</style>"
	);

	$(document).on("click",".iok",function(){
		var id = $(this).parent().attr("vid");
		    id = id.replace(/\./g,"");
		ignores_array.unshift(id);

		console.log(ignores_array);

		if(ignores_array.length > IGNORE_MAX){
			ignores_array.length = IGNORE_MAX;
		}

		//setStorage(cachekey,JSON.stringify(ignores_array));
		setListStorage(ignore_cache_key,id,IGNORE_MAX);

		$(this).parent().find(".ino").click();

		updateIgnore(1);
	})

	$(document).on("click",".ino",function(){
		var id = $(this).parent().attr("vid");

		$(this).parents("li,dl").find(".ignore_checking").html("×").removeClass("ignore_checking");
		$(this).parents("li,dl").removeClass("ignore_check_over");
		$(this).parents(".ignore_check").remove();
	
	})

	$(".ignore").live("click",function(e){

		e.preventDefault();
		var ID = $(this).attr("val");
		var _ID = ID.replace(/\./g,"");

		if(ignores_hash[ID]){
			var message = "ID:" + ID + " の無視設定を解除します。\nよろしいですか？";

			if( confirm(message) ){ /* 解除 */
				delete ignores_hash[_ID];
				ignores_array = ignores_array.filter(function(e){return e!==_ID});

				$(".id"+_ID).slideDown().removeAttr("ignored");
				updateIgnore();
				if( ignores_array.length ){
//				setStorage(cachekey,JSON.stringify(ignores_array))
					delListStorage(ignore_cache_key,_ID,IGNORE_MAX);
				} else {
					delStorage(ignore_cache_key)
				}
			}
		} else { /*無視*/

			$(this).html("");

			var message = "ID:" + ID + " を無視設定します。\nよろしいですか？";

			if(!$(this).hasClass("ignore_checking")){


					var confirm = $("<div class='ignore_check' vid='"+ID+"'>" + 
					                "<input type=button value='無視' class=iok><input class=ino type=button value='取消'>" + 
					                "</div>");

					$(this).addClass("ignore_checking");
					$(this).parents("li,dl").addClass("ignore_check_over");
					confirm.attr("uid",ID);
					$(this).after(confirm);

				}
/*
			if( confirm(message) ){

				ignores_hash[_ID] = 1;
				ignores_array.unshift(_ID);

				if(ignores_array.length > IGNORE_MAX){
					ignores_array.length = IGNORE_MAX;
				}

				//setStorage(cachekey,JSON.stringify(ignores_array));
				setListStorage(ignore_cache_key,_ID,IGNORE_MAX);

				updateIgnore();
			}
*/

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

	var is_moving;
	var clickOffsetTop;
	var clickOffsetLeft;

	var e = $("#formdiv").get(0);
//	var e = $("#oekakiCanvas").get(0);

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

		var icons = ["anime_matanki01","anime_matanki02"];

		for(var i=0;i<(1+Math.floor(Math.random()*12));i++){

			var icon = icons[Math.floor(Math.random()*icons.length)];
			var img = $("<img class='_pata' style='position:relative;top:-60' src=//image.open2ch.net/image/icon/2ch/"+icon+".gif>");
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
			var posi = e.style.top + ":" + e.style.left;
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


		if($(".aa").is(":checked")){
				$("[name=MESSAGE]").css("max-width","450px");
		}

		$("#formdiv").css({
			"backgroundColor":"#DDD",
			"padding":"2px",
			"border":"1px solid #999",
			"border-radius":"3px",
			"z-index" : 1000
		});

		if(isSmartPhone == 1){
			$("#formdiv").css({
				"position":"fixed",
				"bottom":0,
				"width":"100%"
			});
			$("#formdiv").show();
		} else {

//		$(".formDivDefault").after("<p class=closeKoteiWindow_div><button class=closeKoteiWindow>別窓リセット</button></p>");

			$("#formdiv").prepend($(
			"<div class=ddWindow style='width:98%;border-radius:3px;font-size:0pt;background:#449;color:#007;padding:4px;cursor: move !important;'>"+
			"<div style='width:95%;text-align:center;display: inline-block;'>&nbsp;</div>"+
			"<div style='display: inline-block;'><img class=closeKoteiWindow src=//open.open2ch.net/image/icon/svg/batu_white_v2.svg width=10 height=10 style='cursor:pointer;paddnig:3px'></div>" + 
			"</div>"
			))

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

		if($(".aa").is(":checked")){
				$("[name=MESSAGE]").css("max-width","450px");
		}


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


		var array = [];
		var message = $('#MESSAGE').val();

		if(message){
			message = message.replace(/(\r\n|\r|\n)$/,"");
			array = message.split("\n");
		}

		array.push(">>" + $(this).attr("val") + "\n");

		var text = array.join("\n");


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
var OEKAKI_READY = 0;

$(document).ready(function() {

	tuhoInit();

	defTitle = document.title;
	if ("WebSocket" in window && is_update_disable == 0) {
		isNodeJS = 1;
		nodejs_connect();
	}
	/* WebSocketに未対応のブラウザは更新チェックしない。*/


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
	


	$('#form1').submit(function(e) {



/* お絵描きデータ生成 */
		if(OEKAKI_INIT && !OEKAKI_READY && OEKAKI.isOekakiDone == 1){

			console.log("OEKAKI_READY start");
			console.log("OEKAKI_DONE_FLAG:"+ OEKAKI.isOekakiDone);

			if( (OEKAKI.isOekakiDone == 1) && 
				$("#oekakiCanvas").is(":visible") && 
				($('#sketch').sketch().actions.length || $('#sketch').sketch().baseImageURL) && 
				$("[name=oekakiData]").val() == ""){
				OEKAKI.redrawHonban();
			}

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

						console.log("OEKAKI_READY fin");

						$("[name=oekakiData]").val(_source);
						OEKAKI_READY = 1;
						$("#form1").submit();
				}
			e.preventDefault();
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

	is_oekaki_focus = 0;	

	$("body").trigger("SUBMIT_SEND_PRE_START");

	console.log("SUBMIT_FUNC");


	$("#submitOekaki,#submit_button,#resSubmit").prop("disabled",true);
	$("#loading_bar").slideDown('fast');

/*
	var img = "https://image.open2ch.net/image/read.cgi/image.cgi?" + bbs + "/" + key;
	$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
*/

	$("#status").html("投稿中...");

	if(
			$('#MESSAGE').val() && 
			$(".aa").is(":checked") && 
			!$('#MESSAGE').val().match(/\!aa/i)
		){
			$('#MESSAGE').val("!AA\n" + $('#MESSAGE').val());


	}


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
			$("#submitOekaki,#submit_button,#resSubmit").prop("disabled",false);
			$("#loading_bar").slideUp('fast');
		},

		success: function(res){

			$(".dlink").remove();

 /* 投稿成功、新規書き込みを読み込む */

			if(res.match(/success/)){

				$('#MESSAGE').val("").trigger("change");
				$('#oekakiData').val("");
				$("#parent_pid").val("");

				$(".admin_command").val("");
				$(".aa_talk").val("");

				$(".aa-select").val("");

				if(OEKAKI_INIT){
					OEKAKI_READY = 0;
					OEKAKI.isOekakiDone = 0;
				}


				if($('#sketch').is(":visible") && OEKAKI_INIT){
					$('#sketch').sketch().clear();
					OEKAKI.redrawHonban();
				}

/*
				var img = "https://image.open2ch.net/image/read.cgi/image.cgi?mode=done&" + bbs + "/" + key;
				$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
*/
				$("#status").html("投稿完了しました!");
				submit_flag = 1;

				setTimeout(function(){
					$("#submitOekaki,#submit_button,#resSubmit").prop("disabled",false);
					$("#loading_bar").slideUp('fast');
				},1000);

			} else {
				alert("投稿失敗。。\n"+res);
				$("#submitOekaki,#submit_button,#resSubmit").prop("disabled",false);
				$("#loading_bar").slideUp('fast');
			}
		}
	});
}

$(function(){
	$("body").append("<style>.openpic{display:none}</style>");
});

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
			$('#new_alert').fadeOut("fast");
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
//							$("[num="+resnum+"] div").show();
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
		var resnum = $(e).attr("res");
		

		var _html;


		var ignore = ignores_hash[id] ? ("ignored=1 uid="+id) : "";

		if(pageMode == "sp"){
			_html = "<li "+ignore+" val="+resnum+" class=hide><dl><section>" + e + "</section></dl></li>";
		} else { /* PC */
			_html = "<dl "+ignore+" val="+resnum+" class=hide>" + e + "</dl>";
		}

		var html_obj = $(_html);


			/* NG処理 */
			if(NGREGEXP){
				$(html_obj).find(".body").each(function(){
					ng_filter($(this));
				});
			}

			/* NG処理 */
			if(SETTING["nanasi_mode"] == "on"){
				$(html_obj).find(".name").each(function(){
					nanasi_filter($(this));
				});
			}

			/* ICON処理 */
			icon_filter($(html_obj));


			/* URL処理 */
			url_info_handler($(html_obj));


			/* AA処理 */
			AA_filter($(html_obj));

			if(SETTING["reverse_mode"] == "on"){
				$(".thread").prepend(html_obj);
			} else {
				$(".thread").append(html_obj);
			}
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

		$(".openpic")
		.after("<div class=grid><img src=https://image.open2ch.net/image/icon/svg/loading.v2.svg width=100 height=100></div>");

		setTimeout(function(){
			$(".grid").fadeOut("fast",function(){
				$(this).remove();
				$(".openpic").addClass("pic lazy").fadeIn("fast",function(){
						$(".openpic").attr("src",$(".openpic").attr("data-src"));
						$(this).removeClass("openpic");
				});
			});
			},(isSmartPhone ? 5000 : 3000) );
	}


	$(".thread").find(".hide").not("[ignored=1],.ng_hide").fadeIn("fast");

	if( $("#auto_scroll").is(":checked") ){
		moveToMiddle($(".thread dl:last"),500);
	}

	document.title = defTitle;

			} else {
				;;
			}

		//updateIgnore();

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
						"※"+mode+" 保留 <horyu>0</horyu>/"+ MAX_HORYU_TIME +"秒</div>");
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

				$("[res="+_from+"]").parent().find(".body").contents().wrapAll("<span class=ankaFrom />");
				$("[res="+_to+"]").parent().find(".body").contents().wrapAll("<span class=ankaTo />");


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
	socket.on('ru',function(data){
		socket_update_ratings(data);
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


