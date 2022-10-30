import jwt, { JwtPayload } from 'jsonwebtoken';

export { jwt };

export interface SomeJwtPayload extends JwtPayload {
  kind?: 'unsubscribe';
}

export function verifyUnsubscribeToken(token: string): string | undefined {
  let parsedToken: SomeJwtPayload | string;
  try {
    parsedToken = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET ?? '',
      {
        algorithms: ['HS256'],
      }
    );
  } catch (error) {
    console.error('Failed to verify unsubscribe jwt', error);
    return undefined;
  }
  if (
    (typeof parsedToken === 'string') ||
    (parsedToken.kind !== 'unsubscribe') ||
    (typeof parsedToken.sub !== 'string')
  ) {
    console.error('Not an unsubscribe token');
    return undefined;
  }
  return parsedToken.sub;
}
