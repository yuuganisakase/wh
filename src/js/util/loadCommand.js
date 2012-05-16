var LoadCommand = function() {

		//window.fbAsyncInit = function() {
		var friendNum = 3;
		var nonFriendNum = 4;


		return {
			completeSignal: _.extend({}, Backbone.Events),
			mutualCounter: 0,
			allMem: [],
			load: function() {
				var that = this;
				if (local === true) {
					log("load command");

					$.ajax({
						url: "debug/nodeList.json",
						cache: false
					}).done(function(data) {
						log("node list json");
						//log(data);
						that.completeSignal.trigger("complete", data);
					});
					return;
				}
				

				FB.init({
					appId: '275094809244675',
					// App ID
					channelUrl: 'whtest.com/channel.html',
					// Channel File
					status: true,
					// check login status
					cookie: true,
					// enable cookies to allow the server to access the session
					xfbml: true // parse XFBML
				});

				FB.login(function(res) {
					if (res.authResponse) {

						FB.api('/me/friends', function(friends) {

							log("friends");
							console.log(friends);

							// to do error
							if (_.isUndefined(friends.data)) {
								alert("message : facebook error. wait for 5min ");
								return;
							}
							var friendTryCount = 0;
							var num;
							var grCommand = new GetGroupsMembersCommand();
							var findNonCommand = new FindNonFriendFromArrayCommand();

							var retry = function() {
									if (friendTryCount < friendNum) {
										num = Math.floor(Math.random() * friends.data.length);
										log("friend start---------------");
										log(friends.data[num].name);
										log("---------------");
										//that.getGroupsUsers(friends.data[num].id);
										grCommand.execute(friends.data[num].id);

										friends.data.splice(num, 1);
									} else {
										findNonCommand.execute(that.allMem, friends.data, nonFriendNum);
										////that.includeMe();
									}
								};

							retry();

							grCommand.signal.on("noGroup", function() {
								log("no group friend try end");
								retry();

							});
							grCommand.signal.on("complete", function(mem) {
								_.each(mem, function(m) {
									that.allMem.push(m);
								});
								friendTryCount += 1;
								//log("friend try end");
								retry();

							});

							findNonCommand.signal.on("complete", function(nf) {
								log("---------------");
								log("find non friend ");
								log("---------------");
								log(nf);
								that.includeMe(nf, friends.data);
							});


						});
					}
				}, {
					scope: 'email,user_likes,user_about_me,friends_about_me,read_friendlists,user_groups,friends_groups'
				});
			},

			includeMe: function(ar, fr) {
				var that = this;
				FB.api('/me', function(res) {
					log("me");
					log(res);
					FB.api('/' + res.id + '/picture', function(res2) {
						log("me");
						log(res2);
						var me = {
							data: fr,
							nonFriend: {
								id: res.id,
								imageUrl: res2,
								userName: res.name,
								screenName: res.username
							},
							kinds: "me"
						};

						ar.push(me);
						log("---------------")
						log(ar);
						that.decrease(ar);

						that.getProfileImage(ar);
					});
				});
			},
			decrease: function(ar) {
				var that = this;
				_.each(ar, function(o) {
					if (o.data && o.data.length > 3 && o.data.kinds !== "me") {
						o.data = o.data.slice(0, 3);
					}
				});
			},
			getProfileImage: function(ar) {
				var that = this;
				var counter = 1;
				var all = 0;

				var complete = function() {
						that.completeSignal.trigger("comp", ar);
					};
				if (ar.length == 1) {
					complete();
					return;
				}
				_.each(ar, function(o) {
					all += 1;
					if (o.kinds !== "me") {
						FB.api('/' + o.nonFriend.id + '/picture', function(res) {

							o.nonFriend.imageUrl = res;

							FB.api('/' + o.nonFriend.id, function(res2) {
								counter += 1;
								//console.dir(res);
								log("non friend profile");
								log(res2);
								o.nonFriend.userName = res2.name;
								o.nonFriend.screenName = res2.username;

								if (all === counter) {
									complete();
								}
							});

						});

						_.each(o.data, function(o2) {
							all += 1;
							FB.api('/' + o2.id + '/picture', function(res) {

								log("mutual profile image");
								//console.dir(res);
								if (_.isUndefined(o2.nonFriend)) {
									o2.nonFriend = {};
								}
								o2.nonFriend.imageUrl = res;



								FB.api('/' + o2.id, function(res) {
									counter += 1;
									log("friend profile ");
									log(res);
									log(o2);
									//console.dir(res);
									if (_.isUndefined(o2.nonFriend)) {
										o2.nonFriend = {};
									}
									o2.nonFriend.userName = res.name;
									o2.nonFriend.screenName = res.username;

									if (all === counter) {
										complete();
									}
								});

								if (all === counter) {
									complete();
								}
							});

						});

					}
				});


			}
		};
	};