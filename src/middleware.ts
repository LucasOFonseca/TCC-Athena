import { EmployeeRole } from '@athena-types/employee';
import { getAuthorizedRoutesByRoles } from '@helpers/utils/getAuthorizedRoutesByRoles';
import decode from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/panel/:path*',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('alohomora');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { roles } = decode(accessToken.value) as { roles: EmployeeRole[] };

  const authorizedRoutes = getAuthorizedRoutesByRoles(roles);

  if (
    !authorizedRoutes.some((route) => route.includes(pathname.split('/')[1]))
  ) {
    const res = NextResponse.redirect(new URL('/panel', req.url));

    return res;
  }

  return NextResponse.next();
}
