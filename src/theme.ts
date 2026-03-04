import { createTheme } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#16a34a' : '#4ade80',
      },
      secondary: {
        main: mode === 'light' ? '#0284c7' : '#38bdf8',
      },
      background: {
        default: mode === 'light' ? '#f3f4f6' : '#020617',
        paper: mode === 'light' ? '#ffffff' : '#020617',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            background:
              mode === 'light'
                ? 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.04))'
                : 'radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(74,222,128,0.18), transparent 55%)',
            border: '1px solid rgba(148,163,184,0.25)',
          },
        },
      },
    },
  })

