(function ($) {

	var contents   = [];
	var imgmargin  = [];
	var max_height = [];
	
	$.fn.galeria = function(opciones) {
		//Esta es la variable que contiene la configuracion del plugin
	    var config = $.extend({
	    	directory     : 'album', //
	    	maxheight     : 240, //
			maxheight_def : 240, //
			imgmargin     : 1,
			_t 			  : 0,
			_l 			  : 0,
			_contSize     : 0,
			_window 	  : $(window),
			_windowSizeW  : 0,
			_windowSizeH  : 0,
			_row 	      : 0,
			_images       : [],
			_imagesTemp   : [],
			_imgsRow 	  : [],
			_elmt 	   	  : [],
			_elements  	  : [],
			_elmtRow      : [],
			_reboot  	  : false,
			_match    	  : false,
			_resize 	  : false,//
			fade 		  : true,//
			_newSize      : 0,
			_img 	   	  : [],
			_content 	  : this, //
			margintop    : '0px', //
			marginright  : '0px', //
			marginbottom : '0px', //
			marginleft   : '0px', //
			_print        : false
		
		}, opciones);

	    (function setSize(){
	    	if($(config._content).parent().is('body')){
				config._windowSizeW = window.innerWidth;
				config._windowSizeH = window.innerHeight;
	    	}else{
	    		config._windowSizeW = $(config._content).parent()[0].clientWidth;
	    		config._windowSizeH = $(config._content).parent()[0].clientHeight;
	    	}
	    	setContProperties();
	    	setContSize($(config._content));
	    
	    })();

		(function getImages(){
			max_height.push( config.maxheight )
			contents.push( $(config._content) );
			imgmargin.push( config.imgmargin );
			
			jQuery.ajax({
				type : 'POST',
				url : 'read_dir.php',
				data : {dir: config.directory},
				success: function(data){
					config._images = data;
				},
				dataType: "json",
				async: false
			});

		})();

    	(function init(){
    		config.maxheight_def = config.maxheight;
    		setImgSize();
    		setVisor();
    	
    	})();

    	function setContProperties(){

    		config._content
			.css('position','relative')
			.css('margin-top',config.margintop)
			.css('margin-right',config.marginright)
			.css('margin-bottom',config.marginbottom)
			.css('margin-left',config.marginleft);
    	
    	}

		function setContSize(content){

			var margins,marginleft,marginright,total=0,percent=true,percent_val = 100;

			config.margintop = content.css('margin-top');
			config.marginright = content.css('margin-right');
			config.marginbottom = content.css('margin-bottom');
			config.marginleft = content.css('margin-left');

			if(config.marginleft.indexOf('%') != -1){
				marginleft = parseInt(config.marginleft.substr(0,config.marginleft.indexOf('%')));
				percent = true;
				total = total + marginleft;
			}
			if(config.marginright.indexOf('%') != -1){
				percent = true;
				marginright = parseInt(config.marginright.substr(0,config.marginright.indexOf('%')));
				total = total + marginright;
			}
			if(config.marginleft.indexOf('px') != -1){
				percent = false;
				marginleft = parseInt(config.marginleft.substr(0,config.marginleft.indexOf('px')));
				total = total + marginleft;
			}
			if(config.marginright.indexOf('px') != -1){
				percent = false;
				marginright = parseInt(config.marginright.substr(0,config.marginright.indexOf('px')));
				total = total + marginright;
			}
			
			if(!percent){
				margins = total;
			}else{
				margins = (config._windowSizeW * total)/100;
			}

			config._contSize = config._windowSizeW - margins;

			content
			.css('width',parseInt(config._contSize));
			
			config._contSize = Math.ceil(content[0].clientWidth);

			if(config._contSize%2 != 0){
			
				config._contSize++;

				content.css('width',parseInt(config._contSize));
				
			}

			return config._contSize;
		
		}

		function setImgSize(){

			var w, h, r, l, t;
			var resto = 0,sobras = false;
			config._l = 0;
			config._imagesTemp = config._images;
			
			for(var i = 0; i < config._imagesTemp.length; i++){//

				if(config._resize){
					w = config._imagesTemp[i].clientWidth;
					h = config._imagesTemp[i].clientHeight;		
					r = $(config._imagesTemp[i]).data('rest');
					w = w - parseInt(r);
				}else{
					w = config._imagesTemp[i].width
					h = config._imagesTemp[i].height;
				}
					
				w = (w * config.maxheight) / h;
				w = parseInt(w);
				h = config.maxheight;

				config._row = config._row + (w+(config.imgmargin*2));
				resto = config._contSize - config._row;
				l = config._l
				t = config._t

				config._imgsRow.push([config._imagesTemp[i],w,h,l,t]);				
				config._l = config._l + (w+(config.imgmargin*2));

				if( resto > 0 && resto < 10 ){

					config._match = true;
					config._t = config._t + (config.maxheight+(config.imgmargin*2));					

					break;

				}else if(config._row > config._contSize){

					config.maxheight--;
					config._row 	 = 0;
					config._imgsRow  = [];
					config._reboot   = true;
					break;

				}

				sobras = true;

			}

			if(config._reboot){

				config._reboot = false;
				setImgSize();
			
			}else if(config._match){
				config._match = false;
				var is  = config._imgsRow;
				
				for(var z = 0 ; z<config._imgsRow.length;z++){
					config._imagesTemp.splice(0,1);
				}
				
				config._images 	  = config._imagesTemp;
				config.maxheight  = config.maxheight_def;
				config._row 	  = 0;
				config._imgsRow   = [];

				if(config._resize){
					updateFoto(is,resto);
				}else{
					ponerFoto(is,resto);
				}

			}else if(sobras){

				var is = config._imgsRow;
				sobras = false;
				
				for(var z = 0 ; z<config._imgsRow.length;z++){
					config._imagesTemp.splice(0,1);
				}
				
				config._images    = config._imagesTemp;
				config.maxheight  = config.maxheight_def;
				config._row 	  = 0;
				config._imgsRow   = [];

				if(config._resize){
					config._t = config._t + h;
					updateFoto(is,0);
				}else{
					ponerFoto(is,0);
				}
			
			}

		}

		function updateFoto(elmts,resto){

			var f = '';
			var w = 0;
			var h = 0;
			var r = 0;

			for(var x = 0 ; x<elmts.length;x++){
				
				f = $(elmts[x][0]);
				w = elmts[x][1];
				h = elmts[x][2];
				l = elmts[x][3];
				t = elmts[x][4];

				r = 0;

				if(x == 0){
					r = resto;
					w = elmts[x][1]+resto;
				}

				if(x == 0){
					f.css('z-index','10')
					.animate({left:0,top:t},{queue:false});
				}else{
					f.css('z-index','9')
					.animate({left:l+resto,top:t},{queue:false});
				}

				f.attr('data-rest',r)
				.css('position','absolute')
				.css('width',w)
				.css('height',h);

				f.find('img').attr('width',w).attr('height',h);
			}

			if(config._imagesTemp.length != 0){
				setImgSize();
			}

		}

		function ponerFoto(imgs,resto){

			var f = '';
			var w = 0;
			var h = 0;
			var r = 0;

			for(var x=0 ; x<imgs.length ;x++){
				f = config.directory+'/'+imgs[x][0].file;
				w = imgs[x][1];
				h = imgs[x][2];
				l = imgs[x][3];
				t = imgs[x][4];

				r = 0;
				if(x == 0){
					r = resto;
					w = imgs[x][1]+resto;
				}else{
					l = l + resto
				}

				var _e = $('<div class="galery" data-rest="'+r+'"><img src="'+f+'" alt="" width="'+w+'" height="'+h+'"/></div>')
				.css('position','absolute')
				.css('top',t)
				.css('left',l)
				.css('margin',config.imgmargin+'px')
				.css('cursor','pointer')
				.css('width',w)
				.css('height',h);
				
				if(config.fade){
					_e.fadeIn(Math.random()*2000);
				}
				
				config._img.push(_e);
				
			}

			if(config._imagesTemp.length == 0){
				config._print = true;
				config._t = 0;
			}else{
				setImgSize();
			}

		}
	    
	    function setVisor(){
	    	
			var panel = $('.panel-galery');
			var bg = $('.bagro');

			if(panel.length == 0) {
	    		var visor = $('<div class="panel-galery"></div>');
			    visor.css('position', 'fixed')
			    .css('top', '5%')
			    .css('background-color', 'white')
			    .css('display', 'none')
			    .css('border', '1px solid black')
			    .css('z-index', '99999')
			    .css('box-sizing', 'border-box')
			    .css('padding', '20px')
			    .css('border-radius', '10px')
			    .css('box-shadow', '0px 0px 20px black');
    
	    		$('body').append(visor);

	    	}
			
			if(bg.length == 0) {
				var bagro = $('<div class="bagro"/>');
				bagro
				.css('position', 'fixed')
				.css('height', '100%')
				.css('width', '100%')
				.css('background', 'rgba(0, 0, 0, 0.76)')
				.css('z-index','99998')
				.css('display', 'none')
				.css('top', '0')
				.css('left', '0');

				bagro.insertBefore('.panel-galery');
				    
			}

	    }
		
		if(config._print){
			config._print = false;
			for(var z = 0; z<config._img.length;z++){
				config._content.append(config._img[z]);
			}
			$(config._content).css('height',config._content[0].scrollHeight);
			
		}

		$(window).on('resize', function(e){
		    window.resizeEvt;
		    $(window).resize(function(){
		        clearTimeout(window.resizeEvt);
		        window.resizeEvt = setTimeout(function(){
			    	
			    	for(var c = 0; c < contents.length;c++){

			    		config._images = [];

				    	if($(contents[c]).parent().is('body')){
							config._windowSizeW = window.innerWidth;
							config._windowSizeH = window.innerHeight;
				    	}else{
				    		config._windowSizeW = $(contents[c]).parent()[0].clientWidth;
				    		config._windowSizeH = $(contents[c]).parent()[0].clientHeight;
				    	}

			    		config.maxheight      = max_height[c];
			    		config.maxheight_def  = max_height[c];
			    		config.imgmargin      = imgmargin[c];
				   		config._contSize      = setContSize(contents[c]);
				    	config._images        = contents[c].find('.galery');
				    	config._resize        = true;
				    	
				    	setImgSize();

				    	$(contents[c]).css('height',(config._t+10)+'px');

				    	config._t 	   = 0;
			    		config._resize = false;
			    	}

		        }, 750);
		    });
		
		});	

	};

	$('body').on('mouseover','.galery',function(){

		$(this).animate({
			opacity : 0.5
		},{
			queue: false
		},'fast');
    	
    });

    $('body').on('mouseout','.galery',function(){

		$(this).animate({
			opacity : 1
		},{
			queue: false
		},'fast');
	    	
	});

    var ua = navigator.userAgent;

	if(ua.match(/iPhone/) || ua.match(/iPad/)){
	    event = 'touchstart';
	}else{
	    event = 'click';
	}
 
    $('body').on(event,'.galery',function(){

    	var img = $(this).find('img');
    	var src = img.attr('src');
    	var width_;
    	var height_;
    	var left_;
	
		var cerrar = $('<span class="flop" id="cerrar">x</span>');
		
		cerrar
		.css('position','absolute')
		.css('right','2px')
		.css('top','2px')
		.css('background-color','rgba(128, 128, 128, 0.36)')
		.css('width','20px')
		.css('height','20px')
		.css('cursor','pointer')
		.css('text-align','center')
		.css('border-radius','20px')
		.css('text-decoration','none')
		.css('font-family','Arial')
		.css('color','white')
		.css('z-index', '1000000');

		var ventanaH = window.innerHeight;
		var ventanaW = window.innerWidth;

		var alturaPanel = $('.panel-galery').css('top');
		alturaPanel = alturaPanel.substr(0,alturaPanel.indexOf('%'));
		var alturaLimite = parseInt(Math.ceil((ventanaH*5) /100));

		ventanaH = ventanaH - (alturaLimite*3);

		var imagen = new Image();
		imagen.src = src;

		if(imagen.height >= ventanaH && imagen.width <= ventanaW){

			width_ = (imagen.width * ventanaH) / imagen.height;
			height_ = ventanaH;

		}
		else if(imagen.height <= ventanaH && imagen.width >= ventanaW){

			height_ = (imagen.height * ventanaW-100) / imagen.width;
			width_ = ventanaW - 100;

		}
		else if(imagen.height >= ventanaH && imagen.width >= ventanaW){

			ventanaW = ventanaW - 100;
			width_ = ventanaW;
			height_ = (imagen.height * ventanaW) / imagen.width;
			while(height_>ventanaH){
				height_ = (imagen.height * ventanaW) / imagen.width;
				ventanaW--;
			}
			width_ = ventanaW;

		}else{

			width_ = imagen.width;
			height_ = imagen.height;

		}

		var img = '<img src="'+src+'" width="'+parseInt(width_)+'" height="'+parseInt(height_)+'" alt="" />';

		left_ = parseInt(window.innerWidth - width_);
		left_ = parseInt(Math.ceil((left_)/2)-20);

		$('.panel-galery').css('left',left_);

		$('.panel-galery').html(img);

		$('.panel-galery').append(cerrar);

    	$('.panel-galery').fadeIn( 'fast' );
    	$('.bagro').fadeIn( 'slow' );
	    	
	});		

	$('body').on(event,'.flop',function(){
		
		if($('.panel-galery').is(':visible')){
			$('.panel-galery').fadeOut('fast');
			$('.bagro').fadeOut('slow');
		}
	
	});

	$(document).on(event,'.bagro',function(){
		
		if($('.panel-galery').is(':visible')){
			$('.panel-galery').fadeOut('fast');
			$('.bagro').fadeOut('slow');
		}
	
	});

	$(document).keyup(function(e) {
		
		if($('.panel-galery').is(':visible')){
			if(e.which===27){ 
				$('.panel-galery').fadeOut('fast'); 
				$('.bagro').fadeOut('slow'); 
			} 
		}
	
	});

}(jQuery));

