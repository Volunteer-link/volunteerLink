import React from "react";

const DownLoadFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const getFileNameFromUrl = (url: string): string => {
    const match = url.match(/\/o\/(.*?)\?/);
    return match
      ? decodeURIComponent(match[1].split("/").pop() || "download")
      : "download";
  };
  return (
    <a
      href={fileUrl}
      className="py-2 px-2 inline-block hover:scale-105 transition-all text-primary-color"
    >
      {getFileNameFromUrl(fileUrl)}
    </a>
  );
};

export default DownLoadFile;
