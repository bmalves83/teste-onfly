import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHotel } from '../stores/hotelsStore';

describe('useHotel Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty state', () => {
    const store = useHotel();
    expect(store.list).toEqual([]);
    expect(store.filtered).toEqual([]);
    expect(store.page).toBe(1);
  });

  it('should filter by name', () => {
    const store = useHotel();
    store.list = [
      {
        id: 1,
        name: 'Hotel A',
        stars: '5',
        totalPrice: 100,
        dailyPrice: 10,
        tax: 5,
        thumb: '',
        amenities: [],
        hasBreakFast: true,
        hasRefundableRoom: true,
        district: '',
        placeId: 1,
      },
      {
        id: 2,
        name: 'Hotel B',
        stars: '4',
        totalPrice: 200,
        dailyPrice: 20,
        tax: 10,
        thumb: '',
        amenities: [],
        hasBreakFast: true,
        hasRefundableRoom: true,
        district: '',
        placeId: 1,
      },
    ];
    store.filterByName('Hotel A');
    expect(store.filtered).toHaveLength(1);
    expect(store.filtered[0]!.name).toBe('Hotel A');
  });

  it('should order by price', () => {
    const store = useHotel();
    store.list = [
      {
        id: 1,
        name: 'Hotel A',
        stars: '5',
        totalPrice: 100,
        dailyPrice: 20,
        tax: 5,
        thumb: '',
        amenities: [],
        hasBreakFast: true,
        hasRefundableRoom: true,
        district: '',
        placeId: 1,
      },
      {
        id: 2,
        name: 'Hotel B',
        stars: '4',
        totalPrice: 200,
        dailyPrice: 10,
        tax: 10,
        thumb: '',
        amenities: [],
        hasBreakFast: true,
        hasRefundableRoom: true,
        district: '',
        placeId: 1,
      },
    ];
    store.orderByPrice();
    expect(store.filtered[0]!.dailyPrice).toBe(10);
    expect(store.filtered[1]!.dailyPrice).toBe(20);
  });
});
