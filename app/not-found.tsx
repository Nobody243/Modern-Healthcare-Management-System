'use client';
import { motion } from 'framer-motion';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[150px] md:text-[200px] font-extrabold bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-none"
          >
            404
          </motion.div>
          
          {/* Floating icons */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-1/4"
          >
            <AlertCircle className="w-12 h-12 text-red-400 opacity-50" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [10, -10, 10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-0 right-1/4"
          >
            <AlertCircle className="w-8 h-8 text-yellow-400 opacity-50" />
          </motion.div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-xl text-slate-300 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => router.back()}
            size="lg"
            variant="outline"
            className="border-2 border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700/50 px-8 py-6 text-lg rounded-xl backdrop-blur-sm font-semibold min-w-[200px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          
          <Link href="/">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-blue-500/50 font-bold border-0 hover:shadow-blue-500/70 transition-all min-w-[200px]"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
            <p className="text-blue-300 text-sm">
              Error Code: 404 • Page Not Found
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
