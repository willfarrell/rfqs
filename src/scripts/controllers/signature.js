
SignatureCtrl.$inject = ['$scope'];
function SignatureCtrl($scope) {
	console.log('SignatureCtrl ('+$scope.$id+')');
	
	$scope.output = [];
	var canvas = document.getElementById("signature"),
   		ctx = canvas.getContext("2d");
	/**
	 * Redraws the signature on a specific canvas
     *
     * @param {Array} paths the signature JSON
     * @param {Object} context the canvas context to draw on
     * @param {Boolean} saveOutput whether to write the path to the output array or not
     */
    $scope.drawSignature = function(paths, context, saveOutput) {
	    for(var i in paths) {
	      if (typeof paths[i] === 'object') {
	        context.beginPath();
	        context.moveTo(paths[i].mx, paths[i].my);
	        context.lineTo(paths[i].lx, paths[i].ly);
	        context.lineCap = settings.penCap;
	        context.stroke();
	        context.closePath();
	
	        if (saveOutput) {
	          $scope.output.push({
	            'lx' : paths[i].lx
	            , 'ly' : paths[i].ly
	            , 'mx' : paths[i].mx
	            , 'my' : paths[i].my
	          })
	        }
	      }
	    }
    }
  	
  	$scope.clear = function() {
	  	ctx.save();
	  	ctx.setTransform(1, 0, 0, 1, 0, 0);
	  	ctx.clearRect(0, 0, canvas.width, canvas.height);
	  	ctx.restore();
	  	$scope.init();
  	};
  	
	//-- canvas drawing --//
	$scope.init = function() {
		var previous = {}, offset = {};
   		
   		// init draw
   		// x ---------- // 'x ' = 8px, '- ' = 4px
   		var padding = 10, dash = '';
   		for (var i = (canvas.width - 2*padding - 8*1.5); i > 0; i -= 5) {
	   		dash += '-';
   		}
   		ctx.font         = '15px sans-serif';  // set text font
		ctx.textBaseline = 'bottom';  // set text position
		ctx.fillText('x'+dash, padding, canvas.height - padding); // str, x, y
   		
   		
   		function mouseOffset(e) {
	   		// get offsets
	    	var pageX,pageY, totalOffsetX = 0, totalOffsetY = 0, currentElement = canvas;
	    	
	    	// global position of mouse pointer
	    	if (e.pageX || e.pageY) { 
			  pageX = e.pageX;
			  pageY = e.pageY;
			}
			else { 
			  pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			  pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
			}
			
			// global position of canvas top-left
			do{
		        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		    }
		    while(currentElement = currentElement.offsetParent)
		    
		    // calc grab offset - on mouse down only
		    offset = {
			    top:(pageY - totalOffsetY),
			    left:(pageX - totalOffsetX)
		    };
		    return offset;
	   	}
	   	
	   	function drawLine(e) {
	   		mouseOffset(e);
		    var newX = offset.left, newY = offset.top;
	
		    if (previous.x === newX && previous.y === newY)
		      return true
		
		    if (previous.x === null)
		      previous.x = newX
		
		    if (previous.y === null)
		      previous.y = newY
		
		    ctx.beginPath()
		    ctx.moveTo(previous.x, previous.y)
		    ctx.lineTo(newX, newY)
		    //ctx.lineCap = settings.penCap
		    ctx.stroke()
		    ctx.closePath()
		
		    $scope.output.push({
		      'lx' : newX
		      , 'ly' : newY
		      , 'mx' : previous.x
		      , 'my' : previous.y
		    })
		
		    previous.x = newX
		    previous.y = newY
		  }
	   	
	   	canvas.onselectstart = function(){ return false; };
		canvas.onmouseover = function (e){
			//canvas.onselectstart = function(){ return false; };
		}
		canvas.onmouseout = function (){
		 	//canvas.onselectstart = function(){ return true; };
		};
	    canvas.onmousedown = function (e){
	    	previous.x = null;
	    	previous.y = null;
		 	canvas.onmousemove = drawLine;
			
	    	document.onselectstart = null;
		};
		canvas.onmouseup = function (){
		 	canvas.onmousemove = null;
		 	previous.x = null;
		 	previous.y = null;
		};
	}
   	$scope.init();
   	
}