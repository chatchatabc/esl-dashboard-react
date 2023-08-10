import { Table, TableProps, message } from "antd";
import React from "react";

type Props = TableProps<any> & {
  getData: (params: { page?: number; size?: number }) => Promise<any>;
};

function DynamicTable({ getData, ...props }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Record<string, any>[]>([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  React.useEffect(() => {
    if (loading) {
      (async () => {
        const response = await getData({
          page: pagination.current,
          size: pagination.pageSize,
        });
        if (!response) {
          message.error("Failed to fetch data");
        } else {
          setData(response.content);
          setPagination((prev) => {
            return { ...prev, total: response.totalElements ?? 1 };
          });
        }

        setLoading(false);
      })();
    }
  }, []);

  return (
    <Table
      loading={loading}
      {...props}
      dataSource={data}
      pagination={{ ...pagination, className: "pr-4" }}
    />
  );
}

export default DynamicTable;
