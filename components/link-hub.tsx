"use client";

import { motion } from "framer-motion";
import { CREATOR } from "@/config/creator";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Instagram,
  Music2,
  Ghost,
  Facebook,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Icons } from "@/lib/icons";

// ─── Link Data ────────────────────────────────────────────────────────────────

const mainLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bella.lamannaa",
    icon: Instagram,
    external: true,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bella.lamanna",
    icon: Music2,
    external: true,
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com/t/6JlcKA4a",
    icon: Ghost,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/16rVazadtQ/?mibextid=wwXIfr",
    icon: Facebook,
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@IsabellaLamanna",
    icon: Icons.YouTube,
    external: true,
  },
  {
    label: "Contact Me",
    href: "/contact",
    icon: Mail,
    external: false,
  },
];

const socialIcons = [
  {
    label: "Instagram",
    href: "https://instagram.com/Bella.lamannaa",
    icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@bella.lamanna",
    icon: Music2,
  },
  {
    label: "Email",
    href: `mailto:${CREATOR.email}`,
    icon: Mail,
  },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const slideUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function LinkHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-pink/10 via-brand-pink/5 to-white py-20 px-4">
      <div className="max-w-md mx-auto">

        {/* ── 1. Profile Section ──────────────────────────────────────── */}
        <motion.div
          {...slideUp(0)}
          className="text-center mb-10"
        >
          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-deep blur-md opacity-40 scale-110" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <Image
                src={CREATOR.profileImage}
                alt="Isabella Lamanna profile portrait"
                fill
                className="object-cover"
                sizes="112px"
                priority
              />
            </div>
          </div>

          {/* Name */}
          <h1 className="font-outfit text-2xl font-bold text-gray-900 mb-1">
            {CREATOR.name}
          </h1>

          {/* Handle */}
          <p className="text-sm text-brand-pink-deep font-medium mb-3">
            {CREATOR.handle}
          </p>

          {/* Bio */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            Bits of Bella&apos;s Life
          </p>
        </motion.div>

        {/* ── 2. Main Link Buttons ─────────────────────────────────────── */}
        <div className="space-y-3 mb-10">
          {mainLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.label}
                {...slideUp(0.1 + i * 0.07)}
              >
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-brand-pink to-brand-pink-deep text-white font-semibold rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-base">{link.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── 3. Social Icon Row ───────────────────────────────────────── */}
        <motion.div
          {...slideUp(0.1 + mainLinks.length * 0.07 + 0.05)}
          className="flex justify-center gap-4 mb-10"
        >
          {socialIcons.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                className="w-11 h-11 bg-white border border-brand-pink/20 rounded-full flex items-center justify-center shadow-sm hover:bg-brand-pink/10 hover:border-brand-pink/40 hover:shadow-md transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2"
              >
                <Icon className="w-5 h-5 text-brand-pink-deep" />
              </Link>
            );
          })}
        </motion.div>

        {/* ── 4. Footer Text ───────────────────────────────────────────── */}
        <motion.div
          {...slideUp(0.1 + mainLinks.length * 0.07 + 0.15)}
          className="text-center"
        >
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" /> by Isabella
          </p>
        </motion.div>

      </div>
    </div>
  );
}
