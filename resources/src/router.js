import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './views/login';
import Index from './views/index';
Vue.use(VueRouter);


const pageRoutes = [

    /*-------------------------------评论管理---------------------------------*/
    {
        path: '/comment/yingyuan/config/detail',
        component: () => import('./views/comment/yyCommentList/detailWapper')
    },
    {
        path: '/comment/yingyuan/config',
        component: () => import('./views/comment/yyCommentList/list')
    },
    {
        path: '/comment/son_comment/config',
        component: () => import('./views/comment/yySonCommentList/sonList.vue')
    },

    {
        path: '/comment/black_user/config',
        component: () => import('./views/comment/commentBlackUser/config')
    },

    {
        path: '/comment/black_program/config',
        component: () => import('./views/comment/commentBlackProgram/config')
    },

    {
        path: '/comment/word/config',
        component: () => import('./views/comment/commentSensitiveWord/config')
    },


    /*-------------------------------话题管理---------------------------------*/



    /*-------------------------------点赞管理---------------------------------*/

    {
        path: '/barrage/barragelist/config',
        component: () => import('./views/barrage/barrageList/config')
    },

    /*-------------------------------弹幕管理---------------------------------*/



    /*-------------------------------uic用户管理---------------------------------*/

    {
        path: '/uicuserInfo/userList/config',
        component: () => import('./views/UICUserInfo/userList/config')
    },

    /*-------------------------------客服管理---------------------------------*/

    {
        path: '/customService/userFeedBack/config',
        component: () => import('./views/customService/userFeedBack/config')
    },

    /*-------------------------------用户管理---------------------------------*/

    {
        path: '/user/info/config',
        component: () => import('./views/user/userConfig')
    },

    {
        path: '/user/info/config/edit',
        component: () => import('./views/user/userEdit')
    },
    {
        path: '/user/character/config',
        component: () => import('./views/user/userCharacter')
    },
    {
        path: '/user/jurisdiction/config',
        component: () => import('./views/user/userJurisdiction')
    },
    {
        path: '/whiteUser/info/config',
        component: () => import('./views/user/whiteUserConfig')
    },
    {
        path: '/whiteUser/info/edit',
        component: () => import('./views/user/whiteUserEdit')
    }


]


const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '',
            component: Index,
            children: pageRoutes
        },
    ]
});
export default router;
