import { Model } from '../../../Model'
import { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne(
  related: () => typeof Model,
  foreignKey: string,
  localKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () =>
      target.$self.hasOne(related(), foreignKey, localKey)
    )
  }
}
