# Handle Test ID Naming

All components that need test id will implement `data-testid` attribute

All top-level routes should declare `TEST_ID_ROOT`

- This is the test id being passed down to child components

Only routes should have this variable

- Either common components or page-level components should not have this variable
- Rather, these components will use whatever `data-testid` passed in from parent

When naming, use `getTestId` since it supports naming test id with proper separator

- Each scope is separated by "."

You can even later add more test attributes or naming strategy to this function

- For example, besides `data-testid`, let's say you want to support `data-fullstory-name` for Fullstory, you can
  do that using this function too
