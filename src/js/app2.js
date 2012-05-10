var log = function(mes) {
        if (console) {
            console.log(mes);
        }
    };

var local = true;

var store = {};
var FBp = new FBproxy(store);
log("=========local data =======");
log(store.data);
var allInit = function() {

        var models = [];
        var nodes = [];

        window.fbAsyncInit = function() {
            var lc = new LoadCommand();
            lc.load();
            lc.completeSignal.on("complete", function(obj) {
                log("load complete in app");
                log(obj);

                (function(data) {

                    var createM = function(n) {
                        
                            var m = new NodeModel(n, {
                                "store": store
                            });
                            models.push(m);
                        };

                    var js = JSON.parse(data);
                    _.each(js.list, function(o) {
                        createM(o);
                    });
                })(obj);

                log("models");
                log(models);
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
                var images = ['assets/help.png','assets/help_hover.png',
                            'assets/logo.png','assets/logo_hover.png',
                            'assets/logout.png','assets/logout_hover.png',
                            "assets/clock.png"];
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