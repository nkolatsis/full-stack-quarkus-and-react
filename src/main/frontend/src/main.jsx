import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import {CssBaseline, ThemeProvider} from '@mui/material';
import {store} from './store';
import {theme} from './styles/theme';
//import reportWebVitals from './reportWebVitals';
import {App} from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);