export type CoinResult = 'H' | 'T'; // H for Head (正面), T for Tail (反面)

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

export interface HistoryItem extends UserInfo {
  id: number;
  tosses: TossResult[];
  interpretation: string;
  created_at: string;
}
