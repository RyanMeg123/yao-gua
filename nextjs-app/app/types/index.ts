export type CoinResult = 'H' | 'T';

export interface TossResult {
  coins: [CoinResult, CoinResult, CoinResult];
  yaoType: '老阳' | '少阳' | '少阴' | '老阴';
  isChanging: boolean;
  value: number; // 6, 7, 8, 9
}

export interface UserInfo {
  time: string;
  question: string;
  age: string;
  gender: string;
}

export interface DivinationData {
  userInfo: UserInfo;
  tosses: TossResult[];
}

export interface HistoryRecord {
  id: number;
  time: string;
  question: string;
  age: string;
  gender: string;
  tosses: TossResult[];
  interpretation: string;
  createdAt: string;
}
