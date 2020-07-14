//var NODEJS = "http://nodejs.open2ch.net:8880";
var NODEJS = "https://nodessl.open2ch.net:8443";


/* バルス強化版 */
function doValus(){

	if( $("#is_valus_after").val() != 1 ){

//,"shake-chunk" "shake-slow" "shake-rotate"
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



//var NODEJS = "nodejs.open2ch.net:8000";

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
/*
$(function(){
	$("[name=MESSAGE]").blur(function(){
		setTimeout(function(){
			if($('#autoOpen').is(':checked') && is_update_que == 1){
				update_res("now");
			}
		},1500);
	});
})
*/

/* 履歴 */

var is_history_updating = 0;

$(function(){
	$("#history_add").click(function(e){

			e.preventDefault();

			if( is_history_updating ){
				return false;
			}

			is_history_updating =1;

//		$(this).css({"color":"black","text-decoration":"none","cursor":"default"});

			var $this = $(this);
			var action = {"update":"更新", "new":"追加"};

			$(".history_res").hide()
				.html("<img src=//open.open2ch.net/image/loading.gif> 履歴を更新中")
				.slideDown("fast");

				setTimeout(function(){
					$.ajax({
						type: "POST",
						url    : "/ajax/add_history.cgi",
						data   :  $("#form1").serialize(),
						cache  : false,
						success: function(res){

							var res = action[res] ? "履歴を" + action[res] + "したよ！(ﾟ∀ﾟ)ノ <a href=//open2ch.net/test/history.cgi>履歴を表示</a>" 
																		: "エラー。なんかおかしいみたい。。(；∀；)";

							$(".history_res").html( "<font color=red>" + res + "</font>");
							setTimeout(function(){
								$(".history_res").slideUp("fast",function(){ is_history_updating = 0 })

//							$("#history_add").css({"color":"blue","text-decoration":"underline","cursor":"hand"});

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
		console.log( ">>" + $("[name=mail]").val() );
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


// レス取得機能
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
//				$(parent).find(".aresdata").slideDown("fast");
					$(parent).find(".aresdata").fadeIn("fast");
			}
		});


	});

})


// <フォーム固定>
var cachekey;
var ignores;

function updateIgnore(){

	if(!Object.keys(ignores).length){
		return;
	}	

	jQuery.each(ignores, function(key, val) {
		if(key !== "???"){
			$(".id"+key + "[ignored!='1']").fadeOut("fast").attr("ignored",1);
		}
	})
	var length = Object.keys(ignores).length;
	$("#clear_ignore").html("無視設定をクリア(" + length + "件)").show();
}

$(function(){
	cachekey = "ign:"+bbs;
	ignores = getStorage(cachekey) ? JSON.parse(getStorage(cachekey)) : new Object();

	$("#clear_ignore").click(function(e){
		e.preventDefault();
		if(confirm("無視設定をクリアします。\nよろしいですか？")){
			delStorage(cachekey);
			ignores = new Object();
			$(".mesg").fadeIn("fast").removeAttr("ignored");
			$(this).hide();
			//updateIgnore();
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

		if(ignores[ID]){

			var message = "ID:" + ID + " の無視設定を解除します。\nよろしいですか？";
			if( confirm(message) ){ //解除
				delete ignores[ID];
				$(".id"+ID).slideDown().removeAttr("ignored");
				updateIgnore();
				if( Object.keys(ignores).length ){
					setStorage(cachekey,JSON.stringify(ignores))
				} else {
					delStorage(cachekey)
				}

			}
		} else { //無視

			var message = "ID:" + ID + " を無視設定します。\nよろしいですか？";
			if( confirm(message) ){
				ignores[ID] = 1;
				setStorage(cachekey,JSON.stringify(ignores));
				updateIgnore();
			}
		}

	})

});

$(function(){
	$("#formfix").click(function(){
		var flag = $(this).prop("checked") ? "1" : "0";
		setCookie("fm_kotei",flag);
		setFormKotei(flag)
		$(this).dr;
	});

	if(getCookie("fm_kotei") == 1){
		$("#formfix").prop("checked",true);
		setFormKotei(1)
	}
});

function setFormKotei(flag){

	if(flag == 1){
		$("#formdiv").hide();

		$("#formdiv").css({
			"bottom":"0",
			"position":"fixed",
			"backgroundColor":"#DDD",
			"padding":"2px",
			"border":"1pt dotted #999"
		});

		$(".social").hide();

		if(isSmartPhone == 1){
			$("#formdiv").css({"width":"100%"});
		}

		$("#formdiv").slideDown("slow");


	} else {

		$("#formdiv").fadeOut("fast");

		$("#formdiv").css({
				"bottom":"",
				"position":"",
				"backgroundColor":"",
				"padding":"",
				"border":""
			});
		$(".social").show();

		if(isSmartPhone == 1){
			$("#formdiv").css({"width":""});
		}

		$("#formdiv").fadeIn("fast");

	}



}
// </フォーム固定>


// <お絵かき高機能モード>
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
	$("#oekakiMode").change(function(){
		if($(this).prop("checked") && $("#oekaki_plugin").prop("checked") ){
			loadOekakiEx();
		}
	});
	if(getCookie("oekaki_ex") == 1){
		$("#oekaki_plugin").prop("checked",true);
		if($("#oekakiMode").prop("checked")){
			loadOekakiEx();
		}
	}
});
// </お絵かき高機能モード>

	function loadOekakiEx(){
//	var url = "http://let.st-hatelabo.com/Fxnimasu/let/hJmd88Dl4M4W.bookmarklet.js";
		var url = "//open.open2ch.net/lib/oekakiex/hJmd88Dl4M4W.bookmarklet.v2.js";
		$.getScript(url);
	}


var hour = new Date().getHours();

// 23:00-1:00 
//var sec = (hour > 22 || hour < 2) ? (1000*30) : (1000*10); 
var sec = 1000*10;

var defTitle;

var selectedID = {};

$(function(){
	$("img.lazy").lazyload(
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
			//Num
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

	// ID選択解除
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

$(function(){
	//安価機能
	$(".num").live("click",function(e){ 
		if($(".mainBox").css("display") !== "block"){
			if($('#MESSAGE').val()){
				$('#MESSAGE').val(jQuery.trim( $('#MESSAGE').val() ));
			}

			$('#MESSAGE').focus();
			$('#MESSAGE').val(  ($('#MESSAGE').val() ? $('#MESSAGE').val() + "\n" : $('#MESSAGE').val()) + ">>" + $(this).attr("val") + "\n")


			if($("#formdiv").css("position") !== "fixed"){
//			moveToLink($("[name=_preForm]"));
				
			}
			e.preventDefault();
		}
	});
})



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

		setTimeout(function(){

			$.ajax({
					type: "POST",
					url    : "/ajax/tuho_submit.cgi",
					data   :  $form.serialize(),
					cache  : false,
					success: function(res){

						$("#tuhoLoading").html("");
						alert("通報しました。削除人の対応まで、今しばらくおまちください。m(_ _)m");

						//終了処理
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
		},1000);
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
	if ("WebSocket" in window) {
		isNodeJS = 1;
		nodejs_connect();
	}
	// WebSocketに未対応のブラウザは更新チェックしない。

	oekakiInit();
	matomeInit();
	menuInit();

	//状態をCookieで保持
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


	$("#ajaxSubmit").change(function(){
		setCookie("submitMode", $(this).is(':checked') ? "1" : "0");
	});

	$("#oekakiMode").change(function(){
		setCookie("oekakiMode", $(this).is(':checked') ? "1" : "0");
	});


	$("#noSoundAlert").change(function(){
		setCookie("noSoundAlert", $(this).is(':checked') ? "1" : "0");
	});

	$("#alertRes").change(function(){
		setCookie("alertRes", $(this).is(':checked') ? "1" : "0");
	});
	
	$('#form1').submit(function() {

//	alert("debug");


		if( isOekakiDone == 1 && 
		    $("#oekakiMode").is(':checked') && 
		    ($('#sketch').sketch().actions.length || $('#sketch').sketch().baseImageURL) && 
		    $("[name=oekakiData]").val() == ""){

		$("#submit_button").prop("disabled",true);

			var img = new Image();
			var source = $('#sketch').sketch().el.toDataURL("image/png");
			img.src = source;
			img.onload = function(){

			var _source = new String(source).replace(/^data:image\/png;base64,/, '');
					$("[name=oekakiData]").val(_source);
					$('#form1').submit(); //再度、送信する。
			}
		
			return false;
		}

//		return false;

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


// MatomeLink
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

function setKoraboLink(){

	$(document).on("mouseover", ".opic", function(){ 
		$(this).css("cursor","pointer") 
	});

	$(document).on("click", ".opic", function(){
		if(confirm("この画像とコラボするとね？？\n(他の人が描いた絵をベースに追記できる機能でござる☆)")){

			//親IDをセット
			$("#parent_pid").val($(this).attr("pid"));

			//v3:画像をローカル画像に差し替える(編集可能化)
			var local_image_url = $(this).attr("src").replace("https://.+open2ch.net","");

			var _this = this;

			if($("#oekakiMode").is(':checked')){
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

			// v13サイズを一致させる。
			var size = $(this).width() + "x" + $(this).height();
			$("#canvasSize").val(size).trigger("change");

		}
	})
}

function setPaletColor(color){
	$("#colorPicker").spectrum("set", color);
}

var isOekakiDone = 0;

function oekakiInit(){

	$(".opic").css({cursor:"pointer"});

	setKoraboLink();

	// ツール：戻る
	$("#backButton").click(function(){
		$('#sketch').sketch().actions.pop();
		$('#sketch').sketch().redraw();
	});

	// キーで戻る
	$(document).keydown(function(e){
		if( e.which === 90 && e.ctrlKey ){
			$('#sketch').sketch().actions.pop();
			$('#sketch').sketch().redraw();
		}
	}); 


	//お絵かきモード
	var sketch = $('#sketch').sketch();

	sketch.bind("mousedown", function(){
		isOekakiDone = 1;
	});

	//スマホ用
	sketch.get(0).addEventListener("touchend", function(){
		isOekakiDone = 1;
	});

	// 色選択
	$("#colorPicker").spectrum({
		showAlpha: true,
		showPalette: true,
		move: function(color) {
			$('#sketch').sketch("color",color.toRgbString());
		}
	});

	// 背景色
	$("#bgcolorPicker").spectrum({
		showAlpha: true,
		color: "#fff",
		showPalette: true,
		move: function(color) {
//				$('#sketch').sketch("color",color.toHexString());
//			alert("hoe");

			$('#sketch').sketch().setBgcolor(color.toRgbString());
		}
	});



	// ツール：サイズ
	$("#psize").change(function(){
		$('#sketch').sketch("size",$(this).val());
	});

	// ツール：消す＆描くモード
	$("#kesu").click(function(){
		$("[data-tool=eraser]").click();
	});

	// ツール：消す＆描くモード
	$("#spoit").click(function(){
		$("[data-tool=spoit]").click();
	});

	$("#saveButton").click(function(){
		if(isOekakiDone){
			var link = document.createElement('a');
			link.download = ["open2ch",new Date().getTime()].join("-") + ".png";
			link.href = $('#sketch').sketch().download("png");
			link.click();
		} else {
			alert("まだ何も描かれていないようだ。。");
		}
	});



	// ツール：クリアボタン
	$("#clearButton").click(function(){
		if(confirm("お絵かきをクリアします。よろしいですか？")){
			$('#sketch').sketch().clear();
			isOekakiDone = 0;
		}
	});

	$("#kaku").click(function(){
		$("[data-tool=marker]").click();
	});

	$("#oekakiMode").click(function(){
		if($(this).attr("checked")){
			$("#oekakiCanvas").slideDown("fast");
		} else {
			$("#oekakiCanvas").slideUp("fast");
		}
	})

	//サイズ変更
	$("#canvasSize").change(function(){
		var size = $(this).val().split("x");
		var ctx = $("#sketch").get(0).getContext('2d');

		$(ctx.canvas).animate({ 
			width : size[0],
			height : size[1],
		}, "fast",function(){
			ctx.canvas.width = size[0];
			ctx.canvas.height = size[1];
			$("#sketch").sketch().redraw();
		});
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

			if(res.match(/success/)){ // 投稿成功
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



// フォーム送信関連
var submit_flag = 0;
function submit_form(){


	$("body").trigger("SUBMIT_SEND_PRE_START");


	$("#submit_button").prop("disabled",true);
	$("#loading_bar").slideDown('fast');

	var img = "https://image.open2ch.net/image/read.cgi/image.cgi?" + bbs + "/" + key;
	$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
	$("#status").html("投稿中...");

	var query = {
		FROM : $('[name=FROM]').val(),

		mail : $('[name=mail]').val(),
		sage : ($("[name=sage]").is(':checked') ? 1 : 0),
		ninja : ($("[name=ninja]").is(':checked') ? 1 : 0),
		rating : ($("[name=rating]").is(':checked') ? 1 : 0),

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

		oekakiMode : ($("#oekakiMode").is(':checked') ? 1 : 0),
		oekakiData : ($("#oekakiMode").is(':checked') ? $("[name=oekakiData]").val() : "")
	};

	$.ajax({
		type: "POST",
		url    : "/test/bbs.cgi",
		data   : query,
		cache  : false,
		error  : function(res){
			alert("投稿失敗！\n今はサーバがおかしいみたい。。少し待ってから投稿してみよう！");
			$("#submit_button").prop("disabled",false);
			$("#loading_bar").slideUp('slow');
		},

		success: function(res){

			$(".dlink").remove();

			if(res.match(/success/)){ // 投稿成功、新規書き込みを読み込む

//			server_resnum = (res.split(":"))[1];
//			server_updated = (res.split(":"))[2];

				$('#MESSAGE').val("");
				$('#oekakiData').val("");
				$("#parent_pid").val("");
				$('#sketch').sketch().clear();

				var img = "https://image.open2ch.net/image/read.cgi/image.cgi?mode=done&" + bbs + "/" + key;
				$("#statusicon").html("<img width=32 height=32 src='"+img+"'>&nbsp;");
				$("#status").html("投稿完了しました!");
//			update_res();
				submit_flag = 1;

				setTimeout(function(){
					$("#submit_button").prop("disabled",false);
					$("#loading_bar").slideUp('slow');
				},1000);

			} else {
				alert("投稿失敗。。\n何らかの原因で投稿できませんでした。\nちょっと待ってからもう一度試してみよう。\n以下、エラー内容：\n"+res);
				$("#submit_button").prop("disabled",false);
				$("#loading_bar").slideUp('slow');
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


	local_resnum = server_resnum;
	nodejs_set_resnum(local_resnum);

	$.ajax({
		type: "GET",
		url    : "/ajax/get_res.v7.cgi/" + bbs + "/" + key + "/",
		data   :query,
		cache  : true,
		success: function(res){


			if(res.match(/success/)){
				//update時に最新情報を同時に取得
				var html = (res.split(""))[1];
				
				
				//local_resnum = (res.split(""))[2];
				//nodejs_set_resnum(local_resnum);

				$(html).find("a").filter(function(){
					if( m = $(this).html().match(/^&gt;&gt;(\d+)$/) ){
						var resnum = m[1];

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
					}
				})

//音声置換処理(PC用)

	$("body").trigger("UPDATE_NEWRES");

	if( $("#use_autoaudio").prop("checked") ){
		html = html.replace("<audio ","<audio autoplay ");
	}


				html = "<dl class=hide>"+html+"</dl>";

				if(pageMode == "sp"){
					$(".thread").append("<section><li>" + html + "</li></section>");
				} else {
					$(".thread").append(html);
				}

				$(".thread").find("dl:hidden").slideDown("slow",function(){
					if(
						 $("#auto_scroll").is(":checked")
						){

						moveToMiddle($(".thread dl:last"),500);

					}
				});

				

				updateIgnore();

				document.title = defTitle;
			} else {
				;;
			}

			//setKoraboLink();

		}
	});
	
}

// nodeJS版
function call_update_alert(_server_resnum){

//	console.log("node-call: server_rewsnum :" + _server_resnum);

		server_resnum = _server_resnum;
		var diff = server_resnum - local_resnum;

		if( diff > 0 ){ // 更新アリ

			var $new_alert = $("<div class='new_alert'>" + 
'<font size=2 color="white">' + 
'<font color=yellow size=3><b>+<span id=now_max>'+diff+'</span>件</b></font> の新着レス <a href=# id=gotoNewRes>▼</a>' +
'</font></div>');


	if( $('#autoOpen').is(':checked') == false){
		$("#new_alert_div").html( $new_alert );
	} else {
		$("#new_alert_div").append( $new_alert );
	}



			if(!$("#new_alert_hide").is(":checked")){
				$new_alert.fadeIn('fast');
			}

	setTimeout(function(){
		$new_alert.animate( { opacity: '0.2',}, { duration: 2000, easing: 'swing', complete:function(){
			$(this).slideUp("fast");
		}});
	},1000);


			document.title = "(+" + diff + ")" + defTitle;

			if(!$('#noSoundAlert').is(':checked')){
				if(isSmartPhone == "0"){
//				$("#soundClip")[0].play();
					soundManager.play('res');

				}
			}

			if($('#autoOpen').is(':checked') || submit_flag == 1){
//				setTimeout(function(){update_res()},1000)
//				update_res();

					update_res();

			} else {

				$("#get_newres_button").val("新着レスを表示する("+diff+"件)").fadeIn("fast");

			}


			if($('#alertRes').is(':checked')){
//				setTimeout(function(){alert("◆お知らせ◆\n新規レスが" + diff + "件ついたよ！");},500);
					alert("◆お知らせ◆\n新規レスが" + diff + "件ついたよ！");
			}
		}
}

// Node.js-client

var socket;
var sockID;

function setSureConter(count){
	$(".sureNinzu").html( count);
	$(".lbox").fadeIn("fast");
}

function setSureTotalConter(count){
	$(".sureTotal").html( count);
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
	socket = io.connect('https://nodessl.open2ch.net:8443',{
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

		//alert("error");
		//startOldTypeUpdateChecker();
		//$("body").append("<img src='https://hoge.open2ch.net/nodejs-status/error.png?"+reason+"' width=1 height=1>");
	});


	socket.on('disconnect',function(){
		onConnect_nodejs = 0;

		console.log("disconnect");
//		console.log(socket);

		setTimeout(function(){
			if($("#disconnect").is(":visible") == 0 && onConnect_nodejs == 0){

				$("body").append(
						"<div id='disconnect' class='hide' align=center>" + 
						"<font color=red>オフラインになりました。自動更新停止中..</font>&nbsp;<input id='retry_button' type=button value='再接続'>" + 
						"</div>"
				);
				$("#disconnect").css({
				"z-index" : "1000",
				"border-bottom": "1px solid #eecccc",
				"fontSize":"9pt",
				"padding":"5px",
				"background": "#ffeeee",
				"position": "fixed",
				"width":"100%",
				"top":"0px",
				"left":"0px"
				}).slideDown("fast");
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
		
		console.log("connect");
//		console.log(socket);

		socket.emit('set', bbs,key,local_resnum);
	});

	//u:updated
	socket.on('u',function(_server_resnum){
		call_update_alert(_server_resnum);
	});

	//stc:setTotalCounter
	socket.on('stc',function(count){
		setSureTotalConter(count);
	});
	
	//sc:setCounter
	socket.on('sc',function(count){
		setSureConter(count);
	});

	//su:setCounterUpdate
	socket.on('c',function(res){
//		setSureTotalConter(count);
		if(res["p"]){
			setSureTotalConter(res["p"]);
		}
		if(res["n"]){
			setSureConter(res["n"]);
		}
	});

	//ru:ratingUpdated
	socket.on('ru',function(updated){
//		setSureTotalConter(count);
		updateRating(updated);
	});




}

function nodejs_set_resnum(_local_resnum){
	//sr=SetResnum
	socket.emit('sr',_local_resnum );
}

// Twitter

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

	//初期状態
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
		} else { // 閉じた
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

//		console.log(data);

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


