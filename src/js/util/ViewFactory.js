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