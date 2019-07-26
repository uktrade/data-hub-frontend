/* eslint-disable no-unused-vars */

const createUseContext = require('constate').default

const React = require('react')

const { useState } = React
const { render } = require('react-dom')

// Pulling our data in from an async request from the controller
const { reactData } = require('./controller')

const element = document.querySelector('#react-mount-sandbox')

// 1️⃣ Create a custom hook to intialise our store
function store () {
  // These are our store values & actions
  const [status, setStatus] = useState('')
  const [controllerData, setControllerData] = useState('')

  // This is our action dispatchers which have the previous store value as a prop
  const verifyStatus = () => setStatus(prev => 'React is working correctly')
  const getControllerData = () =>
    setControllerData(
      () => `Your controller data is: ${JSON.stringify(reactData)}`
    )

  // expose our action dispatchers and state values
  return { status, verifyStatus, controllerData, getControllerData }
}

// 2️⃣ Wrap your hook with the createUseContext factory
const useSandboxContext = createUseContext(store)

// 3️⃣ Use context instead of custom hook
function Button () {
  const { verifyStatus, getControllerData } = useSandboxContext()

  function actionSequence () {
    getControllerData()
    verifyStatus()
  }

  return <button onClick={actionSequence}>Is React working?</button>
}

// 4️⃣ Use context in other components
function StatusText () {
  const { status, controllerData } = useSandboxContext()
  return (
    <span>
      {status}
      <br />
      {controllerData}
    </span>
  )
}

function App () {
  // 5️⃣ Wrap your components with Provider
  return (
    <useSandboxContext.Provider>
      <StatusText />
      <Button />
    </useSandboxContext.Provider>
  )
}

const reactSandbox = render(<App />, element)

module.exports = reactSandbox
