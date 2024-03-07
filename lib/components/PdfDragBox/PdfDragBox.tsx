/* eslint-disable react/prop-types */
import { memo, useRef } from "react";
import { Colors } from "./Colors";
import { SourceBox } from "./SourceBox";
import { StatefulTargetBox as TargetBox, TargetBoxRef } from "./TargetBox";
import { DndProvider } from "react-dnd";
import { pdfjs } from "react-pdf";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdf.scss";
import { PdfDragBoxProps } from ".";
import { NotificationCircleOutlined } from "./icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfDragBox = memo(function Container(props: PdfDragBoxProps) {
  const {
    itemsTitle = "Items",
    boxes = [],
    pdf,
    onSubmit,
    submitButton,
    loading,
    data,
  } = props;

  const boxRef = useRef<TargetBoxRef>(null);

  const getBoxes = () => {
    const boxesData = boxRef?.current?.getBoxes();

    return boxesData ?? [];
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const boxesData = getBoxes();
      onSubmit(boxesData);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pdf-drag-box">
        {pdf ? (
          <div style={{ overflow: "hidden", clear: "both", margin: "-.5rem" }}>
            <div className="boxes-section">
              <div
                className="flex justify-space-between align-center flex-wrap"
                style={{ margin: "10px 0" }}
              >
                <div
                  className="text-center text-bold block"
                  style={{ padding: "5px 10px" }}
                >
                  {itemsTitle}
                </div>
              </div>

              {boxes.map((box) => (
                <SourceBox
                  key={box.id}
                  color={Colors.BLUE}
                  item={{
                    ...box,
                    resizable:
                      box.resizable !== undefined ? box.resizable : true,
                  }}
                >
                  <div style={{ fontSize: 12, textAlign: "center" }}>
                    <b>{box.title}</b>
                    <div>{box.text}</div>
                  </div>
                </SourceBox>
              ))}
            </div>
            <div className="pdf-drag-section">
              <TargetBox ref={boxRef} pdf={pdf} data={data} />
            </div>
            <div className="pdf-drag-actions">
              <div className="pdf-drag-extra">{props.extra}</div>
              <button
                className="pdf-drag-submit-btn"
                onClick={handleSubmit}
                style={submitButton?.style}
                disabled={loading}
              >
                {loading && (
                  <div className="pdf-drag-submit-btn__icon">
                    <NotificationCircleOutlined className="btn-loading" />
                  </div>
                )}
                {submitButton?.text ?? "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <h1>
            <b>Where is the pdf ? ! ? ! ? ! ? </b>
          </h1>
        )}
      </div>
    </DndProvider>
  );
});

export default PdfDragBox;