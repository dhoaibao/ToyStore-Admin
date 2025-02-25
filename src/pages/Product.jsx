import { Button, Tag } from "antd";
import { useState, useEffect, useMemo } from "react";
import { productService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import ProductForm from "../components/form/ProductForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAllProducts(
          searchParams.toString()
        );
        setProducts(
          response.data.map((item) => ({ ...item, key: item.productId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch product list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchProducts();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Hình ảnh</span>
        </div>
      ),
      dataIndex: "productImages",
      align: "center",
      render: (productImages) => (
        <div className="flex justify-center">
          <img
            src={productImages[0].uploadImage.url}
            alt="category"
            className="w-8 h-8 object-cover rounded-md"
          />
        </div>
      ),
      width: "8%",
    },
    {
      title: (
        <div className="text-center">
          <span>Tên sản phẩm</span>
        </div>
      ),
      dataIndex: "productName",
      width: "40%",
    },
    {
      title: (
        <div className="text-center">
          <span>Giá</span>
        </div>
      ),
      align: "right",
      dataIndex: "price",
      render: (price) => `${price.toLocaleString("vi-VN")}đ`,
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: (
        <div className="text-center">
          <span>Tồn kho</span>
        </div>
      ),
      align: "right",
      dataIndex: "soldNumber",
      render: (soldNumber, record) => (
        <>
          {record.quantity - soldNumber}/ {record.quantity}
        </>
      ),
      showSorterTooltip: {
        target: "sorter-icon",
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: (
        <div className="text-center">
          <span>Trạng thái</span>
        </div>
      ),
      dataIndex: "visible",
      align: "center",
      render: (visible) => {
        return visible ? (
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
              setSelectedProduct(record);
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
        title="Sản phẩm"
        searchPlaceholder={"Nhập tên sản phẩm để tìm kiếm..."}
        data={products}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedProduct}
        setFetchData={setFetchData}
        pagination={pagination}
      />
      <ProductForm
        open={open}
        setOpen={setOpen}
        data={selectedProduct}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Product;
