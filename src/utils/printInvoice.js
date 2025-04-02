import html2pdf from "html2pdf.js";
import dayjs from "dayjs";
import { PAYMENT_METHOD } from "../constants";

const printInvoice = (data) => {
  const shopInfo = {
    name: "ToyStore",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
    phone: "(+84) 942 463 758",
    email: "support@mail.com",
  };

  const htmlContent = `
    <div style="padding: 2rem; font-size: 0.875rem; font-family: 'Times New Roman', sans-serif; box-sizing: border-box;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">Hóa đơn</h1>
          <p style="font-weight: 700; font-size: 1rem;">${shopInfo.name}</p>
          <p>${shopInfo.address}</p>
          <p>Số điện thoại: ${shopInfo.phone}</p>
          <p>Email: ${shopInfo.email}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 600;">Mã đơn hàng: #${data?.orderId || "XXXX"}</p>
          <p style="font-weight: 600;  margin-top: 0.25rem;">Mã số thuế: 0106208569</p>
          <p style="font-weight: 600;  margin-top: 0.25rem;">Ngày xuất hóa đơn</p>
          <p>${dayjs(new Date()).format("DD/MM/YYYY HH:mm")}</p>
        </div>
      </div>
      <p style="margin-bottom: 0.5rem; border-bottom: 1px solid black;"></p>
      <div style="margin-bottom: 1.5rem;">
        <p style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem;">Chi tiết đơn hàng</p>
        <p>Người nhận: ${data?.orderAddress?.contactName || "Name"}</p>
        <p>Địa chỉ: ${data?.orderAddress?.address || "Street address"}</p>
        <p>Số điện thoại: ${data?.orderAddress?.contactPhone || "Phone number"}</p>
        <p>Hình thức thanh toán: ${PAYMENT_METHOD[data?.paymentMethod.paymentMethodName]?.label}</p>
        <p>Thời gian thanh toán: ${dayjs(data?.paidDate).format("DD/MM/YYYY HH:mm")}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border: 1px solid #d1d5db;">
        <thead>
          <tr style="background-color: #F3F4F6; border-bottom: 1px solid #d1d5db;">
            <th style="padding: 0.5rem; text-align: center; font-weight: 600;">#</th>
            <th style="padding: 0.5rem; text-align: center; font-weight: 600;">Tên sản phẩm</th>
            <th style="padding: 0.5rem; text-align: center; font-weight: 600;">Giá</th>
            <th style="padding: 0.5rem; text-align: center; font-weight: 600;">Số lượng</th>
            <th style="padding: 0.5rem; text-align: center; font-weight: 600;">Tổng</th>
          </tr>
        </thead>
        <tbody>
          ${
            data?.orderDetails
              ?.map(
                (item, index) => `
            <tr style="border-bottom: 1px solid #d1d5db;">
              <td style="padding: 0.75rem; border: 1px solid #d1d5db;">${index + 1}</td>
              <td style="padding: 0.75rem; border: 1px solid #d1d5db;">${item.product?.productName || "Item"}</td>
              <td style="padding: 0.75rem; text-align: right; border: 1px solid #d1d5db;">${item.price?.toLocaleString("vi-VN") || "0.00"}đ</td>
              <td style="padding: 0.75rem; text-align: center; border: 1px solid #d1d5db;">${item.quantity || "0"}</td>
              <td style="padding: 0.75rem; text-align: right; border: 1px solid #d1d5db;">${(item.price * item.quantity)?.toLocaleString("vi-VN") || "0.00"}đ</td>
            </tr>
          `,
              )
              .join("") || ""
          }
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 25%; text-align: right;">
          <p>Tiền hàng: ${data?.totalPrice?.toLocaleString("vi-VN") || "0.00"}đ</p>
          <p style="padding: 0.5rem 0; border-bottom: 1px solid #d1d5db; font-style: italic;">(Đã bao gồm VAT)</p>
          <p style="padding: 0.5rem 0; border-bottom: 1px solid #d1d5db;">Giảm: -${data?.totalDiscount?.toLocaleString("vi-VN") || "0.00"}đ</p>
          <p style="padding: 0.5rem 0; border-bottom: 1px solid #d1d5db;">Phí vận chuyển: ${data?.shippingFee?.toLocaleString("vi-VN") || "0.00"}đ</p>
          <p style="padding: 0.5rem 0; font-weight: 700; border-top: 1px solid #d1d5db;">Tổng hóa đơn: ${data?.finalPrice?.toLocaleString("vi-VN") || "0.00"}đ</p>
          
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `HoaDon_${dayjs(data?.createdAt).format("DDMMYYYY_HHmm")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(htmlContent).save();
};

export default printInvoice;
