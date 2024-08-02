/**
 * @fileoverview Implements dynamic CSS properties for theming the app.
 */

import { Global, css } from '@emotion/react';

export default function Theme(props) {
  const { settings } = props;

  if (!settings || !settings.colors) {
    return null;
  }

  return (
    <Global
      styles={css`
        :root {
          --background-color: ${settings.colors.background};
          --tap-color: ${settings.colors.tap};
          --text-color: ${settings.colors.text};
        }
      `}
    />
  );
}
