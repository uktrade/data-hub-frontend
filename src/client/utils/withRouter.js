import { useLocation, useNavigate, useParams } from 'react-router-dom'

/*
 ** REMARKS: More information can be found @ https://reactrouter.com/docs/en/v6/faq
 */
export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()
    return <Component {...props} router={{ location, navigate, params }} />
  }

  return ComponentWithRouterProp
}
