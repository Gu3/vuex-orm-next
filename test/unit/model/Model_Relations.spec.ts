import { createStore } from 'test/Helpers'
import { Model, Attr, HasOne, BelongsTo, HasMany, HasManyBy } from '@/index'

describe('unit/model/Model_Relations', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Attr() countryId!: number
    @Attr() nameIds!: number[]

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null

    @BelongsTo(() => Country, 'countryId')
    country!: Country | null

    @HasMany(() => Post, 'userId')
    posts!: Post[]

    @HasManyBy(() => Name, 'nameIds')
    names!: Name[]
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Country extends Model {
    static entity = 'countries'

    @Attr() id!: number
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Name extends Model {
    static entity = 'names'

    @Attr() id!: number
  }

  it('fills "has one" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      phone: {
        id: 2
      }
    })

    expect(user.phone).toBeInstanceOf(Phone)
    expect(user.phone!.id).toBe(2)
  })

  it('fills "belongs to" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      country: {
        id: 2
      }
    })

    expect(user.country).toBeInstanceOf(Country)
    expect(user.country!.id).toBe(2)
  })

  it('fills "has many" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      posts: [{ id: 2 }, { id: 3 }]
    })

    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[1]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
    expect(user.posts[1].id).toBe(3)
  })

  it('fills "has many by" relation', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      names: [{ id: 2 }, { id: 3 }]
    })

    expect(user.names[0]).toBeInstanceOf(Name)
    expect(user.names[1]).toBeInstanceOf(Name)
    expect(user.names[0].id).toBe(2)
    expect(user.names[1].id).toBe(3)
  })
})
