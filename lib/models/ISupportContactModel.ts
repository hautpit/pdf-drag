import { IPersonalProfileModel } from "./IPersonalProfileModel";

export interface ISupportContactModel {
  title: string;
  phoneNumber: string;
  personalProfileId: number;
  personalProfile: IPersonalProfileModel;
  personalProfileName?: string;
}
