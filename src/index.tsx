import { store } from '@app/src/store';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArcElement, Chart as ChartJS, LinearScale, PointElement, Title } from 'chart.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import './index.scss';
import { LanguageProvider } from './LanguageProvider';
import { App } from './pages/App';
import { persistor } from './store/store';

// React Query client.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: Infinity,
    },
  },
});

// Override `Material-UI` theme for customizing.
// ref: https://material-ui.com/customization/themes/#muithemeprovider
// const theme = createTheme({
//   typography: {
//     fontFamily: "'Roboto', 'Noto Sans', 'Noto Sans KR', sans-serif, Arial",
//   },
//   palette: {
//     primary: {
//       main: '#3d424e',
//     },
//     secondary: {
//       main: '#3e70d6',
//     },
//     error: {
//       main: '#FF0000',
//     },
//   },
// });

// Register chart.js plugins.
ChartJS.register(ArcElement, PointElement, LinearScale, Title);

// Render React components.
const rootElement = document.querySelector('#root');
const rootNode = ReactDOM.createRoot(rootElement);
rootNode.render(
  <StyledEngineProvider injectFirst>
    {/* <ThemeProvider theme={theme}> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
    {/* </ThemeProvider> */}
  </StyledEngineProvider>
);
