import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import { ICON_MAP, ORDER_STATUS } from "../constants";

export const generateAvatar = (identifier, name) => {
  const hash = CryptoJS.MD5(identifier || "default").toString();
  const color = `#${hash.slice(0, 6)}`;
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return { color, initial };
};

export const fetchImage = async (url, filename) => {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileType = blob.type || "image/png";
    return new File([blob], filename, { type: fileType });
  } catch (error) {
    console.error("Failed to fetch image: ", error);
    return null;
  }
};

export const getSortOrder = (searchParams, columnKey) => {
  const sortBy = searchParams.get("sort");
  const direction = searchParams.get("order");

  if (sortBy === columnKey) {
    return direction === "asc"
      ? "ascend"
      : direction === "desc"
        ? "descend"
        : null;
  }
  return null;
};

export const getStepStatus = (statusName) => {
  return statusName === "canceled"
    ? "error"
    : statusName === "delivered"
      ? "finish"
      : "process";
};

export const generateStepItems = (orderTrackings) => {
  const canceledIndex = orderTrackings.findIndex(
    (track) => track.orderStatus.statusName === "canceled",
  );

  const hasCanceled = canceledIndex !== -1;

  let statuses = ["pending", "confirmed", "shipping", "delivered"];

  if (hasCanceled) {
    statuses[canceledIndex] = "canceled";
  }

  return statuses.map((key) => {
    const status = ORDER_STATUS[key];
    const tracking = orderTrackings.find(
      (track) => track.orderStatus.statusName === key,
    );
    return {
      title: status.label,
      icon: ICON_MAP[key],
      description: tracking
        ? dayjs(tracking.time).format("DD/MM/YYYY HH:mm")
        : null,
    };
  });
};

export const generateLabels = (start, end, type) => {
  const labels = [];
  let current = start;
  const endDate = end;

  while (current.isBefore(endDate) || current.isSame(endDate, type)) {
    switch (type) {
      case "day":
        labels.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
        break;
      case "month":
        labels.push(current.format("YYYY-MM"));
        current = current.add(1, "month");
        break;
      case "quarter":
        labels.push(current.format("YYYY-[Q]Q"));
        current = current.add(3, "month");
        break;
      case "year":
        labels.push(current.format("YYYY"));
        current = current.add(1, "year");
        break;
      default:
        labels.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
    }
  }
  return labels;
};
