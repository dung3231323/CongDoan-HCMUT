import { Gender } from './gender';

export interface Children {
  familyName: string;
  givenName: string;
  dob: string;
  gender?: Gender;
}
