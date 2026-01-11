import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import { initTelemetry } from './utils/telemetry'
import './index.css'
import App from './App.tsx'

// Initialize Application Insights
const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
if (connectionString) {
  initTelemetry(connectionString);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
