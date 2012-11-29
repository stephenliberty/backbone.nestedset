var NestedSetModel = Backbone.Model.extend({
    isLeaf: function () {
        return this.get('right') - this.get('left') == 1;
    }
});
var NestedSetCollection = Backbone.Collection.extend({
    
    initialize: function () {
        Backbone.Collection.prototype.initialize.apply(this, arguments);
        
        this.on('remove', this.removeModelEventCallback, this);
    },
    
    removeModelEventCallback: function (model) {
        var right = model.get('right');
        this.each(function (model) {
            if (model.get('left') >= right) {
                model.set('left', model.get('left') - 2);
            }
            if (model.get('right') >= right) {
                model.set('right', model.get('right') - 2);
            }
        });
    },
    
    _prepareModel: function (model) {
        console.log(model);
        if(!(model instanceof NestedSetModel)) {
            model = new NestedSetModel(model);
        }
        if(!model.get('left') || !model.get('right') || !model.get('level')) {
            throw "You must have the left, right and level attributes set on a model to just 'add' it. Otherwise, use addModel to position.";
            return false;
        }
        return Backbone.Collection.prototype._prepareModel.apply(this, arguments);
    },
    
    getChildren: function (searchModel, levels) {
        var models = this.filter(function (model) {
            if(levels) {
                if(model.get('level') > searchModel.get('level') + levels) { return }
            }
            return model.get('right') < searchModel.get('right') && model.get('left') > searchModel.get('left');
        });
        
        models.sort(function (a, b) {
            return b.get('left') < a.get('left');
        });
        
        return models;
    },
    
    addModel: function (model, parent) {
        if(!(model instanceof NestedSetModel)) {
            model = new NestedSetModel(model);
        }
        if(!parent) {
            parent = this.getRootModel();
        }
        if(!parent) {
            this.setRootModel(model);
            return;
        }
        var left = parent.get('left');
        var right = parent.get('right');
        model.set('left', right);
        model.set('right', right + 1);
        model.set('level', parent.get('level') + 1);
        var needUpdate = this.filter(function (model) {
            return model.get('right') >= right;
        });
        _.each(needUpdate, function (umodel) {
            umodel.set('right', umodel.get('right') + 2);
        });
        this.add(model);
    },
    
    insertModelBefore: function (model, before) {
        if(!(model instanceof NestedSetModel)) {
            model = new NestedSetModel(model);
        }
        if (model.collection && model.collection == this) {
            this.remove(model);
            
        }
        model.set('left', before.get('left'));
        model.set('right', before.get('right'));
        model.set('level', before.get('level'));
        this.each(function (model) {
            if(model.get('left') >= before.get('left')) {
                model.set('left', model.get('left') + 2);
            }
            if(model.get('right') >= before.get('right')) {
                model.set('right', model.get('right') + 2);
            }
        });
        this.add(model);
    },
    
    insertModelAfter: function (model, after) {
        if(!(model instanceof NestedSetModel)) {
            model = new NestedSetModel(model);
        }
        if (model.collection && model.collection == this) {
            this.remove(model);
            
        }
        model.set('left', after.get('left') + 2);
        model.set('right', after.get('right') + 2);
        model.set('level', after.get('level'));
        this.each(function (model) {
            if(model.get('left') >= after.get('left') + 2) {
                model.set('left', model.get('left') + 2);
            }
            if(model.get('right') >= after.get('right') + 2) {
                model.set('right', model.get('right') + 2);
            }
        });
        this.add(model);
    },
    
    getRootModel: function () {
        var search = this.where({left: 1});
        return search[0];
    },
    
    setRootModel: function (model) {
        if(!(model instanceof NestedSetModel)) {
            model = new NestedSetModel(model);
        }
        this.reset();
        model.set('left', 1);
        model.set('right', 2);
        model.set('level', 1);
        this.add(model);
    },
    
    toJSON: function () {
        var array = Backbone.Collection.prototype.toJSON.apply(this);
        return array.sort(function (a, b) {
            return b.left < a.left;
        });
    },
    
    toHeirarchy: function () {
        var collection = this;
        var recursor = function (model) {
            var modelData = model.toJSON();
            modelData.children = [];
            if(model.isLeaf()) {
                return modelData;
            } else {
                var children = collection.getChildren(model, 1);
                _.each(children, function (child) {
                    modelData.children.push(recursor(child));
                });
            }
            return modelData;
        }
        
        var heirarchy = recursor(this.getRootModel());
        return heirarchy;
    }
});