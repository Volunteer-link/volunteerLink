import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import { Modal } from "antd";
import "quill/dist/quill.snow.css"; // Import Quill theme

interface ModalProps {
  value: string;
  setSummaryValue: any;
}

const MyModalWithQuill: React.FC<ModalProps> = ({ value, setSummaryValue }) => {
  const quillRef = useRef<HTMLDivElement | null>(null); // Quill container
  const quillInstance = useRef<Quill | null>(null);
  useEffect(() => {
    // Chỉ khởi tạo Quill một lần nếu chưa khởi tạo
    if (quillRef.current && !quillInstance.current) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ align: [] }],
            ["link", "blockquote"],
            ["image", "video"],
          ],
        },
      });

      quillInstance.current = quill;

      const handleTextChange = () => {
        setSummaryValue((prev: any) => quill.root.innerHTML);
      };
      quill.on("text-change", handleTextChange);
    }
  }, [quillRef.current]);

  useEffect(() => {
    if (quillInstance.current && value) {
      quillInstance.current.root.innerHTML = value;
    }
  }, [quillInstance.current]);
  return <div ref={quillRef} style={{ height: 250 }}></div>;
};

export default MyModalWithQuill;
