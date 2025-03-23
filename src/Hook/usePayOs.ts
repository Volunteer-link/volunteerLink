import { usePayOS, PayOSConfig } from "payos-checkout";

export const payOSConfig: PayOSConfig = {
  RETURN_URL: process.env.NEXT_PUBLIC_RETURN_URL || window.location.href,
  ELEMENT_ID: "payos-checkout-container",
  CHECKOUT_URL: process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://checkout.payos.vn/payment?sessionId=abcxyz",
  onSuccess: (event) => {
    console.log("Thanh toán thành công:", event);
  },
  onExit: (event) => {
    console.log("Người dùng thoát khỏi giao diện PayOS:", event);
  },
  onCancel: (event) => {
    console.log("Người dùng hủy đơn hàng:", event);
  },
};





