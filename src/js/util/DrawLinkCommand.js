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