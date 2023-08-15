import React from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import {
  userGetByUsername,
  userOptionStatus,
} from "../../domain/services/userService";
import { User } from "../../../../esl-workers/src/domain/models/UserModel";
import { utilFormatCurrency } from "../../domain/services/utilService";

function UserProfilePage() {
  const { username = "" } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const statusList = userOptionStatus();
  const status = statusList.find((item) => item.value === user?.status);

  React.useEffect(() => {
    if (loading) {
      (async () => {
        const res = await userGetByUsername({ username });
        if (res) {
          setUser(res);
        }
        setLoading(false);
      })();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 py-24">
        <NotFoundPage />
      </div>
    );
  }

  return (
    <section className="p-4">
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Profile Information</h2>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400">
            Edit
          </button>
        </header>

        <section className="p-2 flex flex-wrap gap-y-2">
          {/* Username */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Username</h3>
            </header>

            <section>
              <p>{user.username}</p>
            </section>
          </section>

          {/* First name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">First name</h3>
            </header>

            <section>
              <p>
                {user.firstName && user.firstName.length
                  ? user.firstName
                  : "NULL"}
              </p>
            </section>
          </section>

          {/* Last Name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Last name</h3>
            </header>

            <section>
              <p>
                {user.lastName && user.lastName.length ? user.lastName : "NULL"}
              </p>
            </section>
          </section>

          {/* Phone */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Phone</h3>
            </header>

            <section>
              <p>{user.phone && user.phone.length ? user.phone : "NULL"}</p>
            </section>
          </section>

          {/* Credit */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Credits</h3>
            </header>

            <section>
              <p>{utilFormatCurrency(user.credit)}</p>
            </section>
          </section>

          {/* Role */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Roles</h3>
            </header>

            <section>
              <p>{user.role?.name}</p>
            </section>
          </section>

          {/* Status */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Status</h3>
            </header>

            <section>
              <p>{status?.label}</p>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}

export default UserProfilePage;
