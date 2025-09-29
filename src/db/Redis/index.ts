// src/lib/RedisClient.ts
import { createClient, RedisClientType } from "redis";

interface RedisClientOptions {
  host?: string;
  port?: number;
  password?: string;
  prefix?: string;
  ttl?: number;
}

export class RedisClient {
  private client: RedisClientType;
  private connected: boolean = false;
  private prefix: string;
  private ttl: number;

  constructor(options: RedisClientOptions = {}) {
    this.prefix = options.prefix || "";
    this.ttl = options.ttl || 3600; // default 1 hour TTL

    this.client = createClient({
      socket: {
        host: options.host || process.env.REDIS_HOST || "localhost",
        port:
          options.port ??
          (process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379),
      },
      password: options.password || process.env.REDIS_PASSWORD,
    });

    this.client.on("error", (err) => console.error("Redis Client Error:", err));
  }

  private _key(key: string): string {
    return `${this.prefix}${key}`;
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
      console.log("Redis connected!");
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.connect();
    await this.client.set(this._key(key), JSON.stringify(value), {
      EX: ttl ?? this.ttl,
    });
  }

  async get<T = any>(key: string): Promise<T | null> {
    await this.connect();
    const value: string | null = (await this.client.get(this._key(key))) as
      | string
      | null;
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.connect();
    await this.client.del(this._key(key));
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
      console.log("Redis disconnected!");
    }
  }
}
