import type { CSSProperties, Ref } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";
import { Colors } from "./Colors";
import type { DragItem } from "./interfaces";
import { BoxContainer, BoxContainerRef } from "./BoxContainer";
import { BOX_HEIGHT, BOX_WIDTH } from "./Box";
import { useDevice } from "../../hooks";
import {
  BoxModel,
  ContainerBoxItem,
  PdfDragBoxData,
  Position,
  SourceBoxItem,
} from "./PdfDragBox.types";

const style: CSSProperties = {
  position: "relative",
};

export interface Offset {
  x: number;
  y: number;
}

export interface TargetBoxProps {
  onDrop: (item: any, offset: Offset, offset2: any) => void;
  boxes: BoxModel[];
  offset?: Offset;
  onChange: (boxes: BoxModel[]) => void;
  page: number;
  numPages: number;
  onChangePage: (page: number) => void;
  onChangeNumPages: (numPages: number) => void;
  hideSourceOnDrag?: boolean;
  pdf: string;
  pageHeight: number;
  pageWidth: number;
}

export interface TargetBoxRef {
  getBoxes: () => ContainerBoxItem[];
}

const TargetBoxComponent = (
  {
    onDrop,
    boxes,
    offset,
    page,
    numPages,
    onChange,
    onChangePage,
    onChangeNumPages,
    hideSourceOnDrag = true,
    pdf,
    pageHeight,
    pageWidth,
  }: TargetBoxProps,
  ref: Ref<BoxContainerRef>
) => {
  const boxRef = useRef<BoxContainerRef>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        getBoxes: () => {
          return boxRef?.current?.getBoxes() ?? [];
        },
        fromCoordinatesToPosition: (
          llx: number,
          lly: number,
          urx: number,
          ury: number
        ) => {
          return boxRef!.current!.fromCoordinatesToPosition(llx, lly, urx, ury);
        },
      };
    },
    []
  );

  const [{ isOver, draggingColor, canDrop }, drop] = useDrop(
    () => ({
      accept: [Colors.YELLOW, Colors.BLUE],
      drop(_item: DragItem, monitor) {
        onDrop(_item, monitor.getClientOffset() as any, offset);
        return undefined;
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          draggingColor: monitor.getItemType() as string,
        };
      },
    }),
    [onDrop]
  );

  const opacity = isOver ? 1 : 0.7;
  let backgroundColor = "#fff";
  switch (draggingColor) {
    case Colors.BLUE:
      backgroundColor = "lightblue";
      break;
    case Colors.YELLOW:
      backgroundColor = "lightgoldenrodyellow";
      break;
    default:
      break;
  }

  return (
    <div
      ref={drop}
      data-color={"blue"}
      style={{ ...style, backgroundColor, opacity }}
      role="TargetBoxComponent"
    >
      {/* <Document file={a} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document> */}

      <BoxContainer
        pdf={pdf}
        ref={boxRef}
        hideSourceOnDrag={hideSourceOnDrag}
        boxes={boxes}
        pageNumber={page}
        numPages={numPages}
        onChange={onChange}
        onChangePage={onChangePage}
        onChangeNumPages={onChangeNumPages}
        pageHeight={pageHeight}
        pageWidth={pageWidth}
      />

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: offset?.y,
          left: offset?.x,
          border: "1px dashed gray",
          width: "100%",
          height: 160,
          background: "#fff",
          display: "none",
        }}
      >
        {/* {!canDrop && lastDroppedColor && (
          <b
            style={{
              color: 'red',
            }}
          >
            Last dropped: {lastDroppedColor}
          </b>
        )} */}
      </div>
      {/* <p>Drop here.</p>

      */}
    </div>
  );
};

const TargetBox = forwardRef(TargetBoxComponent);

export interface StatefulTargetBoxState {
  pdf: string;
  isMultiple?: boolean;
  data?: PdfDragBoxData[];
}

