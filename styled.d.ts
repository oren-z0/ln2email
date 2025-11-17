import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryLighter1: string;
      primaryLighter2: string;
      primaryLightest: string;
    };
  }
}

