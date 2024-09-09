import '../webpack-csp-nonce'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

createRoot(document.getElementById('react-app')).render(<App />)
