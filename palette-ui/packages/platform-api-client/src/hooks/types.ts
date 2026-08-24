import type { ApiRequestContext, ApiResponseContext } from '../interceptors/types';
import type { ApiError } from '../error/ApiError';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';

export type BeforeRequestHook = (context: ApiRequestContext) => void | Promise<void>;
export type AfterResponseHook = <T>(
  context: ApiResponseContext<T>,
) => void | Promise<void>;
export type OnErrorHook = (error: ApiError) => void | Promise<void>;

export async function runBeforeRequestHook(
  config: ResolvedApiClientConfig,
  context: ApiRequestContext,
): Promise<void> {
  if (!config.hooks?.beforeRequest) {
    return;
  }

  try {
    await config.hooks.beforeRequest(context);
  } catch (hookError) {
    config.logger?.warn?.('beforeRequest hook failed', { error: hookError });
  }
}

export async function runAfterResponseHook<T>(
  config: ResolvedApiClientConfig,
  context: ApiResponseContext<T>,
): Promise<void> {
  if (!config.hooks?.afterResponse) {
    return;
  }

  try {
    await config.hooks.afterResponse(context);
  } catch (hookError) {
    config.logger?.warn?.('afterResponse hook failed', { error: hookError });
  }
}

export async function runOnErrorHook(
  config: ResolvedApiClientConfig,
  error: ApiError,
): Promise<void> {
  if (config.hooks?.onError) {
    try {
      await config.hooks.onError(error);
    } catch (hookError) {
      config.logger?.warn?.('onError hook failed', { error: hookError });
    }
  }

  config.onError?.(error);
}
