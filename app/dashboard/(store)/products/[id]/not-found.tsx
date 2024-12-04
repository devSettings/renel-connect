'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='relative min-h-[80vh] w-full bg-black flex flex-col items-center justify-center p-4 overflow-hidden'>
      {/* Animated stars background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='stars'></div>
        <div className='stars2'></div>
        <div className='stars3'></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative z-10 text-center'
      >
        <motion.h1
          className='text-7xl md:text-9xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-700 to-purple-600'
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          Oops!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className='text-xl md:text-2xl font-semibold text-gray-200 mb-4'>
            404 - PRODUCT NOT FOUND
          </h2>
          <p className='text-gray-400 max-w-md mx-auto mb-8'>
            The product you are looking for might have been removed, its name
            changed, or it is temporarily unavailable. Please browse our catalog
            or return to the homepage.
          </p>

          <Link
            href='/'
            className='inline-block px-8 py-3 bg-gradient-to-r from-blue-700 to-purple-600 text-white rounded-full font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black'
          >
            GO TO HOMEPAGE
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
