import axios from "axios";

const fetchImage = async (url, filename) => {
    try {
        const response = await axios.get(url, { responseType: "blob" });
        const blob = response.data;
        const fileType = blob.type || "image/png";
        return new File([blob], filename, { type: fileType });
    } catch (error) {
        console.error("Failed to fetch image: ", error);
        return null;
    }
};

export default fetchImage;