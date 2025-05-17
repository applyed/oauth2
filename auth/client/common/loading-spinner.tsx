import { useStyletron } from 'styletron-react';

function LoadingSpinner({
  size = '10em',
  border = '1.1em',
  color = 'rgba(172, 200, 248)',
  borderColor = 'rgba(172, 200, 248, 0.3)',
}: {
  size?: string;
  border?: string;
  color?: string;
  borderColor?: string;
}) {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        fontSize: '10px',
        position: 'relative',
        textIndent: '-9999em',
        borderTop: `${border} solid ${borderColor}`,
        borderRight: `${border} solid ${borderColor}`,
        borderBottom: `${border} solid ${borderColor}`,
        borderLeft: `${border} solid ${color}`,
        transform: `translateZ(0)`,
        borderRadius: '50%',
        width: size,
        height: size,
        overflow: 'hidden',

        animationName: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        animationDelay: '0s',
        animationDuration: '1.1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',

        ':after': {
          content: "''",
          borderRadius: '50%',
          width: size,
          height: size,
        },
      })}
    >
      Loading...
    </div>
  );
}

export { LoadingSpinner };
