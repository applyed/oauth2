import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { useStyletron } from 'styletron-react';
import { useTheme } from '../styles/theme';
import { LoadingSpinner } from './loading-spinner';

export function Button({
  className,
  children,
  loading = false,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  loading?: boolean;
}) {
  const [css] = useStyletron();
  const theme = useTheme();

  return (
    <button
      className={`${className ?? ''} ${css({
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '0.75rem 1rem',
        marginTop: '1rem',
        fontSize: '1rem',
        borderRadius: '7.5px',
        border: `1px solid ${theme.app.controlsBorder}`,
        outline: 'none',
        marginBottom: '0.5rem',
        backgroundColor: theme.app.actionBackground,
        color: 'white',

        ':active': {
          opacity: '0.5',
        },
      })}`}
      {...props}
      disabled={loading}
    >
      {loading ? (
        <LoadingSpinner
          size="1rem"
          border="0.2rem"
          color={'black'}
          borderColor={theme.app.controlsBorder}
        />
      ) : (
        children
      )}
    </button>
  );
}
