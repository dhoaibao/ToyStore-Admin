import PropTypes from "prop-types";
import { productService, brandService, categoryService } from "../../services";
import { Input, Select, Checkbox, List, Image } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const SearchProduct = ({ productIds, setProductIds, productData = [] }) => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const brands = await brandService.getAllBrands("limit=-1");
      const categories = await categoryService.getAllCategories("limit=-1");
      setBrands(brands.data);
      setCategories(categories.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (productData.length > 0) {
      setProducts(productData);
    }
  }, [productData]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productService.getAllProducts(
        `keyword=${keyword}&brandNames=${selectedBrands.join(",")}&categoryNames=${selectedCategories.join(",")}`,
      );
      setProducts(products.data);
    };
    if (keyword || selectedBrands.length > 0 || selectedCategories.length > 0)
      fetchProducts();
  }, [keyword, selectedBrands, selectedCategories]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="Nhập tên sản phẩm để tìm kiếm..."
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Select
        placeholder="Lọc theo thương hiệu"
        mode="multiple"
        onChange={(values) => setSelectedBrands(values)}
        options={brands.map((brand) => ({
          value: brand.brandName,
          label: brand.brandName,
        }))}
      ></Select>
      <Select
        placeholder="Lọc theo danh mục"
        mode="multiple"
        onChange={(values) => setSelectedCategories(values)}
        options={categories.map((category) => ({
          value: category.categoryName,
          label: category.categoryName,
        }))}
      ></Select>
      <div>
        {products.length > 0 && (
          <div>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  setProductIds(products.map((product) => product.productId));
                } else {
                  setProductIds([]);
                }
              }}
              checked={
                productIds.length === products.length && products.length > 0
              }
            >
              Chọn tất cả
            </Checkbox>

            <List
              className="mt-0 max-h-72 overflow-y-auto"
              itemLayout="horizontal"
              dataSource={products}
              renderItem={(product) => (
                <List.Item>
                  <Checkbox
                    className="mr-4"
                    checked={productIds.includes(product.productId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProductIds([...productIds, product.productId]);
                      } else {
                        setProductIds(
                          productIds.filter((id) => id !== product.productId),
                        );
                      }
                    }}
                  />
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={50}
                        height={50}
                        src={product.productImages[0].url}
                        alt={product.productName}
                      />
                    }
                    title={product.productName}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

SearchProduct.propTypes = {
  productIds: PropTypes.array.isRequired,
  setProductIds: PropTypes.func.isRequired,
  productData: PropTypes.array,
};

export default SearchProduct;
