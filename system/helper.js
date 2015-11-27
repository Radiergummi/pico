module.exports = {
	/**
	 * custom extend function like jQuery's $.extend
	 * this function merges two objects. */
	extend: function() {
	  for (var i=1; i<arguments.length; i++)
	    for (var key in arguments[i])
	      if (arguments[i].hasOwnProperty(key))
	        arguments[0][key] = arguments[i][key]
	
	    return arguments[0]
	},
	
	shuffle: function(array) {
	    var counter = array.length,
	        temp,
	        index
	        
	    while (counter > 0) {
	        // pick a random index
	        index = Math.floor(Math.random() * counter)
	        
	        // decrease the counter by 1
	        counter--
	        
	        // swap the last element with it
	        temp = array[counter]
	        array[counter] = array[index]
	        array[index] = temp
	    }
	    
	    return array
	},
	
	readableDate: function(timestamp) {
	    var date = (typeof timestamp === 'undefined')
	               ? new Date(Date.now())
	               : timestamp

	    return ('00' + date.getDate()).slice(-2) +
	     '.' + ('00' + date.getMonth()).slice(-2) +
	     '.' + date.getFullYear() +
	     ' ' + ('00' + date.getHours()).slice(-2) +
	     ':' + ('00' + date.getMinutes()).slice(-2) +
	     ':' + ('00' + date.getSeconds()).slice(-2) +
	     ':' + ('000' + date.getMilliseconds()).slice(-3)
	}
}
