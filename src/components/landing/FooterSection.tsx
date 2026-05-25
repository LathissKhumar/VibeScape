"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { Globe, Link, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function FooterSection() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");

  const productLinks = ["Features", "Archetypes", "Galaxy", "Pricing"];
  const companyLinks = ["About", "Blog", "Careers", "Press"];
  const legalLinks = ["Privacy", "Terms", "Cookies", "Licenses"];

  return (
    <motion.footer
      initial={reduced ? {} : { opacity: 0 }}
      whileInView={reduced ? {} : { opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 bg-bg-deep border-t border-glass-border"
    >
      <div className="px-5 md:px-16 py-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="font-[var(--font-space-grotesk)] text-2xl font-bold gradient-text-animated mb-4">
              Resona
            </div>
            <p className="text-on-surface-variant mb-6 font-light max-w-sm">
              AI-powered Spotify listening intelligence that reveals the hidden patterns in your music taste.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-enhanced flex items-center justify-center text-on-surface-variant hover:text-neon-cyan hover:glow-cyan transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-enhanced flex items-center justify-center text-on-surface-variant hover:text-neon-pink hover:glow-pink transition-all">
                <Link className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-enhanced flex items-center justify-center text-on-surface-variant hover:text-neon-purple hover:glow-purple transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-[var(--font-space-grotesk)] font-semibold text-on-surface mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[var(--font-space-grotesk)] font-semibold text-on-surface mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[var(--font-space-grotesk)] font-semibold text-on-surface mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-enhanced p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-on-surface mb-2">
                Stay in the loop
              </h4>
              <p className="text-on-surface-variant font-light">
                Get updates on new features and music insights.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 md:w-72 px-4 py-3 rounded-full bg-surface-container/50 border border-glass-border text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-neon-purple/50 focus:glow-purple transition-all font-light"
              />
              <button className="px-6 py-3 rounded-full gradient-button text-white font-semibold flex items-center gap-2 glow-purple hover:scale-105 transition-transform cursor-pointer">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant font-light">
            &copy; 2026 Resona. Decode your sonic soul.
          </p>
          <div className="flex gap-6 text-sm">
            <a className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light" href="#">
              Privacy
            </a>
            <a className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light" href="#">
              Terms
            </a>
            <a className="text-on-surface-variant hover:text-neon-cyan transition-colors font-light" href="#">
              Support
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
