import React from "react";

const DownloadFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const getFileNameFromUrl = (url: string): string => {
    const match = url.match(/\/o\/(.*?)\?/);
    return match
      ? decodeURIComponent(match[1].split("/").pop() || "download")
      : "download.pdf";
  };

  const getDownloadUrl = (url: string) => {
    if (!url.includes("?alt=media")) {
      return `${url}?alt=media`;
    }
    return url;
  };

  return (
    <a
      href={getDownloadUrl(fileUrl)}
      download={getFileNameFromUrl(fileUrl)}
      className="py-2 px-2 inline-block hover:scale-105 transition-all text-primary-color"
    >
      Tải xuống PDF
    </a>
  );
};

export default DownloadFile;
