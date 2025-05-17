import { PropsWithChildren } from 'react';
import { useTheme } from '../styles/theme';
import { useStyletron } from 'styletron-react';

export function ErrorBanner({ children }: PropsWithChildren) {
  const [css] = useStyletron();
  const theme = useTheme();
  return (
    <div
      className={css({
        backgroundColor: theme.app.errorBackground,
        color: theme.app.errorForeground,
        padding: '0.75rem 1rem',
        borderRadius: '7.5px',
        marginBottom: '1rem',
      })}
    >
      {children}
    </div>
  );
}
