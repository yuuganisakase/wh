//GetGroupMembersCommand.js
var GetGroupsMembersCommand = function() {
		
		var randomPick = function(ar, all) {

				var oldAr = _.clone(ar);
				var len = oldAr.length;
				var newAr = [];
				var ranNum = Math.floor(len * Math.random());

				for (var i = all; i >= 1; i--) {
					newAr.push(oldAr[ranNum]);
					oldAr.splice(ranNum, 1);
					len = oldAr.length;
					ranNum = Math.floor(len * Math.random());
				}
				log("random pick");
				log(oldAr);
				log(newAr);
				return newAr;

			};
		var allMembers = [];
		return {
			signal : _.extend({}, Backbone.Events),
			execute: function(userId) {
				var that = this;
				FB.api('/' + userId + '/groups', function(res) {
					log("get group members");
					
					if (res.data.length === 0) {
						that.signal.trigger("noGroup");
						return;
					}
					var maxGroupNum = 3;
					if (res.data.length > maxGroupNum) {
						res.data = randomPick(res.data, maxGroupNum);
					}

					var groupCounter = 0;
					_.each(res.data, function(obj) {
						FB.api('/' + obj.id + '/members', function(res2) {
							groupCounter += 1;
							_.each(res2.data, function(obj) {
								allMembers.push(obj);
							});
							if (groupCounter == res.data.length) {
								log("group complete");
								log(allMembers.length);
								that.signal.trigger("complete",allMembers);
							}
						});
					});
				});

			}

		};
	};