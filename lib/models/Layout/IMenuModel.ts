import React from "react";

export interface IMenuModel extends IMenuChildModel {
  children?: IMenuChildModel[];
}

export interface IMenuChildModel {
  id?: string;
  title: string | React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode | string;
  url?: string;
  menuId?: string;
  count?: number;
  onClick?: () => void;
  isOutside?: boolean;
  isChild?: boolean;
}
