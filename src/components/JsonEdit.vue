<template>
    <JsonEditor
        :options="{
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
        }"
        :objData="jsonData" 
        v-model="jsonData" >
    </JsonEditor>
</template>
<script>

export default {

    created (){
        this.id = this.$route.params.id;
        db.collection ("export").doc (this.id).get ().then ( doc => {
            this.jsonData = doc.data ().sections;
            this.name = doc.data ().name;
        });
    },
    data: function() {
        return {
            id: "",
            jsonData: {
                name: 'mike',
                age: 23,
                phone: '18552129932',
                address: ['AAA C1', 'BBB C2']
            }
        }
    }
}
</script> 