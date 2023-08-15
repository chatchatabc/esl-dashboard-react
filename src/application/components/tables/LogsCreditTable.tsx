import DynamicTable from "../DynamicTable";
import { logsCreditGetAll } from "../../../domain/services/logsService";
import { ColumnsType } from "antd/es/table";
import { LogsCredit } from "../../../../../esl-workers/src/domain/models/LogsModel";
import {
  utilFormatCurrency,
  utilFormatDateAndTime,
} from "../../../domain/services/utilService";

function LogsCreditTable() {
  const columns: ColumnsType<LogsCredit> = [
    {
      key: "id",
      title: "Amount",
      render: (record: LogsCredit) => {
        return (
          <p
            className={`${
              record.amount < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {utilFormatCurrency(record.amount)}
          </p>
        );
      },
    },
    {
      key: "id",
      title: "Date",
      render: (record: LogsCredit) => {
        return (
          <p>{utilFormatDateAndTime("zn-CH", new Date(record.createdAt))}</p>
        );
      },
    },
  ];

  return <DynamicTable columns={columns} getData={logsCreditGetAll} />;
}

export default LogsCreditTable;
