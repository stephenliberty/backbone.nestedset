Backbone.NestedSet
==================

Nested sets are always a pain to set up, so this is a snippet/script/whatever to create a nested set setup in Backbone. 

The collection is assuming that if you're adding a collection 'normally', that you've already updated all of the left/right attributes, and the model you are adding already has left/right/level set on it appropriately.

If you're adding a model to the collection and you want it positioned within the heirarchy appropriately, use the collection's methods of:

* addModel(modelBeingAdded, parentModelInHeirarchy)
* insertModelBefore(modelBeingAdded, modelToInsertBefore)
* insertModelAfter(modelBeingAdded, modelToInsertAfter)

At some point I'd like to add in model methods, but alas - I've only got so much caffeine in my reach.

Example Usage
-------------

    var data = [
        {"id":2,"name":"root node","left":1,"right":12,"level":1},
        {"id":3,"name":"API","left":2,"right":3,"level":2},
        {"id":4,"name":"Components","left":6,"right":9,"level":2},
        {"id":5,"name":"Guide","left":8,"right":11,"level":2},
        {"id":6,"name":"FAQ","left":4,"right":5,"level":2},
        {"id":7,"name":"Component 1","left":7,"right":8,"level":3}
    ];
    
    var collection = new NestedSetCollection(data);

    collection.addModel({
        id: 8,
        name: "What does this do"
    }, collection.get(6));

    collection.insertModelBefore({
        id: 9,
        name: "What does that do"
    }, collection.get(8));
    
    console.log(collection.toJSON());

This should output something like:

    [
        {
            "id": 2,
            "name": "root node",
            "left": 1,
            "right": 16,
            "level": 1
        },
        {
            "id": 3,
            "name": "API",
            "left": 2,
            "right": 3,
            "level": 2
        },
        {
            "id": 6,
            "name": "FAQ",
            "left": 4,
            "right": 9,
            "level": 2
        },
        {
            "id": 9,
            "name": "What does that do",
            "left": 5,
            "right": 6,
            "level": 3
        },
        {
            "id": 8,
            "name": "What does this do",
            "left": 7,
            "right": 8,
            "level": 3
        },
        {
            "id": 4,
            "name": "Components",
            "left": 8,
            "right": 13,
            "level": 2
        },
        {
            "id": 7,
            "name": "Component 1",
            "left": 9,
            "right": 12,
            "level": 3
        },
        {
            "id": 5,
            "name": "Guide",
            "left": 10,
            "right": 15,
            "level": 2
        }
    ]

You can also output a heirarchy with 'children' -

    {
        "id": 2,
        "name": "root node",
        "left": 1,
        "right": 16,
        "level": 1,
        "children": [
            {
                "id": 3,
                "name": "API",
                "left": 2,
                "right": 3,
                "level": 2,
                "children": []
            },
            {
                "id": 6,
                "name": "FAQ",
                "left": 4,
                "right": 9,
                "level": 2,
                "children": [
                    {
                        "id": 9,
                        "name": "What does that do",
                        "left": 5,
                        "right": 6,
                        "level": 3,
                        "children": []
                    },
                    {
                        "id": 8,
                        "name": "What does this do",
                        "left": 7,
                        "right": 8,
                        "level": 3,
                        "children": []
                    }
                ]
            },
            {
                "id": 4,
                "name": "Components",
                "left": 8,
                "right": 13,
                "level": 2,
                "children": [
                    {
                        "id": 7,
                        "name": "Component 1",
                        "left": 9,
                        "right": 12,
                        "level": 3,
                        "children": []
                    }
                ]
            },
            {
                "id": 5,
                "name": "Guide",
                "left": 10,
                "right": 15,
                "level": 2,
                "children": []
            }
        ]
    }

License
-------

Copyright (c) 2012 Stephen Liberty (stephen@liberty-irm.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
