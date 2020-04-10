import { Store, Module as VuexModule } from 'vuex'
import { schema as Normalizr } from 'normalizr'
import { Constructor } from '../types'
import { Schema } from '../schema/Schema'
import { Model } from '../model/Model'
import { RootModule } from '../modules/RootModule'
import { Module } from '../modules/Module'
import { State } from '../modules/State'
import { mutations, Mutations } from '../modules/Mutations'

export class Database {
  /**
   * The store instance.
   */
  store!: Store<any>

  /**
   * The name of Vuex Module namespace. Vuex ORM will create Vuex Modules from
   * the registered models, and modules, and define them under this namespace.
   */
  connection!: string

  /**
   * The list of registered models.
   */
  models: Record<string, Model> = {}

  /**
   * The schema definition for the registered models.
   */
  schemas: Record<string, Normalizr.Entity> = {}

  /**
   * Whether the database has already been installed to Vuex or not.
   * The model registration procedure depends on this flag.
   */
  started: boolean = false

  /**
   * Register the given model.
   */
  register(model: Constructor<Model>): void {
    const instance = new model()

    this.models[instance.$entity] = instance
  }

  /**
   * Set the store.
   */
  setStore(store: Store<any>): this {
    this.store = store

    return this
  }

  /**
   * Set the connection.
   */
  setConnection(connection: string): this {
    this.connection = connection

    return this
  }

  /**
   * Initialize the database before a user can start using it.
   */
  start(): void {
    this.injectStoreToModels()

    this.createSchemas()

    this.registerModules()

    this.started = true
  }

  /**
   * Get a model by the specified entity name.
   */
  getModel<M extends Model>(name: string): M {
    return this.models[name] as any
  }

  /**
   * Get schema by the specified entity name.
   */
  getSchema(name: string): Normalizr.Entity {
    return this.schemas[name]
  }

  /**
   * Inject the store instance to all registered models.
   */
  private injectStoreToModels(): void {
    for (const name in this.models) {
      this.models[name].$setStore(this.store)
    }
  }

  /**
   * Create the schema definition from registered models and set it to the
   * `schema` property. This schema will be used by the interpretation
   * to interpret data before persisting them to the store.
   */
  private createSchemas(): void {
    for (const name in this.models) {
      this.schemas[name] = this.createSchema(this.models[name])
    }
  }

  /**
   * Create schema from the given model.
   */
  private createSchema<M extends Model>(model: M): Normalizr.Entity {
    return new Schema(model).one()
  }

  /**
   * Generate modules and register them to the store.
   */
  private registerModules(): void {
    this.store.registerModule(this.connection, this.createModule())
  }

  /**
   * Create modules from the registered models and modules.
   */
  private createModule(): VuexModule<any, any> {
    const module = this.createRootModule()

    for (const name in this.models) {
      module.modules[name] = this.createSubModule()
    }

    return module
  }

  /**
   * Create root module.
   */
  private createRootModule(): RootModule {
    return {
      namespaced: true,
      modules: {}
    }
  }

  /**
   * Create sub module.
   */
  private createSubModule(): Module<State, any> {
    return {
      namespaced: true,
      state: this.createSubState(),
      mutations: this.createSubMutations()
    }
  }

  /**
   * Create sub state.
   */
  private createSubState(): State {
    return {
      data: {}
    }
  }

  /**
   * Create sub mutations.
   */
  private createSubMutations(): Mutations<State> {
    return mutations
  }
}
