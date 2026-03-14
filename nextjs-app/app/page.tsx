'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LucideHistory,
  LucideInfo,
  LucideRefreshCw,
  LucideSend,
  LucideCoins,
  LucideChevronRight,
  LucideChevronLeft,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Coin } from './components/Coin';
import { HexagramDisplay } from './components/HexagramDisplay';
import { UserInfo, TossResult, CoinResult, HistoryRecord } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Step = 'welcome' | 'info' | 'tossing' | 'interpreting' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('welcome');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    time: new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()),
    question: '',
    age: '',
    gender: '男',
  });
  const [tosses, setTosses] = useState<TossResult[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentCoins, setCurrentCoins] = useState<CoinResult[]>(['H', 'H', 'H']);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setStep('info');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.question || !userInfo.age) return;
    setStep('tossing');
  };

  const tossCoins = () => {
    if (isSpinning || tosses.length >= 6) return;
    setIsSpinning(true);

    setTimeout(() => {
      const results: CoinResult[] = Array.from({ length: 3 }, () =>
        Math.random() > 0.5 ? 'H' : 'T'
      );
      setCurrentCoins(results);

      const headsCount = results.filter((r) => r === 'H').length;
      let yaoType: TossResult['yaoType'];
      let value: number;
      let isChanging = false;

      if (headsCount === 3) {
        yaoType = '老阳';
        value = 9;
        isChanging = true;
      } else if (headsCount === 2) {
        yaoType = '少阳';
        value = 7;
      } else if (headsCount === 1) {
        yaoType = '少阴';
        value = 8;
      } else {
        yaoType = '老阴';
        value = 6;
        isChanging = true;
      }

      const newToss: TossResult = {
        coins: results as [CoinResult, CoinResult, CoinResult],
        yaoType,
        isChanging,
        value,
      };

      setTosses((prev) => [...prev, newToss]);
      setIsSpinning(false);
    }, 800);
  };

  useEffect(() => {
    if (tosses.length === 6 && step === 'tossing') {
      const timer = setTimeout(() => {
        setStep('interpreting');
        startInterpretation();
      }, 1500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tosses, step]);

  const startInterpretation = async () => {
    try {
      const res = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo, tosses }),
      });
      const data = await res.json();
      const finalInterpretation = data.interpretation || '未能获取解卦结果，请重试。';
      setInterpretation(finalInterpretation);
      setStep('result');

      // Save to history
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userInfo, tosses, interpretation: finalInterpretation }),
      });
    } catch (err) {
      console.error(err);
      setError('解卦过程中出现错误，请检查网络或 API 配置。');
      setStep('result');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const deleteHistoryItem = async (id: number) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory]);

  const reset = () => {
    setStep('welcome');
    setTosses([]);
    setInterpretation(null);
    setError(null);
    setUserInfo({
      time: new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()),
      question: '',
      age: '',
      gender: '男',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 font-sans selection:bg-amber-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white font-serif italic">
            易
          </div>
          <h1 className="font-serif font-bold text-xl tracking-tight">义理易学顾问</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              'p-2 rounded-full transition-colors',
              showHistory ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500'
            )}
            title="历史记录"
          >
            <LucideHistory size={20} />
          </button>
          <button
            onClick={reset}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            title="重新开始"
          >
            <LucideRefreshCw size={20} />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">历史记录</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm"
                >
                  <LucideChevronLeft size={18} />
                  返回问卦
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
                  <p className="text-stone-400">暂无历史记录</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-serif font-bold text-lg mb-1">{item.question}</h3>
                          <p className="text-xs text-stone-400">{item.time}</p>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-stone-300 hover:text-red-500 transition-colors text-xs"
                        >
                          删除
                        </button>
                      </div>
                      <div className="flex gap-4 items-center mb-4 p-4 bg-stone-50 rounded-xl">
                        <HexagramDisplay tosses={item.tosses} />
                        <div className="text-sm text-stone-600">
                          <p>
                            {item.gender} · {item.age}岁
                          </p>
                        </div>
                      </div>
                      <div className="prose prose-stone prose-sm max-w-none line-clamp-2 text-stone-500 mb-4">
                        <Markdown>{item.interpretation}</Markdown>
                      </div>
                      <button
                        onClick={() => {
                          setUserInfo({
                            time: item.time,
                            question: item.question,
                            age: item.age,
                            gender: item.gender,
                          });
                          setTosses(item.tosses);
                          setInterpretation(item.interpretation);
                          setStep('result');
                          setShowHistory(false);
                        }}
                        className="text-stone-900 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        查看完整解卦 <LucideChevronRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <>
              {step === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-8 py-6 sm:py-12"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                      诚实、温厚、洞察
                    </h2>
                    <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
                      深谙《周易》义理体系，将卦象智慧转化为贴近当代生活的实际建议。
                      在这里，我们不粉饰结果，只为您指明方向。
                    </p>
                  </div>
                  <button
                    onClick={handleStart}
                    className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center gap-2 mx-auto group"
                  >
                    开始问卦
                    <LucideChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                  <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {[
                      {
                        icon: <LucideInfo size={20} />,
                        title: '义理派',
                        desc: '基于卦辞爻辞原文，逻辑自洽，提供人生智慧。',
                      },
                      {
                        icon: <LucideHistory size={20} />,
                        title: '不粉饰',
                        desc: '直接面对吉凶，不回避风险，给您最真实的建议。',
                      },
                      {
                        icon: <LucideSend size={20} />,
                        title: '生活化',
                        desc: '将古老智慧转化为当代人听得懂、用得上的建议。',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm"
                      >
                        <div className="text-amber-600 mb-3">{item.icon}</div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-200 border border-stone-100"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold mb-2">问卦信息</h2>
                    <p className="text-stone-500 text-sm">
                      请如实填写您的困惑，以便顾问为您深度解卦。
                    </p>
                  </div>
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">您想问的事情</label>
                      <textarea
                        required
                        placeholder="例如：我最近在考虑换工作，目前有两个机会，该如何抉择？"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all outline-none min-h-[120px]"
                        value={userInfo.question}
                        onChange={(e) =>
                          setUserInfo((prev) => ({ ...prev, question: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">摇卦时间</label>
                      <input
                        required
                        type="text"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all outline-none"
                        value={userInfo.time}
                        onChange={(e) =>
                          setUserInfo((prev) => ({ ...prev, time: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">年龄</label>
                        <input
                          required
                          type="number"
                          placeholder="您的年龄"
                          className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all outline-none"
                          value={userInfo.age}
                          onChange={(e) =>
                            setUserInfo((prev) => ({ ...prev, age: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">性别</label>
                        <select
                          className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all outline-none"
                          value={userInfo.gender}
                          onChange={(e) =>
                            setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
                          }
                        >
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep('welcome')}
                        className="flex-1 py-4 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LucideChevronLeft size={18} />
                        返回
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] py-4 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2"
                      >
                        下一步
                        <LucideChevronRight size={18} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'tossing' && (
                <motion.div
                  key="tossing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center gap-12 py-8"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-serif font-bold">诚心摇卦</h2>
                    <p className="text-stone-500">
                      请静心默念所问之事，点击抛掷硬币，共需六次。
                    </p>
                  </div>

                  <div className="flex gap-4 sm:gap-8 justify-center items-center h-32">
                    {currentCoins.map((res, i) => (
                      <Coin key={i} result={res} isSpinning={isSpinning} />
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={tossCoins}
                      disabled={isSpinning || tosses.length >= 6}
                      className={cn(
                        'w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-xl',
                        isSpinning || tosses.length >= 6
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700 active:scale-95'
                      )}
                    >
                      <LucideCoins size={32} />
                      <span className="text-xs font-bold">{tosses.length}/6</span>
                    </button>
                    <p className="text-sm font-medium text-stone-400">
                      {tosses.length === 6
                        ? '起卦完成，正在生成卦象...'
                        : `第 ${tosses.length + 1} 次抛掷`}
                    </p>
                  </div>

                  <div className="w-full max-w-xs bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                    <HexagramDisplay tosses={tosses} title="当前卦象" />
                  </div>
                </motion.div>
              )}

              {step === 'interpreting' && (
                <motion.div
                  key="interpreting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-serif italic text-stone-400">
                      解
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-serif font-bold">顾问正在深度解卦</h2>
                    <p className="text-stone-500 animate-pulse">正在感应卦象能量，请稍候...</p>
                  </div>
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-200 border border-stone-100">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-stone-100 pb-8 mb-8">
                      <div className="p-6 bg-stone-50 rounded-2xl">
                        <HexagramDisplay tosses={tosses} title="起卦结果" />
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-serif font-bold">解卦结果</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-stone-400">问卦时间</span>
                            <p className="font-medium">{userInfo.time}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-stone-400">问卦人</span>
                            <p className="font-medium">
                              {userInfo.age}岁 · {userInfo.gender}
                            </p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <span className="text-stone-400">所问之事</span>
                            <p className="font-medium italic">「{userInfo.question}」</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error ? (
                      <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                        {error}
                        <button
                          onClick={reset}
                          className="block mt-4 text-sm font-bold underline"
                        >
                          重新开始
                        </button>
                      </div>
                    ) : (
                      <div className="markdown-body">
                        <Markdown>{interpretation || ''}</Markdown>
                      </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
                      <button
                        onClick={reset}
                        className="px-8 py-3 border border-stone-200 rounded-full font-medium hover:bg-stone-50 transition-colors flex items-center gap-2"
                      >
                        <LucideRefreshCw size={18} />
                        重新问卦
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 text-center text-stone-400 text-xs">
        <p>© 2026 义理易学顾问 · 诚实、温厚、洞察</p>
        <p className="mt-2">本工具仅供参考，人生抉择请以理性思考为准。</p>
      </footer>
    </div>
  );
}
