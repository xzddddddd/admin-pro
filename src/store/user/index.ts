import { defineStore } from 'pinia';
import pinia from '@/store';
import { userLogin, refreshUserInfo } from '@/api/user';
// import { UserState } from "./types";
export interface UserState {
    username: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
}

export const useUserStoreHook = defineStore('user', {
    state: (): UserState => ({
        username: 'Edward',
        roles: ['common'],
        accessToken: ''
    }),
    actions: {
        storeUserLogin(data: LoginRequest) {
            return userLogin(data).then((res) => {
                this.username = res.username;
                this.roles = res.roles;
                this.accessToken = res.accessToken;
                return res;
            });
        },
        storeRefreshUserInfo() {
            if (this.username === 'Edward' && this.accessToken !== '') {
                refreshUserInfo({ accessToken: this.accessToken })
                    .then((res) => {
                        this.username = res.username;
                        this.roles = res.roles;
                        this.accessToken = res.accessToken;
                        return res;
                    })
                    .catch((err) => {
                        this.accessToken = '';
                    });
            }
        }
    },
    persist: {
        key: 'userInfo',
        storage: sessionStorage,
        paths: ['accessToken']
    },
    getters: {}
});

export function useUserStore() {
    return useUserStoreHook(pinia);
}
