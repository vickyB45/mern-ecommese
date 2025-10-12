"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // ✅ Correct import

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Correct hook

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");

      if (!logoutResponse) {
        throw new Error("Logout failed");
      }

      dispatch(logout());
      showToast({ type: "success", message: logoutResponse.message });
      router.push(WEBSITE_LOGIN); // ✅ Works now
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || error.message,
      });
    }
  };

  return (
    <DropdownMenuItem asChild>
      <div
        onClick={handleLogout}
        className="cursor-pointer flex items-center gap-2"
      >
        <AiOutlineLogout className="text-red-500" />
        <span>Logout</span>
      </div>
    </DropdownMenuItem>
  );
};

export default LogoutBtn;
