import CryptoJS from 'crypto-js';
import moment from 'moment';
import { ICON_MAP, ORDER_STATUS } from "../constants";

export const generateAvatar = (identifier, name) => {
    const hash = CryptoJS.MD5(identifier || "default").toString();
    const color = `#${hash.slice(0, 6)}`;
    const initial = name ? name.charAt(0).toUpperCase() : "U";

    return { color, initial };
};

export const fetchImage = async (url, filename) => {
    try {
        const response = await fetch(url, { method: 'GET' });
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
}

export const getStepStatus = (statusName) => {
    return statusName === "canceled"
        ? "error"
        : statusName === "delivered"
            ? "finish"
            : "process";
};

export const generateStepItems = (orderTrackings) => {
    const canceledIndex = orderTrackings.findIndex(
        (track) => track.orderStatus.statusName === "canceled"
    );

    const hasCanceled = canceledIndex !== -1;

    let statuses = [
        "pending",
        "confirmed",
        "shipping",
        "delivered",
    ];

    if (hasCanceled) {
        statuses[canceledIndex] = "canceled";
    }

    return statuses.map((key) => {
        const status = ORDER_STATUS[key];
        const tracking = orderTrackings.find(
            (track) => track.orderStatus.statusName === key
        );
        return {
            title: status.label,
            icon: ICON_MAP[key],
            description: tracking
                ? moment(tracking.time).format("DD/MM/YYYY HH:mm")
                : null,
        };
    });
};