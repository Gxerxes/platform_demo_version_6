import type { PaletteApiConfig, PalettePlatformConfig, PaletteQueryConfig } from './platform';
import { defaultApiConfig, defaultQueryConfig } from './defaults';

function mergeRecords(
  base: Record<string, string> | undefined,
  override: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (!base && !override) {
    return undefined;
  }
  return { ...base, ...override };
}

function mergeApiConfig(
  base: PaletteApiConfig,
  override?: Partial<PaletteApiConfig>,
): PaletteApiConfig {
  if (!override) {
    return { ...base };
  }

  return {
    ...base,
    ...override,
    headers: mergeRecords(base.headers, override.headers),
  };
}

function mergeQueryConfig(
  base: PaletteQueryConfig,
  override?: Partial<PaletteQueryConfig>,
): PaletteQueryConfig {
  if (!override) {
    return { ...base };
  }

  return {
    ...base,
    ...override,
  };
}

/**
 * Resolves platform configuration from defaults, runtime, and application layers.
 * Inputs are never mutated.
 */
export function resolvePlatformConfig(
  defaults: PalettePlatformConfig,
  runtimeConfig?: Partial<PalettePlatformConfig>,
  applicationConfig?: Partial<PalettePlatformConfig>,
): PalettePlatformConfig {
  const runtimeApi = mergeApiConfig(
    mergeApiConfig({ ...defaults.api }, defaultApiConfig),
    runtimeConfig?.api,
  );
  const runtimeQuery = mergeQueryConfig(
    { ...(defaults.query ?? defaultQueryConfig) },
    runtimeConfig?.query,
  );

  const merged: PalettePlatformConfig = {
    api: mergeApiConfig(runtimeApi, applicationConfig?.api),
    query: mergeQueryConfig(runtimeQuery, applicationConfig?.query),
    auth: applicationConfig?.auth ?? runtimeConfig?.auth ?? defaults.auth,
    metadata: {
      ...defaults.metadata,
      ...runtimeConfig?.metadata,
      ...applicationConfig?.metadata,
    },
  };

  if (!merged.metadata || Object.keys(merged.metadata).length === 0) {
    delete merged.metadata;
  }

  return merged;
}
