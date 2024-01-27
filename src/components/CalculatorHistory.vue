<script setup>
const props = defineProps({ history: Array });
</script>
<template>
  <div class="history-view">
    <div v-if="props.history.length > 0">
      <div class="row" v-for="(history, index) in props.history" :key="index">
        <div>
          <h3>Calculation</h3>
          <p>
            <span>{{ history.query }}</span>
          </p>
        </div>
        <div class="result-col">
          <h3>Result</h3>
          <p>
            <span v-if="history.currency">{{ history.currency }}</span
            ><span>{{
              history.currency ? history.result.toFixed(2) : history.result
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h2>No data found</h2>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.history-view {
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 0px 3px 0px rgb(40, 40, 40);
    padding: 0.6rem;
    margin-bottom: 1rem;

    div {
      line-height: 1.6rem;

      p {
        font-size: 1.2rem;
      }
    }

    .result-col {
      text-align: end;
    }
  }
}
</style>
