import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { productInformationService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import ProductInfoForm from "../components/product-information/ProductInfoForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { getSortOrder } from "../utils";

const ProductInfo = () => {
  const [productsInfo, setProductsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    limit: 10,
    total: 0,
  });

  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const fetchProductsInfo = async () => {
      setLoading(true);
      try {
        const response =
          await productInformationService.getAllProductsInformation(
            searchParams.toString()
          );
        setProductsInfo(
          response.data.map((item) => ({ ...item, key: item.productInfoId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch productInfo list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchProductsInfo();
    setFetchData(false);
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên thông tin</span>
        </div>
      ),
      dataIndex: "productInfoName",
    },
    {
      title: (
        <div className="text-center">
          <span>Loại</span>
        </div>
      ),
      dataIndex: "type",
      align: "center",
      render: (type) => {
        let color;
        switch (type) {
          case "INPUT_NUMBER":
            color = "blue";
            break;
          case "INPUT":
            color = "green";
            break;
          case "SELECT":
            color = "orange";
            break;
          case "AUTOCOMPLETE":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      dataIndex: "isActive",
      align: "center",
      render: (isActive) => {
        return isActive ? (
          <Tag color="blue">ACTIVE</Tag>
        ) : (
          <Tag color="gray">INACTIVE</Tag>
        );
      },
      filters: [
        {
          text: "ACTIVE",
          value: true,
        },
        {
          text: "INACTIVE",
          value: false,
        },
      ],
      filteredValue: [searchParams.get("isActive")],
      filterMultiple: false,
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày tạo</span>
        </div>
      ),
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "createdAt"),
    },
    {
      title: (
        <div className="text-center">
          <span>Ngày cập nhật</span>
        </div>
      ),
      dataIndex: "updatedAt",
      align: "center",
      render: (updatedAt) => moment(updatedAt).format("DD/MM/YYYY"),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: true,
      sortOrder: getSortOrder(searchParams, "updatedAt"),
    },
    {
      title: (
        <div className="text-center">
          <span>Hành động</span>
        </div>
      ),
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="text"
            onClick={() => {
              setSelectedProductInfo(record);
              setOpen(true);
            }}
          >
            <Pencil strokeWidth={1} size={20} color="blue" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Thông tin sản phẩm"
        searchPlaceholder={"Nhập tên thông tin sản phẩm để tìm kiếm..."}
        data={productsInfo}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedProductInfo}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <ProductInfoForm
        open={open}
        setOpen={setOpen}
        data={selectedProductInfo}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default ProductInfo;
