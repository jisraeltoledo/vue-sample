<template>
  <div class="home">
    <list-project-progress></list-project-progress>
  </div>
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import ProgressVue from '@/components/Progress.vue';
import { db } from "@/main";
import fields from "@/assets/fields.json"
export default {
  name: 'field-edit',
  components: {
    "list-project-progress": ProgressVue
  },
  created(){
    
  },
  methods: {
    

  }
}
</script>