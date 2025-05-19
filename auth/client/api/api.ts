import { useCallback, useEffect, useState } from 'react';

export const APIS = {
  login: '/api/v1/login',
  signup: '/api/v1/signup',
  userInfo: '/api/v1/user-info',
  appState: '/api/v1/app-state',
};

export class APIError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.details = details;
    this.status = status;
  }

  static async from(resp: Response) {
    const message = `Call to ${resp.url.toString()} failed with status ${
      resp.status
    }`;
    const details = await resp.json();
    return new APIError(message, resp.status, details);
  }
}

export type APIResultState<T> = {
  data: T | null;
  loading: boolean;
  error: null | APIError;
  refetch: () => Promise<T>;
};

export function useAPIResult<T>(
  url: string,
  { skip = false, ...init }: RequestInit & { skip?: boolean } = {}
) {
  const [state, setState] = useState<Omit<APIResultState<T>, 'refetch'>>({
    data: null,
    loading: !skip,
    error: null,
  });

  const refetch = useCallback(
    async (initOverrides: Partial<RequestInit> = {}) => {
      let data = null;
      let loading = true;
      let error = null;
      setState({ data, loading, error });

      try {
        const res = await fetch(url, {
          ...init,
          ...initOverrides,
          headers: {
            ...init.headers,
            ...initOverrides.headers,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        if (!res.ok) {
          error = await APIError.from(res);
        } else {
          data = (await res.json()) as T;
        }
      } catch (e) {
        console.error('An error occurred trying to make api request', e);
        error = new APIError('UNKNOWN ERROR', 500, {
          error: e instanceof Error ? e.stack : e,
        });
      }

      loading = false;
      setState({ data, loading, error });

      if (error !== null) {
        throw error;
      }
      return data;
    },
    []
  );

  useEffect(() => {
    if (!skip) {
      refetch().catch();
    }
  }, []);

  return {
    ...state,
    refetch,
  };
}

export function useLogin() {
  return useAPIResult<{ success: boolean }>(APIS.login, {
    method: 'POST',
    skip: true,
  });
}

export function useSignup() {
  return useAPIResult<{ success: boolean }>(APIS.signup, {
    method: 'POST',
    skip: true,
  });
}

export function useUser() {
  return useAPIResult(APIS.userInfo);
}

export function useAppState() {
  return useAPIResult<{ isSettingUp: boolean }>(APIS.appState);
}
