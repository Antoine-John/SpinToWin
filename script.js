var segments = 12;
var angle = 2*Math.PI/12;
var newAngle = 0;

/*
function draw(){
	var canvas = document.getElementById('wheel_of_fortune');
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFFAFA";

	//Draw 'Pie' wheel
	for (i=1; i<=segments; i++){
		ctx.beginPath();
		ctx.moveTo(300,300);
		newAngle = i * angle;
		ctx.arc(300, 300, 200, 0, newAngle);
		ctx.lineTo(300, 300);
	  	ctx.stroke();
	}

}

window.onload = draw;
*/
//^used a canvas to draw the pie wheel, however the resulting wheel was rather pixelated, need to find way to make the wheel higher resolution or choose different method.



//This is the end goal to reach, make a function rotate, that runs similarly to the one below, uncomment for example

/*
$(document).ready(function(){
	$('.btn').click(function(){
		$("#test").css("-webkit-animation-duration", "1s");
		$("#test").delay(4000).queue(function(next){
			$(this).css("-webkit-animation-duration", "0.2s");
			next();
		});

		setTimeout(function(){
			$("#test").css("-webkit-animation-duration", "1s");
			setTimeout(function(){
				$("#test").css("-webkit-animation-duration", "0.5s");
				setTimeout(function(){
					$("#test").css("-webkit-animation-duration", "0.2s");
					setTimeout(function(){
						$("#test").css("-webkit-animation-duration", "1s");
						setTimeout(function(){
							$("#test").css("-webkit-animation-duration", "0s");
						}, 1000);
					}, 1000);
				}, 4000);
			}, 1000);
		}, 500);

	})
});
*/

/*
jQuery-Rotate-Plugin v0.2 by anatol.at
http://jsfiddle.net/Anatol/T6kDR/
*/

//currently random, but in future will take winners off of data
// .rotate() DEMO


var end = 0;
$(function() {

  $('.btn').click(function() {
    $('#test').rotate({ count:4, duration:0.3, easing:'ease-in' });
    $('#test').rotate({ count:15, duration:0.1});
    for(var i=0.1; i<1.5; i=i+0.5){
    	$('#test').rotate({ count:1, duration:i});
    }
    for(var j=1.5; j<2.5; j=j+0.75){
    	$('#test').rotate({ count:1, duration:j});
    }
    for(var k=2.5; k<3.5; k=k+1){
    	$('#test').rotate({ count:1, duration:k});
    }
    end = Math.random()*360;

    //ensure that it the spinner does not land exactly between two categories, not necessary with predetermined winnings however
    if (end%30 == 0){
    	end=end+1;
    }
    time = end / 180 * 4;
    $('#test').rotate({duration:time, endDeg:end, easing:'ease-out', persist:true });
    var final = 12 - Math.floor(end/30);
    alert ('you got '+ final); 
  })
})

$.fn.rotate=function(options) {
  var $this=$(this), prefixes, opts, wait4css=0;
  prefixes=['-Webkit-', '-Moz-', '-O-', '-ms-', ''];
  opts=$.extend({
    startDeg: false,
    endDeg: 360,
    duration: 1,
    count: 1,
    easing: 'linear',
    animate: {},
    forceJS: false
  }, options);

  function supports(prop) {
    var can=false, style=document.createElement('div').style;
    $.each(prefixes, function(i, prefix) {
      if (style[prefix.replace(/\-/g, '')+prop]==='') {
        can=true;
      }
    });
    return can;
  }

  function prefixed(prop, value) {
    var css={};
    if (!supports.transform) {
      return css;
    }
    $.each(prefixes, function(i, prefix) {
      css[prefix.toLowerCase()+prop]=value || '';
    });
    return css;
  }

  function generateFilter(deg) {
    var rot, cos, sin, matrix;
    if (supports.transform) {
      return '';
    }
    rot=deg>=0 ? Math.PI*deg/180 : Math.PI*(360+deg)/180;
    cos=Math.cos(rot);
    sin=Math.sin(rot);
    matrix='M11='+cos+',M12='+(-sin)+',M21='+sin+',M22='+cos+',SizingMethod="auto expand"';
    return 'progid:DXImageTransform.Microsoft.Matrix('+matrix+')';
  }

  supports.transform=supports('Transform');
  supports.transition=supports('Transition');

  opts.endDeg*=opts.count;
  opts.duration*=opts.count;

  if (supports.transition && !opts.forceJS) { // CSS-Transition
    if ((/Firefox/).test(navigator.userAgent)) {
      wait4css=(!options||!options.animate)&&(opts.startDeg===false||opts.startDeg>=0)?0:25;
    }
    $this.queue(function(next) {
      if (opts.startDeg!==false) {
        $this.css(prefixed('transform', 'rotate('+opts.startDeg+'deg)'));
      }
      setTimeout(function() {
        $this
          .css(prefixed('transition', 'all '+opts.duration+'s '+opts.easing))
          .css(prefixed('transform', 'rotate('+opts.endDeg+'deg)'))
          .css(opts.animate);
      }, wait4css);

      setTimeout(function() {
        $this.css(prefixed('transition'));
        if (!opts.persist) {
          $this.css(prefixed('transform'));
        }
        next();
      }, (opts.duration*1000)-wait4css);
    });

  } else { // JavaScript-Animation + filter
    if (opts.startDeg===false) {
      opts.startDeg=$this.data('rotated') || 0;
    }
    opts.animate.perc=100;

    $this.animate(opts.animate, {
      duration: opts.duration*1000,
      easing: $.easing[opts.easing] ? opts.easing : '',
      step: function(perc, fx) {
        var deg;
        if (fx.prop==='perc') {
          deg=opts.startDeg+(opts.endDeg-opts.startDeg)*perc/100;
          $this
            .css(prefixed('transform', 'rotate('+deg+'deg)'))
            .css('filter', generateFilter(deg));
        }
      },
      complete: function() {
        if (opts.persist) {
          while (opts.endDeg>=360) {
            opts.endDeg-=360;
          }
        } else {
          opts.endDeg=0;
          $this.css(prefixed('transform'));
        }
        $this.css('perc', 0).data('rotated', opts.endDeg);
      }
    });
  }

  return $this;
};
