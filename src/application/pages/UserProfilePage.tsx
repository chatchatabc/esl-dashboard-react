import { useParams } from "react-router-dom";

function UserProfilePage() {
  const { username } = useParams();

  return (
    <section className="p-4">
      <section className="border rounded-lg shadow">
        <header className="p-2">
          <h2>Profile {username}</h2>
        </header>

        <section className="p-2">{username}</section>
      </section>
    </section>
  );
}

export default UserProfilePage;
