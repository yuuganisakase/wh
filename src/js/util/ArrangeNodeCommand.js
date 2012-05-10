//ArrangeNodeCommand.js

var ArrangeNodeCommand = function(_nodes) {

	var nodes = _nodes;
	var centerX = 1024/2;
	var centerY = 704/2;
	var pi = Math.PI;
	var pow = function(number) {
		return Math.pow(number, 2);
	};
	var calcDist = function(a,b) {
		return Math.sqrt( pow( a.x - b.x ) + pow(a.y - b.y) );
	};
	return{

		execute: function() {
			var that = this;
			_.each(nodes,function(n) {

				if( n.getType() === 0 ){
					n.setPosition(centerX - n.config.me.size/2, centerY - n.config.me.size/2);
				}
			});
			that.placeNonFriend();
			that.placeNonFriend2();
		},
		setSimilarity : function() {
			
			_.each(nodes, function(n) {
				_.each(nodes, function(o) {



				})
			})

		},
		placeFriend: function() {
			var that = this;
			var friends = [];
			_.each(nodes,function(n) {
				if(n.getType() == 1){
					friends.push(n);
				}
			});
			var eachChilds = [];
			_.each(nodes, function(o) {
				if(o.getType() == 2){
					var childs = [];
					_.each(friends, function(f) {
						log(" - - - - ");
						log(o.getId());
						log(f.getOneHop());

						if(("/me/mutualfriends/" + o.getId()) == f.getOneHop()){
							childs.push(f);
						}
					});

					eachChilds.push(childs);
				}
			});

			var getById = function(id) {
				_.each(nodes, function(n) {
					log("get by id");
					log(n.getId());
					log(id);
					if(n.getId() == id){
						return n;
					}
				});
			};

			var already = [];
			_.each(eachChilds, function(c) {
				var len = c.length;
				var ind = Math.floor(Math.random() * len);
				var target = c[ind];
				log("nodes");
				log(nodes);
				that.placeNodeFromCenter(target,200, 2*pi*Math.random());//getById(target.getOneHop()).angle );
			});

		},
		placeNonFriend: function() {
			var that = this;
			var num = 1;
			_.each(nodes,function(n) {
				if(n.getType() == 2){
					num += 1;
				}
			});
			var oneAngle = pi*2 / num;
			var currentAngle = 0;
			var dd;
			_.each(nodes,function(n) {
				if(n.getType() == 2){
					if(currentAngle > pi/4 && currentAngle < pi*3/4){
						dd = 380;
					}else{
						dd = 400;
					}
					that.placeNodeFromCenter(n,dd, currentAngle);
					n.angle = currentAngle;
					currentAngle += oneAngle;
				}
			});
			
		},
		already : [],
		placeNonFriend2: function() {
			var that = this;
			var num = 1;
			_.each(nodes,function(n) {
				if(n.getType() == 1){
					num += 1;
				}
			});
			var oneAngle = pi*2 / num;
			var currentAngle = 0;
			var dd;

			var isAlready = function(t) {

				_.each(that.already, function(n) {

					if( n.getId() == t.getId() ){
						log("**********is aleread same");
						return true;
					}
				});
				log("**********is already  not");
				return false;
			};

			_.each(nodes,function(n) {

				if(n.getType() == 1 && isAlready(n) === false){
					if((currentAngle > pi/4 && currentAngle < pi*3/4) || currentAngle > 5 * pi/4 && currentAngle < pi*3/4){
						dd = 100 + Math.random()*50;
					}else{
						dd = 170 + Math.random()*70;
					}
					that.placeNodeFromCenter(n,dd, currentAngle);
					n.angle = currentAngle;
					currentAngle += oneAngle;
					that.already.push(n);
				}
			});
			log("already");
			log(that.already);
			
		},
		calcFriendRanking: function() {

		},
		isCollided: function(a, b) {
			var dist = calcDist(a.getPosition(),b.getPosition());

			if(dist > 80){
				return false;
			}else{
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

