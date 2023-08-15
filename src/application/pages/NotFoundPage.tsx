import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="flex-1 flex justify-center items-center">
      {/* Container */}
      <section className="border p-8 rounded-lg border-black w-full max-w-md">
        <header>
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        </header>

        <section className="mt-4">
          <p>
            The page you are looking for does not exist. Please check the URL
          </p>
        </section>

        <footer className="mt-4 flex justify-between">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="inline-block underline hover:no-underline"
          >
            Go back
          </button>

          <button
            onClick={() => {
              navigate("/");
            }}
            className="inline-block underline hover:no-underline"
          >
            Go to Home Page
          </button>
        </footer>
      </section>
    </section>
  );
}

export default NotFoundPage;
