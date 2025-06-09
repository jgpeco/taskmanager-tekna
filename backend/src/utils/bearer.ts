export const parseBearer = (bearer: string | undefined): string | null => {
  if (!bearer) return null

  const [_, token] = bearer.trim().split(' ')
  return token
}
