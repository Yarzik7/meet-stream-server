import { config } from 'dotenv';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RoomsModule } from './modules/rooms/rooms.module';

config();

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URI), AuthModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/logout', 'auth/current', 'rooms/create-room');
  }
}
