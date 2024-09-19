import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { createProvider } from '../../../../src/client/createProvider'

/**
 * Creates a DataHub context provider for testing purposes configured
 * to use memory history.
 * @param {Object} options
 * @param {Record<string, Task>} options.tasks - Tasks required by the
 * components wrapped with the provider
 * @param {string} [options.initialPath] - If defined, the provider will
 * navigate to the path specified when mounted.
 * @returns {({children: JSX.Element}) => JSX.Element} - The context provider
 * component.
 */
export const createTestProvider = ({ tasks, initialPath } = {}) => {
  const Provider = createProvider(tasks, createMemoryHistory())

  const NavigateToInitialPath = () => {
    const navigate = useNavigate()
    useEffect(() => {
      navigate(initialPath)
    }, [])
    return null
  }

  return ({ children }) => (
    <Provider>
      {initialPath && <NavigateToInitialPath />}
      {children}
    </Provider>
  )
}
