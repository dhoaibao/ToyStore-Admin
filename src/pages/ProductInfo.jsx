import { Button } from "antd";
import { useState, useEffect, useMemo } from "react";
import { productInformationService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import ProductInfoForm from "../components/form/ProductInfoForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";

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
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch productInfo list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchProductsInfo();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên thương hiệu</span>
        </div>
      ),
      dataIndex: "productInfoName",
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
