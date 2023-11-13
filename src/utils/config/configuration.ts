import * as process from "process";

export type Config = {
  PORT: number,
  JWT_SECRET: string,
  JWT_REFRESH_TOKEN_KEY: string,
}

export default (): Config => ({
  PORT: parseInt(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY
})