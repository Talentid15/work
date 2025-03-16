import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import store from './redux/store.jsx';

import { Toaster } from 'react-hot-toast';

import PipelineContextProvider from './context/PipelineContext.jsx';
import UserContextProvider from './context/UserContext.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <UserContextProvider>
          <PipelineContextProvider>
            <Toaster />
            <App />
          </PipelineContextProvider>
        </UserContextProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
