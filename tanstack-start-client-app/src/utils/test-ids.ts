export const getTestId = (scopes: Array<string | undefined>) => {
  scopes = scopes.filter((val) => !!val)

  if (scopes.length === 0) {
    return {}
  }

  return {
    'data-testid': scopes.join('.'),
  }
}
