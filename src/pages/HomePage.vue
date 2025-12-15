<template>
  <div class="container">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-select
          v-model="store.selectedCity"
          :options="cityOptions"
          option-value="value"
          option-label="label"
          label="Destino"
          filled
          use-input
          @filter="filterCities"
          emit-value
          map-options
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="my_location" />
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="store.sortBy"
          filled
          :options="sortOptions"
          option-value="value"
          option-label="label"
          label="Ordenar"
          emit-value
          :display-value="sortDisplay"
        >
          <template v-slot:prepend>
            <q-icon name="sort" />
          </template>
        </q-select>
      </div>

      <div class="col-12">
        <q-input
          v-model="store.nameFilter"
          filled
          color="primary"
          label="Filtrar por nome"
          @input="store.filterByName(store.nameFilter)"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="hotel-list q-mt-lg">
      <div class="row">
        <div class="col-12 q-mt-md q-mb-md" v-for="hotel in paginated" :key="hotel.id">
          <HotelCard :hotel="hotel" @view="openDetails" />
        </div>
      </div>

      <div class="q-mt-lg q-mb-lg text-center text-md-left">
        <q-btn
          class="bg-secondary text-white q-mr-md"
          label="Anterior"
          :disabled="page === 1"
          @click="prev"
        />
        <span>{{ page }} de {{ totalPages }}</span>
        <q-btn
          class="bg-secondary text-white q-ml-md"
          label="Próximo"
          :disabled="page >= totalPages"
          @click="next"
        />
      </div>
    </div>

    <q-drawer v-model="drawer" side="right" :width="420">
      <div class="drawer__header">
        <span class="drawer__title">Detalhes do hotel</span>

        <q-btn flat dense round icon="close" aria-label="Fechar" @click="drawer = false" />
      </div>
      <div v-if="store.loadingDetails" class="q-pa-md">
        <q-spinner color="primary" size="3em" />
        <p>Carregando detalhes...</p>
      </div>
      <div v-else-if="store.details" class="q-drawer__details">
        <q-carousel
          v-if="store.details.images && store.details.images.length > 0"
          v-model="carouselSlide"
          animated
          swipeable
          arrows
          height="240px"
          class="drawer-details__carousel"
        >
          <q-carousel-slide
            v-for="(img, index) in store.details.images"
            :key="index"
            :name="index"
            :img-src="img"
          />
        </q-carousel>
        <img v-else :src="store.details.thumb" alt="" class="hotel-details__thumb" />

        <div class="bg-main-info q-pl-md q-pr-md q-pt-lg q-pb-sm">
          <div class="hotel-card__stars">
            <q-icon
              v-for="i in 5"
              :key="i"
              name="star"
              :color="i <= Number(store.details.stars) ? 'yellow-7' : 'grey-4'"
              size="18px"
            />
          </div>
          <h3>{{ store.details.name }}</h3>
          <div v-if="store.details.description">
            <p>{{ store.details.description }}</p>
          </div>
          <div v-if="store.details.fullAddress">
            <p><span>Endereço:</span> {{ store.details.fullAddress }}</p>
          </div>
        </div>
        <div class="q-drawer__info q-mt-md">
          <p><span>Distrito:</span> {{ store.details.district }}</p>
          <p><span>Diária:</span> {{ formatBRL(store.details.dailyPrice) }}</p>
          <p><span>Taxa:</span> {{ formatBRL(store.details.tax) }}</p>
          <p><span>Café da manhã:</span> {{ store.details.hasBreakFast ? 'Sim' : 'Não' }}</p>
          <p><span>Reembolso:</span> {{ store.details.hasRefundableRoom ? 'Sim' : 'Não' }}</p>
          <div>
            <h4>Comodidades:</h4>
            <q-chip
              v-for="amenity in store.details.amenities"
              :key="amenity.key"
              color="primary"
              text-color="white"
              dense
              class="q-pa-md"
            >
              {{ amenity.label }}
            </q-chip>
          </div>
        </div>
      </div>
    </q-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useHotel } from '../stores/hotelsStore';
import HotelCard from '../components/HotelCard/HotelCard.vue';
import type { City, Hotel } from '../types/hotel';
import { formatBRL } from '../utils/format';

const store = useHotel();
const drawer = ref(false);
const carouselSlide = ref(0);

const sortOptions = [
  { label: 'Preço', value: 'price' },
  { label: 'Estrelas', value: 'stars' },
];

const sortDisplay = computed(() => sortOptions.find((o) => o.value === store.sortBy)?.label || '');

const cityOptions = ref<{ label: string; value: City }[]>([]);

onMounted(async () => {
  await store.fetchHotels();
  await store.fetchCities();
});

watch(
  () => store.sortBy,
  () => {
    store.setPage(1);
  },
);

function filterCities(val: string, update: (fn: () => void) => void) {
  update(() => {
    cityOptions.value = store.filterCities(val);
  });
}

const paginated = computed(() => store.paginated);
const page = computed(() => store.page);
const totalPages = computed(() => store.totalPages);

function prev() {
  if (store.page > 1) store.setPage(store.page - 1);
}

function next() {
  if (store.page < store.totalPages) store.setPage(store.page + 1);
}

async function openDetails(hotel: Hotel) {
  await store.openDetails(hotel);
  drawer.value = true;
}

//const selected = computed(() => store.selected);
</script>
