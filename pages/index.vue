<template>
  <div class="grow">
    <div class="px-6 pt-14 lg:px-8">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <!--
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
          <div
            class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
          >
            Announcing our next round of funding.
            <a href="#" class="font-semibold text-zinc-600"
              ><span class="absolute inset-0" aria-hidden="true" />Read more
              <span aria-hidden="true">&rarr;</span></a
            >
          </div>
        </div>
-->
        <div class="text-center">
          <img src="@/assets/banner.png" class="w-full h-auto" />
          <p class="mt-6 text-lg leading-8 text-gray-600">
            At the Globe Foundation, we build and maintain a variety of farms,
            shops and infrastructure, enhancing your Minecraft experience, from
            within the game.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink
              href="/pricing"
              class="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
              >Join Globe+</NuxtLink
            >
            <NuxtLink href="/about" class="text-sm font-semibold leading-6 text-gray-900"
              >Learn more <span aria-hidden="true">→</span></NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
