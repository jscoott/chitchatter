import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import 'typeface-roboto'

import * as serviceWorkerRegistration from 'serviceWorkerRegistration'
import 'index.sass'
import Bootstrap from 'Bootstrap'
import reportWebVitals from 'reportWebVitals'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Bootstrap />
    </Router>
  </ThemeProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

serviceWorkerRegistration.register()
