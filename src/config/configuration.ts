export interface Configuration {
  env: string;
  port: number;
  api: {
    baseUrl: string;
  };
  database: {
    url: string;
  };
  encryption: {
    secret: string;
    IV: string;
  };
  isTest(): boolean;
  isDev(): boolean;
}

export default (): Configuration => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 2001,
  api: {
    baseUrl: process.env.API_URL,
  },
  database: {
    url: process.env.DATABASE_HOST,
  },
  encryption: {
    secret: process.env.ENCRYPTION_SECRET,
    IV: process.env.ENCRYPTION_IV,
  },
  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  },
  isDev(): boolean {
    const env = process.env.NODE_ENV;
    const envs = ['development', 'test', 'localhost', 'local'];
    return !env || envs.includes(env);
  },
});
