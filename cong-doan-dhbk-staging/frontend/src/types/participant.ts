import { Faculty } from './faculty';
import { UnionDepartment } from './unionDepartment';
import { Children } from './children';
import { Gender } from './gender';
import { WorkingStatus } from './workingStatus';

export interface Participant {
  id: string;
  familyName: string;
  givenName: string;
  email: string;
  phone: string;
  sID: string;
  dob: string;
  faculty?: Faculty;
  facultyId?: string;
  gender?: Gender;
  isUnionMember: boolean;
  uID?: string;
  workingStatus?: WorkingStatus;
  unionDept?: UnionDepartment;
  unionDeptId?: string;
  unionJoinDate?: string;
  numOfChildren: number;
  childs?: Children[];
  updatedAt?: string;
}
