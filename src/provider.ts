
import { QueryExpression } from './query-expression';

import { FilterOptions } from './filter-options';

export interface Provider {

    /**
     * 将查询表达式转换为where语句
     * @param exp 
     * @returns [0]where语句 [1]参数列表
     */
    toWhere(exp: QueryExpression): [string, any[]]

    /**
     * 将过滤选项转换为sql
     * @param opts 
     * @returns [0]where语句 [1]orderBy、groupBy、分页语句 [2]参数列表
     */
    toCommand(opts: FilterOptions): [string, string, any[]]

}