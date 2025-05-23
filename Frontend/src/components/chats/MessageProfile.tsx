import { userData } from "@/types/profile/profile";
import React from "react";
import { useNavigate } from "react-router-dom";

const MessageProfile: React.FC<{ user: Partial<userData> }> = ({ user }) => {

  const navigate = useNavigate();

  return (
    <div className="w-8 h-8 self-end">
      <img
        onClick={() => navigate(`/user/${user.username}`)}
        src={user.profilePicture}
        className="w-8 h-8 cursor-pointer rounded-full object-cover"
        alt=""
      />
    </div>
  );
};

export default MessageProfile;
