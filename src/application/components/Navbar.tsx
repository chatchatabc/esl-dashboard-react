import UserIcon from "../assets/UserIcon";
import MyDropdown from "./MyDropdown";

function Navbar() {
  return (
    <section className="py-4 flex items-center">
      {/* Title */}
      <h2 className="text-2xl font-bold">ESL Admin Dashboard</h2>

      {/* Menu */}
      <div className="ml-auto">
        <MyDropdown
          button={
            <div className="space-x-2 flex items-center pl-2 rounded-md transition hover:bg-blue-100">
              <p>Welcome User!</p>
              <div className="w-10 h-10 p-1 rounded-full">
                <UserIcon />
              </div>
            </div>
          }
        >
          <div>
            <button className="px-4 py-2 text-red-500 w-full hover:bg-red-500 hover:text-white">
              Logout
            </button>
          </div>
        </MyDropdown>
      </div>
    </section>
  );
}

export default Navbar;
