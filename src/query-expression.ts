
import { Operator, OPERATORS } from './operator';

export type Joiner = 'AND' | 'OR';

export class QueryExpression {

    static from(arr: any[]) {
        if (!arr || !arr.length) {
            return null;
        }
        if (!Array.isArray(arr) || arr.length < 3) {
            throw new Error('not support the arr');
        }
        // console.log(typeof arr, arr.length, arr[1], OPERATORS.indexOf(arr[1]));
        if (OPERATORS.indexOf(arr[1]) === -1) {
            throw new Error('not support the Operator');
        }
        let exp = new QueryExpression(arr[0], arr[2], arr[1]);
        if (arr.length > 3) {
            let prev = QueryExpression.from(arr[4]);
            exp = prev.join(arr[3], exp);
            if (arr[5]) {
                exp.group();
            }
        }
        return exp;
    }

    toJSON() {
        let arr = [this.field, this.operator, this.value];
        if (this._prev) {
            arr.push(this._prev.joiner);
            arr.push(this._prev.exp.toJSON());
        }
        if (this.grouped) {
            arr.push(this.grouped);
        }
        return arr;
    }

    public readonly field: string;

    public readonly operator: Operator;

    public readonly value: any;

    private isGroup: boolean;

    public get grouped() {
        return this.isGroup;
    }

    private _prev: {
        joiner: Joiner,
        exp: QueryExpression
    }

    public get prev() {
        return this._prev;
    }

    constructor(
        field: string,
        value: any,
        operator: Operator = Operator.equal
    ) {
        if (field === null || field === undefined) {
            throw new Error('field is null or undefined');
        }
        if (value === undefined) {
            throw new Error('value is undefined');
        }
        if (operator === Operator.in && !Array.isArray(value)) {
            throw new Error('operator is in, value must is a array');
        }
        this.field = field;
        if (operator === Operator.in && value.length === 1) {
            this.value = value[0];
            this.operator = Operator.equal;
        } else {
            //将日期时间字符串反序列化为Date
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                this.value = new Date(value);
            } else {
                this.value = value;
            }
            this.operator = operator;
        }
    }

    join(joiner: Joiner, exp: QueryExpression) {
        let e = exp;
        while (e._prev) {
            e = e._prev.exp;
        }
        e._prev = {
            joiner: joiner,
            exp: this
        };
        return exp;
    }

    and(field: string, value: any, operator = Operator.equal) {
        let exp = new QueryExpression(field, value, operator);
        return this.join('AND', exp);
    }

    or(field: string, value: any, operator = Operator.equal) {
        let exp = new QueryExpression(field, value, operator);
        return this.join('OR', exp);
    }

    group() {
        if (!this.prev) {
            throw new Error('this.prev must has value');
        }
        this.isGroup = true;
        return this;
    }

}
