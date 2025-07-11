export interface JwtPayload {
  sub: string; // user ID
  email: string;
  // .NET Identity role claim URI:
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?:
    | string
    | string[];
  // plus any other custom claims you emit…
}
