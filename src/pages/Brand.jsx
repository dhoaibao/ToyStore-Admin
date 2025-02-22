import { Button } from "antd";
import { useState, useEffect, useMemo } from "react";
import { brandService } from "../services";
import moment from "moment";
import { Pencil } from "lucide-react";
import BrandForm from "../components/form/BrandForm";
import { useLocation } from "react-router-dom";
import DataTable from "../components/common/DataTable";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
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
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await brandService.getAllBrands(
          searchParams.toString()
        );
        setBrands(
          response.data.map((item) => ({ ...item, key: item.brandId }))
        );
        setPagination({
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          total: response.pagination.total,
        });
        setLoading(false);
        setFetchData(false);
      } catch (error) {
        console.error("Failed to fetch brand list: ", error.data);
        setLoading(false);
      }
    };
    if (fetchData || searchParams) fetchBrands();
  }, [fetchData, searchParams]);

  const columns = [
    {
      title: (
        <div className="text-center">
          <span>Tên thương hiệu</span>
        </div>
      ),
      dataIndex: "brandName",
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
              setSelectedBrand(record);
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
        title="Thương hiệu"
        data={brands}
        loading={loading}
        columns={columns}
        setOpenForm={setOpen}
        setSelectedItem={setSelectedBrand}
        setFetchData={setFetchData}
        pagination={pagination}
        expandable={{
          expandedRowRender: (record) => (
            <p className="m-0">
              <span className="font-semibold">Mô tả:</span> {record.brandDesc}
            </p>
          ),
          rowExpandable: (record) =>
            record.brandName !== "Không có mô tả về thương hiệu này!",
        }}
      />
      <BrandForm
        open={open}
        setOpen={setOpen}
        data={selectedBrand}
        setFetchData={setFetchData}
      />
    </>
  );
};

export default Brand;
