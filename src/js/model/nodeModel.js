var NodeModel = Backbone.Model.extend({
	defaults : {
		time:{
			"hour":1,
			"min":30
		},
		screenName:"screeeeeen",
		userName:"userrrrrrrr"
	},
	initialize : function (attr,opt) {
		if(!opt) opt = {};
		if(opt.store) this.localStorage = opt.store;

		this.set("time",{
			"hour":Math.floor(4*Math.random()),
			"min":Math.floor(60*Math.random())
		});
		if(_.isUndefined(this.get("userName"))){
			this.set("userName", "username");
		}
		if(_.isUndefined(this.get("screenName"))){
			this.set("screenName", "screenName");
		}
	}
});
