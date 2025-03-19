import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #1E88E5;
    --primary-dark: #1565C0;
    --primary-light: #64B5F6;
    --secondary-color: #FF9800;
    --secondary-dark: #F57C00;
    --secondary-light: #FFB74D;
    --background: #F5F5F5;
    --surface: #FFFFFF;
    --error: #D32F2F;
    --success: #388E3C;
    --text-primary: #212121;
    --text-secondary: #757575;
    --text-disabled: #9E9E9E;
    --divider: #BDBDBD;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    cursor: pointer;
  }
`;