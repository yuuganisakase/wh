var NodeList = Backbone.Collection.extend({
  initialize: function(mdl, opt) {
    if(!opt) opt = {};

    if (opt.klass) this.model = opt.klass;
    if (opt.store) this.localStorage = opt.store;
  }
});