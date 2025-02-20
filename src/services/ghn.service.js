import axios from "axios";

const TOKEN = import.meta.env.VITE_GHN_TOKEN_API;
const SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;

const apiClient = axios.create({
    baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api/",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "token": TOKEN,
    },
});

class GHN {
    async getProvinces() {
        const response = await apiClient.get('/master-data/province');
        return response.data;
    }

    async getDistricts(provinceId) {
        const response = await apiClient.get(`/master-data/district?province_id=${provinceId}`);
        return response.data;
    }

    async getWards(districtId) {
        const response = await apiClient.get(`/master-data/ward?district_id=${districtId}`);
        return response.data;
    }

    async getService(districtId) {
        const response = await apiClient.post('/v2/shipping-order/available-services',
            {
                shop_id: parseInt(SHOP_ID),
                from_district: 1572,
                to_district: districtId
            }
        );
        return response.data;
    }

    async getShippingFee(address, quantity) {
        console.log(address)
        const services = await this.getService(address.districtId);

        const response = await apiClient.post('/v2/shipping-order/fee',
            {
                shop_id: parseInt(SHOP_ID),
                service_id: services.data[0].service_id,
                service_type_id: services.data[0].service_type_id,
                from_district_id: 1572,
                from_ward_code: "550113",
                to_district_id: address.districtId,
                to_ward_code: address.wardCode,
                weight: 200 * quantity,
            }
        );
        return response.data.data.total;
    }
}

export const GHNService = new GHN();