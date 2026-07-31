import React from "react";
import ReusableTable from "./ReusableTable";

const EmployeeList = ({ employees, openForm, onDelete, t }) => {
  // Chỉ cần khai báo các cột thông tin, không cần code nút bấm rườm rà nữa
  const columns = [
    {
      title: t ? t("col_name") : "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t ? t("col_position") : "Vị trí",
      dataIndex: "position",
      key: "position",
      align: "center",
    },
    {
      title: t ? t("col_email") : "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: t ? t("col_phone") : "Số ĐT",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
  ];

  return (
    <ReusableTable
      dataSource={employees}
      columns={columns}
      onEdit={(record) => openForm("edit", record)}
      onDelete={onDelete}
      t={t}
      rowKey="id"
    />
  );
};

export default EmployeeList;
