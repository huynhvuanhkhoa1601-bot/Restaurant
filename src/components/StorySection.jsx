import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, UtensilsCrossed, Award, Sparkles, HeartHandshake } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

const StorySection = () => {
  const highlightIcons = [
    <UtensilsCrossed className="w-6 h-6 text-orange-500" />,
    <Truck className="w-6 h-6 text-emerald-500" />,
    <ShieldCheck className="w-6 h-6 text-blue-500" />,
    <HeartHandshake className="w-6 h-6 text-rose-500" />
  ];

  const highlights = siteConfig.story.highlights.map((item, idx) => ({
    icon: highlightIcons[idx % highlightIcons.length],
    title: item.title,
    desc: item.desc
  }));

  return (
    <section id="story" className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Gallery */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={siteConfig.story.image1} 
                alt="Restaurant interior"
                className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-103 transition-transform" 
              />
              <img 
                src={siteConfig.story.image2} 
                alt="Chef preparing meal"
                className="w-full h-64 object-cover rounded-3xl shadow-lg mt-8 hover:scale-103 transition-transform" 
              />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-3.5 backdrop-blur-md">
              <Award className="w-8 h-8 shrink-0" />
              <div>
                <div className="text-xl font-black">{siteConfig.story.experienceBadge}</div>
                <div className="text-xs text-orange-100 font-medium">Khẳng Định Đẳng Cấp Ẩm Thực</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{siteConfig.story.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {siteConfig.story.title}
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {siteConfig.story.description}
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-2 hover:border-orange-300 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-gray-700/60 w-fit shadow-sm">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default StorySection;
