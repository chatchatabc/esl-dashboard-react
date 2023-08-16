import TeacherTable from "../components/tables/TeacherTable";

function TeacherPage() {
  return (
    <section className="p-4">
      {/* First section */}
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Teachers</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400">
            Add +
          </button>
        </header>

        <section>
          <TeacherTable />
        </section>
      </section>
    </section>
  );
}

export default TeacherPage;
