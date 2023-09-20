import { Table, TableProps } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";

type Props = TableProps<any> & {
  data?: CommonContent | null;
};

function DynamicTable({ pagination, data, ...props }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Table
      dataSource={data?.content}
      pagination={{
        pageSize: data?.size,
        total: data?.totalElements,
        current: data?.page,
        onChange: (page, size) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(page));
          params.set("size", String(size));
          navigate(`?${params.toString()}`);
        },
        ...pagination,
      }}
      {...props}
    />
  );
}

export default DynamicTable;
