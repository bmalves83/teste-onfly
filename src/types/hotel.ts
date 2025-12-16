export type Hotel = {
  id: number;
  name: string;
  stars: string;
  totalPrice: number;
  dailyPrice: number;
  tax: number;
  thumb: string;
  images?: string[];
  amenities: { key: string; label?: string }[];
  hasBreakFast: boolean;
  hasRefundableRoom: boolean;
  district: string;
  placeId: number;
  description?: string;
  fullAddress?: string;
};

export type City = {
  name: string;
  state: {
    name: string;
    shortname: string;
  };
  placeId: number;
};
