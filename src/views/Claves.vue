<template>
  <div class="container">
    <h1>Claves</h1>

Claves es un complemento que permite cifrar cadenas por cadenas aleatorias, y posteriormente recuperarlas.

  </div>
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import ProgressVue from '@/components/Progress.vue';
import { db } from "@/main";
import fields from "@/assets/fields.json"
import mock from "@/assets/MOCK_DATA.json"
import TabsScreenVue from '../components/TabsScreen.vue';
export default {
  name: 'claves',
  components: {
    
  },
  created(){
    
  },
  methods: {
    
  }
}
</script>