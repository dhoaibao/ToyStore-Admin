import CryptoJS from 'crypto-js';

export const generateAvatar = (identifier, name) => {
    const hash = CryptoJS.MD5(identifier || "default").toString();
    const color = `#${hash.slice(0, 6)}`;
    const initial = name ? name.charAt(0).toUpperCase() : "U"; // Ký tự đầu tiên hoặc mặc định là "U"

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