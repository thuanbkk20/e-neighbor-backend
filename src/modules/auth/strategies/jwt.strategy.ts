import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { LessorService } from './../../lessor/services/lessor.service';
import { UserService } from './../../user/services/user.service';

import { ROLE } from '@/constants';
import { Unauthorized } from '@/exceptions/unauthorized.exception';
import { AdminService } from '@/modules/admin/services/admin.service';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt' as const) {
  constructor(
    private apiConfigService: ApiConfigService,
    private adminService: AdminService,
    private userService: UserService,
    private lessorService: LessorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.accessTokenPrivateKey,
    });
  }

  async validate(payload) {
    const role = payload.role;

    if (!role) {
      throw new Unauthorized('Invalid role');
    }
    try {
      let authUser: any;
      switch (payload.role) {
        case ROLE.ADMIN:
          authUser = await this.adminService.findOneById(payload.id);
          delete authUser.password; // Remove the 'password' field
          break;
        case ROLE.LESSOR:
          authUser = await this.lessorService.findOneById(payload.id);
          delete authUser.user.password; // Remove the 'password' field
          break;
        default:
          authUser = await this.userService.findOneById(payload.id);
          delete authUser.password; // Remove the 'password' field
      }
      return { ...authUser, role };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
