<template>
  <div class="row hotel-card">
    <div class="col-12 col-md-12 col-lg-4 hotel-card__thumb">
      <img :src="hotel.thumb" :alt="`Imagem principal: ${hotel.name}`" />
    </div>
    <div class="col-12 col-md-9 col-lg-6 hotel-card__body">
      <h2 class="hotel-card__title text-primary">{{ hotel.name }}</h2>

      <div class="hotel-card__prices">
        <p class="hotel-card__daily"><b>Diária:</b> {{ formatBRL(hotel.dailyPrice) }}</p>
        <p class="hotel-card__tax"><b>Taxa:</b> {{ formatBRL(hotel.tax) }}</p>
      </div>
    </div>
    <div class="col-12 col-md-3 col-lg-2 hotel-card__footer">
      <div class="hotel-card__stars">
        <q-icon
          v-for="i in 5"
          :key="i"
          name="star"
          :color="i <= Number(hotel.stars) ? 'yellow-7' : 'grey-4'"
          size="18px"
        />
      </div>
      <q-btn
        class="hotel-card__btn bg-primary text-white"
        label="Ver detalhes"
        @click="$emit('view', hotel)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Hotel } from '../../types/hotel';
import { formatBRL } from 'src/utils/format';

defineProps<{ hotel: Hotel }>();
</script>
