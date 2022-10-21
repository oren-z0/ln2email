import { css, FlattenInterpolation, DefaultTheme } from 'styled-components';

// Media Queries
// Leverage the `media` function inside the theme
// to target specific screen sizes.

export const sizes = {
  mobile: 320,
  tablet: 768,
  largeTablet: 920,
  desktop: 1024,
  largeDesktop: 1280,
};

export const media = Object.fromEntries(
  Object.entries(sizes).map(([key, size]) => [
    key,
    (first: any, ...args: any) => css`
      @media (min-width: ${size}px) {
        ${css(first, ...args)}
      }
    `,
  ])
) as Record<keyof typeof sizes, (first: any, ...args: any) => FlattenInterpolation<DefaultTheme>>;
