import { useContext } from "react";
import { Form } from "react-bootstrap";
import { ThemeContext } from "../contexts/ThemeContext";

const ToggleTheme = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Form className="mb-3">
      <Form.Switch
        className="text-2xl"
        id="theme-switch"
        onChange={toggleTheme}
        checked={darkMode} // Sync the switch with the theme
      />
    </Form>
  );
};

export default ToggleTheme;
