import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

config();

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URI), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
