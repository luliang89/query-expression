
import { Operator, OPERATORS } from './operator';

import { QueryExpression } from './query-expression';

import { FilterOptions, Ordering } from './filter-options';

import { Provider } from './provider';

import * as helper from './helper';

export class MysqlProvider implements Provider {

    toDbName(field: string) {
        return '`' + helper.toUnderline(field) + '`';
    }

    // toValue(value: any) {
    //     //nodejs运行时为0时区，必须将日期时间字符串反序列化为Date，由mysql驱动转换时区
    //     if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z?$/.test(value)) {
    //         return new Date(value);
    //     }
    //     return value;
    // }

    toRelation(field: string, op: Operator) {
        return `${this.toDbName(field)} ${op} ${op === Operator.in || op === Operator.notIn ? '(?)' : '?'}`;
    }

    toWhere(exp: QueryExpression): [string, any[]] {
        if (!exp) {
            throw new Error('exp has no value');
        }

        let wheres = [];
        let params = [];
        let grouped = false;

        if (exp.grouped) {
            grouped = true;
            wheres.push(')');
        }

        wheres.push(this.toRelation(exp.field, exp.operator));
        // params.push(this.toValue(exp.value));
        params.push(exp.value);

        let prev = exp.prev;
        while (prev) {

            if (prev.exp.grouped && grouped) {
                grouped = false;
                wheres.push('(');
            }

            wheres.push(prev.joiner);

            if (prev.exp.grouped) {
                grouped = true;
                wheres.push(')');
            }

            wheres.push(this.toRelation(prev.exp.field, prev.exp.operator));
            // params.push(this.toValue(prev.exp.value));
            params.push(prev.exp.value);

            prev = prev.exp.prev;
        }

        if (exp.grouped || grouped) {
            wheres.push('(');
        }

        return ['WHERE ' + wheres.reverse().join(' '), params.reverse()];

    }

    toOrderBy(orderBy: string | string[] | Ordering | Ordering[]) {
        let by = 'ORDER BY ';
        let type = typeof orderBy;
        if (type === 'string') {
            by += this.toDbName(orderBy as string);
        } else if (Array.isArray(orderBy) && orderBy.length) {
            by += (orderBy as any[]).map((x: any) => {
                let t = typeof x;
                if (t === 'string') {
                    return this.toDbName(x as string);
                }
                if (t === 'object' && x.field) {
                    return this.toDbName(x.field) + ' ' + (x.isDesc ? 'DESC' : 'ASC');
                }
                throw new Error('not support groupBy Type');
            }).join(', ');
        } else if (type === 'object' && (orderBy as Ordering).field) {
            let order = orderBy as Ordering;
            by += this.toDbName(order.field) + ' ' + (order.isDesc ? 'DESC' : 'ASC');
        } else {
            throw new Error('not support groupBy Type');
        }
        return by;
    }

    toGroupBy(groupBy: string | string[]) {
        let by = 'GROUP BY ';
        if (typeof groupBy === 'string') {
            by += this.toDbName(groupBy);
        } else if (Array.isArray(groupBy) && groupBy.length) {
            by += groupBy.map(x => this.toDbName(x)).join(', ');
        } else {
            throw new Error('not support groupBy Type');
        }
        return by;
    }

    toCommand(opts: FilterOptions): [string, string, any[]] {

        let query = '';

        let results: [string, string, any[]] = [null, '', null];

        if (opts.expression) {
            let [where, params] = this.toWhere(opts.expression);
            results[1] = where;
            results[2] = params;
        }

        if (opts.orderBy) {
            query += ' ' + this.toOrderBy(opts.orderBy);
        }

        if (opts.groupBy) {
            query += ' ' + this.toGroupBy(opts.groupBy);
        }

        if (opts.limit) {
            query += ` LIMIT ${opts.limit.offset},${opts.limit.rows}`
        }

        results[0] = query.trim();

        return results;

    }

}