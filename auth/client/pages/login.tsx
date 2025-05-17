import { FormEvent, useEffect, useState } from 'react';
import { useStyletron } from 'styletron-react';
import { ErrorBanner } from '../common/error-banner';
import { Input } from '../common/input';
import { Layout } from './layout';
import { Button } from '../common/button';
import { APIError, useLogin } from '../api/api';
import { useReturnURI } from '../utils';

export function Login() {
  const [localError, setLocalError] = useState<Error | null>(null);
  const [css] = useStyletron();
  const returnURI = useReturnURI();

  useEffect(() => {
    if (!returnURI) {
      setLocalError(new Error('MISSING_RETURN_URI'));
    }
  }, [returnURI]);

  const { refetch: loginAPI, error: loginError, loading } = useLogin();

  const error = loginError || localError;
  // console.log(error, error?.details, error?.message);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = await loginAPI({
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result?.success && returnURI) {
      // Done redirect to return uri;
      window.location.href = returnURI;
    }
  };

  return (
    <Layout>
      <div
        className={css({
          maxWidth: '560px',
          padding: '1rem',
        })}
      >
        {error ? (
          <ErrorBanner>
            {(error instanceof APIError &&
              (error?.details as { [k: string]: string }).error) ||
              error.message}
          </ErrorBanner>
        ) : (
          <div
            className={css({
              width: '100%',
              height: '1.1rem',
              marginBottom: '2.5rem',
            })}
          />
        )}
        <form onSubmit={onSubmit}>
          <Input name="username" placeholder="Email or username" />
          <Input type="password" name="password" placeholder="Password" />
          <Button
            type="submit"
            loading={loading}
            onClick={() => console.log('clicked!')}
          >
            Login
          </Button>
        </form>
      </div>
    </Layout>
  );
}
