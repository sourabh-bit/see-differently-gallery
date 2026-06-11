type EnvMap = Record<string, string | undefined>;

function asBooleanMap(env: EnvMap) {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, Boolean(value)]),
  ) as Record<string, boolean>;
}

export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    error,
  };
}

export function logEnvAvailability(scope: string, env: EnvMap) {
  console.info(`[${scope}] env availability`, asBooleanMap(env));
}

export function assertRequiredEnv(scope: string, env: EnvMap, required: string[]) {
  logEnvAvailability(scope, env);

  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    const message = `Missing required environment variable(s): ${missing.join(", ")}`;
    console.error(`[${scope}] ${message}`);
    throw new Error(message);
  }

  return env as Record<string, string>;
}

function describeRequest(input: RequestInfo | URL, init?: RequestInit) {
  if (typeof input === "string") {
    return {
      url: input,
      method: init?.method ?? "GET",
    };
  }

  if (input instanceof URL) {
    return {
      url: input.toString(),
      method: init?.method ?? "GET",
    };
  }

  return {
    url: input.url,
    method: init?.method ?? input.method ?? "GET",
  };
}

function linkAbortSignals(controller: AbortController, signal?: AbortSignal | null) {
  if (!signal) {
    return () => {};
  }

  if (signal.aborted) {
    controller.abort(signal.reason ?? new Error("Aborted"));
    return () => {};
  }

  const onAbort = () => {
    controller.abort(signal.reason ?? new Error("Aborted"));
  };

  signal.addEventListener("abort", onAbort, { once: true });
  return () => signal.removeEventListener("abort", onAbort);
}

export function createTimedFetch(scope: string, timeoutMs: number) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const { url, method } = describeRequest(input, init);
    const controller = new AbortController();
    const unlinkAbortSignal = linkAbortSignals(controller, init?.signal ?? undefined);
    const startedAt = Date.now();

    console.info(`[${scope}] fetch start`, { method, url, timeoutMs });

    const timer = setTimeout(() => {
      controller.abort(new Error(`${scope} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      console.info(`[${scope}] fetch complete`, {
        method,
        url,
        status: response.status,
        ok: response.ok,
        durationMs: Date.now() - startedAt,
      });

      return response;
    } catch (error) {
      console.error(`[${scope}] fetch error`, {
        method,
        url,
        durationMs: Date.now() - startedAt,
        error: serializeError(error),
      });
      throw error;
    } finally {
      clearTimeout(timer);
      unlinkAbortSignal();
    }
  };
}
