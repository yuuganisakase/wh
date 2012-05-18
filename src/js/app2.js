var log = function(mes) {
        if (console) {
            console.log(mes);
        }
    };

var local = true;

var store = {};
var FBp = new FBproxy(store);

var allInit = function() {
        log("all init");
        var models = [];
        var nodes = [];
        var images = ['assets/help.png', 'assets/help_hover.png', 'assets/logo.png', 'assets/logo_hover.png', 'assets/logout.png', 'assets/logout_hover.png', "assets/clock.png"];

        var reloadCommand = new ReloadDataCommand();
        //window.fbAsyncInit = function() {

        (function() {
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
                    var ran = Math.random();

                    var randomChoose = function(ind) {
                            if (Math.random() > 1) {
                                js.list.splice(ind, 1);
                            }
                        };
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
        })();


        var start = function() {

                enchant();

                var CanvasSizeW = 1024;
                var CanvasSizeH = 704;

                var collidedNum = 0;

                var game = new Game(CanvasSizeW, CanvasSizeH);
                game.fps = 18;
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

                    var me;
                    _.each(nodes, function(n) {
                        if (n.getType() == "me") {
                            me = n;
                        }
                    });
                    game.addEventListener('enterframe', function() {
                        stage.clear();
                        TWEEN.update();
                        var dl = new DrawLinkCommand();
                        dl.execute(nodes, stage);
                        _.each(nodes, function(n) {
                            n.update(me, nodes);
                        });

                        if (collidedNum > 0) {
                            $(stageSprite._element).css("cursor", "pointer");

                        } else {
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
                    _.each(nodes, function(n) {
                        n.init();
                        if (n.getType() === 0) {
                            me = n;
                        }
                    });

                    reloadCommand.completeSignal.on("complete", function(data) {
                            log("reload command");
                            makeNodes(data);
                            setTimeout(function() {reload();}, 9000);
                        });

                    var reload = function() {
                        reloadCommand.load();
                    };
                    var makeNodes = function(data) {
                        var tempModels = [];
                        var createM = function(n) {
                            var m = new NodeModel(n, {
                                "store": store
                            });
                            tempModels.push(m);
                        };

                        var js = JSON.parse(data);

                        _.each(js.list, function(o) {
                            //images.push(o.imageUrl);

                            createM(o);
                        });


                        var newM = [];
                        log("****************reload make nodes");
                        log("before");
                        log(nodes);
                        _.each(tempModels, function(t) {
                            var result = _.find(nodes, function(n) {
                                return (n.getId() == t.get("userId"));
                            });
                            //log(result);
                            if(_.isUndefined(result)){
                                var v = factory.create(NodeView, {
                                    "model": t
                                });
                                log("new model");
                                log(t);
                                game.load(t.get("imageUrl"), function() {
                                    v.setPosition((CanvasSizeW/2) + Math.random()*100 - 50,(CanvasSizeH/2) + Math.random()*100 - 50);

                                    v.init();
                                    nodes.push(v);
                                });
                            }
                        });

                        _.each(nodes, function(n) {
                            var result = _.find(tempModels, function(t) {
                                return (t.get("userId") == n.getId());
                            });
                            if(_.isUndefined(result)){
                                n.remove();
                                setTimeout(function() {nodes = _.without(nodes, n);}, 600);
                            }
                        });
                        log("after");
                        log(nodes);

                    };
                    setTimeout(function() {
                        reload();
                    }, 3000);

                    var dl = new DrawLinkCommand();
                    dl.execute(nodes, stage);


                    var eb = factory.getGlobalEventbus();
                    eb.on("collided", function(e) {
                        log("collided");

                        collidedNum += 1;

                    });
                    stageSprite.addEventListener("touchend", function(e) {
                        for (var i = nodes.length - 1; i >= 0; i--) {
                            var n = nodes[i];
                            if (n.checkCollided(e.localX, e.localY)) {
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
                            try {
                                eb.trigger("resize");
                                var wid = $(window).width();
                                var hei = $(window).height();
                                var se = $(scene._element);

                                se.addClass("current_scene");
                                game.width = wid;
                                se.width(wid);
                                game.height = hei;
                                se.height(hei);

                                stageGroup.x = (wid - CanvasSizeW) / 2;
                                stageGroup.y = ((hei - 64) - CanvasSizeH) / 2 + 64;
                                log(se);
                            } catch (e) {
                                log("resize error");
                            }
                        };
                    onResize();

                };
                game.start();

            };

    };