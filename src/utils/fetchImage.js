const fetchImage = async (url, filename) => {
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

export default fetchImage;