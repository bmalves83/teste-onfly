<template>
  <!-- <router-view /> -->
  <q-layout view="lHr LpR lFr">
    <q-header class="bg-primary-100 text-white">
      <div class="container"><h1 class="q-ma-none">Onfly - Teste Frontend</h1></div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <div class="container">
        <p class="text-center q-ma-none text-dark">
          Teste desenvolvido com <q-icon name="favorite" color="negative" size="18px" /> por Bruno
          Moreira Alves
        </p>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
//
</script>
