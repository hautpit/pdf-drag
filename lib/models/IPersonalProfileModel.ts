export interface IPersonalProfileModel {
  accountId?: string;
  accountName?: string;
  name?: string;
  fullName?: string;
  departmentId?: number;
  departmentTitle?: string;
  managerId?: number | null;
  positionId?: number | null;
  positionTitle?: string;
  gender?: boolean;
  birthDay?: Date | null;
  address?: string;
  staffId?: string;
  dateOfHire?: Date | null;
  mobile?: string;
  email?: string;
  imagePath?: string;
  imageId?: number | null;
  signatureUserName?: string;
  signaturePassword?: string;
  signatureTitle?: string;
  signatureEmail?: string;
  enableSignature?: boolean;
  userStatus?: number | null;
  userLevel?: number | null;
  userPosition?: number | null;
}
