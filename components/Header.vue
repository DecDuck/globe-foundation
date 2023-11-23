<template>
  <header>
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <NuxtLink href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Globe Foundation</span>
          <img class="h-8 w-auto" src="@/assets/icon.svg" alt="" />
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900"
          >Features</a
        >
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900"
          >Marketplace</a
        >
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900"
          >Company</a
        >
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <NuxtLink
          v-if="!auth"
          to="/access/login"
          class="text-sm font-semibold leading-6 text-gray-900"
          >Sign in <span aria-hidden="true">&rarr;</span></NuxtLink
        >
        <NuxtLink
          v-else
          to="/access/viewer"
          class="text-sm font-semibold leading-6 text-gray-900"
          >Documents <span aria-hidden="true">&rarr;</span></NuxtLink
        >
      </div>
    </nav>
    <TransitionRoot as="template" :show="mobileMenuOpen">
      <Dialog as="div" class="relative z-10" @close="mobileMenuOpen = false">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl"
                  >
                    <div class="px-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <NuxtLink href="/" class="-m-1.5 p-1.5">
                          <span class="sr-only">Globe Foundation</span>
                          <img
                            class="h-8 w-auto"
                            src="@/assets/icon.svg"
                            alt=""
                          />
                        </NuxtLink>
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            @click="mobileMenuOpen = false"
                          >
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="relative mt-6 flex-1 px-6">
                      <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                          <a
                            href="#"
                            class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >Features</a
                          >
                          <a
                            href="#"
                            class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >Marketplace</a
                          >
                          <a
                            href="#"
                            class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >Company</a
                          >
                        </div>
                        <div class="py-6">
                          <NuxtLink
                            v-if="!auth"
                            to="/access/login"
                            class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >Sign in</NuxtLink
                          >
                          <NuxtLink
                            v-else
                            to="/access/viewer"
                            class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >Documents</NuxtLink
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import type { User } from "~/pages/access/encryption";

const mobileMenuOpen = ref(false);

const auth = useState<User>("auth");

const router = useRouter();
router.afterEach(() => {
  mobileMenuOpen.value = false;
});
</script>
