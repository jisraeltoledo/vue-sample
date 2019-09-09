<template>
  <div class="home">
    <tab-screen></tab-screen>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
import fields from "@/assets/fields.json";
import mock from "@/assets/MOCK_DATA.json";
import data from "@/assets/data.json";
import exportSamples from "@/assets/export-samples.json"
import TabsScreenVue from "../components/TabsScreen.vue";
export default {
  name: "home",
  components: {
    "list-project-progress": ProgressVue,
    "tab-screen": TabsScreenVue
  },
  created() {
    
    // Array.prototype.forEach.call(mock, elements => {
    //   var keywords = [];
    //   keywords = keywords.concat (this.createKey(elements.C02));
    //   keywords = keywords.concat (this.createKey(elements.C03));
    //   elements["keywords"] = Array.from(new Set (keywords));
    //   db.collection("projects").add(elements);
    // });

    Array.prototype.forEach.call(exportSamples, f => {
      db.collection ("export").doc ("GPRhnpTy77demsHh1tHB").set ({sections:exportSamples});
    });
    // var array = ["C01","C02","C03","C04","C05","C06","C07","C08","C09","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26","C27","C28","C29","C30","C31","C32","C33","C34","C35","C36","C37","C38","C39","C40","C41","C42","C43","C44","C45","C46","C47","C48","C64","C49","C50","C51","C52","C53","C54","C65","C55","C56"];
    // db.collection ("forms").doc("F01").update({fields: array});
  },
  methods: {
    createKey(name) {
      console.log(name);
      const arrName = [];
      let curName = "";
      name
        .toLowerCase()
        .split("")
        .forEach(letter => {
          curName += letter;
          arrName.push(curName);
        });
      return arrName;
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    }
  }
};
</script>