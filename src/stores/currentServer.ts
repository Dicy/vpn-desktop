import {defineStore} from 'pinia'


export const useCurrentServerStore = defineStore('currentServer', {
    state: () => {
        if (localStorage.getItem('currentServer'))
            return JSON.parse(localStorage.getItem('currentServer') as string);
        return ({
            connected: false,
            serverTag: 'unknown',
            country: 'unknown',
            city: 'Unknown',
        })
    },
})

