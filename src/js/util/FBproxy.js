var FBproxy = function(_store) {
	var store = _store;

	return {
		request: function(path, cb) {
			
			//var localData = store.find({id:path});
			//if( _.isUndefined( localData )){
			if(true){
				FB.api(path, cb);
			}else{
				localData.localFlag = true;
				cb(localData);
			}
			
		}
	};
};