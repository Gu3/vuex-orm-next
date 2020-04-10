import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Boolean attribute property decorator.
 */
export function Bool(
  value: boolean | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => {
      const attr = target.$self.boolean(value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
