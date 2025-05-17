import { PropsWithChildren } from 'react';
import { useTheme } from '../styles/theme';
import { useStyletron } from 'styletron-react';

export function Layout({ children }: PropsWithChildren) {
  const [css] = useStyletron();
  const theme = useTheme();

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.app.background,
        color: theme.app.foreground,
        minHeight: '100vh',
      })}
    >
      {children}
    </div>
  );
}
