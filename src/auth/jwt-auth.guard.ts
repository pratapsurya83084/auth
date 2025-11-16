import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';











@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    // Check blacklist
    if (token && !(await this.authService.isTokenValid(token))) {
      throw new UnauthorizedException('Token revoked. Please login again.');
    }

    // Run default JWT validation
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}




// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {


//  constructor(private authService: AuthService) {
//     super();
//   }

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.split(' ')[1];

// if (!await this.authService.isTokenValid(token)) {
//   throw new UnauthorizedException('Token revoked. Please login again.');
// }


//     // Run default JWT guard
//     const result = (await super.canActivate(context)) as boolean;
//     return result;
//   }

// }
