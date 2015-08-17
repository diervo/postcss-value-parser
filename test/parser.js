var test = require('tape');
var parser = require('../lib/parser');

test('Parser', function (t) {
    t.test('i/o', function (t) {
        var tests = [
            ' rgba( 34 , 45 , 54, .5 ) ',
            'w1 w2 w6 \n f(4) ( ) () \t "s\'t" \'st\\"2\''
        ];
        t.plan(tests.length);

        tests.forEach(function (item) {
            t.equal(item, parser(item).walk(function () {}).toString(), JSON.stringify(item));
        });
    });

    t.test('walk', function (t) {
        t.plan(2);
        var result;


        result = [];

        parser('fn( ) fn2( fn3())').walk(function (node) {
            if(node.type === 'function') {
                result.push(node);
            }
        });

        t.deepEqual(result, [
            {
                type: 'function',
                value: 'fn',
                nodes: [
                    {
                        type: 'space',
                        value: ' '
                    }
                ]
            },
            {
                type: 'function',
                value: 'fn2',
                nodes: [
                    {
                        type: 'space',
                        value: ' '
                    }, {
                        type: 'function',
                        value: 'fn3',
                        nodes: []
                    }
                ]
            },
            {
                type: 'function',
                value: 'fn3',
                nodes: []
            },
        ], 'should process all functions');


        result = [];

        parser('fn2( fn3())').walk(function (node) {
            if(node.type === 'function') {
                result.push(node);
            }
        }, true);

        t.deepEqual(result, [
            {
                type: 'function',
                value: 'fn3',
                nodes: []
            },
            {
                type: 'function',
                value: 'fn2',
                nodes: [
                    {
                        type: 'space',
                        value: ' '
                    }, {
                        type: 'function',
                        value: 'fn3',
                        nodes: []
                    }
                ]
            },
        ], 'should process all functions with reverse mode');
    });
});
