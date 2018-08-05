// user flow
import { concatMap } from 'rxjs/operators';
import { login } from '../sources/user';

// user login flow
export function userLoginFlow(input) {
  return input.pipe(
    concatMap(login)
  );
}