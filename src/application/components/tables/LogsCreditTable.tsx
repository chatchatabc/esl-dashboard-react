import DynamicTable from "../DynamicTable";
import { logsCreditGetAllByUser } from "../../../domain/services/logsService";
import { ColumnsType } from "antd/es/table";
import { LogsCredit } from "../../../../../esl-workers/src/domain/models/LogsModel";
import {
  utilFormatCurrency,
  utilFormatDateAndTime,
} from "../../../domain/services/utilService";

type Props = {
  userId: number;
};

function LogsCreditTable({ userId }: Props) {
  const columns: ColumnsType<LogsCredit> = [
    {
      key: "id",
      title: "Details",
      dataIndex: "details",
    },
    {
      key: "id",
      title: "Credit Points",
      render: (record: LogsCredit) => {
        return (
          <p
            className={`${
              record.amount < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {record.amount}点
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

  return (
    <DynamicTable
      rowKey={(record: LogsCredit) => record.id}
      columns={columns}
      getData={(values: any) => {
        return logsCreditGetAllByUser({ ...values, userId });
      }}
    />
  );
}

export default LogsCreditTable;
