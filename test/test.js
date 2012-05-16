console.log("js test");

module('test test', {
	setup: function() {

	}
});

test('test 1', function() {
	// Not a bad test to run on collection methods.
	var lc = new LoadCommand();
	lc.load();
	var models = [];
	var nodes = [];
	lc.completeSignal.on("complete", function(obj) {

		(function(data) {

			var createM = function(n) {

					var m = new NodeModel(n, {
						"store": store
					});
					models.push(m);
				};

			var js = JSON.parse(data);
			var ran = Math.random();

			_.each(js.list, function(o) {
				createM(o);
			});
		})(obj);

		_.each(models, function(m) {
			var v = factory.create(NodeView, {
				"model": m
			});
			nodes.push(v);
		});

		var arrangeCommand = new ArrangeNodeCommand(nodes);
		arrangeCommand.execute();
		//equal(arrangeCommand._pow(3),1,"power");
	});
	ok(true, "arrange node");
	equal(3+2,5,"threee");
});