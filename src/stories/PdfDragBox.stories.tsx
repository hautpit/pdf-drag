import React, { useRef, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import pdf from "./pdf.pdf";
import {
  ContainerBoxItem,
  PdfDragBox,
  PdfDragBoxData,
  PdfDragBoxProps,
} from "../../lib/components/PdfDragBox";
import { EditOutlined } from "../../lib/components/PdfDragBox/icons/EditOutlined";
import { PdfRef } from "../../lib/components/PdfDragBox/PdfDragBox.types";

const meta: Meta = {
  title: "PdfDragBox",
  component: PdfDragBox,
};

export default meta;
const Template: StoryFn<PdfDragBoxProps> = (args: PdfDragBoxProps) => {
  const [boxData, setBoxData] = useState<PdfDragBoxData[]>([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef<PdfRef>(null);

  const handleClick = () => {
    setLoading(true);
    const newData = boxData.map((item) => {
      return { ...item, isShowImage: false };
    });
    setBoxData(newData);
  };

  return (
    <PdfDragBox
      {...args}
      itemsTitle="Signatures"
      ref={ref}
      boxes={[
        {
          id: "https://workflow.vntts.vn/api/v2/System/DefaultSignature",
          image: "https://workflow.vntts.vn/api/v2/System/DefaultSignature",
          title: "kyso@vntt.com.vn",
          multiple: false,
          text: "Chữ ký mặc định của công ty",
          resizable: true,
          texts: [
            { text: "haajutran@gmail.com" },
            { text: "SIGNATURE SIGNATURE SIGNATURE SIGNATURE" },
          ],
        },
        {
          id: "https://library.vntts.vn/api/PublicLibrary/ViewFile/pcejziwbbi1o40cf4jk5nppisa2yybvi4thzo10p2t4nbw43fk",
          image:
            "https://library.vntts.vn/api/PublicLibrary/ViewFile/70kkdmr1djv46tgxys8myletwg9381c0x7i9mmptp7h7tm0niz",
          multiple: false,
          text: "Ký số cá nhân",
          resizable: true,
          width: 221,
          height: 12,
          imageType: "fill",
        },
      ]}
      onChangeData={(data) => {
        const newData: PdfDragBoxData[] = [];
        data.forEach((item) => {
          const newItem: PdfDragBoxData = {
            id: item.id,
            image: item.image,
            page: item.page,
            title: item.id?.toString(),
            position: item.position,
            texts: item.texts ?? [],
          };
          newData.push(newItem);
        });
        setBoxData(newData);
      }}
      pdf={pdf}
      onSubmit={(a) => {
        console.log(a);
      }}
      data={boxData}
      extraAction={{
        icon: <EditOutlined />,
        title: "Edit",
        onClick: (item) => {
          ref.current?.updateData();
          // handleClick();
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
