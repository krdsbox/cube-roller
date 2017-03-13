// pre load image
function imgpreload( imgs, callback ) {
	"use strict";
	var loaded = 0,
	forceStop	=	true,
	images = [];
	imgs = Object.prototype.toString.apply( imgs ) === '[object Array]' ? imgs : [imgs];
	var inc = function() {
		loaded += 1;
		if ( loaded === imgs.length && callback ) {
			callback( images );
		}
	};
	for ( var i = 0; i < imgs.length; i++ ) {
		images[i] = new Image();
		images[i].onabort = inc;
		images[i].onerror = inc;
		images[i].onload = inc;
		images[i].src = imgs[i];
	}
}
setTimeout(function(){
	imgpreload(['img/img-01.jpg', 'img/img-02.jpg', 'img/img-03.jpg', 'img/img-04.jpg'], function( images ) {
		document.body.className = 'docReady';
		setTimeout(function(){
			document.getElementById('loader').style.display = 'none';
			forceStop	=	false;
		}, 1500);
	});
}, 3000);

// Start cube roller control
var App = {
	doc: $(document),
	win: $(window)
};

var cubeRoll 		= 	$('.cube-roller'),
	cubemain			=	$('.cube-main'),
	cubeBox			=	$('.cube-box'),
	cubeSlider		=	$('.cube-slider'),
	boxFront			=	$("#CS-1"),
	boxBottom		=	$("#CS-2"),
	boxBack			=	$("#CS-3"),
	boxTop			=	$("#CS-4"),
	animateCont		=	$('.cube-content-inner'),
	arrow				=	$('.arrows'),
	rxAdd 			= 	90,
	cX 				= 	0,
	active			=	1,
	scrollIntervel	=	1030,
	crH 				=	cubeRoll.height(),
	pers3D, transZ, cXBtm, cXTp;

var cube3d	=	{
	cubeScroll:	function() {

		App.win.on( 'DOMMouseScroll mousewheel', function ( e ) {
			if( e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0 ) {	//Scroll Control
				if(forceStop)
					return;

				forceStop	=	true;
				cube3d.downSetup();	// Scroll down
				setTimeout(function(){ forceStop	=	false; }, scrollIntervel + 50);
			} else {
				if(forceStop)
					return;

				forceStop	=	true;
				cube3d.upSetup();	// Scroll Up
				setTimeout(function(){ forceStop	=	false; }, scrollIntervel + 50);
			}

			setTimeout(function(){	// Reset Rodate after complete 360 deg
				cube3d.resetRodate();
			}, scrollIntervel);

			return false;
		});
		App.win.keyup(function(e) { //Keyboard Control
			if(e.which == 40) {
				if(forceStop)
					return;

				forceStop	=	true;
				cube3d.downSetup();	// Scroll down
				setTimeout(function(){ forceStop	=	false; }, scrollIntervel + 50);
		   } else if(e.which == 38) {
				if(forceStop)
					return;

				forceStop	=	true;
				cube3d.upSetup();	// Scroll Up
				setTimeout(function(){ forceStop	=	false; }, scrollIntervel + 50);
			}

			setTimeout(function(){	// Reset Rodate after complete 360 deg
				cube3d.resetRodate();
			}, scrollIntervel);

			return false;
		});
	},
	cubeinitialSetup: function() {
		cX = 0,
		pers3D	=	crH*8,
		transZ = crH/2;
		boxFront.addClass('_active_cnt');
		cubeRoll.css({
			transform: "perspective("+pers3D+"px) translateZ(-"+transZ+"px)"
		}), cubeSlider.css({
			"transform-origin": "50% 50% -"+transZ+"px"
		})
		cube3d.cubeRodate();
		cube3d.cubeScroll();
	},
	cubeResizeSetup: function() {
		crH 		=	cubeRoll.height(),
		pers3D	=	crH*8,
		transZ 	=	crH/2;
		cubeRoll.css({
			transform: "perspective("+pers3D+"px) translateZ(-"+transZ+"px)"
		}), cubeSlider.css({
			"transform-origin": "50% 50% -"+transZ+"px"
		})
		cube3d.cubeRodate();
	},
	downSetup: function() {
		cX += rxAdd;
		active += 1;
		cubeSlider.removeClass('_active_cnt');
		cubeRoll.removeClass('_up');
		cubeRoll.addClass('_down');
		setTimeout(function(){
			cube3d.cubeRodate();
		}, 0);
		cube3d.addcontentAnimateclass();	// Control Classes
		if( active > 4 ) {
			active = 1;
			$('#CS-'+active).addClass('_active_cnt');
		} else {
			$('#CS-'+active).addClass('_active_cnt');
		}
	},
	upSetup: function() {
		cX -= rxAdd;
		active -= 1;
		cubeSlider.removeClass('_active_cnt');
		cubeRoll.removeClass('_down');
		cubeRoll.addClass('_up');
		setTimeout(function(){
			cube3d.cubeRodate();
		}, 0);
		cube3d.addcontentAnimateclass();	// Control Classes
		if( active <= 0 ) {
			active = active + 4;
			$('#CS-'+active).addClass('_active_cnt');
		} else {
			$('#CS-'+active).addClass('_active_cnt');
		}
	},
	resetRodate: function() {
		if( cX >= 360 || cX <= -360 ) {
			cX = 0;
			cube3d.cubeRodate();
			cubeSlider.css({
				transition: "transform 0s"
			})
		}
	},
	addcontentAnimateclass: function() {
		cubeRoll.removeClass('_active');
		setTimeout(function(){
			cubeRoll.addClass('_tempTrans _active');
			arrow.addClass('hide');
		}, 50);
		setTimeout(function(){
			cubeRoll.removeClass('_tempTrans');
		}, scrollIntervel + 40);
	},
	cubeRodate: function() {
		cXBtm	= cX-rxAdd;
		cXTp	= cX+rxAdd;

		cubeSlider.css({
			transition: "transform 1s ease"
		}), boxFront.css({
			transform: "perspective("+pers3D+"px) rotateX("+cX+"deg) translateZ(0px)"
		}), boxBottom.css({
			transform: "perspective("+pers3D+"px) rotateX("+cXBtm+"deg)"
		}), boxBack.css({
			transform: "perspective("+pers3D+"px) rotateX("+cX+"deg) rotateY(180deg) rotateZ(180deg) translateZ(0px)"
		}), boxTop.css({
			transform: "perspective("+pers3D+"px) rotateX("+cXTp+"deg) translateZ(0px)"
		});

	}
}

cube3d.cubeinitialSetup();	// init
App.win.resize(function() {	// Resize
	cube3d.cubeResizeSetup();
});
if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
	$('html').addClass('touch')
	setInterval(function(){ cube3d.downSetup(); }, 5000);
}
