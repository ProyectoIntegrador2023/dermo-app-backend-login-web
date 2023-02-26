import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthHelper } from './services/auth.helper';
import { AuthService } from './services/auth.service';
import { Login } from './login.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Inject(AuthService)
  private readonly service: AuthService;

  @Inject(AuthHelper)
  private readonly authHelper: AuthHelper;

  @Get('health')
  redirect(@Res() res) {
    return res.redirect('/health');
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<Login | never> {
    return this.service.register(body);
  }

  @Post('login')
  private login(@Body() body: LoginDto): Promise<any | never> {
    return this.service.login(body);
  }

  @Post('token/refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: Request): Promise<any | never> {
    this.logger.log('refresh user ', user);
    return this.service.refresh(<Login>user);
  }

  @Post('token/validate')
  @UseGuards(JwtAuthGuard)
  validToken(@Req() req) {
    return req.user;
  }
}
