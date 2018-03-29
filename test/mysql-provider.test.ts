
import 'mocha';
import assert = require('assert');

import { Operator } from '../src/operator';

import { QueryExpression } from '../src/query-expression';

import { FilterOptions, Ordering } from '../src/filter-options';

import { MysqlProvider } from '../src/mysql-provider';

var provider = new MysqlProvider();

describe('MysqlProvider', function () {

    describe('toWhere', function () {

        it('one exp', function (done) {
            let exp = new QueryExpression('createDate', 'a');
            let [where, params] = provider.toWhere(exp);
            let ok = 'WHERE `create_date` = ?' === where && params[0] === 'a';
            assert.ok(ok);
            done();
        })

        it('group 1', function (done) {
            let exp = new QueryExpression('n', 'n')
                .or('m', 'm')
                .group()
                .and('id', 1);
            let [where, params] = provider.toWhere(exp);
            let ok = 'WHERE ( `n` = ? OR `m` = ? ) AND `id` = ?' === where && params[0] === 'n';
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
            let [where, params] = provider.toWhere(exp);
            //console.log(where, JSON.stringify(exp));
            let ok = 'WHERE ( `n` = ? OR `m` = ? ) AND ( `x` = ? OR `y` = ? )' === where && params[0] === 'n';
            assert.ok(ok);
            done();
        })

    })

    describe('toOrderBy', function () {

        it('string', function (done) {
            let by = provider.toOrderBy('createDate');
            let ok = 'ORDER BY `create_date`' === by;
            assert.ok(ok);
            done();
        })

        it('string[]', function (done) {
            let by = provider.toOrderBy(['createDate', 'stopTime']);
            let ok = 'ORDER BY `create_date`, `stop_time`' === by;
            assert.ok(ok);
            done();
        })

        it('Ordering', function (done) {
            let by = provider.toOrderBy({
                field: 'createDate',
                isDesc: true
            });
            let ok = 'ORDER BY `create_date` DESC' === by;
            assert.ok(ok);
            done();
        })

        it('Ordering[]', function (done) {
            let by = provider.toOrderBy([{
                field: 'createDate',
                isDesc: true
            }, {
                field: 'stopTime',
                isDesc: true
            }]);
            let ok = 'ORDER BY `create_date` DESC, `stop_time` DESC' === by;
            assert.ok(ok);
            done();
        })

    })

    describe('toCommand', function () {

        it('limit', function (done) {
            let opts = new FilterOptions();
            opts.expression = new QueryExpression('createDate', 'a');
            opts.limit = {
                offset: 0,
                rows: 10
            };
            let [orderBy, where, params] = provider.toCommand(opts);
            //console.log(orderBy, where);
            let ok = where === 'WHERE `create_date` = ?'
                && orderBy === 'LIMIT 0,10';
            assert.ok(ok);
            done();
        })

    })

})
