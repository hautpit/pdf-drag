import React, { useEffect, useRef } from "react";

export interface BoxStyle {
  height: string;
  width: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
}

type Edge = "top" | "right" | "bottom" | "left";

interface ResizableBoxProps {
  onResize: (boxStyle: BoxStyle) => void;
  height: number;
  width: number;
  disables?: Edge[];
  children?: React.ReactNode;
  data: any;
  resizable?: boolean;
  left: number;
  top: number;
  isActiveBox: boolean;
}

export const ResizableBox = (props: ResizableBoxProps) => {
  const {
    onResize,
    height,
    width,
    disables = [],
    children,
    data,
    resizable,
    left,
    top,
    isActiveBox,
  } = props;

  const refBox = useRef(null);

  const refTop = useRef<any>(null);
  const refRight = useRef<any>(null);
  const refBottom = useRef<any>(null);
  const refLeft = useRef<any>(null);

  const handleResize = (resizableElement: any) => {
    const { height, width, top, bottom, left, right } = resizableElement.style;
    onResize({ height, width, top, bottom, left, right });
  };

  useEffect(() => {
    const resizableElement: any = refBox.current;
    const styles = window?.getComputedStyle(resizableElement);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);

    let xCord = 0;
    let yCord = 0;

    // resizableElement.style.top = `${0}px`;
    // resizableElement.style.left = `${0}px`;

    // TOP
    const onMouseMoveTopResize = (e: MouseEvent) => {
      const dy = e.clientY - yCord;
      height = height - dy;
      yCord = e.clientY;

      resizableElement.style.height = `${height}px`;
      handleResize(resizableElement);
    };

    const onMouseUpTopResize = () => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (e: MouseEvent) => {
      yCord = e.clientY;
      const styles = window.getComputedStyle(resizableElement);
      resizableElement.style.bottom = styles.bottom;
      resizableElement.style.top = null;
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
      handleResize(resizableElement);
    };

    // Mouse down event listener
    const resizerTop = refTop.current;
    resizerTop.addEventListener("mousedown", onMouseDownTopResize);

    // RIGHT
    const onMouseMoveRightResize = (e: MouseEvent) => {
      const dx = e.clientX - xCord;
      width = width + dx;
      xCord = e.clientX;

      resizableElement.style.width = `${width}px`;
      handleResize(resizableElement);
    };

    const onMouseUpRightResize = () => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (e: MouseEvent) => {
      xCord = e.clientX;
      const styles = window.getComputedStyle(resizableElement);
      resizableElement.style.left = styles.left;
      resizableElement.style.right = null;
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
      handleResize(resizableElement);
    };

    // Mouse down event listener
    const resizerRight = refRight.current;
    resizerRight.addEventListener("mousedown", onMouseDownRightResize);

    // BOTTOM
    const onMouseMoveBottomResize = (e: MouseEvent) => {
      const dy = e.clientY - yCord;
      height = height + dy;
      yCord = e.clientY;

      resizableElement.style.height = `${height}px`;
      handleResize(resizableElement);
    };

    const onMouseUpBottomResize = () => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
    };

    const onMouseDownBottomResize = (e: MouseEvent) => {
      yCord = e.clientY;
      const styles = window.getComputedStyle(resizableElement);
      resizableElement.style.top = styles.top;
      resizableElement.style.bottom = null;
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
      handleResize(resizableElement);
    };

    // Mouse down event listener
    const resizerBottom = refBottom.current;
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);

    // LEFT
    const onMouseMoveLeftResize = (e: MouseEvent) => {
      const dx = e.clientX - xCord;
      width = width - dx;
      xCord = e.clientX;

      resizableElement.style.width = `${width}px`;
      handleResize(resizableElement);
    };

    const onMouseUpLeftResize = () => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (e: MouseEvent) => {
      xCord = e.clientX;
      const styles = window.getComputedStyle(resizableElement);
      resizableElement.style.right = styles.right;
      resizableElement.style.left = null;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
      handleResize(resizableElement);
    };

    // Mouse down event listener
    const resizerLeft = refLeft.current;
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    return () => {
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };

    // console.log(styles);
  }, [data]);

  const getClassNames = (...classNames: any) => {
    return classNames.filter((className: string) => className).join(" ");
  };

  return (
    <div
      ref={refBox}
      className={`resizable-box${isActiveBox ? " active-box" : ""}`}
      style={{ height, width, left, top }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* LEFT */}
      <div
        ref={refLeft}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={getClassNames(
          "resizer rl",
          (!resizable || disables.includes("left")) && "disabled"
        )}
      />
      {/* TOP */}
      <div
        ref={refTop}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={getClassNames(
          "resizer rt",
          (!resizable || disables.includes("top")) && "disabled"
        )}
      />
      {/* RIGHT */}
      <div
        ref={refRight}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={getClassNames(
          "resizer rr",
          (!resizable || disables.includes("right")) && "disabled"
        )}
      />

      {/* BOTTOM */}
      <div
        ref={refBottom}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={getClassNames(
          "resizer rb",
          (!resizable || disables.includes("bottom")) && "disabled"
        )}
      />
    </div>
  );
};
