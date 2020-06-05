import { connect } from 'react-redux'
import { ANALYTICS__PUSH } from '../../actions'

/* This component wraps around a child component from which you want to push
data to the Google Tag Manager data layer. It passes an arrow function to the 
child component which when called dispatches the ANALYTICS__PUSH 
action and passes the data intended for the GTM data layer to the 
Analytics saga. */

const Analytics = connect()(({ children, dispatch }) =>
  children((data) =>
    dispatch({
      type: ANALYTICS__PUSH,
      data,
    })
  )
)

export default Analytics
