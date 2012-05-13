var ViewFactory = function(_stage, _sp, _game) {
	var eb = _.extend({}, Backbone.Events);
	var stage = _stage;
	var stageSprite = _sp;
	var game = _game;
	return {
		create : function(c, m, o) {
			if(!m) m = {};
			if(!o) o = {};

			var klass = c;
			klass.prototype.eventBus = eb;
			klass.prototype.stage = stage;
			klass.prototype.stageSprite = stageSprite;
			klass.prototype.game = game;

			var obj = new klass(m, o);
			//obj.init();
			return obj;
		},
		getGlobalEventbus : function(){
			return eb;
		}
	};
};
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

var NodeList = Backbone.Collection.extend({
  initialize: function(mdl, opt) {
    if(!opt) opt = {};

    if (opt.klass) this.model = opt.klass;
    if (opt.store) this.localStorage = opt.store;
  }
});
var NodeView = Backbone.View.extend({

    onClick: function(e) {
        var url = "https://www.facebook.com/" + this.model.get("userId");
        window.open(url , "_blank");
    },
    onMousemove: function(xx,yy) {
        if(this.checkCollided(xx,yy)){
            this.model.set("popup", false);
            this.eventBus.trigger("collided");
        }else{
            this.model.set("popup", true);
        }
    },
    popUp:function() {

        this.stageSprite.addChild(this.model.get("gr"));
        var pop = this.model.get("pop");
        pop.opacity = 0.5;
        pop.scaleX = 0.4;
        pop.scaleY = 0;
        var tween = new TWEEN.Tween(pop).to({opacity: 1,scaleX:1, scaleY:1}, 70).start();
        var misc = this.model.get("misc");
        _.each(misc, function(m) {
            m.opacity = 0;
            var tween2 = new TWEEN.Tween(m);
            tween2.to({opacity: 1}, 90).start();
        });

    },
    popDown:function() {
        var that = this;
        var pop = this.model.get("pop");
        var tween = new TWEEN.Tween(pop);
        tween.to({opacity: 0.5,scaleY:0, scaleX:0.4}, 180);

        tween.onComplete(function(){
            that.stageSprite.removeChild(that.model.get("gr"));
        });
        tween.start();

        _.each(this.model.get("misc"), function(m) {
            var tween2 = new TWEEN.Tween(m);
            tween2.to({opacity: 0}, 60);
            tween2.start();
        });

    },
    config: {
        me: {
            size: 64,
            borderWidth: 8,
            borderColor: "#00ff00"
        },
        friend: {
            size: 32,
            borderWidth: 4,
            borderColor: "#00ff00"
        },
        other: {
            size: 48,
            borderWidth: 6,
            borderColor: "#ff00ff"
        }
    },
    init: function() {
        var that = this;
        this.createPop();

        var path = that.model.get("imageUrl");
        that.model.on("change:popup", that.onPopupChange ,this);
        that.render();

        //this.game.load(path, function() {
            var path = that.model.get("imageUrl");

            var image = that.game.assets[path];
            var context = that.stage.context;

            var timeObj = this.model.get("time");
            var time = (+timeObj.hour) * 60 + (+timeObj.min);
            var alpha = (250 - time) / 250;
            if(time < 50){
                alpha = 1;
            }
            context.globalAlpha = alpha;
            var size = that.model.get("size");
            var bw = that.model.get("borderWidth");
            context.strokeStyle = that.model.get("borderColor");
            context.fillStyle = that.model.get("borderColor");
            context.beginPath();
            var pos = that.getPosition();
context.lineWidth = bw;
  context.moveTo(pos.x - bw/2, pos.y - bw/2);
  context.lineTo(pos.x + bw/2 + size, pos.y - bw/2);
  context.lineTo(pos.x + bw/2 + size, pos.y + bw/2 + size);
  context.lineTo(pos.x - bw/2, pos.y + bw/2 + size);
  context.lineTo(pos.x - bw/2, pos.y - bw/2);
  context.closePath();
  context.stroke();
           // context.fillRect(that.getPosition().x - bw,that.getPosition().y - bw,size+bw*2,size+bw*2);
            that.stage.draw(image, 0, 0, 50, 50, that.getPosition().x, that.getPosition().y, size, size);
context.globalAlpha = 1;
            //that.render();
       // });

    },
    createPop: function() {
        var screennameStr = this.model.get("screenName");
        var usernameStr = this.model.get("userName");
        var gr = new Group();

        
        var whiteWidth = 128;
        //var len = Math.max(screennameStr.length, usernameStr.length);
        var len = screennameStr.length;
        if(len >= 13){
            whiteWidth = 128 + (len - 13)*10;
        }
        
        var white = "<div style='position: absolute; width: " + whiteWidth + "px; height: 64px; overflow: hidden; background-color: rgb(255, 255, 255);'></div> ";
        
        var screenLabel = new Label(screennameStr);
        screenLabel.className = "screenname";
        screenLabel.color = this.model.get("borderColor");
        screenLabel.x = 8;
        screenLabel.y = 4;
        //this.model.set("screenlabel", screenLabel);

        var userLabel = new Label(usernameStr);
        userLabel.className = "username";
        userLabel.color = "#000000";
        userLabel.x = 8;
        userLabel.y = 20;
        //this.model.set("userlabel", userLabel);

        var pop = new Sprite(0,0);
        this.model.set("gr",gr);
        this.model.set("pop",pop);
        pop._style.overflow = '';
        
        var type = this.getType();

        var config;
        if(type === 0){
            config = this.config.me;
        }else if(type === 1){
            config = this.config.friend;
        }else{
            config = this.config.other;
        }
        
        gr.x = this.getPosition().x - config.borderWidth;
        gr.y = this.getPosition().y + config.size + config.borderWidth;
        pop.backgroundColor = "#ff0000";
        $(pop._element).append(white);

        var blackBack = new Sprite(112,16);
        blackBack.backgroundColor = "#000000";
        blackBack.x = 8;
        blackBack.y = 40;

        var clockImg = this.game.assets["assets/clock.png"];
        var clockSp = new Sprite(clockImg.width, clockImg.height);
        clockSp.image = clockImg;
        clockSp.x = 10;
        clockSp.y = 42;

        var timeStr = "<span class='number'>" + this.model.get("time").hour + "</span>hour and <span class='number'> " + this.model.get("time").min + "</span>mins";
        var timeLabel = new Label(timeStr);
        timeLabel.className = "timelabel";
        timeLabel.color = "#ffffff";
        timeLabel.x = 26;
        timeLabel.y = 40;

        var misc = [blackBack, screenLabel, userLabel, timeLabel, clockSp];
        this.model.set("misc",misc);

        gr.addChild(pop);
        gr.addChild(blackBack);
        gr.addChild(screenLabel);
        gr.addChild(userLabel);
        gr.addChild(timeLabel);
        gr.addChild(clockSp);
    },
    onPopupChange:function(a) {
        var that = this;
        if( this.model.get("popup") === true){
            this.popDown();
        }else{
            setTimeout(function() {
                if(that.model.get("popup") === false){
                    that.popUp();
                }
            }, 100);
        }
    },
    _position: {
        x: 100,
        y: 100
    },
    getFourCenter:function() {
        var that = this;
        var size = that.model.get("size");
        var bw = that.model.get("borderWidth");

        var a = {
            "x" : that.getPosition().x + size/2,
            "y" : that.getPosition().y - bw
        };
        var b = {
            "x" : that.getPosition().x + size + bw,
            "y" : that.getPosition().y + size/2
        };
        var c = {
            "x" : that.getPosition().x + size/2,
            "y" : that.getPosition().y + size + bw
        };
        var d = {
            "x" : that.getPosition().x - bw,
            "y" : that.getPosition().y + size/2
        };
        
        
        var ar = [a,b,c,d];
        return ar;
    },
    render: function() {
        var that = this;
        var kinds = that.getType();
        
        
        var size;
        var color;
        var bw;
        if (kinds === 0) {
            size = that.config.me.size;
            color = that.config.me.borderColor;
            bw = that.config.me.borderWidth;
        } else if (kinds === 1) {
            size = that.config.friend.size;
            color = that.config.friend.borderColor;
            bw = that.config.friend.borderWidth;
        } else {
            size = that.config.other.size;
            color = that.config.other.borderColor;
            bw = that.config.other.borderWidth;
        }
        this.model.set("size",size);
        this.model.set("borderColor",color);
        this.model.set("borderWidth",bw);

        //context.fillStyle = "rgba(152,152,152,0.4)";

        //context.fillRect(that.getPosition().x ,that.getPosition().y,size,size);

//security error of cross origin policy

        // var imgPixels = context.getImageData(that.getPosition().x, that.getPosition().y, size, size);

        // for(var y = 0; y < imgPixels.height; y++){
        //      for(var x = 0; x < imgPixels.width; x++){
        //           var i = (y * 4) * imgPixels.width + x * 4;
        //           var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        //           imgPixels.data[i] = avg;
        //           imgPixels.data[i + 1] = avg;
        //           imgPixels.data[i + 2] = avg;
        //      }
        // }
        // context.putImageData(imgPixels, that.getPosition().x, that.getPosition().y, 0, 0, imgPixels.width, imgPixels.height);

    },
    checkCollided: function(xx,yy) {
        var xDis = Math.abs(xx - this.getPosition().x - this.model.get("size")/2);
        var yDis = Math.abs(yy - this.getPosition().y - this.model.get("size")/2);

        var crit = 35;
        if(xDis < crit && yDis < crit){
            return true;
        }else{
            return false;
        }
    },
    getType: function() {
        return this.model.get("type");
    },
    getId: function() {
        return this.model.get("userId");
    },
    getPosition: function() {
        var pos = {
            x:this.model.get("x"),
            y:this.model.get("y")
        };
        return pos;
    },
    getPosition2: function() {
        var pos = {
            x:this.model.get("x") + this.model.get("size")/2,
            y:this.model.get("y") + this.model.get("size")/2
        };
        return pos;
    },
    getLink: function() {
        var n = this.model.get("link");
        if(_.isUndefined(n)) n = [];
        return n;
    },
    setPosition: function(_x, _y) {
        var xx = Math.floor(_x);
        var yy = Math.floor(_y);
        this.model.set({"x":xx, "y":yy});
    }
});
var HeaderView = Backbone.View.extend({

    onClick: function(e) {
        this.model.set("flag", !this.model.get("flag"));
    },
    logo: {},
    help: {},
    logout: {},
    back: {},
    init: function() {
        var that = this;
        //that.model.bind("change", this.render, this);
        back = new Sprite(500, 64);
        back.backgroundColor = "#00a0e9";
        this.game.currentScene.addChild(back);

        this.logo = that.makeButton("logo");
        this.logo.x = 10;
        this.logo.y = 8;
        $(this.logo._element).click(function(e) {
            alert("logo click");
        });

        this.help = that.makeButton("help");
        this.help.x = 200;
        this.help.y = 8;
        $(this.help._element).click(function(e) {
            alert("help click");
        });
        this.logout = that.makeButton("logout");
        this.logout.x = 400;
        this.logout.y = 8;
        $(this.logout._element).click(function(e) {
            alert("logout click");
        });
        this.eventBus.on("resize", this.onResize, this);

        this.onResize();

    },
    onResize: function() {
        $ = jQuery.noConflict();


        log("resize in header view");
        var wid = $(window).width();
        log(wid);
        this.help.x = wid - 256;
        this.logout.x = wid - 128;
        back.width = wid;

    },
    makeButton: function(name) {
        $ = jQuery.noConflict();
        var assets = this.game.assets;
        var image = [assets["assets/" + name + ".png"], assets["assets/" + name + "_hover.png"]];
        var sp = new Sprite(image[0].width, image[0].height);
        sp.hover = image[1];
        sp.normal = image[0];
        sp.image = image[0];

        $(sp._element).mouseover(function(e) {
            log("mouse over");
            sp.image = sp.hover;
        }).mouseleave(function(e) {
            log("mouse leave");
            sp.image = sp.normal;
        }).css("cursor", "pointer");
        sp.makeButton = true;
        this.game.currentScene.addChild(sp);
        return sp;
    }
});
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
//DrawLinkCommand.js
var DrawLinkCommand = function() {

		var pow = function(number) {
				return Math.pow(number, 2);
			};
		var calcDist = function(a, b) {
				return Math.sqrt(pow(a.x - b.x) + pow(a.y - b.y));
			};
		var stage;
		return {
			execute: function(_nodes, _stage) {
				var that = this;
				stage = _stage;
				log("draw line execute");
				var already = [];
				var nodes = _nodes;
				_.each(nodes, function(n1) {
					_.each(nodes, function(n2) {
						var cl = that.checkLink(n1, n2);
						log(cl);


						if (cl){
							var n1id = n1.getId();
							var n2id = n2.getId();
							var iden = false;
							_.each(already, function(al) {
								if( (al.a == n1id || al.b == n1id) && (al.a == n2id || al.b == n2id)){
									iden = true;
								}
							});
							if(iden === false){
								that.drawLine(n1, n2);
								already.push({a:n1.getId(), b:n2.getId()});
							}
							
							
						}

					});
				});
			},
			drawLine: function(a, b) {

				var flag;
				var atype = a.getType();
				var btype = b.getType();
				if (atype == 2 || btype == 2) {
					flag = 2;
				} else {
					flag = 1;
				}
				var aPoint = a.getPosition2();
				var bPoint = b.getPosition2();
				log("draw line");
				log(bPoint);

				var min = 99999;
				var mmm;
				var four = a.getFourCenter();
				for (var i = four.length - 1; i >= 0; i--) {
					var c = four[i];
					var dist = calcDist(c, bPoint);

					if (dist < min) {
						min = dist;
						mmm = c;
					}
				}

				var min2 = 99999;
				var mmm2;
				var four2 = b.getFourCenter();
				for (i = four.length - 1; i >= 0; i--) {
					var c2 = four2[i];
					var dist2 = calcDist(c2, aPoint);
					// log("dist");
					// log(dist2);
					// log(four);
					if (dist2 < min2) {
						min2 = dist2;
						mmm2 = c2;
					}
				}
				log(mmm);
				var ctx = stage.context;
				var color;
				if (flag == 1) {
					color = "#00ff00";
					ctx.strokeStyle = color;
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(mmm.x, mmm.y);
					ctx.lineTo(mmm2.x, mmm2.y);
					ctx.closePath();
					ctx.stroke();
				} else if (flag == 2) {
					color = "#ff00ff";
					ctx.strokeStyle = color;
					ctx.lineWidth = 2;
					ctx.beginPath();


					var angle = Math.atan2(mmm2.y - mmm.y, mmm2.x - mmm.x);
					var dx = 2 * Math.cos(angle);
					var dy = 2 * Math.sin(angle);
					var dd = calcDist(mmm, mmm2);
					var num = Math.floor(dd / 4);

					var next = {
						x: mmm.x + dx,
						y: mmm.y + dy
					};
					for (i = num - 1; i >= 0; i--) {

						ctx.moveTo(next.x, next.y);
						ctx.lineTo(next.x + dx, next.y + dy);
						next.x += dx * 2;
						next.y += dy * 2;
					}

					ctx.closePath();
					ctx.stroke();
				}

			},
			checkLink: function(a, b) {
				var al = a.getLink();
				var aid = a.getId();
				var bl = b.getLink();
				var bid = b.getId();
				
				var f = false;
				_.each(al, function(ao) {
					if (ao == bid) {
						f = true;
					}
				});

				// if (f === false) {
				// 	_.each(bl, function(bo) {
				// 		if (bo == aid) {
				// 			f = true;
				// 		}
				// 	});
				// }

				return f;
			}
		};
	};
