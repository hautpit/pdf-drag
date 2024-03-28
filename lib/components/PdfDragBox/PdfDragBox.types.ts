import { ExtraAction } from "./interfaces";

type ImageType = "contain" | "cover" | "fill" | "none" | "scale-down";

interface BoxItem {
  id: React.Key;
  image?: string;
  title?: string;
  text?: string;
  multiple?: boolean;
  width?: number;
  height?: number;
  imageType?: ImageType;
  resizable?: boolean;
}

interface SourceBoxItem {
  id: React.Key;
  title?: string;
  image?: string;
  multiple?: boolean;
  width?: number;
  height?: number;
  imageType?: ImageType;
  resizable?: boolean;
}

export interface PdfDragBoxData {
  id: React.Key;
  position?: Position;
  coordinates?: number[];
  page: number;
  image: string;
  title: string;
}

interface ErrorType {
  code: number;
  text: string;
}

export interface PdfDragBoxProps {
  itemsTitle: string;
  boxes: BoxItem[];
  pdf: string;
  data?: PdfDragBoxData[];
  onSubmit?: (data: ContainerBoxItem[]) => void;
  submitButton?: {
    text?: string;
    style?: React.CSSProperties;
  };
  loading?: boolean;
  extra?: React.ReactNode;
  extraAction?: ExtraAction;
  onError?: (errs: ErrorType[]) => void;
}

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface HandleBox {
  id: any;
  position: Position;
  page: number;
  image?: string;
}

interface BoxModel {
  id: React.Key;
  top: number;
  left: number;
  title?: string;
  width: number;
  height: number;
  image?: string;
  imageType?: ImageType;
  page: number;
  resizable?: boolean;
}

interface ContainerBoxItem {
  coordinates: number[];
  page: number;
  image?: string;
  id: React.Key;
  position: Position;
}

export type {
  ContainerBoxItem,
  BoxItem,
  SourceBoxItem,
  ImageType,
  Position,
  HandleBox,
  BoxModel,
};
