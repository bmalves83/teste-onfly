<template>
  <div class="row hotel-card">
    <div class="col-12 col-sm-4 col-md-12 col-lg-3 hotel-card__thumb">
      <q-img
        :src="hotel.thumb"
        :alt="`Imagem principal: ${hotel.name}`"
        ratio="4/3"
        fit="cover"
        class="hotel-card__img"
      >
        <template #error>
          <q-img
            src="../../images/hotel-image-placeholder.png"
            :alt="`Imagem padrão do hotel ${hotel.name}`"
            ratio="4/3"
            fit="cover"
          />
        </template>
      </q-img>
    </div>
    <div class="col-12 col-sm-5 col-md-9 col-lg-7 hotel-card__body">
      <h2 class="hotel-card__title text-primary">{{ hotel.name }}</h2>

      <div class="hotel-card__prices">
        <p class="hotel-card__daily"><b>Diária:</b> {{ formatBRL(hotel.dailyPrice) }}</p>
        <p class="hotel-card__tax"><b>Taxa:</b> {{ formatBRL(hotel.tax) }}</p>
      </div>

      <div class="hotel-card__amenities" v-if="hotel.amenities && hotel.amenities.length > 0">
        <q-icon
          v-for="amenity in hotel.amenities.slice(0, 4)"
          :key="amenity.key"
          :name="getAmenityIcon(amenity.key)"
          size="20px"
          color="primary"
          class="q-mr-xs"
        />
        <span v-if="hotel.amenities.length > 4" class="text-grey-6"
          >+{{ hotel.amenities.length - 4 }}</span
        >
      </div>
    </div>
    <div class="col-12 col-sm-3 col-md-3 col-lg-2 hotel-card__footer">
      <div class="hotel-card__stars">
        <q-icon
          v-for="i in 5"
          :key="i"
          name="star"
          :color="i <= Number(hotel.stars) ? 'primary' : 'grey-4'"
          size="18px"
        />
      </div>
      <q-btn
        unelevated
        color="primary"
        class="hotel-card__btn"
        label="Ver detalhes"
        @click="$emit('view', hotel)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Hotel } from '../../types/hotel';
import { formatBRL, getAmenityIcon } from 'src/utils/format';

defineProps<{ hotel: Hotel }>();
</script>
