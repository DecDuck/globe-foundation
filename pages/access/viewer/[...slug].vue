<template>
  <div
    class="grow flex flex-col gap-y-12 items-center justify-center"
    v-if="!url.data.value"
  >
    <div role="status">
      <svg
        aria-hidden="true"
        class="w-12 h-12 text-transparent animate-spin fill-zinc-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-if="url.error.value" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ url.error.value }}
          </h3>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute w-full h-full inset-0 z-10" v-else>
    <object
      class="w-full h-full"
      type="application/pdf"
      :data="url.data.value"
    />
    <button
      type="button"
      @click="() => router.back()"
      class="absolute bottom-5 left-5 rounded-full bg-zinc-600 p-2 text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
    >
      <ArrowUturnLeftIcon class="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowUturnUpIcon, XCircleIcon } from "@heroicons/vue/20/solid";
import { decryptSymmetric, genKey, type Payload, type User } from "../payload";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const auth = useState<User>("auth");

if (!auth.value) {
  router.replace("/access/login");
}

const payload = useState<Payload>("payload");

const url = useAsyncData(`url-${route.params.slug}`, async () => {
  const slug: string = Array.isArray(route.params.slug)
    ? route.params.slug[0]
    : route.params.slug;
  const file = payload.value.documents[slug][auth.value.userID];
  const key = await genKey(auth.value.password);
  const decryptedData = JSON.parse(
    await decryptSymmetric(file.ciphertext, file.iv, key)
  );
  const data = atob(decryptedData.data);
  const byteNumbers = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    byteNumbers[i] = data.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  return URL.createObjectURL(blob);
});
</script>
