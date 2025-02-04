'use strict';

interface RequestParams {
    url: string;
    body?: object;
    method: string;
}


class Ajax {
    static get(url: string): Promise<any> {
        return this.#makeRequest({
            method: 'GET',
            url: url,
        });
    }

    static async #makeRequest({
        method,
        url,
        body = {},
    }: RequestParams): Promise<any> {
        const controller = new AbortController();
        const timeout = 1000;
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);



        try {
            let request: Request;
            if (method === 'GET') {
                request = new Request(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    signal: controller.signal,
                });
            } else {
                request = new Request(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(body),
                    signal: controller.signal,
                });
            }

            const response = await fetch(request);
            clearTimeout(timeoutId); // Отмена таймера, если запрос завершен до истечения времени
            return response;
        } catch (error) {
            clearTimeout(timeoutId); // Отмена таймера в случае ошибки
            throw error;
        }
    }
}

export default Ajax;