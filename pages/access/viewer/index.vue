<template>
  <div class="px-4 sm:px-6 mx-auto grow max-w-5xl">
    <div class="border-b border-gray-200 bg-white py-5">
      <h3 class="text-xl font-semibold leading-6 text-gray-900">Documents</h3>
    </div>
    <ul
      v-if="documents.data.value"
      role="list"
      class="divide-y divide-gray-100"
    >
      <li
        v-for="document in documents.data.value"
        :key="document.id"
        class="flex items-center justify-between gap-x-6 py-5"
      >
        <div class="min-w-0 w-full">
          <div class="flex items-start gap-x-3">
            <p
              v-if="decryptedDocuments[document.id]?.filename"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              {{ decryptedDocuments[document.id].filename }}
            </p>
            <div
              v-else
              class="h-3 grow max-w-sm rounded-full bg-gray-400 animate-pulse"
            />
            <p
              v-if="decryptedDocuments[document.id]?.clearance"
              :class="[
                clearances[decryptedDocuments[document.id].clearance],
                'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
              ]"
            >
              {{ decryptedDocuments[document.id].clearance }}
            </p>
          </div>
          <div
            v-if="decryptedDocuments[document.id]"
            class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500"
          >
            Size:
            {{
              formatBytes((decryptedDocuments[document.id].data.length / 4) * 3)
            }}
          </div>
        </div>
        <div class="flex flex-none items-center gap-x-4">
          <NuxtLink
            :href="`/access/viewer/${document.id}`"
            class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >View document<span class="sr-only"
              >, {{ document.id }}</span
            ></NuxtLink
          >
        </div>
      </li>
    </ul>
    <div v-else class="w-full flex mt-6 justify-center" role="status">
      <svg
        aria-hidden="true"
        class="w-10 h-10 text-transparent animate-spin fill-zinc-600"
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
  </div>
</template>

<script setup lang="ts">
import { decryptSymmetric, genKey, type Payload, type User } from "../payload";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const router = useRouter();

const auth = useState<User>("auth");

if (!auth.value) {
  router.replace("/access/login");
}

const payload = useState<Payload>("payload");

const clearances: { [key: string]: string } = {
  B: "text-green-700 bg-green-50 ring-green-600/20",
  NV1: "text-cyan-600 bg-cyan-50 ring-cyan-500/10",
  NV2: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  PV: "text-red-800 bg-red-50 ring-red-600/20",
};

const decryptedDocuments = ref<{
  [key: string]: { filename: string; data: string; clearance: string };
}>({});

const documents = useAsyncData(
  "viewer-documents",
  async (): Promise<Array<{ id: string; ciphertext: string; iv: string }>> => {
    // We filter, but typescript doesn't pick it up
    // @ts-ignore
    return Object.entries(payload.value.documents)
      .map(([foldername, files]) => {
        if (files[auth.value.userID]) {
          // We have an entry in this document
          const file = files[auth.value.userID];
          decryptSymmetric(file.ciphertext, file.iv, auth.value.key).then(
            (doc) => {
              const data = JSON.parse(doc);
              decryptedDocuments.value[foldername] = data;
            }
          );
          return { ...file, id: foldername };
        }
      })
      .filter((e) => e);
  }
);
</script>
