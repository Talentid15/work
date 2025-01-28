import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import store from './redux/store.jsx';

import { Toaster } from 'react-hot-toast';

import PipelineContextProvider from './context/PipelineContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PipelineContextProvider>
        <Toaster />
        <App />
      </PipelineContextProvider>
    </Provider>
  </StrictMode>
);


