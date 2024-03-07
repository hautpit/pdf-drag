import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import pdf from "./pdf.pdf";
import { PdfDragBox, PdfDragBoxProps } from "../../lib/components/PdfDragBox";

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
          id: 1,
          image:
            "https://library.vntts.vn/api/PublicLibrary/ViewFile/d5n7td7u1n4rlvyukpo15zlsz1idyxxgs6k1owfo6hud98aw4m",
          title: "kyso@vntt.com.vn",
          text: "Chữ ký cá nhân",
          multiple: false,
          height: 20,
          width: 100,
          imageType: "fill",
          resizable: false,
        },
        {
          id: 2,
          image:
            "https://library.vntts.vn/api/PublicLibrary/ViewFile/d5n7td7u1n4rlvyukpo15zlsz1idyxxgs6k1owfo6hud98aw4m",
          title: "kyso@vntt.com.vn",
          text: "Chữ ký cá nhân 2222",
        },
      ]}
      pdf={pdf}
      onSubmit={(a) => {
        console.log(a);
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
    {
      page: 1,
      title: "sadsadsa",
      coordinates: [446, 463, 546, 483],
      image:
        "https://library.vntts.vn/api/PublicLibrary/ViewFile/d5n7td7u1n4rlvyukpo15zlsz1idyxxgs6k1owfo6hud98aw4m",
    },
  ],
};
