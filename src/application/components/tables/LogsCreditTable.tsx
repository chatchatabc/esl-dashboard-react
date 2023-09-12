import { ColumnsType, TableProps } from "antd/es/table";
import { LogsCredit } from "../../../../../esl-workers/src/domain/models/LogsModel";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { CommonContent } from "../../../../../esl-workers/src/domain/models/CommonModel";
import DynamicTable from "./DynamicTable";

type Props = TableProps<any> & {
  data?: CommonContent | null;
};

function LogsCreditTable({ data, ...props }: Props) {
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
      data={data}
      {...props}
    />
  );
}

export default LogsCreditTable;
