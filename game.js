$(document).ready(function(){

	var timestamp = 0;
	var jumping = false;
	var jumpcount = 0;
	var jumpstamp = 0;
	var score = 0;

	$(document).keypress(function( event ) {
		switch(event.originalEvent.code){
			// jump - spacebar
			case "Space":
				console.log("JUMP");
				triggerJump();
				break;
			default:
				console.log("KEYPRESS");
				break;
		}
	});

	$(".slider").slider({
	   change : function(e, ui) { 
	  		//ui.handle.parentElement.nextElementSibling.innerHTML = ui.value;
	   },
	   slide : function(e, ui) { 
	  		//ui.handle.parentElement.nextElementSibling.innerHTML = ui.value;
	   }/*,
	   stop    : function(e, ui) {
	   //user has dropped            
	   }*/        
	});

	function triggerJump(){
		if(jumpcount < 1){
			jumping = true;
			jumpcount = jumpcount + 1;
			jumpstamp = 0;
		}
	}

	var overlaps = (function () {
	    function getPositions( elem ) {
	        var pos, width, height;
	        pos = $( elem ).position();
	        width = $( elem ).width();
	        height = $( elem ).height();
	        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
	    }

	    function comparePositions( p1, p2 ) {
	        var r1, r2;
	        r1 = p1[0] < p2[0] ? p1 : p2;
	        r2 = p1[0] < p2[0] ? p2 : p1;
	        return r1[1] > r2[0] || r1[0] === r2[0];
	    }

	    return function ( a, b ) {
	        var pos1 = getPositions( a ),
	            pos2 = getPositions( b );
	        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
	    };
	})();

	function seekObjects(distance, n){
		var seeked = $(".obstacle").filter(function() {
		  return (parseInt($(this).css("left")) - parseInt($("#player").css("left")) <= distance) && (parseInt($(this).css("left")) > parseInt($("#player").css("left")));
		});

		return seeked.slice(0, n);
	}

	function restart(){
		timestamp = 0;
		$(".obstacle").remove();
	}

	function redrawMods(){
		$(".lookahead").toArray().forEach(function(la){
			var distance = 7*$(la).find(".slider").slider("option", "value");
			var located = seekObjects(distance, 1);
			if(located.length > 0){
				$(la).find(".presence").find(".notifier").css("background-color", "yellow");
			}
			else{
				$(la).find(".presence").find(".notifier").css("background-color", "white");
			}
			console.log(distance);
			//$(la).find(".presence")
		});
	}

	function redraw(){
		$(".obstacle").css("left", '-=5px');
		if(jumping){
			jumpstamp = jumpstamp + 0.8;
			console.log()
			$("#player").css("top", `-=${4*jumpstamp - 0.5*(0.5*jumpstamp**2)}px`);
			if(parseInt($("#player").css("top")) > 250){
				$("#player").css("top", "250px");
				jumping = false;
				jumpcount = 0;

			}
		}

		// score
		score = $(".obstacle").filter(function() {
		  return parseInt($(this).css("left")) < parseInt($("#player").css("left"));
		}).length;
		$("#score").html(score);
	}

	function checkCollision(){
		var overlapping = false;		
		$(".obstacle").toArray().some(function(o){
			overlapping = overlaps(o, $("#player")[0]);
			return overlapping;
		});

		if(overlapping){
			$("#player").css("background-color", "red");
			restart();
		}
		else{
			$("#player").css("background-color", "yellow");
		}
	}

	function addObstacle(){
		var new_obstacle = $('<div class="obstacle"></div>');
		$("#obstacles").append(new_obstacle);
		new_obstacle.css("left", `+=${Math.round(Math.random() * 200)}px`);
	}

	function loop(){
		timestamp = timestamp + 1;

		// redraw
		redrawMods();
		//triggerMods();
		redraw();
		checkCollision();
		
		// new obstacle
		if(timestamp % 150 == 0){
			addObstacle();
		}	

		requestAnimationFrame(loop);
	}


	// start
	requestAnimationFrame(loop);

});