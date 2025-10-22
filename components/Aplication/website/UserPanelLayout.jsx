import React from "react";
import UserPanelNavigation from "./UserPanelNavigation";

const UserPanelLayout = ({ children }) => {
  return (
    <div className="lg:flex-nowrap flex flex-wrap gap-10 lg:px-32 px-4 my-16">
      <div className="lg:w-64 w-full lg:mb-0 mb-5">
        <UserPanelNavigation />
      </div>
      <div className="w-full lg:w-[calc(100%-16rem)]">{children}</div>
    </div>
  );
};

export default UserPanelLayout;
