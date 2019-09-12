<template>
  <div class="container">
   <table border="1"> 
       <tr>
           <td v-for="(p, id) in Object.keys(progress)" :key="id" :bgcolor="color(progress[p])" >
               <small>{{p}} {{progress[p]}}%</small>
           </td>
       </tr>
   </table>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/main";
export default {
  name: "progress-bar",
  props: {
      project: Object
  },
  data (){
      return {
        fields: [],
      }
  },
  computed :{
      deptos (){
          var object = {};
          var d = [...new Set (this.fields.map(x => x.departamento))];
          d.forEach (i => {
              var filter = this.fields.filter (function (e){
                return e.departamento === i;
              });
              object[i] = [...new Set (filter.map(x => x.id))];
          });
          return object;
      },
      progress (){
          var object = {};
          Object.keys (this.deptos).forEach (depto => {
              var fieldsByDepto = this.deptos[depto];
              object[depto] = 0;
              fieldsByDepto.forEach (f => {
                  if(this.project[f]){
                     object[depto]++;                      
                  }
              });
              object[depto] = (object[depto] / fieldsByDepto.length *100).toFixed(); 
          });
          return object;
      }
  },
  components: {},
  created() {
      this.getFields (this.project.form);      
  },
  methods: {
      color (percentage){
          if (percentage == 100) return "#008000";
          if (percentage >= 75 && percentage <= 99) return "#004b8c";
          if (percentage >= 50 && percentage <= 74) return "#ffd700";
          if (percentage >= 25 && percentage <= 49) return "#ffa500";
          if (percentage >= 1 && percentage <= 24) return "#cd1041";
          return "#3d4b54";
      },
      getFields (formid){
        return db.collection ("forms").doc (formid).get ().then (doc => {
            if (doc.exists && doc.data ().fields){
                return this.getFieldObjects (doc.data().fields);
            }
            return [];
        });
      },
      getFieldObjects (fieldArray){
        
        var promises = [];
        this.fields = [];
        fieldArray.forEach (f => {
          var p = db.collection ("fields").doc (f).get ().then (doc => {
              if (doc.exists){
                  var field = doc.data ();
                  field["id"] = doc.id;
                  this.fields.push (field);
              }
              return true;
          });
        })
        return Promise.all (promises).then (()=>{
            return this.fields;
        });
      }
  }
};
</script>