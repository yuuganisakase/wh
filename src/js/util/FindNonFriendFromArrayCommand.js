//FindNonFriendFromArrayCommand.js

var FindNonFriendFromArrayCommand = function() {

		var friends = [];
		var allMembers = [];
		var nonFriendMutual = [];

		var removeFriends = function() {
			_.each(friends, function(f) {

				for (var i = allMembers.length - 1; i >= 0; i--) {
					var a = allMembers[i];
					if(a.id == f.id){
						allMembers.splice(i,1);
					}
				}

			});
		};
		var checkMutualSignal = _.extend({}, Backbone.Events);
		return {
			signal: _.extend({}, Backbone.Events),
			execute: function(all, fr, nonFriendNum) {
				allMembers = all;
				friends = fr;
				removeFriends();

				var that = this;
				var nfCounter = 0;

				var num = Math.floor(Math.random() * allMembers.length);
				var tryLimit = Math.min(Math.floor(allMembers.length), 12);
				log("get non friend ==================");
				log(allMembers.length);
				log(num);

				checkMutualSignal.on("complete", function(res) {
					log("have some mutuals");
					if(res.data.length > 0){
						nonFriendMutual.push(res);
						nfCounter += 1;
					}

					if (nfCounter < nonFriendNum && tryLimit > 0) {
						tryLimit -= 1;
						num = Math.floor(Math.random() * allMembers.length);
						that.checkMutual(allMembers[num]);
						allMembers.splice(num, 1);
					} else {
						log("get non friend end");
						that.signal.trigger("complete", nonFriendMutual);
					}

				});

				that.checkMutual(allMembers[num]);
				allMembers.splice(num, 1);

			},

			checkMutual: function(userObj) {
				var that = this;
				var userId = userObj.id;
				
				if (_.isUndefined(userId)) {
					log("***** group members error");
					log(that.groupMembers);
					checkMutualSignal.trigger("complete", {
						"data": []
					});
				}

				log("check mutual" + userId);

				FBp.request('/me/mutualfriends/' + userId, function(res) {
					if(_.isUndefined(res.data)){
						res = {};
					}
					res.nonFriend = userObj;
					res.kinds = "other";
					res.id = '/me/mutualfriends/' + userId;
					if( (res.localFlag === true) ){
						//log("mutual from local !!!!!!!!!");
						log(res);
					}else{
						//log("mutual from server create !!!!!!!!");

						//store.create(res);
					}

					checkMutualSignal.trigger("complete", res);

				});
			}
		};
	};