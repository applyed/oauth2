import { PropsWithChildren, useMemo } from 'react';

const returnURIQueryParam = 'returnURI';

export function useReturnURI() {
  return useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(returnURIQueryParam);
  }, [window.location.search]);
}

export function OneOf({ children }: PropsWithChildren) {
  if (!children) {
    return null;
  }

  if (!Array.isArray(children)) {
    return children;
  }

  return <>{children.find((child) => Boolean(child))}</>;
}
