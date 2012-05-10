$(function() {
	var store = new Store("test-backbone");
	var ItemModel = Backbone.Model.extend({
		defaults: function() {
			return {
				imt: "aiueo",
				img: "" + Math.floor((Math.random() * 100)),
				str: "aaa"
			};
		},
		localStorage: store,
		initialize: function() {}
	});

	var x = new ItemModel();


	var List = Backbone.Collection.extend({
		model: ItemModel,
		localStorage: store
	});

	var list = new List();
	list.add();
	list.add();
	list.add();
	list.add();
	list.add();

	var ItemView = Backbone.View.extend({
		template: "",
		events: {
			"click": "onClick"
		},
		onClick: function(e) {
			this.model.set("flag", !this.model.get("flag"));
		},
		render: function() {
			this.$el.html("<div> model flag : " + this.model.get("flag") + "</div>");
			return this;
		},
		initialize: function() {
			this.model.bind("change", this.render, this);
			this.render();
		}
	});


	var AppView = Backbone.View.extend({
		el: $("#contents"),
		events: {
			"click #but1": "onButClick",
			"click #but2": "onButClick",
			"click #but3": "onButClick"
		},
		onButClick: function(e) {
			//alert( $(this).html() );
			var tar = e.currentTarget;
			var butid = $(tar).attr("id");
			if (butid === "but1") {
				this.addAll();
			} else if (butid === "but2") {
				this.popp();
			} else if (butid === "but3") {
				this.addOne();
			}
		},
		remove: function() {
			this.$el.find("div").remove();
		},
		popp: function() {
			list.pop().destroy();
		},
		initialize: function() {
			list.bind('add', this.added, this);
			list.bind('reset', this.addAll, this);
			list.bind('all', this.render, this);
			this.render();
			list.fetch();
		},
		added: function(m) {
			m.save();
		},
		addOne: function(it) {
			list.add();
		},
		addAll: function() {

		},
		render: function() {
			this.remove();
			console.log(list.length);
			for (var i = list.length - 1; i >= 0; i--) {
				var m = list.at(i);
				$("#contents").append(new ItemView({
					"model": m
				}).render().$el);
			}
		}
	});

	var main = new AppView().$el;

	//$("#contents").append(main);
});