import CryptoJS from 'crypto-js';

const generateAvatar = (identifier, name) => {
    const hash = CryptoJS.MD5(identifier || "default").toString();
    const color = `#${hash.slice(0, 6)}`;
    const initial = name ? name.charAt(0).toUpperCase() : "U"; // Ký tự đầu tiên hoặc mặc định là "U"

    return { color, initial };
};

export default generateAvatar;