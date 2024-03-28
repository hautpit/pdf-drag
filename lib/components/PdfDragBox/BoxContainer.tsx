import update from "immutability-helper";
import type { CSSProperties, FC, Ref } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { XYCoord } from "react-dnd";
import { useDrop } from "react-dnd";
import { BOX_HEIGHT, BOX_WIDTH, Box } from "./Box";
import type { DragItem, ExtraAction } from "./interfaces";
import { ItemTypes } from "./interfaces";
import { Document, Page } from "react-pdf";
import { useDevice } from "../../hooks";
import ReactPaginate from "react-paginate";

import {
  BoxModel,
  ContainerBoxItem,
  HandleBox,
  ImageType,
  Position,
} from "./PdfDragBox.types";

const styles: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};

export interface ContainerProps {
  pdf: string;
  hideSourceOnDrag: boolean;
  boxes: BoxModel[];
  pageNumber: number;
  numPages: number;
  pageHeight: number;
  pageWidth: number;
  onChange: (data: BoxModel[]) => void;
  onChangePage: (page: number) => void;
  onChangeNumPages: (numPages: number) => void;
  extraAction?: ExtraAction;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } };
}

export interface BoxContainerRef {
  getBoxes: () => ContainerBoxItem[];
  fromCoordinatesToPosition: (
    llx: number,
    lly: number,
    urx: number,
    ury: number
  ) => Position;
}

const BOX_SIZE_JUMP = 1;
const BOX_MOVE_JUMP = 1;

const DEFAULT_PG_HEIGHT = 802;
const DEFAULT_PG_WIDTH = 612;

