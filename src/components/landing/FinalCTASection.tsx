"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

export default function FinalCTASection() {

  return (
    <section className="relative z-10 py-32 px-5 md:px-16 mesh-gradient overflow-hidden">
      <div className="ambient-light-purple" style={{ top: "20%", left: "5%" }} />
      <div className="ambient-light-cyan" style={{ bottom: "10%", right: "10%" }} />
      <div className="ambient-light-pink" style={{ top: "50%", left: "50%" }} />

      <div className="relative z-10 max-w-[1440px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[var(--font-space-grotesk)] text-fluid-headline gradient-text-animated mb-6">
            Ready to decode your sonic soul?
          </h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto mb-12 font-light">
            Join thousands of music lovers who have discovered the hidden patterns in their listening habits.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => signIn("credentials")}
              className="gradient-button px-14 py-6 rounded-full font-[var(--font-space-grotesk)] text-2xl text-white inline-flex items-center gap-4 font-semibold cursor-pointer shadow-[0_0_40px_rgba(168,85,247,0.4)] glow-purple hover:scale-105 transition-transform"
            >
              <SlidersHorizontal className="w-6 h-6" />
              Connect with YouTube Music
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
