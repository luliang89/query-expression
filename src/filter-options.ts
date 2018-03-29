
import { Match, Required, Length, Value, StringType, Validation } from 'ichipsea.validators';

import { QueryExpression } from './query-expression';

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

}