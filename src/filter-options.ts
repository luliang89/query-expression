
import { Match, Required, Length, Value, StringType, Validation } from 'ichipsea.validators';

import { QueryExpression } from './query-expression';
import { Operator } from '.';

export class Ordering {

    field: string

    isDesc?: boolean

}

export class Limit {

    @Required()
    offset: number

    @Required()
    rows: number

}

/**
 * 过滤选项
 */
export class FilterOptions {

    @Match({
        value: [true, false]
    })
    count?: boolean

    /**
     * 查询表达式
     */
    @Validation()
    expression?: QueryExpression

    /**
     * 要查询的字段
     */
    @Length({
        min: 1
    })
    fields?: string[]

    /**
     * 分页
     */
    @Validation()
    limit?: Limit

    @Validation()
    orderBy?: string | string[] | Ordering | Ordering[]

    @Length({
        min: 1
    })
    groupBy?: string | string[]

    setExpression(field: string, value: any, op = Operator.equal, join = 'AND') {
        if (op !== Operator.is && op !== Operator.isNot) {
            if (!value) {
                return;
            }
        }
        // if (op === Operator.like) {
        //     target[key] = '%' + target[key] + '%';
        // }
        let exp = new QueryExpression(field, value, op);
        this.expression = this.expression ? this.expression.join(join as any, exp) : exp;
    }

}