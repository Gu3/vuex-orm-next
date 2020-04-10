import { Query } from './Query'

export interface Where {
  field: string | number
  value: any
  boolean: 'and' | 'or'
}

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
}

export interface Order {
  field: string
  direction: OrderDirection
}

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void
