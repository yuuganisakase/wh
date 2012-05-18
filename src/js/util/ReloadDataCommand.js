//ReloadDataCommand.js
var ReloadDataCommand = function(_nodes) {
		var count = 2;
		return {
			completeSignal: _.extend({}, Backbone.Events),
			load: function() {
				var that = this;
				$.ajax({
					url: "debug/nodeList" + count + ".json",
					cache: false
				}).done(function(data) {
					log("node list json");
					count += 1;
					if(count == 6){
						count = 1;
					}
					that.completeSignal.trigger("complete", data);
				});

			}
		};
	};