import { useState } from "react";

export const ResizableDiv = () => {
  const [initialTop, setInitialTop] = useState<number>(0);
  const [initialLeft, setInitialLeft] = useState<number>(0);
  const [initialWidth, setInitialWidth] = useState<number>(0);
  const [initialHeight, setInitialHeight] = useState<number>(0);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  const initial = (e: any) => {
    const resizable: any = document.getElementById("Resizable");

    setInitialLeft(e.clientX);
    setInitialTop(e.clientY);
    setInitialWidth(resizable.offsetWidth);
    setInitialHeight(resizable.offsetHeight);
  };

  const resizeRight = (e: any) => {
    setWidth(initialWidth + (e.clientX - initialLeft));
  };

  const resizeBottom = (e: any) => {
    setHeight(initialHeight + (e.clientY - initialTop));
  };

  return (
    <div style={{ padding: 30 }}>
      <div className="wrapper">.resizable-box</div>
      <div
        className="resize-bottom"
        id="Draggable"
        draggable="true"
        onDragStart={initial}
        onDrag={resizeBottom}
      />
    </div>
  );
};
