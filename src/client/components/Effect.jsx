import { useEffect } from 'react'

/**
 * @function Effect
 * @description Allows you to use the {React.useEffect} hook as a component.
 * A typical use case is when you need to make a side effect inside of a
 * function passed as a child to a component, but you can't use a hook directly
 * because it violates the hook rules.
 * @param {Object} props
 * @param {any[]} props.dependencyList - The same as the second argument to the
 * {React.useEffect} hook, but with all values JSON stringified.
 * @param {() => undefined | (() => () => void)} props.effect - The same as the
 * first argument to the {React.useEffect} hook, but with all values JSON
 * stringified.
 * @returns null
 * @example
 * <Route>
 *   {({location: {pathname}}) =>
 *      // You can't use a hook here, because it's inside a function,
 *      // but you can use it by proxy of the Effect component
 *      <Effect dependencyList={[pathname]} effect={() => alert(pathName)} />
 *   }
 * </Route>
 */
const Effect = ({ dependencyList, effect }) => {
  useEffect(effect, dependencyList?.map(JSON.stringify))
  return null
}

export default Effect