const StatefulTargetBoxComponent = (
  props: StatefulTargetBoxState,
  ref: Ref<TargetBoxRef>
) => {
  const boxRef = useRef<BoxContainerRef>(null);
  const { os } = useDevice();

  const { data = [] } = props;

  // States
  const [offset, setOffset] = useState<Offset>();
  const [boxes, setBoxes] = useState<BoxModel[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const handleBoxes = () => {
    const newBoxes: BoxModel[] = [];
    data.forEach((item, index) => {
      let position: Position | undefined;
      if (item.position) {
        position = item.position;
      } else if (item.coordinates) {
        const [llx, lly, urx, ury] = item.coordinates;
        const boxPosition = boxRef.current?.fromCoordinatesToPosition(
          llx,
          lly,
          urx,
          ury
        );

        position = boxPosition;
      }

      if (position) {
        const { top, left, width, height } = position;
        const newBox: BoxModel = {
          id: new Date().getMilliseconds() + index,
          image: item.image,
          page: item.page,
          top,
          left,
          width,
          height,
        };
        newBoxes.push(newBox);
      }
    });

    setBoxes(newBoxes);
  };

  useEffect(() => {
    if (data.length > 0 && pageHeight > 0 && pageWidth > 0) {
      handleBoxes();
    }
  }, [JSON.stringify(data), pageHeight, pageWidth]);

  useImperativeHandle(
    ref,
    () => ({
      getBoxes: () => {
        return boxRef?.current?.getBoxes() ?? [];
      },
    }),
    []
  );

  const handleDrop = useCallback(
    (item: SourceBoxItem, offsetT: Offset) => {
      const { multiple = true } = item;
      const newBoxes = [...boxes];
      const pdfDoc = document.querySelector(".react-pdf__Document");
      if (pdfDoc) {
        const elementPosition = pdfDoc.getBoundingClientRect();

        const box = newBoxes.find((boxItem) => boxItem.id === item.id);
        const left = offsetT.x - elementPosition.x - (os === "Safari" ? 4 : 0);
        const top = offsetT.y - elementPosition.y + (os === "Safari" ? 6 : 0);

        if (multiple || !box) {
          const newBox: BoxModel = {
            id: multiple ? new Date().getMilliseconds() : item.id,
            left: Math.round(left),
            top: Math.round(top),
            title: item.title,
            image: item.image,
            page: pageNumber,
            imageType: item.imageType ?? "contain",
            resizable: item.resizable,
            width: item.width ?? BOX_WIDTH,
            height: item.height ?? BOX_HEIGHT,
          };
          newBoxes.push(newBox);
        } else {
          box.left = Math.round(left);
          box.top = Math.round(top);
          box.width = item.width ?? box.width;
          box.height = item.height ?? box.height;
        }

        setBoxes(newBoxes);
      }
    },
    [boxes, setBoxes, pageNumber]
  );

  const handleChange = (boxList: BoxModel[]) => {
    setBoxes(boxList);
  };

  const handleChangePage = (page: number) => {
    setPageNumber(page);
  };

  const handleChangeNumPages = (num: number) => {
    setNumPages(num);
  };

  useEffect(() => {
    if (numPages > 0) {
      checkHeight(0);
    }
  }, [numPages]);

  const checkHeight = (times: number) => {
    if (times === 5) {
      return;
    }
    const pdfCanvas = document.querySelector(".react-pdf__Page__canvas");
    if (pdfCanvas) {
      setPageHeight(pdfCanvas.clientHeight);
      setPageWidth(pdfCanvas.clientWidth);
    } else {
      setTimeout(() => {
        checkHeight(times + 1);
      }, 2000);
    }
  };

  return (
    <div>
      <TargetBox
        pdf={props.pdf}
        ref={boxRef}
        boxes={boxes}
        offset={offset}
        page={pageNumber}
        numPages={numPages}
        onDrop={handleDrop}
        onChange={handleChange}
        onChangePage={handleChangePage}
        onChangeNumPages={handleChangeNumPages}
        pageHeight={pageHeight}
        pageWidth={pageWidth}
      />
    </div>
  );
};

export const StatefulTargetBox = forwardRef(StatefulTargetBoxComponent);
