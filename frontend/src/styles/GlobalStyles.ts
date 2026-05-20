import { createGlobalStyle } from "styled-components";
import { colors, fonts, fontSizes, fontWeights } from "./theme";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${fonts.primary};
    font-size: ${fontSizes.base};
    font-weight: ${fontWeights.normal};
    line-height: 1.5;
    color: ${colors.gray800};
    background-color: ${colors.backgroundMain};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fonts.secondary};
    font-weight: ${fontWeights.semibold};
    line-height: 1.25;
    color: ${colors.gray900};
  }

  h1 {
    font-size: ${fontSizes["4xl"]};
  }

  h2 {
    font-size: ${fontSizes["3xl"]};
  }

  h3 {
    font-size: ${fontSizes["2xl"]};
  }

  h4 {
    font-size: ${fontSizes.xl};
  }

  h5 {
    font-size: ${fontSizes.lg};
  }

  h6 {
    font-size: ${fontSizes.base};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.primaryHover};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.gray300};
    border-radius: 3px;

    &:hover {
      background: ${colors.gray400};
    }
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${colors.primaryLight};
    color: ${colors.gray900};
  }
`;
