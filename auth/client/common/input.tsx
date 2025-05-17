import { InputHTMLAttributes } from 'react';
import { useTheme } from '../styles/theme';
import { useStyletron } from 'styletron-react';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [css] = useStyletron();
  const theme = useTheme();
  return (
    <input
      {...props}
      className={`${className ?? ''} ${css({
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        borderRadius: '7.5px',
        border: `1px solid ${theme.app.controlsBorder}`,
        outline: 'none',
        marginBottom: '0.5rem',
        backgroundColor: theme.app.altBackground,
        color: theme.app.foreground,

        ':focus': {
          borderColor: theme.app.focusedBorder,
        },
      })}`}
    />
  );
}
