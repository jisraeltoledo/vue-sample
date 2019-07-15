<template>
  <div class="home">
    <list-project-progress></list-project-progress>
  </div>
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import ProgressVue from '@/components/Progress.vue';
export default {
  name: 'home',
  components: {
    "list-project-progress": ProgressVue
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>