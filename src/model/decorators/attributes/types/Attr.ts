import { PropertyDecorator } from '../../Contracts'

/**
 * Create an Attr attribute property decorator.
 */
export function Attr(value?: any): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => target.$self.attr(value))
  }
}
