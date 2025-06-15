"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstagramFeedSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const sectionRef = document.getElementById("instagram-feed");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="instagram-feed" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white flex items-center justify-center md:justify-start">
              <Instagram className="mr-3 text-primary" size={32} />
              <span>Siga-nos no Instagram</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              Acompanhe o nosso trabalho e veja transformações incríveis em
              tempo real. Atualizamos o nosso feed diariamente com as últimas
              lavagens.
            </p>
          </div>

          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link
              href="https://instagram.com/relusa.pt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
              @relusa.pt
            </Link>
          </Button>
        </div>

        {/* Instagram Embed */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Instagram size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    @relusa.pt
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Feed do Instagram
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://instagram.com/relusa.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seguir
                </Link>
              </Button>
            </div>

            <div className="aspect-video w-full">
              <iframe
                title="Instagram Feed"
                src="https://www.instagram.com/relusa.pt/embed"
                className="w-full h-[600px] border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
