<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="h-full w-full overflow-hidden">
      <img src="@/components/icons/world.svg" class="background-map h-full w-full object-cover">
    </div>
    <div class="bg-gray-600 rounded px-24 py-16 w-320 flex flex-col gap-16 absolute">
      <div class="flex justify-center py-36">
        <font-awesome-icon icon="fa-solid fa-user" class="icon bg-gray-500 rounded-full p-28 w-48 h-48"/>
      </div>
      <div class="flex flex-col gap-y-16">
        <div class="flex flex-col gap-y-8">
          <p class="text-label">Email</p>
          <input type="text" class="text-input rounded" :class="errorClass" v-model="email">
          <p v-if="errorClass !== ''" class="text-red-300 font-light font-size-tiny">Credenziali errate</p>
        </div>
        <div class="flex flex-col gap-y-8">
          <p class="text-label">Password</p>
          <div class="flex items-stretch justify-end" :class="errorClass">
            <input :type="type" class="rounded-l text-input" v-model="password">
            <div class="show">
              <ShowIcon :show="show" @click="toggle" class="text-gray-400 top-20%"/>
            </div>
          </div>
        </div>
        <Button color="blue" @click="login" class="cursor-pointer" :disabled="loading">
          <div class="h-33">
            Accedi
          </div>
        </Button>
      </div>
      <div class="flex flex-col gap-2">
        <p class="bottom-link" @click="openLink('https://dicyvpn.com/register')">Crea un account</p>
        <p class="bottom-link" @click="openLink('https://dicyvpn.com/recover-password')">Recupera la password</p>
      </div>
      <div class="flex mt-64 gap-8">
        <img src="@/components/icons/outh2/btn_google.svg" alt="logo">
        <img src="@/components/icons/outh2/btn_github.svg" alt="logo">
        <img src="@/components/icons/outh2/btn_twitter.svg" alt="logo">
        <img src="@/components/icons/outh2/btn_facebook.svg" alt="logo">
        <img src="@/components/icons/outh2/btn_reddit.svg" alt="logo">
      </div>
    </div>
  </div>
</template>

<script>
import ShowIcon from "@/views/ShowIcon.vue";
import Button from "@/components/icons/Button.vue";
import WorldMap from "@/components/home/map/WorldMap.vue";
import {apiPost} from "@/assets/api";

export default {
  name: "LoginView",
  components: {WorldMap, Button, ShowIcon},
  data() {
    return {
      show: false,
      type: "password",
      password: "",
      email: "",
      errorClass: "",
      loading: false,
    };
  },
  methods: {
    openLink(link) {
      window.api.externalLink(link);
    },
    toggle() {
      this.show = !this.show;
      this.type = this.show ? "text" : "password";
    },
    async login() {
      this.loading = true
      apiPost("/v1/public/login",  JSON.stringify({ email: this.email, password: this.password,}), true)
          .then(
          (res) => {
            this.loading = false
            if (res.status === 400 || res.status === 401) {
              this.errorClass = "border-red-400 border-2 rounded"
              return
            }

            let token = res.headers.get("X-Auth-Token")
            let refreshToken = res.headers.get("X-Auth-Refresh-Token")
            let refreshTokenId = ""
            let accountId = ""



            try {
              const [, payload] = token.split(".");
              const json = JSON.parse(atob(payload));
              refreshTokenId = json.refreshTokenId;
              accountId = json._id;
            } catch (e) {
              console.debug("Error parsing token", e);
            }

            localStorage.setItem("token", JSON.stringify({token: token, refreshToken: refreshToken, refreshTokenId: refreshTokenId, accountId: accountId} ))
            this.$router.push({name: "placeholder"})
          },
      ).catch(() => {
        this.loading = false
        alert("Errore di connessione")
      })
    },
  },
}
</script>

<style scoped>
.background-map {
  transform: scale(1.4);
  transform-origin: center;
}

.text-input:focus {
  outline: transparent none 0;
}

.text-label {
  @apply text-gray-200
}

.text-input {
  @apply w-full h-36 bg-gray-100 text-gray-600 px-16;
}

.show {
  border-radius: 0 3px 3px 0;
  @apply bg-gray-900 w-[2.5rem] flex items-center justify-center
}

.bottom-link {
  @apply font-light text-gray-200 underline underline-offset-2 text-small
}

</style>
