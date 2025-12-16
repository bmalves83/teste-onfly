<template>
  <!-- <router-view /> -->
  <q-layout view="lHr LpR lFr">
    <q-header class="bg-blue-1 text-primary">
      <div class="container">
        <div class="row justify-between items-center">
          <q-toolbar-title class="row items-center">
            <img src="./assets/onfly-logo.svg" alt="Onfly" height="32" class="q-mr-sm" />
          </q-toolbar-title>
          <h1 class="q-ma-none">Onfly - Teste Frontend</h1>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <div class="container">
        <p class="text-center q-ma-none text-dark">
          Teste desenvolvido por
          <a href="https://www.linkedin.com/in/bmalves83/" target="_blank">Bruno Moreira Alves</a>
        </p>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
//
</script>
