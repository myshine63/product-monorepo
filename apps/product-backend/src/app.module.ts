import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env: Record<string, unknown>) => {
        const port = Number(env.PORT ?? 3001);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new Error('PORT must be an integer between 1 and 65535');
        }
        return { ...env, PORT: port };
      },
    }),
  ],
})
export class AppModule {}
