import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../utils/api';
import type { Hotel, City } from '../types/hotel';

interface RawHotel {
  id: number;
  name: string;
  stars: string;
  totalPrice: number;
  dailyPrice: number;
  tax: number;
  thumb: string;
  images?: string[];
  amenities: (string | { key: string; label?: string })[];
  hasBreakFast: boolean;
  hasRefundableRoom: boolean;
  district: string;
  placeId: number;
  description?: string;
  fullAddress?: string;
}

export const useHotel = defineStore('hotels', () => {
  const list = ref<Hotel[]>([]);
  const cities = ref<City[]>([]);
  const selectedCity = ref<City | null>(null);
  const selected = ref<Hotel | null>(null);
  const details = ref<Hotel | null>(null);
  const loading = ref(false);
  const loadingDetails = ref(false);
  const page = ref(1);
  const perPage = ref(6);
  const nameFilter = ref('');
  const sortBy = ref<'' | 'price' | 'stars'>('');

  const filtered = computed(() => {
    let filtered = list.value;
    if (selectedCity.value) {
      filtered = filtered.filter((h) => h.placeId === selectedCity.value!.placeId);
    }
    if (nameFilter.value) {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes(nameFilter.value.toLowerCase()),
      );
    }
    if (sortBy.value === 'price') {
      filtered = [...filtered].sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (sortBy.value === 'stars') {
      filtered = [...filtered].sort(
        (a, b) => parseInt(b.stars.toString()) - parseInt(a.stars.toString()),
      );
    }
    return filtered;
  });

  const paginated = computed(() => {
    const start = (page.value - 1) * perPage.value;
    return filtered.value.slice(start, start + perPage.value);
  });

  const totalPages = computed(() => Math.ceil(filtered.value.length / perPage.value));

  const fetchHotels = async () => {
    loading.value = true;
    const { data } = await api.get('/hotels');
    list.value = data.map((hotel: RawHotel) => ({
      ...hotel,
      amenities: hotel.amenities.map((amenity) =>
        typeof amenity === 'string' ? { key: amenity } : amenity,
      ),
    }));
    loading.value = false;
  };

  const fetchCities = async () => {
    const { data } = await api.get('/cities');
    cities.value = data;
  };

  const fetchHotelDetails = async (name: string) => {
    loadingDetails.value = true;
    try {
      const { data } = await api.get(`/hotels_details?name=${encodeURIComponent(name)}`);
      if (data && data.length > 0) {
        details.value = { ...selected.value, ...data[0] };
      } else {
        details.value = selected.value; // Fallback
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      details.value = selected.value; // Fallback
    } finally {
      loadingDetails.value = false;
    }
  };

  const filterCities = (q: string): { label: string; value: City }[] => {
    return cities.value
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .map((c) => ({
        label: `${c.name}, ${c.state.name}`,
        value: c,
      }));
  };

  const filterByName = (text: string) => {
    nameFilter.value = text;
    page.value = 1;
  };

  const filterByCity = (city: City | null) => {
    selectedCity.value = city;
    page.value = 1;
  };

  const orderByPrice = () => {
    sortBy.value = 'price';
  };

  const orderByStars = () => {
    sortBy.value = 'stars';
  };

  const setPage = (p: number) => {
    page.value = p;
  };

  const openDetails = async (hotel: Hotel) => {
    selected.value = hotel;
    await fetchHotelDetails(hotel.name);
  };

  return {
    list,
    cities,
    selectedCity,
    selected,
    details,
    loading,
    loadingDetails,
    page,
    perPage,
    nameFilter,
    sortBy,
    filtered,
    paginated,
    totalPages,
    fetchHotels,
    fetchCities,
    fetchHotelDetails,
    filterCities,
    filterByName,
    filterByCity,
    orderByPrice,
    orderByStars,
    setPage,
    openDetails,
  };
});
