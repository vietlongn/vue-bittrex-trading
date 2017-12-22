import Vue from 'vue'
import Router from 'vue-router'
import MarketSummaries from '@/components/MarketSummaries'
import MarketFollowing from '@/components/MarketFollowing'
import MarketDetail from '@/components/MarketDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/markets'
    },
    {
      path: '/markets',
      name: 'MarketSummaries',
      component: MarketSummaries
    },
    {
      path: '/market-following',
      name: 'MarketFollowing',
      component: MarketFollowing
    },
    {
      path: '/markets/:marketName',
      name: 'MarketDetail',
      component: MarketDetail,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  mode: 'history'
})
