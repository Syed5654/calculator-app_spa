<script setup>
import Api from "@/assets/js/Api";
import CalculatorHistory from "@/components/CalculatorHistory.vue";
import { onMounted, ref } from "vue";

const number_1 = ref("");
const number_2 = ref("");
const selectedOperator = ref("+");
const selectedCurrency = ref(null);
const result = ref("");
const error = ref("");
const history = ref([]);
const userId = ref("");
const token = ref("");
const loading = ref(false);

const handleSelectOperator = (operator) => {
  selectedOperator.value = operator;
};

const handleSelectCurrency = (currency) => {
  if (selectedCurrency.value === currency) {
    selectedCurrency.value = null;
  } else {
    selectedCurrency.value = currency;
  }
};

const handleCalculate = () => {
  loading.value = true;
  if (number_1.value === "" || number_2.value === "") {
    error.value = "Please enter both values";
    return;
  }

  error.value = "";

  switch (selectedOperator.value) {
    case "+":
      result.value = number_1.value + number_2.value;
      break;
    case "-":
      result.value = number_1.value - number_2.value;
      break;
    case "x":
      result.value = number_1.value * number_2.value;
      break;
    case "÷":
      if (number_1.value === 0 || number_2.value === 0) {
        error.value = "Cannot Divide by 0";
      } else {
        result.value = number_1.value / number_2.value;
      }
      break;
    default:
      error.value = "Unknown Operator";
      break;
  }
  if (error.value === "") {
    saveHistory();
  }
};

const handleAvoidAlphabet = (event) => {
  if (event.key === "e") {
    event.preventDefault();
  }
};

const saveHistory = async () => {
  let query, query_result;
  if (selectedCurrency.value) {
    query = `${selectedCurrency.value}${number_1.value} ${selectedOperator.value} ${selectedCurrency.value}${number_2.value}`;
    query_result = `${selectedCurrency.value}${result.value.toFixed(2)}`;
  } else {
    query = `${number_1.value} ${selectedOperator.value} ${number_2.value}`;
    query_result = `${result.value}`;
  }
  try {
    await Api.post("/history", {
      query: query,
      result: query_result,
      userId: userId.value,
    }).then(() => {
      getHistory();
      loading.value = false;
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getHistory = async () => {
  await Api.get(`/get-history?id=${userId.value}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }).then((res) => {
    history.value = res.data.data;
  });
};

onMounted(() => {
  userId.value = localStorage.getItem("id");
  token.value = localStorage.getItem("token");
  getHistory();
});
</script>
<template>
  <div class="calculator">
    <div class="container">
      <h1 class="title">Calculator</h1>
      <div class="card">
        <div class="card-body">
          <div class="grid-cols-3">
            <div>
              <label for="number_1">Please Enter a number</label>
              <input
                type="number"
                name="number_1"
                id="number_1"
                class="form-input"
                placeholder="0000"
                v-model="number_1"
                @keydown="handleAvoidAlphabet"
              />
            </div>
            <div class="symbol">
              <p>{{ selectedOperator }}</p>
            </div>
            <div>
              <label for="number_2">Please Enter a number</label>
              <input
                type="number"
                name="number_2"
                id="number_2"
                class="form-input"
                placeholder="0000"
                v-model="number_2"
                @keydown="handleAvoidAlphabet"
              />
            </div>
          </div>
          <div class="options">
            <h3 class="my-3">Options</h3>
            <div class="flex">
              <button
                class="btn"
                @click="handleSelectOperator('+')"
                :class="{ 'btn-active': selectedOperator === '+' }"
              >
                Addition (+)
              </button>
              <button
                class="btn"
                @click="handleSelectOperator('-')"
                :class="{ 'btn-active': selectedOperator === '-' }"
              >
                Subtraction (-)
              </button>
              <button
                class="btn"
                @click="handleSelectOperator('x')"
                :class="{ 'btn-active': selectedOperator === 'x' }"
              >
                Multiplication (x)
              </button>
              <button
                class="btn"
                @click="handleSelectOperator('÷')"
                :class="{ 'btn-active': selectedOperator === '÷' }"
              >
                Division (÷)
              </button>
            </div>
          </div>
          <div class="currency">
            <h3 class="my-3">Currency</h3>
            <div class="flex">
              <button
                class="btn"
                @click="handleSelectCurrency('$')"
                :class="{ 'btn-active': selectedCurrency === '$' }"
              >
                USD ($)
              </button>
              <button
                class="btn"
                @click="handleSelectCurrency('€')"
                :class="{ 'btn-active': selectedCurrency === '€' }"
              >
                Euro (€)
              </button>
            </div>
          </div>
          <div class="text-center my-3">
            <button
              class="btn btn-calculate"
              :disabled="loading"
              @click="handleCalculate"
            >
              {{ loading ? "Please Wait..." : "Calculate" }}
            </button>
          </div>
          <div class="result">
            <h1>Result</h1>
            <h2 class="error" v-if="error">{{ error }}</h2>
            <h1 v-else>
              <span>{{ selectedCurrency }}</span
              ><span>{{
                result && selectedCurrency ? result.toFixed(2) : result
              }}</span>
            </h1>
          </div>
        </div>
      </div>
      <div class="history">
        <h1 class="my-3">History</h1>
        <div class="card">
          <div class="card-body">
            <CalculatorHistory :history="history" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/css/scss/variables.scss";

.calculator {
  padding: 2rem 0;

  .title {
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .card {
    background-color: rgb(255, 255, 255);
    width: 100%;
    box-shadow: 0px 0px 8px 0px rgb(118 118 118);
    border-radius: 0.9rem;

    &-body {
      padding: 1.9rem;

      @media screen and (max-width: 600px) {
        padding: 1.4rem;
      }

      .grid-cols-3 {
        display: grid;
        grid-template-columns: 45% 10% 45%;
        align-items: center;

        @media screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }

        .form-input {
          width: 100%;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border: 1px solid rgb(173, 173, 173);
          border-radius: 0.5rem;
          outline: none;
          margin: 0.4rem 0;

          &:focus {
            border-color: $primary-color;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset,
              0 0 8px $primary-color;
          }
        }

        .symbol {
          text-align: center;
          font-size: 2rem;
          font-weight: 900;
        }
      }

      .flex {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .btn {
        &:hover {
          background-color: #cacaca;
        }

        &-active {
          background-color: $primary-color;
          font-weight: 600;
          border: 1px solid rgb(70, 70, 70);
          color: white;

          &:hover {
            background-color: $primary-color;
          }
        }

        &-calculate {
          background-color: rgb(0, 0, 0);
          color: white;
          font-weight: 900;
          margin: 1rem 0;

          &:hover {
            background-color: rgb(36, 36, 36);
          }
        }
      }

      .result {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f0f0f0;
        border-radius: 10px;
        box-shadow: 0 0px 3px 0px rgb(40, 40, 40);
        padding: 1rem;
        margin-top: 1.4rem;
      }

      .error {
        color: rgb(220, 0, 0);
      }
    }
  }

  .history {
    margin-top: 2rem;
  }
}
</style>
