
/**
 * 操作符
 */
export enum Operator {

    /**
     * 等于
     */
    equal = '=',

    /**
     * 小于
     */
    lessThan = '<',

    /**
     * 大于
     */
    moreThan = '>',

    /**
     * 小于等于
     */
    lessEqual = '<=',

    /**
     * 大于等于
     */
    moreEqual = '>=',

    /**
     * 不等于
     */
    notEqual = '<>',

    in = 'IN',

    notIn = 'NOT IN',

    /**
     * 模糊查询
     */
    like = 'LIKE',

    is = 'IS',

    isNot = 'IS NOT'

}


export const OPERATORS = [
    Operator.equal,
    Operator.in,
    Operator.notIn,
    Operator.is,
    Operator.isNot,
    Operator.lessThan,
    Operator.moreThan,
    Operator.lessEqual,
    Operator.moreEqual,
    Operator.like,
    Operator.notEqual
];