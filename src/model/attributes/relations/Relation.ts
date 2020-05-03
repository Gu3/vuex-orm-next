import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, NormalizedData, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Attribute } from '../Attribute'

export interface Dictionary {
  [id: string]: Model[]
}

export abstract class Relation extends Attribute {
  /**
   * The parent model.
   */
  protected parent: Model

  /**
   * The related model.
   */
  protected related: Model

  /**
   * Create a new relation instance.
   */
  constructor(parent: Model, related: Model) {
    super(parent)
    this.parent = parent
    this.related = related
  }

  /**
   * Get all related models for the relationship.
   */
  abstract getRelateds(): Model[]

  /**
   * Get the related model of the relation.
   */
  getRelated(): Model {
    return this.related
  }

  /**
   * Define the normalizr schema for the relation.
   */
  abstract define(schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given data.
   */
  abstract attach(ids: any, record: Element, data: NormalizedData): void

  /**
   * Set the constraints for an eager loading relation.
   */
  abstract addEagerConstraints(query: Query, models: Collection): void

  /**
   * Execute the eager loading query.
   */
  public getEager(query: Query): Collection {
    return query.get()
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  abstract match(
    relation: string,
    models: Collection,
    results: Collection
  ): void

  /**
   * Get all of the primary keys for an array of models.
   */
  protected getKeys(models: Collection, key: string): (string | number)[] {
    return models.map((model) => model[key])
  }

  /**
   * Run a dictionary map over the items.
   */
  protected mapToDictionary(
    models: Collection,
    callback: (model: Model) => [string, Model]
  ): Dictionary {
    return models.reduce<Dictionary>((dictionary, model) => {
      const [key, value] = callback(model)

      if (!dictionary[key]) {
        dictionary[key] = []
      }

      dictionary[key].push(value)

      return dictionary
    }, {})
  }
}
