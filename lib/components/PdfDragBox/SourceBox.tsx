import type { CSSProperties, FC, ReactNode } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import { Colors } from "./Colors";
import { SourceBoxItem } from "./PdfDragBox.types";
import { DragOutlined } from "./icons";

const style: CSSProperties = {
  border: "1px dashed gray",
  padding: "0.5rem",
  margin: "0.5rem",
};

export interface SourceBoxProps {
  color: string;
  title?: string;
  onToggleForbidDrag?: () => void;
  children?: ReactNode;
  item: SourceBoxItem;
}

export const SourceBox: FC<SourceBoxProps> = memo(function SourceBox({
  color,
  title,
  children,
  item,
}: SourceBoxProps) {
  const [forbidDrag, setForbidDrag] = useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: color,
      item,
      canDrag: !forbidDrag,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [forbidDrag, color]
  );

  const onToggleForbidDrag = useCallback(() => {
    setForbidDrag(!forbidDrag);
  }, [forbidDrag, setForbidDrag]);

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

  return (
    <div style={containerStyle} className="pdf-box-item">
      <div
        className="flex flex-items-center pdf-box-image"
        style={{
          opacity: isDragging ? 0.4 : 1,
          position: "relative",
          cursor: "move",
        }}
        ref={drag}
        role="SourceBox"
        data-color={color}
      >
        <div className="pdf-box-icon">
          <DragOutlined />
        </div>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
          className="flex justify-center"
        >
          <img
            src={item.image}
            alt="signature"
            style={{
              height: "100%",
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
