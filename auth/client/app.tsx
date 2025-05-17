import { ThemeProvider } from './styles/theme';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { OneOf } from './utils';

const engine = new Styletron();

export function App() {
  const uri = window.location.pathname;
  return (
    <StyletronProvider value={engine}>
      <ThemeProvider>
        <OneOf>
          {uri.startsWith('/login') && <Login />}
          {uri.startsWith('/signup') && <Signup />}
          <div>
            Not found. Go to <a href="/login">Login page</a>
          </div>
        </OneOf>
      </ThemeProvider>
    </StyletronProvider>
  );
}
