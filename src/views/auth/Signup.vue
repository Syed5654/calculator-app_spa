<script setup>
import { ref } from "vue";
import Api from "@/assets/js/Api.js";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const data = ref({
  name: "",
  email: "",
  password: "",
});
const validation_message = ref({
  name: "",
  email: "",
  password: "",
});

const success = () => {
  validation_message.value = {
    name: "",
    email: "",
    password: "",
  };
  data.value = {
    name: "",
    email: "",
    password: "",
  };
};

const submitData = async () => {
  try {
    loading.value = true;
    await Api.post("/register", data.value).then((res) => {
      if (res.data.validation_message) {
        validation_message.value = res.data.validation_message;
        let fields = Object.keys(res.data.validation_message);
        fields.forEach((field) => {
          let input = document.getElementById(field);
          input.classList.add("validation-error");
          input.addEventListener("input", () => {
            if (input.value.trim() === "") {
              input.classList.add("validation-error");
            } else {
              input.classList.remove("validation-error");
            }
          });
        });
        loading.value = false;
        return;
      } else if (res.data.error) {
        validation_message.value.email = res.data.message;
        loading.value = false;
      } else {
        const userId = res.data.user.id;
        const accessToken = res.data.user.accessToken;
        localStorage.setItem("id", userId);
        localStorage.setItem("token", accessToken);
        success();
        loading.value = false;
        router.push("/");
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    loading.value = false;
  }
};
</script>
<template>
  <div class="container">
    <div class="signup">
      <div class="card">
        <div class="card-body">
          <h1 class="text-center">Register</h1>
          <div class="form-wrapper">
            <label for="name">Please enter your name</label>
            <input
              type="text"
              name="name"
              id="name"
              class="form-input"
              placeholder="Name"
              v-model="data.name"
            />
            <span
              class="validation-msg"
              v-for="message of validation_message.name"
              :key="`name-${message}`"
              >{{ message }}</span
            >
          </div>
          <div class="form-wrapper">
            <label for="email">Please enter your email</label>
            <input
              type="email"
              name="email"
              id="email"
              class="form-input"
              placeholder="your@email.com"
              v-model="data.email"
            />
            <span
              class="validation-msg"
              v-for="message of validation_message.email"
              :key="`email-${message}`"
              >{{ message }}</span
            >
          </div>
          <div class="form-wrapper">
            <label for="password">Please enter your password</label>
            <input
              type="password"
              name="password"
              id="password"
              class="form-input"
              placeholder="Password"
              v-model="data.password"
            />
            <span
              class="validation-msg"
              v-for="message of validation_message.password"
              :key="`password-${message}`"
              >{{ message }}</span
            >
          </div>
          <button
            class="btn btn-signup"
            @click="submitData"
            :disabled="loading"
          >
            {{ loading ? "Please Wait..." : "Register" }}
          </button>
        </div>
      </div>
      <router-link to="/login" class="text-center create-account-link"
        >Login to your account</router-link
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/css/scss/variables.scss";

.signup {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .card {
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 8px 0px rgb(118 118 118);
    border-radius: 0.9rem;
    width: 50%;

    @media screen and (max-width: 992px) {
      width: 100%;
    }

    &-body {
      padding: 1.9rem;

      @media screen and (max-width: 600px) {
        padding: 1.4rem;
      }

      h1 {
        margin-bottom: 1.3rem;
      }

      .validation-msg {
        color: red;
      }

      .form-wrapper {
        margin: 0.4rem 0 1.6rem 0;

        .form-input {
          width: 100%;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border: 1px solid rgb(173, 173, 173);
          border-radius: 0.5rem;
          outline: none;

          &:focus {
            box-shadow: 0 0px 3px rgba(0, 0, 0, 0.18) inset,
              0 0 10px rgba(0, 0, 0, 0.02);
            border: 1px solid rgb(119, 119, 119);
          }
        }

        .validation-error {
          border: 1px solid red;
        }
      }

      .btn-signup {
        background-color: $primary-color;
        color: white;
        font-weight: 800;
        width: 100%;

        &:hover {
          background-color: #ffaa33;
        }
      }
    }
  }

  .create-account-link {
    color: #6c6c6c;
    text-decoration: none;
    margin-top: 1rem;

    &:hover {
      color: #000000;
    }
  }
}
</style>
