import utils from '../utils/misc'
export default{

    computed: {
        pageCategory() {
            return  this.$route.params.category.toUpperCase()
        }
    }

}
