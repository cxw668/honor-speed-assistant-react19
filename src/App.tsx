import { ThemeContextProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import AppRouter from "./router"

function App() {

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AppRouter />
    </ThemeContextProvider>
  )
}

export default App
