import { type CSSProperties, type FC, type ReactNode, useEffect } from "react";
import { useDrag } from "react-dnd";
import { BoxStyle, ResizableBox } from "./ResizableBox";
import { ItemTypes } from "./interfaces";
import { HandleBox, ImageType } from "./PdfDragBox.types";
import { TrashOutlined } from "./icons";

export const BOX_HEIGHT = 60;
export const BOX_WIDTH = 120;

const style: CSSProperties = {
  position: "absolute",
  border: "1px dashed gray",
  backgroundColor: "transparent",
  cursor: "move",
};

export interface BoxProps {
  id: React.Key;
  left: number;
  top: number;
  hideSourceOnDrag?: boolean;
  children?: ReactNode;
  onChangeBoxSize?: (width: number, height: number) => void;
  onDelete?: (id: any) => void;
  onHandleBox: (handleBox: HandleBox) => void;
  pageHeight: number;
  pageWidth: number;
  boxHeight: number;
  boxWidth: number;
  page: number;
  image?: string;
  imageType?: ImageType;
  activeKey: any;
  data: any;
  resizable?: boolean;
}

export const Box: FC<BoxProps> = ({
  id,
  left,
  top,
  data,
  hideSourceOnDrag,
  onChangeBoxSize,
  onDelete,
  onHandleBox,
  pageHeight,
  pageWidth,
  boxHeight = BOX_HEIGHT,
  boxWidth = BOX_WIDTH,
  page,
  image,
  imageType,
  resizable,
  activeKey,
}) => {
  useEffect(() => {
    handleBox();
  }, [boxHeight, boxWidth, top, left, pageHeight, pageWidth, page, image]);

  const handleBox = () => {
    onHandleBox({
      id,
      image,
      page,
      position: {
        left,
        top,
        width: boxWidth,
        height: boxHeight,
      },
    });
  };

  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: ItemTypes.BOX,
      item: { id, left: left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    };
  }, [id, left, top]);

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  const handleResize = (boxStyle: BoxStyle) => {
    handleChangeBoxSize(boxStyle.width, boxStyle.height);
  };

  const handleChangeBoxSize = (width: string, height: string) => {
    if (onChangeBoxSize) {
      onChangeBoxSize(
        Number(width.replace("px", "")),
        Number(height.replace("px", ""))
      );
    }
  };
  return (
    <div
      className={`drag-box${
        id.toString() === activeKey?.toString() ? " active-box" : ""
      }`}
      ref={drag}
      style={{
        ...style,
        left,
        top,
        height: boxHeight,
        width: boxWidth,
        userSelect: "none",
      }}
      data-testid="box"
      onClick={() => handleBox()}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          userSelect: "none",
        }}
        className="block flex justify-center"
      >
        <img
          alt="signature"
          src={image}
          style={{
            height: "100%",
            width: "100%",
            objectFit: imageType ?? "contain",
            userSelect: "none",
          }}
        />
      </div>
      <div className="wrapper">
        <ResizableBox
          onResize={handleResize}
          height={boxHeight}
          width={boxWidth}
          disables={["top", "left"]}
          data={data}
          resizable={resizable}
        />
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onDelete) {
            onDelete(id);
          }
        }}
      >
        <TrashOutlined className="drag-remove-btn" />
      </div>
    </div>
  );
};
