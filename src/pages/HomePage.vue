<template>
  <div class="container">
    <div class="row q-col-gutter-sm justify-center">
      <div class="col-12 col-lg-4">
        <q-input
          v-model="store.nameFilter"
          outlined
          label-color="primary"
          class="custom-input"
          label="Filtrar por nome"
          dense
          @input="store.filterByName(store.nameFilter)"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-lg-4">
        <q-select
          v-model="store.selectedCity"
          :options="cityOptions"
          option-value="value"
          option-label="label"
          label="Destino"
          label-color="primary"
          outlined
          dense
          class="custom-input"
          use-input
          @filter="filterCities"
          emit-value
          map-options
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="my_location" color="primary" />
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <q-select
          v-model="store.sortBy"
          outlined
          class="custom-input"
          label-color="primary"
          :options="sortOptions"
          option-value="value"
          option-label="label"
          label="Ordenar"
          emit-value
          dense
          :display-value="sortDisplay"
        >
          <template v-slot:prepend>
            <q-icon name="sort" color="primary" />
          </template>
        </q-select>
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
        <span class="drawer__title">{{ store.details?.name }}</span>

        <q-btn flat dense round icon="close" aria-label="Fechar" @click="drawer = false" />
      </div>
      <div class="main-info q-pl-md q-pr-md q-pt-lg q-pb-sm">
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
          <q-img
            v-else
            :src="store.details.thumb"
            :alt="`Imagem principal: ${store.details.name}`"
            ratio="4/3"
            fit="cover"
            class="hotel-card__img"
          >
            <template #error>
              <q-img
                src="../images/hotel-image-placeholder.png"
                :alt="`Imagem padrão do hotel ${store.details.name}`"
                ratio="4/3"
                fit="cover"
              />
            </template>
          </q-img>

          <div class="hotel-card__stars q-mt-lg">
            <q-icon
              v-for="i in 5"
              :key="i"
              name="star"
              :color="i <= Number(store.details.stars) ? 'primary' : 'grey-4'"
              size="18px"
            />
          </div>
          <div>
            <h3>Comodidades:</h3>
            <q-chip
              v-for="amenity in store.details.amenities"
              :key="amenity.key"
              color="primary"
              text-color="white"
              dense
              class="q-pa-md"
            >
              <q-icon :name="getAmenityIcon(amenity.key)" class="q-mr-xs" />
              {{ amenity.label || amenity.key }}
            </q-chip>
          </div>
          <h3>Localização</h3>
          <div v-if="store.details.fullAddress">
            <p><span>Endereço:</span> {{ store.details.fullAddress }}</p>
          </div>
          <p><span>Distrito:</span> {{ store.details.district }}</p>
          <h3>Sobre {{ store.details.name }}</h3>
          <div v-if="store.details.description">
            <p>{{ store.details.description }}</p>
          </div>
          <p><span>Diária:</span> {{ formatBRL(store.details.dailyPrice) }}</p>
          <p><span>Taxa:</span> {{ formatBRL(store.details.tax) }}</p>
          <p><span>Café da manhã:</span> {{ store.details.hasBreakFast ? 'Sim' : 'Não' }}</p>
          <p><span>Reembolso:</span> {{ store.details.hasRefundableRoom ? 'Sim' : 'Não' }}</p>
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
import { formatBRL, getAmenityIcon } from '../utils/format';

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
