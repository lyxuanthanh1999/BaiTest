declare module 'react-native-config' {
    export interface BaseAppConfig {
        APP_FLAVOR: 'development' | 'staging' | 'production';
        VERSION_CODE: string;
        VERSION_NAME: string;
        API_URL: string;
        APP_NAME: string;
        SUPABASE_URL: string;
        SUPABASE_ANON_KEY: string;
        SUPABASE_SERVICE_ROLE_KEY: string;
    }

    export type NativeConfig = BaseAppConfig & Record<string, string>;
    export type AppConfig = NativeConfig;
    export type AppConfigKey = keyof BaseAppConfig;

    const Config: NativeConfig;
    export default Config;
}
