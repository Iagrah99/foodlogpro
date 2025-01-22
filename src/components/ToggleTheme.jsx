import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Form } from "react-bootstrap";

const ToggleTheme = () => {
  const { userTheme, setUserTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setUserTheme((currentTheme) => { currentTheme === "light" ? "dark" : "light" })

  }

  return (
    <Form className="mb-3">
      <Form.Switch
        className="text-2xl"
        id="theme-switch"
        onChange={toggleTheme}
      // checked={true}
      />
    </Form>
  )
}

export default ToggleTheme
