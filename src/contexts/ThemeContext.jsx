import { createContext, useState } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [userTheme, setUserTheme] = useState("light")

  return (
    <ThemeContext.Provider value={{ userTheme, setUserTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}