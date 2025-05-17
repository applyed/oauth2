import {
  cloneElement,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStyletron } from 'styletron-react';
import { useTheme } from '../styles/theme';
import e from 'express';

export function MultiSelectOption({
  value,
  $toggle,
  children,
}: PropsWithChildren<{ value: string; $toggle?: (value: string) => void }>) {
  const [css] = useStyletron();
  return (
    <label className={css({ padding: '0.25rem 0' })}>
      <input
        type="checkbox"
        onChange={(e) => {
          e.stopPropagation();
          $toggle?.(value);
        }}
      />
      {children}
    </label>
  );
}

export function MultiSelect({
  children,
  name,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { name: string }) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [css] = useStyletron();
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>([]);

  const toggle = useCallback((value: string) => {
    setValues((existing) =>
      existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value]
    );
  }, []);

  useEffect(() => {
    if (isOpen) {
      const listener = (e: globalThis.MouseEvent) => {
        console.log('mouse event triggered', e);
        if (
          !parentRef.current ||
          parentRef.current.contains(e.target as Node)
        ) {
          return;
        }

        setOpen(false);
      };
      window.addEventListener('click', listener);
      return () => window.removeEventListener('click', listener);
    }
  }, [isOpen]);

  return (
    <div
      ref={parentRef}
      className={css({
        position: 'relative',
      })}
    >
      <div
        {...props}
        tabIndex={0}
        className={`${className} ${css({
          width: '100%',
          minHeight: '2.75rem',
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
        onClick={(e) => {
          if ((e.target as HTMLElement)?.tagName !== 'INPUT') {
            setOpen((old) => !old);
          }
        }}
        onKeyUp={(e) => {
          if (!isOpen && e.key === ' ') {
            setOpen(true);
          }
          if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      >
        <div style={{ display: isOpen ? 'none' : 'flex' }}>
          {values.join(', ') || 'Select roles...'}
        </div>
        <div
          className={css({
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
          })}
        >
          {Array.isArray(children) &&
            children.map((element) =>
              cloneElement(element, { $toggle: toggle })
            )}
        </div>
      </div>
      <span
        className={css({
          position: 'absolute',
          right: '0.75rem',
          top: '10%',
          transform: 'rotate(180deg)',
          fontSize: '1.5rem',
          cursor: 'pointer',
        })}
        onClick={() => setOpen((old) => !old)}
      >
        ^
      </span>
      <input style={{ display: 'none' }} name={name} value={values.join(',')} />
    </div>
  );
}
