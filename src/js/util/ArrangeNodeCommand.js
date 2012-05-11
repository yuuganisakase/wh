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
				var r = {};
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
				throw new Error("get from type back");

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
				var currentAngle = 0;
				var dd;

				_.each(ar, function(n) {

					if (currentAngle > pi / 4 && currentAngle < pi * 3 / 4 || currentAngle > pi * 5 / 4 && currentAngle < pi * 7 / 4) {
						dd = 280;
					} else {
						dd = 400;
					}
					that.placeNodeFromCenter(n, dd, currentAngle);
					n.angle = currentAngle;
					currentAngle += oneAngle;

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

					var lastid = getFromTypeBack(top.simArray, type).id;
					//top.simArray[top.simArray.length - 1].id;
					log(lastid);
					non = getFromId(ar, lastid);
					log(non);
					there.push(non);
					ar = _.without(ar, non);
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
								i = simar.length;
								here.push(top);
								ar = _.without(ar, top);
							}
						}

						if (ar.length > 0 && there.length > 0) {
							tar = _.last(there);
							simar = tar.simArray;
							for (i = 0; i < simar.length; i++) {

								if (isIncluded(ar, simar[i].id)) {
									non = getFromId(ar, simar[i].id);
									i = simar.length;
									ar = _.without(ar, non);
									there.push(non);
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
				var currentAngle = 0;

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
						currentAngle += oneAngle;
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
					if (out.getType() == 2) {
						num += 1;
						angles += out.angle;
					}
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

				var xx = centerX + dist * Math.cos(angle);
				var yy = centerY - dist * Math.sin(angle);
				n.setPosition(xx, yy);

			}

		};
	};