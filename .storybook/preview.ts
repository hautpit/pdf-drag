import type { Preview } from "@storybook/react";
import "../src/font.scss";
import "../lib/styles/global.scss";
import "../lib/styles/main.scss";
import "../lib/styles/test.scss";

if (location.href.includes("mainlayout")) {
  const storybookRoot: any = document.getElementById("storybook-root");
  if (storybookRoot) {
    storybookRoot.style.padding = 0;
  }
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        // any non-empty string here will skip jsx rendering, see:
        // https://github.com/storybookjs/storybook/blob/next/code/renderers/react/src/docs/jsxDecorator.tsx#L165
        code: "hello world",
      },
    },
  },
};

export default preview;