//ArrangeNodeCommand.js
var ArrangeNodeCommand = function(_nodes) {

		var nodes = _nodes;
		var centerX = 1024 / 2;
		var centerY = 704 / 2;
		var pi = Math.PI;
		var pow = function(number) {
				return Math.pow(number, 2);
			};
		var calcDist = function(a, b) {
				return Math.sqrt(pow(a.x - b.x) + pow(a.y - b.y));
			};
		var numOfMutual = function(a, b) {
				return _.intersection(a, b).length;
			};
		var getFromId = function(ar, id) {
				var r = 0;
				_.each(ar, function(n) {
					if (n.getId() == id) {
						r = n;
					}
				});
				return r;
			};
		var getFromTypeFront = function(ar, type) {
				for (var i = 0; i < ar.length; i++) {
					var tar = ar[i];
					if (tar.type == type) {
						return tar;
					}
				}
				throw new Error("get from type front");
			};
		var getFromTypeBack = function(ar, type) {
				for (var i = ar.length - 1; i >= 0; i--) {
					var tar = ar[i];
					if (tar.type == type) {
						return tar;
					}
				}
				return 0;
			};
		var isIncluded = function(ar, id) {
				var included = _.find(ar, function(n) {
					return id == n.getId();
				});
				if (_.isUndefined(included)) {
					//log("is included : " + included)
					return false;
				} else {
					//log("is included : " + included)
					return true;
				}
			};
		var getNearestAngle = function(ar, tar) {
				var diff = 10000;
				var ret = {};

				_.each(ar, function(a) {
					var abs = Math.abs(a - tar);
					if (diff > abs) {
						diff = abs;
						ret = a;
					}
				});
				return ret;
			};
		return {

			execute: function() {
				var that = this;
				_.each(nodes, function(n) {

					if (n.getType() === 0) {
						n.setPosition(centerX - n.config.me.size / 2, centerY - n.config.me.size / 2);
					}
				});
				log("execute");
				log(nodes);
				that.setSimilarity();
				that.placeNonFriend();
				that.placeFriend();

			},
			setSimilarity: function() {

				_.each(nodes, function(n) {
					log("set similarity");
					log(n);
					var simCount = 0;
					var aaa = [];

					_.each(nodes, function(o) {
						var id = o.getId();
						var num = numOfMutual(n.getLink(), o.getLink());

						var lll = n.getLink();
						_.each(lll, function(l) {
							if (l == id) {
								num += 4;
							}
						});
						var type = o.getType();
						aaa.push({
							"num": num,
							"id": id,
							"type": type
						});

						simCount += 1;
					});
					n.simArray = aaa;
					n.simArray = _.sortBy(n.simArray, function(a) {
						return -a.num;
					});

				});

			},

			placeNonFriend: function() {
				var that = this;
				var num = 1;
				var ar = [];
				_.each(nodes, function(n) {
					if (n.getType() == 2) {
						num += 1;
						ar.push(n);
					}
				});
				ar = that.sortBySimilarity(ar, 2);
				var oneAngle = pi * 2 / num;
				var currentAngle = Math.random()*0.3;
				var dd;

				_.each(ar, function(n) {

					if (currentAngle > pi / 4 && currentAngle < pi * 3 / 4 || currentAngle > pi * 5 / 4 && currentAngle < pi * 7 / 4) {
						dd = 280 + Math.random() * 30;
					} else {
						dd = 370 + Math.random() * 70;
					}
					that.placeNodeFromCenter(n, dd, currentAngle);
					n.angle = currentAngle;
					currentAngle += (oneAngle*0.9 + Math.random()*oneAngle*0.2);

				});

			},
			sortBySimilarity: function(ar, type) {
				var here = [];
				var there = [];
				log("sort1");
				log(ar);
				var top = ar[0];
				here.push(top);
				ar = _.without(ar, top);
				var non;
				if (ar.length > 0) {

					//while (true) {
						var obj = getFromTypeBack(top.simArray, type);
						var lastid = obj.id;
						//top.simArray[top.simArray.length - 1].id;
						log(lastid);
						non = getFromId(ar, lastid);
						if(non !== 0){
						//if(true){
							there.push(non);
							ar = _.without(ar, non);
							//break;
						}else{
							//top.simArray = _.without(top.simArray, obj);
							log(obj);
							log(top.simArray);
							there.push(ar[0]);
							ar = _.without(ar,ar[0]);
						}
						log(non);
					//}

				}
				log(ar);
				log(here);
				log(there);

				var counter = 10;
				while (counter > 0) {
					log("while loop");
					log(ar);

					counter -= 1;
					if (here.length > 0) {
						var tar = _.last(here);
						var simar = tar.simArray;
						var i;
						for (i = 0; i < simar.length; i++) {
							//log(simar[i]);
							if (isIncluded(ar, simar[i].id)) {
								top = getFromId(ar, simar[i].id);
								if (top !== 0) {
								//if(true){
									i = simar.length;
									here.push(top);
									ar = _.without(ar, top);

								}

							}
						}

						if (ar.length > 0 && there.length > 0) {
							tar = _.last(there);
							simar = tar.simArray;
							for (i = 0; i < simar.length; i++) {

								if (isIncluded(ar, simar[i].id)) {
									non = getFromId(ar, simar[i].id);
									//if (non !== 0) {
									if(true){

										i = simar.length;
										ar = _.without(ar, non);
										there.push(non);
									}

								}
							}
						}
					}
				}
				log("sort by similarity");
				log(here)
				log(there)
				return here.concat(there);
			},
			already: [],
			placeFriend: function() {
				var that = this;
				var num = 1;
				var ar = [];
				log("place friend");
				_.each(nodes, function(n) {
					if (n.getType() == 1) {
						ar.push(n);
						that.setOuterLineNum(n);
						log(n);
						num += 1;
					}
				});
				ar = _.sortBy(ar, function(a) {
					return -a.outerLineNum;
				});

				var oneAngle = pi * 2 / num;
				var currentAngle = Math.random()*0.3;

				var anglePossibility = [0];
				for (var i = 0; i < num; i++) {
					anglePossibility.push(anglePossibility[i] + oneAngle);
				}

				log("angle possibility");
				log(anglePossibility);


				var dd;

				_.each(ar, function(n) {

					var angle = 0;
					if (n.outerLineNum > 0) {
						angle = getNearestAngle(anglePossibility, n.outerAngle);

						anglePossibility = _.without(anglePossibility, angle);
						if ((angle > pi / 4 && angle < pi * 3 / 4) || angle > 5 * pi / 4 && angle < pi * 7 / 4) {
							dd = 100 + Math.random() * 50;
						} else {
							dd = 170 + Math.random() * 70;
						}
						that.placeNodeFromCenter(n, dd, angle);

						n.angle = angle;

					}

				});
				log(anglePossibility);

				_.each(ar, function(n) {
					log("outer line : 0 each");
					log(anglePossibility);
					if (n.outerLineNum === 0) {

						currentAngle = anglePossibility[0];

						anglePossibility = _.rest(anglePossibility);

						if ((currentAngle > pi / 4 && currentAngle < pi * 3 / 4) || currentAngle > 5 * pi / 4 && currentAngle < pi * 7 / 4) {
							dd = 100 + Math.random() * 50;
						} else {
							dd = 170 + Math.random() * 70;
						}
						that.placeNodeFromCenter(n, dd, currentAngle);
						n.angle = currentAngle;
						currentAngle += (oneAngle*0.9 + oneAngle*Math.random()*0.2);
						that.already.push(n);

					}
				});
				log("already");
				log(that.already);

			},
			setOuterLineNum: function(n) {
				var link = n.getLink();
				var num = 0;
				var angles = 0;
				_.each(link, function(l) {
					//log("set outer line num");
					//log( getFromId(nodes, l) );
					var out = getFromId(nodes, l);
					log("set outer line num : ");
					//log(out);
					//log(l);
					if (out !== 0) {
					//if(true){
						if (out.getType() == 2) {
							num += 1;
							angles += out.angle;
						}
					}

					var idar = [];
					_.each(nodes, function(n) {
						idar.push(n.getId());
					});
					log("node id ar");
					log(idar);


				});
				if (num > 0) {
					angles = angles / num;
				}
				n.outerLineNum = num;
				n.outerAngle = angles;
			},
			isCollided: function(a, b) {
				var dist = calcDist(a.getPosition(), b.getPosition());

				if (dist > 80) {
					return false;
				} else {
					return true;
				}
			},
			placeNodeFromCenter: function(n, dist, angle) {
				log("place node from position");
				log(n);

				var xx = centerX + dist * Math.cos(angle);
				var yy = centerY - dist * Math.sin(angle);
				n.setPosition(xx, yy);

			}

		};
	};
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
var log = function(mes) {
        if (console) {
            console.log(mes);
        }
    };

