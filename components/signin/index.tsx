const defaultError = 'Unable to sign in.';

const errors = new Map([
  ['Signin', 'Try signing in with a different account.'],
  ['OAuthSignin', 'Try signing in with a different account.'],
  ['OAuthCallback', 'Try signing in with a different account.'],
  ['OAuthCreateAccount', 'Try signing in with a different account.'],
  ['EmailCreateAccount', 'Try signing in with a different account.'],
  ['Callback', 'Try signing in with a different account.'],
  ['OAuthAccountNotLinked',
    'To confirm your identity, sign in with the same account you used originally.'],
  ['EmailSignin', 'The e-mail could not be sent.'],
  ['CredentialsSignin',
    'Sign in failed. Check the details you provided are correct.'],
  ['SessionRequired', 'Please sign in to access this page.'],
  ['UnsupportedTld', 'Unsupport domain suffix'],
  ['FailedToRegisterTld', 'Failed to register domain'],
]);

interface InternalProvider {
  type: string;
  id: string;
  name: string;
  signinUrl: string;
}

export interface SigninPageProps {
  csrfToken: string;
  providers: InternalProvider[];
  callbackUrl: string;
  error: string;
  email?: string;
}

export default function SigninPage({
  csrfToken,
  providers,
  callbackUrl,
  error,
  email,
}: SigninPageProps) {
  // We only want to render providers
  const providersToRender = providers.filter((provider) => {
    return (provider.type === "oauth" || provider.type === "email");
  });

  const errorMessage = error && (errors.get(error) ?? defaultError);

  return (
    <div className="signin-page">
      <div className="signin">
        <div className="card">
          {errorMessage && (
            <div className="error">
              <p>{errorMessage}</p>
            </div>
          )}
          {providersToRender.map((provider, i: number) => (
            <div key={provider.id} className="provider">
              {provider.type === "oauth" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  {callbackUrl && (
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />
                  )}
                  <button type="submit" className="button">
                    Sign in with {provider.name}
                  </button>
                </form>
              )}
              {(provider.type === "email" || provider.type === "credentials") &&
                i > 0 &&
                providersToRender[i - 1].type !== "email" &&
                providersToRender[i - 1].type !== "credentials" && <hr />}
              {provider.type === "email" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  <label
                    className="section-header"
                    htmlFor={`input-email-for-${provider.id}-provider`}
                  >
                    Email
                  </label>
                  <input
                    id={`input-email-for-${provider.id}-provider`}
                    autoFocus
                    type="email"
                    name="email"
                    value={email}
                    placeholder="email@example.com"
                    required
                  />
                  <button type="submit">Sign in with {provider.name}</button>
                </form>
              )}
              {(provider.type === "email" || provider.type === "credentials") &&
                i + 1 < providersToRender.length && <hr />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
