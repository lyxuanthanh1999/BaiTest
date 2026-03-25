import { NativeModules, TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

import type { AppConfig, AppConfigKey, BaseAppConfig } from 'react-native-config';

type ConfigModule = TurboModule & {
    getConfig: () => { config: Partial<AppConfig> };
};

type LegacyConfigModule = {
    getConstants?: () => { config?: Partial<AppConfig> };
    config?: Partial<AppConfig>;
    [key: string]: unknown;
} | null;

type NativeModulesWithConfig = typeof NativeModules & {
    RNCConfig?: LegacyConfigModule;
    ReactNativeConfig?: LegacyConfigModule;
    RNCConfigModule?: LegacyConfigModule;
};

const DEFAULT_CONFIG: BaseAppConfig = {
    APP_FLAVOR: 'development',
    APP_NAME: 'NewReactNativeZustandRNQ',
    VERSION_CODE: '1',
    VERSION_NAME: '1.0.0',
    API_URL: 'http://localhost:3000',
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
};

const ENV_KEYS: AppConfigKey[] = [
    'APP_FLAVOR',
    'APP_NAME',
    'VERSION_CODE',
    'VERSION_NAME',
    'API_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
];

const isAppFlavor = (value: string): value is BaseAppConfig['APP_FLAVOR'] =>
    value === 'development' || value === 'staging' || value === 'production';

const readProcessEnv = (): Partial<AppConfig> => {
    const runtimeEnv: Partial<AppConfig> = {};

    for (const key of ENV_KEYS) {
        const value = typeof process !== 'undefined' ? process.env?.[key] : undefined;
        if (!value) {
            continue;
        }

        if (key === 'APP_FLAVOR') {
            if (isAppFlavor(value)) {
                runtimeEnv.APP_FLAVOR = value;
            }
            continue;
        }

        runtimeEnv[key] = value as AppConfig[Exclude<AppConfigKey, 'APP_FLAVOR'>];
    }

    return runtimeEnv;
};

const tryReadTurboModule = (): Partial<AppConfig> | null => {
    try {
        const module = TurboModuleRegistry.get<ConfigModule>('RNCConfigModule');
        const config = module?.getConfig?.().config;
        if (config) {
            return config as Partial<AppConfig>;
        }
    } catch (error) {
        if (__DEV__) {
            console.warn('[env] Failed to read RNCConfigModule.', error);
        }
    }
    return null;
};

const tryReadLegacyModule = (): Partial<AppConfig> | null => {
    const nativeModules = NativeModules as NativeModulesWithConfig;
    const legacyModule =
        nativeModules?.RNCConfig ?? nativeModules?.ReactNativeConfig ?? nativeModules?.RNCConfigModule ?? null;

    if (!legacyModule) {
        return null;
    }

    if (typeof legacyModule.getConstants === 'function') {
        const constants = legacyModule.getConstants();
        if (constants?.config) {
            return constants.config as Partial<AppConfig>;
        }
    }

    if (legacyModule.config && typeof legacyModule.config === 'object') {
        return legacyModule.config as Partial<AppConfig>;
    }

    const stringEntries = Object.entries(legacyModule).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[key] = value;
        }
        return acc;
    }, {});

    return Object.keys(stringEntries).length > 0 ? (stringEntries as Partial<AppConfig>) : null;
};

const readNativeConfig = (): Partial<AppConfig> => {
    const turboConfig = tryReadTurboModule();
    if (turboConfig) {
        return turboConfig;
    }

    const legacyConfig = tryReadLegacyModule();
    if (legacyConfig) {
        return legacyConfig;
    }

    if (__DEV__) {
        console.warn(
            '[env] No react-native-config native module detected. Falling back to process.env/default values. Create a dev build to access native .env files.'
        );
    }

    return {};
};

const mergedConfig = Object.freeze({
    ...DEFAULT_CONFIG,
    ...readProcessEnv(),
    ...readNativeConfig(),
}) as AppConfig;

export const appConfig = mergedConfig;

export type { AppConfig };

export const getAppConfigValue = <K extends AppConfigKey>(key: K): AppConfig[K] => appConfig[key];
