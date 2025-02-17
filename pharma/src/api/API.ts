"use strict";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

interface APIResponse<T = any> {
    json: () => Promise<T>;
    ok: boolean;
    status: number;
    statusText: string;
}

class API {
    private static instance: AxiosInstance;

    private static getInstance(): AxiosInstance {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: "https://localhost:3000/api/",
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.instance.interceptors.request.use(
                (config) => {
                    if (["post", "put", "delete"].includes(config.method || "")) {
                        const csrfToken = getCookie("csrftoken");
                        if (!csrfToken) {
                            throw new Error("CSRF token is missing");
                        }
                        config.headers["X-CSRFToken"] = csrfToken;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            this.instance.interceptors.response.use(
                (response) => response,
                (error) => {
                    console.error("[API Error]:", error.response?.data || error.message);
                    return Promise.reject(error);
                }
            );
        }
        return this.instance;
    }

    private static handleResponse<T>(response: AxiosResponse<T>): APIResponse<T> {
        return {
            json: async () => response.data,
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
        };
    }

    private static async safeRequest<T>(promise: Promise<AxiosResponse<T>>): Promise<APIResponse<T>> {
        try {
            const response = await promise;
            return this.handleResponse(response);
        } catch (error: any) {
            if (error.response) {
                return this.handleResponse(error.response);
            }
            throw error; // Network or unexpected error
        }
    }

    static async getCsrfToken(): Promise<string | null> {
        try {
            const response = await this.getInstance().get("csrf/");
            return response.data.csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
            return null;
        }
    }

    static async getSession() {
        return this.safeRequest(this.getInstance().get("users/check/"));
    }

    static async getIllnesses(postfix?: string) {
        const url = postfix ? `illnesses/${postfix}` : "illnesses/";
        return this.safeRequest(this.getInstance().get(url));
    }

    static async getIllnessDetails(id: string) {
        return this.safeRequest(this.getInstance().get(`illnesses/${id}/`));
    }

    static async login({ email, password }: LoginParams) {
        return this.safeRequest(this.getInstance().post("login/", { email, password }));
    }

    static async logout() {
        return this.safeRequest(this.getInstance().post("logout/", {}));
    }

    static async auth({ email, password }: LoginParams) {
        return this.safeRequest(this.getInstance().post("users/auth/", { email, password }));
    }

    static async getDrugs(filters?: { date_from?: string; date_to?: string; status?: string }) {
        const query = new URLSearchParams(filters).toString();
        return this.safeRequest(this.getInstance().get(`drugs/?${query}`));
    }

    static async getDrugById(id: number) {
        return this.safeRequest(this.getInstance().get(`drugs/${id}/`));
    }

    static async addIllnessToDraft(id: number) {
        return this.safeRequest(this.getInstance().post(`illnesses/${id}/draft/`, {}));
    }

    static async changeIllnessFields(illnessId: number, drugId: number, admiral?: string,) {
        return this.safeRequest(this.getInstance().put(`drugs/${drugId}/illnesses/${illnessId}/`, { admiral: admiral }));
    }

    static async changeAddFields(id: number, drug_name?: string, result?: string) {
        const body: Record<string, any> = {};
        if (drug_name) body.drug_name = drug_name;
        if (result) body.result = result;
        return this.safeRequest(this.getInstance().put(`drugs/${id}/edit/`, body));
    }

    static async deleteIllnessFromDraft(drugId: number, illnessId: number) {
        return this.safeRequest(this.getInstance().delete(`drugs/${drugId}/illnesses/${illnessId}/`));
    }

    static async formDrug(drugId: number) {
        return this.safeRequest(this.getInstance().put(`drugs/${drugId}/form/`, { status: "f" }));
    }

    static async deleteDrug(drugId: number) {
        return this.safeRequest(this.getInstance().delete(`drugs/${drugId}/`));
    }

    static async updateProfile(email?: string, password?: string) {
        const body: Record<string, any> = {};
        if (email) body.email = email;
        if (password) body.password = password;
        return this.safeRequest(this.getInstance().put("users/profile/", body));
    }
}

export default API;