/* Style related imports */
import "../css/app.scss"

import Vue from 'vue'
import Index from "./vue-components/Index"


new Vue({
    el: "#app",
    render: h => h(Index)
})