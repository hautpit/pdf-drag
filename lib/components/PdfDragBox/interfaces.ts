import { BoxModel, PdfDragBoxData } from "./PdfDragBox.types";

export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}
export const ItemTypes = {
  BOX: "box",
};

export interface ExtraAction {
  onClick: (boxData: BoxModel, boxes: PdfDragBoxData[]) => void;
  icon: React.ReactNode;
  title?: string;
}

export interface MousePosition {
  top: number;
  left: number;
}
