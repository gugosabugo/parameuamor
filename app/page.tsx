'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Quicksand } from 'next/font/google';
import Image from 'next/image';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const timelineData = [
  {
    date: '26/03/2026',
    title: 'Primeira vez que te vi',
    img: '/26-03-2026-primeiravezquetevi.png',
  },
  {
    date: '28/03/2026',
    title: 'Primeiro encontro',
    img: '/28-03-2026primeiroencontro.png',
  },
  {
    date: '28/03/2026',
    title: 'O mais bizarro',
    img: '/28-03-2026.png',
  },
  {
    date: '13/04/2026',
    title: 'Hot roll',
    img: '/13-04-2026-sushi.png',
  },
  {
    date: '03/05/2026',
    title: 'nois <3',
    img: '/03-05-2026.png',
  },
];

export default function Surpresa() {
  const [stage, setStage] = useState('heart');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const heartTimer = setTimeout(() => setStage('iloveyou'), 3000);
    const textTimer = setTimeout(() => setStage('cards'), 6000);
    return () => {
      clearTimeout(heartTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center overflow-hidden antialiased selection:bg-rose-500/30 ${quicksand.className}`}>
      <AnimatePresence mode="wait">
        
        {/* ESTÁGIO 1: O Coração */}
        {stage === 'heart' && (
          <motion.div
            key="heart-stage"
            className="fixed inset-0 flex items-center justify-center bg-black z-50 transform-gpu"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [1, 1.2, 40], opacity: 1 }}
              transition={{ duration: 2.8, times: [0, 0.4, 1], ease: "easeInOut" }}
              className="text-rose-600 origin-center"
            >
              <Heart className="w-16 h-16 fill-current" />
            </motion.div>
          </motion.div>
        )}

        {/* ESTÁGIO 2: Eu te amo */}
        {stage === 'iloveyou' && (
          <motion.div
            key="text-stage"
            className="fixed inset-0 flex items-center justify-center bg-rose-600 z-40 transform-gpu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, backgroundColor: '#0a0a0a' }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-light tracking-wide text-white text-center px-4"
            >
              Eu te amo.
            </motion.h1>
          </motion.div>
        )}

        {/* ESTÁGIO 3: Cartões Quadrados Sobrepostos */}
        {stage === 'cards' && (
          <motion.div
            key="cards-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full flex flex-col items-center justify-center px-6 absolute inset-0"
          >
            {/* Cabeçalho */}
            <header className="absolute top-10 text-center flex flex-col items-center z-50">
              <span className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-bold mb-2">
                nois junto
              </span>
              <div className="flex items-center gap-2 text-2xl font-medium text-rose-500 tracking-wide">
                <h1>eu te amo</h1>
                <Heart className="w-5 h-5 fill-current text-rose-500 animate-pulse" />
              </div>
            </header>

            {/* Container da Pilha */}
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center mt-8">
              <AnimatePresence>
                {currentIndex < timelineData.length ? (
                  timelineData
                    .map((item, index) => {
                      if (index < currentIndex || index > currentIndex + 1) return null;

                      return (
                        <TimelineCard
                          key={item.img}
                          item={item}
                          index={index}
                          currentIndex={currentIndex}
                          total={timelineData.length}
                          onSwipeOut={() => setCurrentIndex((prev) => prev + 1)}
                        />
                      );
                    })
                    .reverse()
                ) : (
                  /* TELA FINAL */
                  <motion.div
                    key="final-screen"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-center w-full px-4"
                  >
                    <div>
                      <Heart className="w-7 h-7 text-rose-500 fill-current animate-bounce mx-auto mb-5" />
                      <p className="text-base text-neutral-200 italic tracking-wider font-light">
                        olha a steam mais tarde ;)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Marcadores de bolinha */}
            {currentIndex < timelineData.length && (
              <div className="absolute bottom-16 flex gap-1.5 z-50">
                {timelineData.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 transition-all duration-300 rounded-full ${
                      i === currentIndex ? 'w-5 bg-rose-500' : 'w-1 bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

{/* Sub-componente interno para gerenciar o Drag sem travar */}
interface CardProps {
  item: typeof timelineData[0];
  index: number;
  currentIndex: number;
  total: number;
  onSwipeOut: () => void;
}

function TimelineCard({ item, index, currentIndex, total, onSwipeOut }: CardProps) {
  const isTopCard = index === currentIndex;
  
  // Controle dinâmico da posição X e rotação do card ativo
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  const handleDragEnd = (_event: any, info: any) => {
    if (!isTopCard) return;

    // Se arrastou além do limite, força ele a continuar voando para fora antes de mudar o index
    if (info.offset.x > 120) {
      animate(x, 500, { type: 'spring', stiffness: 300, damping: 30 }).then(onSwipeOut);
    } else if (info.offset.x < -120) {
      animate(x, -500, { type: 'spring', stiffness: 300, damping: 30 }).then(onSwipeOut);
    }
  };

  return (
    <motion.div
      style={{
        zIndex: total - index,
        x: isTopCard ? x : 0,
        rotate: isTopCard ? rotate : 0,
      }}
      initial={isTopCard ? false : { scale: 0.93, y: 16, opacity: 0.7 }}
      animate={
        isTopCard
          ? { scale: 1, y: 0, opacity: 1 }
          : { scale: 0.93, y: 16, opacity: 0.7 }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      drag={isTopCard ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col cursor-grab active:cursor-grabbing group select-none transform-gpu touch-none"
    >
      {/* Foto Quadrada */}
      <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
        <Image
          src={item.img}
          alt={item.title}
          fill
          sizes="340px"
          className="object-cover grayscale group-hover:grayscale-0 transition-opacity duration-500 ease-out pointer-events-none"
          priority={index <= currentIndex + 1}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Informações na base */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col pointer-events-none z-20">
        <span className="text-[10px] font-mono text-rose-500 font-bold tracking-widest mb-1">
          {item.date}
        </span>
        <h3 className="text-lg font-medium text-white tracking-wide leading-tight">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}