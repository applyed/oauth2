import { ThemeProvider } from './styles/theme';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { OneOf } from './utils';
import { useAppState } from './api/api';
import { LoadingPage } from './pages/loading';
import { Layout } from './pages/layout';
import { useEffect } from 'react';

const engine = new Styletron();

const PathToComponentMap = {
  '/login': Login,
  '/signup': Signup,
};

export function App() {
  const { data: appState, loading: appStateLoading } = useAppState();
  const uri = window.location.pathname;

  const { isSettingUp } = appState ?? {};

  useEffect(() => {
    console.log({
      appStateLoading,
      uri,
      isSettingUp,
    });
    if (
      appStateLoading ||
      Object.keys(PathToComponentMap).some((path) => uri.startsWith(path))
    ) {
      return;
    }

    if (isSettingUp) {
      window.location.href = '/signup';
      return;
    }
    window.location.href = '/login';
  }, [isSettingUp, appStateLoading]);

  return (
    <StyletronProvider value={engine}>
      <ThemeProvider>
        <OneOf>
          {[
            appStateLoading ? <LoadingPage /> : null,
            ...Object.entries(PathToComponentMap).map(([path, Component]) =>
              uri.startsWith(path) ? (
                <Component isSettingUp={isSettingUp ?? false} />
              ) : null
            ),
            <Layout>
              Not found. Go to <a href="/login">Login page</a>
            </Layout>,
          ]}
        </OneOf>
      </ThemeProvider>
    </StyletronProvider>
  );
}
