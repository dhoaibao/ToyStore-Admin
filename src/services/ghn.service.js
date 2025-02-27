const TOKEN = import.meta.env.VITE_GHN_TOKEN_API;
const SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api/";

// Hàm fetch cơ bản với headers mặc định
const apiFetch = async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "token": TOKEN,
        ...options.headers, // Cho phép ghi đè headers nếu cần
    };

    const body = options.body ? JSON.stringify(options.body) : undefined;

    const response = await fetch(url, {
        ...options,
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
};

class GHN {
    async getProvinces() {
        return await apiFetch('/master-data/province', { method: 'GET' });
    }

    async getDistricts(provinceId) {
        return await apiFetch(`/master-data/district?province_id=${provinceId}`, { method: 'GET' });
    }

    async getWards(districtId) {
        return await apiFetch(`/master-data/ward?district_id=${districtId}`, { method: 'GET' });
    }

    async getService(districtId) {
        return await apiFetch('/v2/shipping-order/available-services', {
            method: 'POST',
            body: {
                shop_id: parseInt(SHOP_ID),
                from_district: 1572,
                to_district: districtId,
            },
        });
    }

    async getShippingFee(address, quantity) {
        console.log(address);
        const services = await this.getService(address.districtId);

        const feeData = await apiFetch('/v2/shipping-order/fee', {
            method: 'POST',
            body: {
                shop_id: parseInt(SHOP_ID),
                service_id: services.data[0].service_id,
                service_type_id: services.data[0].service_type_id,
                from_district_id: 1572,
                from_ward_code: "550113",
                to_district_id: address.districtId,
                to_ward_code: address.wardCode,
                weight: 200 * quantity,
            },
        });
        return feeData.data.total;
    }
}

export const GHNService = new GHN();