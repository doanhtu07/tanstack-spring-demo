export const getTestId = (scopes: Array<string | undefined>) => {
  const filteredScopes = scopes.filter((val) => !!val)

  // NOTE: Make sure scopes don't contain undefined
  if (filteredScopes.length !== scopes.length) {
    return {}
  }

  return {
    'data-testid': scopes.join('.'),
  }
}
