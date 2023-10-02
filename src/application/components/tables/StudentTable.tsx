import Table, { ColumnsType, TableProps } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Student } from "../../../../../esl-backend-workers/src/domain/models/StudentModel";
import { useAppDispatch } from "../../stores/hooks";
import { modalUpdate } from "../../stores/app/modalSlice";
import { Modal, message } from "antd";
import {
  userRevokePhoneVerification,
  userVerifyPhone,
} from "../../../domain/services/userService";
import { useQueryClient } from "@tanstack/react-query";

type Props = TableProps<any> & {
  data?: CommonContent<Student> | null;
};

function StudentTable({ data, ...props }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const columns: ColumnsType<Student> = [
    {
      key: "username",
      title: "Username",
      fixed: "left",
      width: 200,
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              navigate("/students/" + record.user.username);
            }}
            className="text-blue-500 underline hover:no-underline"
          >
            {record.user.username}
          </button>
        );
      },
    },
    {
      title: "Student Name",
      key: "alias",
      dataIndex: "alias",
    },
    {
      key: "credit",
      title: "Credits",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "credit",
                  title: "Add Credit",
                  data: { userId: record.userId },
                })
              );
            }}
            className="underline hover:no-underline"
          >
            {record.user.credits}点
          </button>
        );
      },
    },
    {
      key: "phone",
      title: "Phone Number",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              Modal.confirm({
                title: `${
                  record.user.phoneVerifiedAt ? "Revoke" : "Verify"
                } Phone verification`,
                content: `Are you sure you want to ${
                  record.user.phoneVerifiedAt ? "revoke" : "verify"
                } phone verification?`,
                onOk: async () => {
                  let res: any;
                  if (record.user.phoneVerifiedAt) {
                    res = await userRevokePhoneVerification({
                      id: record.userId,
                    });
                  } else {
                    res = await userVerifyPhone({ id: record.userId });
                  }

                  if (!res) {
                    message.error("Something went wrong");
                  } else {
                    message.success("Success");
                    queryClient.invalidateQueries(["students"]);
                  }
                },
                okButtonProps: {
                  className: `${
                    record.user.phoneVerifiedAt
                      ? "bg-red-500 hover:bg-red-400"
                      : "bg-green-500 hover:bg-green-400"
                  } text-white rounded-md transition`,
                },
                okText: "Yes",
                maskClosable: true,
              });
            }}
            className={`underline ${
              record.user.phoneVerifiedAt ? "text-green-500" : "text-red-500"
            } hover:no-underline`}
          >
            {record.user.phone}
          </button>
        );
      },
    },
    {
      title: "Credits",
      key: "credits",
      dataIndex: "user",
      render: (_, data) => {
        return <p>{data.user.credits}</p>;
      },
    },
  ];

  return (
    <Table
      dataSource={data?.content}
      columns={columns}
      pagination={{
        total: data?.totalElements,
        pageSize: data?.size,
        current: data?.page,
        onChange: (page, size) => {
          navigate(`?page=${page}&size=${size}`);
        },
      }}
      rowKey={(record: Student) => record.id}
      {...props}
    />
  );
}

export default StudentTable;
