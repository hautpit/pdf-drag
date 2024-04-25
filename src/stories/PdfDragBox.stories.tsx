import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import pdf from "./pdf.pdf";
import { PdfDragBox, PdfDragBoxProps } from "../../lib/components/PdfDragBox";
import { EditOutlined } from "../../lib/components/PdfDragBox/icons/EditOutlined";

const meta: Meta = {
  title: "PdfDragBox",
  component: PdfDragBox,
};

export default meta;
const Template: StoryFn<PdfDragBoxProps> = (args: PdfDragBoxProps) => {
  return (
    <PdfDragBox
      {...args}
      itemsTitle="Signatures"
      boxes={[
        {
          id: "https://workflow.vntts.vn/api/v2/System/DefaultSignature",
          image: "https://workflow.vntts.vn/api/v2/System/DefaultSignature",
          title: "kyso@vntt.com.vn",
          multiple: false,
          text: "Chữ ký mặc định của công ty",
          resizable: true,
        },
        {
          id: "https://library.vntts.vn/api/PublicLibrary/ViewFile/pcejziwbbi1o40cf4jk5nppisa2yybvi4thzo10p2t4nbw43fk",
          image:
            "https://library.vntts.vn/api/PublicLibrary/ViewFile/pcejziwbbi1o40cf4jk5nppisa2yybvi4thzo10p2t4nbw43fk",
          multiple: false,
          text: "Ký số cá nhân",
          resizable: true,
          width: 247,
          height: 12,
          imageType: "fill",
        },
      ]}
      pdf={pdf}
      onSubmit={(a) => {
        console.log(a);
      }}
      data={
        [
          // {
          //   id: "https://localhost:44356/api/v2/System/DefaultSignature",
          //   image: "https://localhost:44356/api/v2/System/DefaultSignature",
          //   page: 1,
          //   title: "ss",
          //   coordinates: [210, 629, 330, 689],
          //   resizable: true,
          // },
          // {
          //   id: "https://localhost:44356/api/personalProfiles/281/getSignatureSmartCAImageById",
          //   image:
          //     "https://localhost:44356/api/personalProfiles/281/getSignatureSmartCAImageById",
          //   page: 1,
          //   title: "duydd1@vntt.com.vn",
          //   coordinates: [245, 408, 365, 468],
          //   resizable: true,
          // },
          // {
          //   id: "https://library.vntts.vn/api/PublicLibrary/ViewFile/5in316ji5yn2bvfnkd4q4vofsqktycvaelh1n3kprvemtnku5g",
          //   image:
          //     "https://library.vntts.vn/api/PublicLibrary/ViewFile/5in316ji5yn2bvfnkd4q4vofsqktycvaelh1n3kprvemtnku5g",
          //   page: 2,
          //   title: "duydd1@vntt.com.vn",
          //   coordinates: [211, 511, 331, 571],
          //   resizable: true,
          // },
        ]
      }
      extraAction={{
        icon: <EditOutlined />,
        title: "Edit",
        onClick: (item) => {
          console.log(item);
          //
        },
      }}
    />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  submitButton: {
    text: "Submit",
  },
  data: [
    // {
    //   page: 1,
    //   title: "sadsadsa",
    //   coordinates: [446, 463, 546, 483],
    //   image:
    //     "https://library.vntts.vn/api/PublicLibrary/ViewFile/d5n7td7u1n4rlvyukpo15zlsz1idyxxgs6k1owfo6hud98aw4m",
    // },
  ],
};
