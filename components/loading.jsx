import { motion } from "framer-motion";

export function DotsLoader() {
  return (
    <div className="flex items-center gap-2 mt-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-3 w-3 rounded-full bg-indigo-500"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ProfileLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.p
        className="mt-4 text-lg md:text-xl text-indigo-500 font-semibold"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading User details...
      </motion.p>
       <div className="flex items-center gap-2 mt-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-3 w-3 rounded-full bg-indigo-500"
          initial={{ opacity: 0.8 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
    </div>
  );
}
