
export enum ThemeType {
  DEFAULT = 'default',
  AHLY = 'ahly',
  RAMADAN = 'ramadan',
  CHRISTMAS = 'christmas'
}

export enum DeviceMode {
  SINGLE = 'single',
  MULTI = 'multi'
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  drinkId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  startTime: string; // HH:mm
  duration: number; // minutes
  isLoyal?: boolean; // Priority flag for customer loyalty
  createdAt: number; // Timestamp for booking time prioritization
}

export interface Device {
  id: string;
  name: string;
  isRoom: boolean;
  status: 'idle' | 'running';
  mode: DeviceMode;
  startTime?: Date;
  drinks: OrderItem[];
  reservations: Reservation[];
}

export interface SessionRecord {
  id: string;
  deviceName: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  drinksTotal: number;
  playTotal: number;
  mode: DeviceMode;
}

export interface AppSettings {
  singlePrice: number;
  multiPrice: number;
  roomPrice: number;
  theme: ThemeType;
}
