import type { CSSProperties, FC, ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { DragPreviewImage } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import { Colors } from "./Colors";
import { SourceBoxItem } from "./PdfDragBox.types";
import { DragOutlined } from "./icons";
import { MousePosition } from "./interfaces";
import { BOX_HEIGHT, BOX_WIDTH } from "./Box";

const style: CSSProperties = {
  border: "1px dashed gray",
  padding: 0,
  margin: "0.5rem",
};

export interface SourceBoxProps {
  color: string;
  title?: string;
  onToggleForbidDrag?: () => void;
  children?: ReactNode;
  item: SourceBoxItem;
  onMouseClick: (position: MousePosition) => void;
}

export const SourceBox: FC<SourceBoxProps> = memo(function SourceBox({
  color,
  title,
  children,
  item,
  onMouseClick,
}: SourceBoxProps) {
  const [forbidDrag, setForbidDrag] = useState(false);

  const previewOptions = {
    offsetX: 127,
    offsetY: 128,
  };

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: color,
      item,
      previewOptions,
      canDrag: !forbidDrag,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [forbidDrag, color, item, previewOptions]
  );

  const backgroundColor = useMemo(() => {
    switch (color) {
      case Colors.YELLOW:
        return "lightgoldenrodyellow";
      case Colors.BLUE:
        return "lightblue";
      default:
        return "lightgoldenrodyellow";
    }
  }, [color]);

  const containerStyle = useMemo(
    () => ({
      ...style,
      opacity: isDragging ? 0.4 : 1,
    }),
    [isDragging, forbidDrag, backgroundColor]
  );

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  // const img = new Image();
  // img.src = item.image ?? "";
  // preview(img, previewOptions);

  return (
    <div style={containerStyle} className="pdf-box-item">
      {/* <DragPreviewImage src={item.image ?? ""} connect={preview} /> */}
      <div
        id={`box-${item.id.toString()}`}
        className="flex flex-items-center pdf-box-image"
        style={{
          opacity: isDragging ? 0.4 : 1,
          position: "relative",
          cursor: "move",
          height: item.height ?? BOX_HEIGHT,
          // width: item.width ?? BOX_WIDTH,
        }}
        ref={drag}
        role="SourceBox"
        data-color={color}
        onMouseDown={(e) => {
          onMouseClick({ top: e.clientY, left: e.clientX });
        }}
      >
        {/* <div className="pdf-box-icon">
          <DragOutlined />
        </div> */}
        <div
          style={{
            position: "absolute",
            // height: "100%",
            // width: "100%",
          }}
          className="flex justify-center"
        >
          <img
            src={item.image}
            alt="signature"
            style={{
              height: item.height ?? BOX_HEIGHT,
              width: item.width ?? BOX_WIDTH,
              cursor: "move",
              // margin: 'auto',
            }}
          />
        </div>

        <small style={{ zIndex: 1 }}>{title}</small>
      </div>

      {children}
    </div>
  );
});
