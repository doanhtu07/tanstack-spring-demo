/*
  The goal is to centralize all class names under this single file
  - Or if you want to split them, do so but under a single folder like `class-names/`
  - So you can easily find within the folder scope

  Make sure all class names are unique across the app to avoid conflicts
*/

/** Class names that many components/routes might share + reuse */
export const SharedClassNames = {
  dark: 'dark',
  light: 'light',
  children: 'children',
} as const

/** Class names for a component */
export const ButtonClassNames = {
  root: 'button_root',
} as const

/** Class names unique for a route */
export const HomeClassNames = {
  // ...
} as const
