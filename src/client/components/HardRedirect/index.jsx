import { useEffect } from 'react'
import { connect } from 'react-redux'

import { HARD_REDIRECT } from '../../actions'

/**
 * @function HardRedirect
 * @description When rendered, it will change {window.location.href} to the
 * value of {to}. This is meant to be used in cases when there's a need to
 * redirect to a different Express page, not to a different route within the
 * React application. For that you should use {react-router-dom.Redirect}.
 * @param {Object} props
 * @param {string} props.to - The URL to redirect to
 * @param {any} props.when - The redirect will only happen when this expression
 * is truthy
 * @param {(redirect: (to: string) => any) => React.ReactNode} props.children - A
 * function which will be passed the redirect function as its only argument.
 * Calling that function will result in the hard redirection.
 * @example
 * <HardRedirect to="/foo" when={shouldRedirect} />
 */
export default connect()(({ to, when, dispatch, children = null }) => {
  useEffect(() => {
    when && dispatch({ type: HARD_REDIRECT, to })
  }, [to, when])
  return typeof children === 'function'
    ? children((to) => dispatch({ type: HARD_REDIRECT, to }))
    : children
})
