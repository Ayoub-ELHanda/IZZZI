import { Controller, Post, Body, UseGuards, Get, Req, Res, Delete } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterInvitedDto } from './dto/register-guest.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register/admin')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterAdminDto })
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('register/invited')
  @ApiOperation({ summary: 'Register an invited user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid invitation token' })
  @ApiBody({ type: RegisterInvitedDto })
  async registerInvited(@Body() dto: RegisterInvitedDto) {
    return this.authService.registerInvited(dto);
  }

  @Get('invite/:token')
  @ApiOperation({ summary: 'Get invitation information' })
  @ApiResponse({ status: 200, description: 'Invitation information retrieved' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async getInvitationInfo(@Req() req) {
    const token = req.params.token;
    return this.authService.getInvitationInfo(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Invite a new user' })
  @ApiResponse({ status: 201, description: 'User invited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: InviteUserDto })
  async inviteUser(@Req() req, @Body() dto: InviteUserDto) {
    return this.authService.inviteUser(req.user.userId, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'jwt-token', user: {} } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return this.authService.validateUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  async deleteAccount(@Req() req) {
    return this.authService.deleteAccount(req.user.userId);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
 
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    
      res.redirect(`${frontendUrl}/auth/google/callback?token=${result.token}`);
    } catch (error) {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(error.message)}`);
    }
  }
}
