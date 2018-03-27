
import { Operator } from './operator';

export type Joiner = 'AND' | 'OR';

export class QueryExpression {

    static from(model: { [k: string]: any }, keys?: string[]) {
        if (!model) {
            return null;
        }
        keys = keys || Object.keys(model);
        let exp = new QueryExpression(keys[0], model[keys[0]]);
        for (let i = 1; i < keys.length; i++) {
            exp = exp.and(keys[i], model[keys[i]]);
        }
        return exp;
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
            this.value = value;
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
