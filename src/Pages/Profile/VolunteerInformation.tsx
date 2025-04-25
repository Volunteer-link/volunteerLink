import { Tag } from "antd";
import React from "react";
import { VolunteerProfilePage } from "../../model/Request/VolunteerProfile";
import { decodedCookie, getCookie } from "../../ultils/cookie";

const VolunteerInformation = ({
  volunteer,
}: {
  volunteer: VolunteerProfilePage | undefined;
}) => {
  const tagColors = [
    "green",
    "blue",
    "red",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "volcano",
    "gold",
    "lime",
    "green",
    "geekblue",
    "purple",
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * tagColors.length);
    return tagColors[randomIndex];
  };

  return (
    <>
      {/* Bio and Skills */}
      <div className="mt-6">
        <div className="mt-4">
          <h3 className="text-lg mb-2 text-[#3BA769] font-semibold">Kỹ năng</h3>
          <p className="text-gray-500"> {volunteer?.skill}</p>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-6">
        <h3 className="text-lg mb-2 text-[#3BA769]  font-semibold">
          Lĩnh vực quan tâm
        </h3>
        <div className="flex flex-wrap gap-2">
          {volunteer?.fields?.map((field) => (
            <Tag key={field.id} color={getRandomColor()}>
              {field.name}
            </Tag>
          ))}
        </div>
      </div>

      {/* Contact */}
      {decodedCookie(getCookie("accessToken")).role === "Organization" && (
        <div className="mt-6">
          <h3 className="text-lg mb-2 text-[#3BA769]  font-semibold">
            Thông tin liên hệ
          </h3>
          <ul className="list-none space-y-2 text-gray-600">
            <li>
              <span className="font-semibold">Phone:</span>{" "}
              {volunteer?.phoneNumber}
            </li>
            <li>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {volunteer?.address}
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default VolunteerInformation;
