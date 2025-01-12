import useUserRole from './use-user-role';

const role = useUserRole();
export const hasPermission =
  role === 'ADMIN' || role === 'DEVELOPER' ? true : false;
