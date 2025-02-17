import { ILLNESSES_MOCK } from "../modules/mock";
"use strict";

import Ajax from "./Ajax.ts";
//import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

const API = {
    BASE_URL: `http://${window.location.hostname}:3000/api`,

    async getCsrfToken() {
        try {
            const url = this.BASE_URL + 'csrf/';
            const response = await Ajax.get(url);
            const data = await response.json()
            return data.csrfToken
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return null;
        }
    },

    async getSession() {
        const url = this.BASE_URL + 'users/check/'
        return Ajax.get(url)
    },

    async getILLNESSES(){
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

    async getILLNESSDetails(illnessId: string) {
        const url = this.BASE_URL + `/illnesses/${illnessId}/`;
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных о корабле:", error);
            const mockILLNESS = ILLNESSES_MOCK.find((s) => s.id === illnessId);
            if (mockILLNESS) {
                return mockILLNESS;
            } else {
                throw new Error("Корабль не найден в мок-данных");
            }
        }
    },

    async login({email, password}:LoginParams) {
        const url = this.BASE_URL + '/login/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    },

    async auth({email, password}:LoginParams) {
        const url = this.BASE_URL + '/users/auth/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    },

    async logout() {
        const url = this.BASE_URL + 'logout/';
        const body = {};
        return Ajax.post({url, body})
    },

    async updateProfile(email?: string, password?: string) {
        const url = this.BASE_URL + 'users/profile/';
        const body: any = {};
        if (email) body.email = email;
        if (password) body.password = password;

        return Ajax.put({url, body})
    }, 

    async getFights(filters?: { date_from?: string; date_to?: string; status?: string }) {
        const query = new URLSearchParams(filters).toString();
        const url = `${this.BASE_URL}fights/?${query}`;
        return Ajax.get(url);
    },         

    async getFightById(id: number){
        const url = this.BASE_URL + `/fights/${id}/`;
        return Ajax.get(url)
    },

    async addILLNESSToDraft(id: number){
        const url = this.BASE_URL + `/illnesses/${id}/draft/`;
        const body = {}
        return Ajax.post({url, body});
    },

    async changeAddFields(id:number, fight_name?: string, result?: string) {
        console.log(id);
        console.log(fight_name);
        const url = this.BASE_URL + `/fights/${id}/edit/`;
        const body: any = {};
        if (fight_name) body.fight_name = fight_name;
        if (result) body.result = result;

        return Ajax.put({url, body})
    },

    async changeILLNESSFields(illnessId: number, fightId: number, admiral?: string){
        const url = this.BASE_URL + `fights/${fightId}/illnesses/${illnessId}/`;
        const body: any = {};
        if (admiral) body.admiral = admiral;

        return Ajax.put({url, body})
    },

    async deleteILLNESSFromDraft(fightId: number, illnessId: number) {
        const url = this.BASE_URL + `fights/${fightId}/illnesses/${illnessId}/`;
        const body = {}
        return Ajax.delete({url, body})
    },

    async formFight(fightId: number) {
        const url = this.BASE_URL + `fights/${fightId}/form/`;
        const body = {
            status: 'f'
        }
        return Ajax.put({url, body});
    },

    async deleteFight(fightId: number) {
        const url = this.BASE_URL + `/fights/${fightId}/`;
        const body = {}
        return Ajax.delete({url, body});
    }
};

export default API;