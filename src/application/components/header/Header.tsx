import { useNavigate } from "react-router-dom";
import {
  authGetProfile,
  authLogout,
} from "../../../domain/services/authService";
import UserIcon from "../../assets/UserIcon";
import MyDropdown from "../MyDropdown";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";

function Navbar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const res = await authGetProfile();
      return res;
    },
  });

  return (
    <section className="px-4 py-2 flex items-center">
      {/* Title */}
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Menu */}
      <div className="ml-auto">
        <MyDropdown
          button={
            <div className="space-x-2 flex items-center pl-2 rounded-md transition hover:bg-blue-100">
              {userQuery.isLoading ? (
                <div className="w-10 h-10 border-r-2 rounded-full border-black animate-spin border-t-2"></div>
              ) : (
                <>
                  <p>Welcome {userQuery.data?.alias}!</p>
                  <div className="w-10 h-10 p-1 rounded-full">
                    <UserIcon />
                  </div>
                </>
              )}
            </div>
          }
        >
          <div>
            <button
              onClick={async () => {
                Modal.confirm({
                  title: "Are you sure?",
                  content: "Do you want to logout?",
                  onOk: async () => {
                    const res = await authLogout();

                    if (!res) {
                      message.error("Logout failed");
                    } else {
                      queryClient.invalidateQueries();
                      message.success("Logout success");
                      navigate("/login");
                    }
                  },
                  okType: "danger",
                });
              }}
              className="px-4 py-2 text-red-500 w-full hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </MyDropdown>
      </div>
    </section>
  );
}

export default Navbar;
