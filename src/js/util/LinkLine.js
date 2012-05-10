//LinkLine.js

var LinkLine = function(a,b) {
	return{
		getId:function() {
			return [a,b];
		},
		isEqual:function(otherLine) {
			var ids = otherLine.getId();
			var me = this.getId();
			if(ids[0] == me[0]  || ids[0] == me[1]){
				if(ids[1] == me[0] || ids[1] == me[1]){
					return true;
				}
			}
			return false;
		}
	};
};