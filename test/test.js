console.log("js test");

module('test test', {
	setup: function() {

	}
});

test('test 1', function() {
	// Not a bad test to run on collection methods.
		ok(true, "arrange node");

	var lc = new LoadCommand();
	lc.load();
	var models = [];
	var nodes = [];
	//console.log(lc.load);
	lc.completeSignal.on("complete", function(obj) {
		start();
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
	equal(3+2,5,"threee");
	//var n = nodes[2].getRepul(nodes[3],100);
	ok(true,"get repul");
});