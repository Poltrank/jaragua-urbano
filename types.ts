
export enum Category {
  RESTAURANTS = 'RESTAURANTS',
  HOTELS = 'HOTELS',
  DRIVERS = 'DRIVERS',
  GENERAL = 'GENERAL'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface Voucher {
  storeName: string;
  discount: string;
  code: string;
  cpf: string;
  date: string;
  color: string;
  rules: string;
}