const Container = (
  {
    pdf,
    hideSourceOnDrag,
    boxes = [],
    onChange,
    pageNumber,
    numPages,
    onChangePage,
    onChangeNumPages,
    pageHeight,
    pageWidth,
    extraAction,
  }: ContainerProps,
  ref: Ref<BoxContainerRef>
) => {
  const { os } = useDevice();

  const [movingKey, setMovingKey] = useState<any>();

  useImperativeHandle(
    ref,
    () => {
      return {
        getBoxes: () => {
          return getBoxes();
        },
        fromCoordinatesToPosition: fromCoordinatesToPosition,
      };
    },
    [boxes, pageHeight]
  );

  const handleDocumentLoadSuccess = async ({
    numPages: numPagesT,
  }: {
    numPages: number;
  }) => {
    onChangeNumPages(numPagesT);
  };

  const moveBox = useCallback(
    (id: React.Key, left: number, top: number) => {
      const newBoxes = [...boxes];
      const newBox = newBoxes.find((boxItem) => boxItem.id === id);

      if (newBox) {
        newBox.left = left;
        newBox.top = top;
      }

      setMovingKey(id);
      onChange(newBoxes);
    },
    [onChange, boxes]
  );

  const handleChangeBoxSize = useCallback(
    (id: React.Key, width: number, height: number) => {
      const newBoxes = [...boxes];

      const newBox = newBoxes.find((boxItem) => boxItem.id === id);
      if (newBox) {
        newBox.height = height;
        newBox.width = width;
      }
      setMovingKey(id);
      onChange(newBoxes);
    },
    [onChange, JSON.stringify(boxes)]
  );

  function handleKeyDown(e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (movingKey) {
      const movingBox = [...boxes].find(
        (e) => e.id.toString() === movingKey.toString()
      );
      if (movingBox) {
        // RESIZE BOX
        if (e.shiftKey && movingBox.resizable) {
          const boxWidth = !isNaN(movingBox.width)
            ? movingBox.width
            : BOX_WIDTH;
          const boxHeight = !isNaN(movingBox.height)
            ? movingBox.height
            : BOX_HEIGHT;
          switch (e.code) {
            case "ArrowLeft":
              handleChangeBoxSize(
                movingKey,
                boxWidth - BOX_SIZE_JUMP,
                boxHeight
              );
              break;
            case "ArrowUp":
              handleChangeBoxSize(
                movingKey,
                boxWidth,
                boxHeight - BOX_SIZE_JUMP
              );
              break;
            case "ArrowRight":
              handleChangeBoxSize(
                movingKey,
                boxWidth + BOX_SIZE_JUMP,
                boxHeight
              );
              break;
            case "ArrowDown":
              handleChangeBoxSize(
                movingKey,
                boxWidth,
                boxHeight + BOX_SIZE_JUMP
              );
              break;
            default:
              break;
          }
        } else {
          // MOVE BOX
          switch (e.code) {
            case "ArrowLeft":
              moveBox(movingKey, movingBox.left - BOX_MOVE_JUMP, movingBox.top);
              break;
            case "ArrowUp":
              moveBox(movingKey, movingBox.left, movingBox.top - BOX_MOVE_JUMP);
              break;
            case "ArrowRight":
              moveBox(movingKey, movingBox.left + BOX_MOVE_JUMP, movingBox.top);
              break;
            case "ArrowDown":
              moveBox(movingKey, movingBox.left, movingBox.top + BOX_MOVE_JUMP);
              break;
            default:
              break;
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [boxes, movingKey]);

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(
          item.left + delta.x + (os === "Safari" ? 0 : 10)
        );
        const top = Math.round(item.top + delta.y + (os === "Safari" ? 0 : 16));
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  const handleDeleteBox = (id: React.Key) => {
    const newBoxes = boxes.filter((boxItem) => boxItem.id !== id);
    onChange(newBoxes);
  };

  const fromCoordinatesToPosition = useCallback(
    (llx: number, lly: number, urx: number, ury: number) => {
      const top = pageHeight - ury;
      const left = llx;
      const height = ury - lly;
      const width = urx - llx;
      return { top, left, height, width };
    },
    [pageHeight]
  );

  const fromPositionToCoordinates = (
    top: number,
    left: number,
    height: number,
    width: number
  ) => {
    const boxHeight = height !== undefined ? height : BOX_HEIGHT;
    const boxWidth = width !== undefined ? width : BOX_WIDTH;
    // Upper Right Y
    const ury = pageHeight - top;
    // Lower Left X
    const llx = left;
    // Lower Left Y
    const lly = ury - boxHeight;
    // Upper Right X
    const urx = llx + boxWidth;

    return [llx, lly, urx, ury];
  };

  const getBoxes = () => {
    const newBoxesList: ContainerBoxItem[] = [];

    boxes.forEach((box) => {
      // Calculate coordinates
      const top = box.top;
      const left = box.left;
      const boxHeight = box.height;
      const boxWidth = box.width;

      const coordinates = fromPositionToCoordinates(
        top,
        left,
        boxHeight,
        boxWidth
      );

      const newBox: ContainerBoxItem = {
        id: box.id,
        page: box.page,
        coordinates,
        image: box.image,
        position: {
          top,
          left,
          height: boxHeight,
          width: boxWidth,
        },
      };
      newBoxesList.push(newBox);
    });
    return newBoxesList;
  };

  const handleBox = (handleBox: HandleBox) => {
    // const boxesListT = [...boxesList];
    // const boxItem: any = boxesListT.find((b) => b.id === box.id);
    // Calculate coordinates
    const top = handleBox.position.top;
    const left = handleBox.position.left;
    const boxHeight = handleBox.position.height;
    const boxWidth = handleBox.position.width;

    const newBoxes: BoxModel[] = [...boxes];
    let box: BoxModel | undefined = newBoxes.find(
      (boxItem) => boxItem.id === handleBox.id
    );

    if (box) {
      box = {
        ...box,
        height: boxHeight,
        width: boxWidth,
        top,
        left,
        page: box.page,
        title: box.title,
        image: box.image,
      };
    } else {
      const newBox: BoxModel = {
        id: handleBox.id,
        height: boxHeight,
        width: boxWidth,
        top,
        left,
        page: handleBox.page,
        title: "",
        image: handleBox.image,
      };
      newBoxes.push(newBox);
    }

    onChange(newBoxes);
    setMovingKey(handleBox.id);
  };

  const renderBoxes = useCallback(() => {
    const boxesInPage = boxes.filter((box) => box.page === pageNumber);

    return boxesInPage.map((box) => {
      const {
        left,
        top,
        title,
        width: boxWidth,
        height: boxHeight,
        image,
        page,
      } = box;

      return (
        <Box
          key={box.id}
          id={box.id}
          data={boxes}
          left={left}
          top={top}
          hideSourceOnDrag={hideSourceOnDrag}
          onChangeBoxSize={(width, height) => {
            handleChangeBoxSize(box.id, width, height);
          }}
          onDelete={(id) => handleDeleteBox(id)}
          onHandleBox={handleBox}
          pageHeight={pageHeight}
          pageWidth={pageWidth}
          boxWidth={boxWidth}
          boxHeight={boxHeight}
          page={page}
          image={image}
          activeKey={movingKey}
          imageType={box.imageType}
          resizable={box.resizable}
          extraAction={extraAction}
        >
          {title}
        </Box>
      );
    });
  }, [
    JSON.stringify(boxes),
    hideSourceOnDrag,
    pageHeight,
    pageWidth,
    movingKey,
    pageNumber,
  ]);

  return (
    <div>
      <div
        ref={drop}
        style={{ ...styles, height: "fit-content", width: pageWidth + 4 }}
      >
        <Document
          file={pdf}
          onLoadSuccess={(doc) => {
            handleDocumentLoadSuccess(doc);
          }}
          onLoadError={(e) => console.log(e)}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        {renderBoxes()}
      </div>
      {/* <Pagination
        current={pageNumber}
        total={numPages}
        pageSize={1}
        onChange={(page: number) => onChangePage(page)}
        className="pdf-pagination"
      /> */}

      <ReactPaginate
        // breakLabel={<MoreOutlined />}
        // nextLabel={<ArrowRight1Outlined />}
        onPageChange={(item) => {
          onChangePage(item.selected + 1);
        }}
        pageRangeDisplayed={5}
        pageCount={numPages}
        // previousLabel={<ArrowLeftOutlined />}
        renderOnZeroPageCount={null}
        className="pagination"
      />
    </div>
  );
};

export const BoxContainer = forwardRef(Container);
