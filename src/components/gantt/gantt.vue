<template>
  <div ref="ganttContainer"></div>
</template>


<script setup>
import {gantt} from 'dhtmlx-gantt';
import { onMounted, watch } from 'vue'

const props = defineProps({
  tasks: {
    type: Object,
    default: () => ({data: [], links: []})
  },
  columns:{
    type: Array,
    default: () => ([])
  }
})
const ganttContainer = ref()



onMounted(() => {
  if(props.columns && props.columns.length > 0){
    gantt.config.columns = props.columns
  }
  gantt.init(ganttContainer.value);
  gantt.config.date_format = "%Y-%m-%d";
  gantt.parse(props.tasks);
})

watch(() => props.tasks, () => {
  gantt.clearAll();
  console.log(props.tasks)
  gantt.parse(props.tasks);
})

onUnmounted(()=>{
  gantt.clearAll();
})
</script>

<style>
@import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>