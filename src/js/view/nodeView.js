var NodeView = Backbone.View.extend({

    onClick: function(e) {
        var url = "https://www.facebook.com/" + this.model.get("userId");
        window.open(url, "_blank");
    },
    onMousemove: function(xx, yy) {
        if (this.checkCollided(xx, yy)) {
            this.model.set("popup", false);
            this.eventBus.trigger("collided");
        } else {
            this.model.set("popup", true);
        }
    },
    popUp: function() {

        this.stageSprite.addChild(this.model.get("gr"));
        var pop = this.model.get("pop");
        pop.opacity = 0.5;
        pop.scaleX = 0.4;
        pop.scaleY = 0;
        var tween = new TWEEN.Tween(pop).to({
            opacity: 1,
            scaleX: 1,
            scaleY: 1
        }, 70).start();
        var misc = this.model.get("misc");
        _.each(misc, function(m) {
            m.opacity = 0;
            var tween2 = new TWEEN.Tween(m);
            tween2.to({
                opacity: 1
            }, 90).start();
        });

    },
    popDown: function() {
        var that = this;
        var pop = this.model.get("pop");
        var tween = new TWEEN.Tween(pop);
        tween.to({
            opacity: 0.5,
            scaleY: 0,
            scaleX: 0.4
        }, 180);

        tween.onComplete(function() {
            that.stageSprite.removeChild(that.model.get("gr"));
        });
        tween.start();

        _.each(this.model.get("misc"), function(m) {
            var tween2 = new TWEEN.Tween(m);
            tween2.to({
                opacity: 0
            }, 60);
            tween2.start();
        });

    },
    init: function() {
        var that = this;
        this.createPop();

        var path = that.model.get("imageUrl");
        that.model.on("change:popup", that.onPopupChange, this);

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
        this.model.set("size", size);
        this.model.set("borderColor", color);
        this.model.set("borderWidth", bw);
        this.render();
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

        //this.game.load(path, function() {
    },
    update: function(me, nodes) {
        var current = this.getPosition();
        this.setPosition(current.x + 1, current.y + 1);
        this.render();
    },
    createPop: function() {
        var screennameStr = this.model.get("screenName");
        var usernameStr = this.model.get("userName");
        var gr = new Group();


        var whiteWidth = 128;
        //var len = Math.max(screennameStr.length, usernameStr.length);
        var len = screennameStr.length;
        if (len >= 13) {
            whiteWidth = 128 + (len - 13) * 10;
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
        var pop = new Sprite(0, 0);
        this.model.set("gr", gr);
        this.model.set("pop", pop);
        pop._style.overflow = '';

        var type = this.getType();

        var config;
        if (type === 0) {
            config = this.config.me;
        } else if (type === 1) {
            config = this.config.friend;
        } else {
            config = this.config.other;
        }

        gr.x = this.getPosition().x - config.borderWidth;
        gr.y = this.getPosition().y + config.size + config.borderWidth;
        pop.backgroundColor = "#ff0000";
        $(pop._element).append(white);

        var blackBack = new Sprite(112, 16);
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
        this.model.set("misc", misc);

        gr.addChild(pop);
        gr.addChild(blackBack);
        gr.addChild(screenLabel);
        gr.addChild(userLabel);
        gr.addChild(timeLabel);
        gr.addChild(clockSp);
    },
    onPopupChange: function(a) {
        var that = this;
        if (this.model.get("popup") === true) {
            this.popDown();
        } else {
            setTimeout(function() {
                if (that.model.get("popup") === false) {
                    that.popUp();
                }
            }, 100);
        }
    },
    _position: {
        x: 100,
        y: 100
    },
    getFourCenter: function() {
        var that = this;
        var size = that.model.get("size");
        var bw = that.model.get("borderWidth");

        var a = {
            "x": that.getPosition().x + size / 2,
            "y": that.getPosition().y - bw
        };
        var b = {
            "x": that.getPosition().x + size + bw,
            "y": that.getPosition().y + size / 2
        };
        var c = {
            "x": that.getPosition().x + size / 2,
            "y": that.getPosition().y + size + bw
        };
        var d = {
            "x": that.getPosition().x - bw,
            "y": that.getPosition().y + size / 2
        };


        var ar = [a, b, c, d];
        return ar;
    },
    render: function() {
        var that = this;
        var path = that.model.get("imageUrl");

        var image = that.game.assets[path];
        var context = that.stage.context;

        var timeObj = this.model.get("time");
        var time = (+timeObj.hour) * 60 + (+timeObj.min);
        var alpha = (250 - time) / 250;
        if (time < 50) {
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
        context.moveTo(pos.x - bw / 2, pos.y - bw / 2);
        context.lineTo(pos.x + bw / 2 + size, pos.y - bw / 2);
        context.lineTo(pos.x + bw / 2 + size, pos.y + bw / 2 + size);
        context.lineTo(pos.x - bw / 2, pos.y + bw / 2 + size);
        context.lineTo(pos.x - bw / 2, pos.y - bw / 2);
        context.closePath();
        context.stroke();
        that.stage.draw(image, 0, 0, 50, 50, that.getPosition().x, that.getPosition().y, size, size);
        context.globalAlpha = 1;
    },
    checkCollided: function(xx, yy) {
        var xDis = Math.abs(xx - this.getPosition().x - this.model.get("size") / 2);
        var yDis = Math.abs(yy - this.getPosition().y - this.model.get("size") / 2);

        var crit = 35;
        if (xDis < crit && yDis < crit) {
            return true;
        } else {
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
            x: this.model.get("x"),
            y: this.model.get("y")
        };
        return pos;
    },
    getPosition2: function() {
        var pos = {
            x: this.model.get("x") + this.model.get("size") / 2,
            y: this.model.get("y") + this.model.get("size") / 2
        };
        return pos;
    },
    getLink: function() {
        var n = this.model.get("link");
        if (_.isUndefined(n)) n = [];
        return n;
    },
    setPosition: function(_x, _y) {
        //var xx = Math.floor(_x);
        //var yy = Math.floor(_y);
        this.model.set({
            "x": _x,
            "y": _y
        });
    }
});
NodeView.prototype.config = {
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
};