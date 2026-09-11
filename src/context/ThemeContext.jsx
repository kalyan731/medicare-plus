import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
}

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('medicare_plus_theme') === 'dark')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
        localStorage.setItem('medicare_plus_theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleTheme: () => setDarkMode((enabled) => !enabled) }}>
            {children}
        </ThemeContext.Provider>
    )
}
