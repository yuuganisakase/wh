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