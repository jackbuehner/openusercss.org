import client from '~/../lib/apollo-client'

import announcementsQuery from '~/apollo/queries/announcements.gql'

export const state = () => ({
  'loading':       false,
  'error':         null,
  'announcements': [],
})

export const getters = {
  loading (state) {
    return state.loading
  },

  announcements (state) {
    return state.announcements
  },

  error (state) {
    return state.error
  },
}

export const mutations = {
  loading (state, value) {
    state.loading = value
  },

  announcements (state, value) {
    state.announcements = value
  },

  error (state, value) {
    state.error = value.message
  },
}

export const actions = {
  async announcements ({commit,}) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query': announcementsQuery,
      })

      commit('announcements', data.forumTopics)
    } catch (error) {
      commit('error', error)
    }

    commit('loading', false)
  },
}
