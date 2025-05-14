import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
type QueryFnOptions = {
  on401: UnauthorizedBehavior;
} | string | null;

export const getQueryFn: <T>(options?: QueryFnOptions) => QueryFunction<T> =
  (options) =>
  async ({ queryKey }) => {
    // Handle case where options is a string (direct URL) or null
    let url: string;
    let unauthorizedBehavior: UnauthorizedBehavior = "throw";
    
    if (typeof options === 'string') {
      url = options;
    } else if (options && typeof options === 'object') {
      url = queryKey[0] as string;
      unauthorizedBehavior = options.on401;
    } else {
      url = queryKey[0] as string;
    }
    
    // Skip fetch if URL is null
    if (url === null) {
      return null;
    }
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
