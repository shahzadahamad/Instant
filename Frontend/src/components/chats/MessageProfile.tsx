import { userData } from "@/types/profile/profile";
import React from "react";

const MessageProfile: React.FC<{ user: Partial<userData> }> = ({ user }) => {
  return (
    <div className="w-7 self-end">
      <img
        src={user.profilePicture}
        className="w-7 cursor-pointer rounded-full object-cover"
        alt=""
      />
    </div>
  );
};

export default MessageProfile;
