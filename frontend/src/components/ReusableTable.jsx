import React from "react";
import { Table, Button, Space } from "antd";

const ReusableTable = ({
  dataSource,
  columns,
  onEdit,
  onDelete,
  t,
  rowKey = "id",
}) => {
  // Tự động gắn thêm cột "Thao tác" chứa sẵn các nút bấm chuẩn vào bảng
  const fullColumns = [
    ...columns,
    {
      title: t ? t("col_action") : "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {/* Nút Sửa / Edit */}
          <Button
            type="primary"
            size="middle"
            onClick={() => onEdit(record)}
            style={{
              minWidth: "80px",
              backgroundColor: "#1677ff",
              borderColor: "#1677ff",
              color: "white",
            }}
            className="font-semibold shadow-sm"
          >
            {t ? t("edit") : "Sửa"}
          </Button>

          {/* Nút Xóa / Delete */}
          <Button
            type="primary"
            danger
            size="middle"
            onClick={() => onDelete(record.id)}
            style={{ minWidth: "80px" }}
            className="font-semibold shadow-sm"
          >
            {t ? t("delete") : "Xóa"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full max-w-5xl">
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={{
          defaultPageSize: 5,

          pageSizeOptions: ["5", "10", "20"],
          showSizeChanger: true,

          locale: {
            items_per_page: "",
          },
          showTotal: (total, range) =>
            t
              ? `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`
              : `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default ReusableTable;