var local = true;

var store = {};
var FBp = new FBproxy(store);

var allInit = function() {

        var models = [];
        var nodes = [];
                var images = ['assets/help.png','assets/help_hover.png',
                            'assets/logo.png','assets/logo_hover.png',
                            'assets/logout.png','assets/logout_hover.png',
                            "assets/clock.png"];
        window.fbAsyncInit = function() {
            var lc = new LoadCommand();
            lc.load();
            lc.completeSignal.on("complete", function(obj) {
                log("load complete in app");
                log(obj);

                //obj = obj.splice(0,4);

                (function(data) {

                    var createM = function(n) {
                        
                            var m = new NodeModel(n, {
                                "store": store
                            });
                            models.push(m);
                        };

                    var js = JSON.parse(data);
                    var ran = Math.random();
                    // if(ran > 0.8){

                    // }else if(ran > 0.6){
                    //     js.list.splice(6,1);
                    // }else if(ran > 0.4){
                    //     js.list.splice(7,1);
                    // }else if(ran > 0.2){
                    //     js.list.splice(12,1);
                    // }
                    var randomChoose = function(ind) {
                      if(Math.random() > 0.7){
                        js.list.splice(ind,1);
                    }                      
                    }
                    randomChoose(1);
                    randomChoose(6);
                    randomChoose(7);
                    randomChoose(8);
                    randomChoose(12);
                    
                    //js.list = _.shuffle(js.list);
                    //js.list = js.list.slice(0, 0 + Math.floor(Math.random() * (js.list.length - 0)));
                    log("sliced");
                    log(js.list);
                    _.each(js.list, function(o) {
                        images.push(o.imageUrl);
                        
                        createM(o);
                    });
                })(obj);

                log("models");
                log(models);
                log(images);
                start();
            });
        };


        var start = function() {

                enchant();

                var CanvasSizeW = 1024;
                var CanvasSizeH = 704;

                var collidedNum = 0;

                var game = new Game(CanvasSizeW, CanvasSizeH);
                game.fps = 20;
                var ls = new Scene();
                game.loadingScene = ls;
                game.preload(images);
                game.scale = 1;

                
                game.onload = function() {
                    var scene = new Scene();
                    game.replaceScene(scene);
                    
                    var stageGroup = new Group();
                    scene.addChild(stageGroup);
                    var stageSprite = new Sprite(CanvasSizeW, CanvasSizeH);
                    var stage = new Surface(CanvasSizeW, CanvasSizeH);
                    stageSprite.image = stage;
                    var factory = new ViewFactory(stage, stageGroup, game);


                game.addEventListener('enterframe', function () {
                    TWEEN.update();

                    if(collidedNum > 0){
                        $(stageSprite._element).css("cursor", "pointer");

                    }else{
                        $(stageSprite._element).css("cursor", "default");
                    }
                });

                    _.each(models, function(m) {
                        var v = factory.create(NodeView, {
                            "model": m
                        });
                        nodes.push(v);
                    });
                    var h = factory.create(HeaderView);
                    h.init();
                    stageGroup.addChild(stageSprite);

                    log(nodes);
                    var arrangeCommand = new ArrangeNodeCommand(nodes);
                    arrangeCommand.execute();
                    var me;
                    _.each(nodes, function(n) {
                        n.init();
                        if(n.getType() === 0){
                            me = n;
                        }
                    });


                    var dl = new DrawLinkCommand();
                    dl.execute(nodes, stage);


                    var eb = factory.getGlobalEventbus();
                    eb.on("collided",function(e) {
                        log("collided");
                        
                        collidedNum += 1;
                        
                    });
                    stageSprite.addEventListener("touchend",function(e) {
                        for (var i = nodes.length - 1; i >= 0; i--) {
                            var n = nodes[i];
                            if( n.checkCollided(e.localX, e.localY) ){
                                n.onClick();
                                i = 0;
                            }
                        }
                    });

                    $(stageSprite._element).mousemove(function(e) {
                        collidedNum = 0;
                        var localX = e.pageX - stageGroup.x;
                        var localY = e.pageY - stageGroup.y;
                        for (var i = nodes.length - 1; i >= 0; i--) {
                            var n = nodes[i];
                            n.onMousemove(localX, localY);
                        }

                    });
                    var resizeTimer;
                    $(window).resize(function() {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(onResize, 100);
                    });
                    var onResize = function() {
                        $ = jQuery.noConflict();
                        try{
                            eb.trigger("resize");
                            var wid = $(window).width();
                            var hei = $(window).height();
                            var se = $(scene._element);

                            se.addClass("current_scene");
                            game.width = wid;
                            se.width(wid);
                            game.height = hei;
                            se.height(hei);

                            stageGroup.x = (wid - CanvasSizeW)/2;
                            stageGroup.y = ((hei - 64) - CanvasSizeH)/2 + 64;
                            log(se);
                        }catch(e){
                            log("resize error");
                        }
                    };
                    onResize();


                };
                game.start();

            };

    };