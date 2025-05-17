import { SelectHTMLAttributes } from 'react';
import { useStyletron } from 'styletron-react';
import { useTheme } from '../styles/theme';

export function Select({
  children,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const [css] = useStyletron();
  const theme = useTheme();

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <select
        {...props}
        className={`${className} ${css({
          width: '100%',
          padding: '0.75rem 1.75rem 0.75rem 1rem',
          fontSize: '1rem',
          borderRadius: '7.5px',
          border: `1px solid ${theme.app.controlsBorder}`,
          outline: 'none',
          marginBottom: '0.5rem',
          backgroundColor: theme.app.altBackground,
          color: theme.app.foreground,
          appearance: 'none',

          ':focus': {
            borderColor: theme.app.focusedBorder,
          },
        })}`}
      >
        {children}
      </select>
      <span
        className={css({
          position: 'absolute',
          right: '0.75rem',
          top: '10%',
          transform: 'rotate(180deg)',
          fontSize: '1.5rem',
        })}
      >
        ^
      </span>
    </div>
  );
}
