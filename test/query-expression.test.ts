
import 'mocha';
import assert = require('assert');

import { Operator } from '../src/operator';

import { QueryExpression } from '../src/query-expression';

import { MysqlProvider } from '../src/mysql-provider';

var provider = new MysqlProvider();

describe('QueryExpression', function () {

    describe('toJSON', function () {

        it('one exp number', function (done) {
            let exp = new QueryExpression('id', 1);
            let json = JSON.stringify(exp);
            let exp2 = QueryExpression.from(JSON.parse(json));
            let ok = exp.field === exp2.field
                && exp.value === exp2.value
                && exp.operator === exp2.operator;
            assert.ok(ok);
            done();
        })

        it('one exp date', function (done) {
            let exp = new QueryExpression('date', new Date());
            let json = JSON.stringify(exp);
            let exp2 = QueryExpression.from(JSON.parse(json));
            let ok = exp.field === exp2.field
                && exp.value.getTime() === exp2.value.getTime()
                && exp.operator === exp2.operator;
            //console.log(exp.value, exp2.value);
            assert.ok(ok);
            done();
        })

        it('group 1', function (done) {
            let exp = new QueryExpression('n', 'n')
                .or('m', 'm')
                .group()
                .and('id', 1);
            let json = JSON.stringify(exp);
            let exp2 = QueryExpression.from(JSON.parse(json));
            let ok = json === JSON.stringify(exp2);
            //console.log(json, JSON.stringify(exp2));
            assert.ok(ok);
            done();
        })

        it('group 2', function (done) {

            let exp2 = new QueryExpression('x', 'x')
                .or('y', 'y')
                .group();
            let exp = new QueryExpression('n', 'n')
                .or('m', 'm')
                .group()
                .join('AND', exp2);

            let json = JSON.stringify(exp);
            let [where, params] = provider.toWhere(QueryExpression.from(JSON.parse(json)));
            //console.log(where, JSON.stringify(exp));
            let ok = 'WHERE ( `n` = ? OR `m` = ? ) AND ( `x` = ? OR `y` = ? )' === where && params[0] === 'n';
            assert.ok(ok);
            done();

        })

    })

})