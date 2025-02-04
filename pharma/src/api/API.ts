import { ILLNESSES_MOCK } from "../modules/mock";
"use strict";


import Ajax from "./Ajax.ts";

const API = {
    BASE_URL: `http://192.168.31.6:3000/api`,

    // async login({ username, password }: LoginParams) {
    //     const url = this.BASE_URL + "/login/";
    //     const body = {
    //         username: username,
    //         password: password,
    //     };
    //     return Ajax.post({ url, body });
    // },

    // async register({ username, password }: RegisterParams) {
    //     const url = this.BASE_URL + "/users/auth/";
    //     const body = {
    //         username: username,
    //         password: password,
    //     };

    //     return Ajax.post({ url, body });
    // },

    async getIllnesses(){
        const url = this.BASE_URL + "/illnesses/";
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            return ILLNESSES_MOCK;
        }
        //return Ajax.get(url);
    },

    //async getillnessDetails(illnessId: string) {
    //    const url = this.BASE_URL + `/illnesses/${illnessId}`;
    //    return Ajax.get(url);
    //},

    async getIllnessDetails(illnessId: string) {
        const url = this.BASE_URL + `/illnesses/${illnessId}/`;
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных о болезнях:", error);
            const mockillness = ILLNESSES_MOCK.find((s) => s.id === illnessId);
            if (mockillness) {
                return mockillness;
            } else {
                throw new Error("Болезнь не найдена в мок-данных");
            }
        }
    },
    
};

export default API;