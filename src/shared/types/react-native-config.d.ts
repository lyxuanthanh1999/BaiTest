declare module 'react-native-config' {
    export interface BaseAppConfig {
        APP_FLAVOR: 'development' | 'staging' | 'production';
        VERSION_CODE: string;
        VERSION_NAME: string;
        API_URL: string;
        APP_NAME: string;
    }

    export type NativeConfig = BaseAppConfig & Record<string, string>;
    export type AppConfig = NativeConfig;
    export type AppConfigKey = keyof BaseAppConfig;

    const Config: NativeConfig;
    export default Config;
}
