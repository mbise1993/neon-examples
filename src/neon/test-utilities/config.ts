export interface NeonTestConfig {
  readonly mockFn: (...args: any) => any;
}

export let __config: NeonTestConfig;

export const setNeonTestConfig = (config: NeonTestConfig) => (__config = config);
