import Vue from "vue";
import ES6Promise from 'es6-promise'
ES6Promise.polyfill();

import store from "./store";
import router from "./router";
import {sync} from "vuex-router-sync";
import App from './App';
sync(store, router);


new Vue({
    el: '#root',
    store,
    router,
    render: h => h(App)
});

