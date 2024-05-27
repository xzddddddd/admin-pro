import { MockMethod } from 'vite-plugin-mock';
export default [
    {
        url: '/mock/api/login',
        method: 'post',
        response: ({ body }) => {
            // 简单编写一个逻辑
            // 用户名不等于密码就是密码错误
            if (body.username !== body.password) {
                // 返回JSON信息
                return {
                    code: 1,
                    message: '密码错误',
                    data: {
                        username: '',
                        roles: [],
                        accessToken: ''
                    }
                };
            }
            // 其余的则显示登录成功
            if (body.username === 'admin') {
                return {
                    code: 0,
                    message: '登录成功',
                    data: {
                        username: 'admin',
                        roles: ['admin'],
                        accessToken: 'admin'
                    }
                };
            } else {
                return {
                    code: 0,
                    message: '登录成功',
                    data: {
                        username: 'common',
                        roles: ['common'],
                        accessToken: 'common'
                    }
                };
            }
        }
    }
] as MockMethod[];
