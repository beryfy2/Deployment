/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Title from './Title';
import { RiArrowRightLongLine, RiEyeLine, RiExternalLinkLine } from '@remixicon/react';
import { portfolioItems, mainProject } from '../constant/data';
import { motion } from 'motion/react';
import * as variants from '../motion/animation';

const OurWorks = () => {
    const [hoveredImage, setHoveredImage] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxImages, setLightboxImages] = useState([]);

    const openLightbox = (images = [], startIndex = 0) => {
        setLightboxImages(images);
        setLightboxIndex(startIndex);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxImages([]);
        setLightboxIndex(0);
    };

    const nextLightbox = () => {
        setLightboxIndex((i) => (i + 1) % lightboxImages.length);
    };

    const prevLightbox = () => {
        setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length);
    };

    // helper to get screenshots array
    const getScreenshots = (item) => (item.screenshots && item.screenshots.length > 0) ? item.screenshots : [item.image];

    return (
        <section className="section pb-20 lg:pb-32 relative overflow-hidden" id='works'>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-30"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>

            <motion.div
                variants={variants.staggerContainer}
                initial='hidden'
                whileInView='show'
                viewport={{ once: true }}
                className="container relative z-10">

                {/* Title */}
                <Title subtitle="Our Works" title="Our works describe why we are the best in the business" classes="lg:text-center lg:mx-auto " />

                <div className="grid gap-16 mt-14 lg:grid-cols-2 lg:items-start lg:gap-20">

                    <div className="lg:order-1">
                        {/* Portfolio Grid */}
                        <div className="grid grid-cols-2 gap-6 lg:gap-10 items-center mt-18 mb-20">
                            {portfolioItems.map((item) => {
                                const screenshots = getScreenshots(item);

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={variants.fadeIn}
                                        className={`relative group cursor-pointer ${item.featured ? 'col-span-2 lg:col-span-1' : ''}`}
                                        onMouseEnter={() => setHoveredImage(item.id)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                            <motion.img
                                                variants={variants.fadeIn}
                                                src={item.image}
                                                alt={item.title}
                                                width={item.width}
                                                height={item.height}
                                                className="w-full h-auto rounded-2xl transition-transform duration-500 group-hover:scale-110"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                                            {/* Hover Actions */}
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: hoveredImage === item.id ? 1 : 0.8 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.button
                                                    onClick={() => openLightbox(screenshots, 0)}
                                                    className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label={`Open gallery for ${item.title}`}
                                                >
                                                    <RiEyeLine className="text-xl" />
                                                </motion.button>
                                                <motion.a
                                                    href={item.liveUrl || '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label={`Open live project ${item.title}`}
                                                >
                                                    <RiExternalLinkLine className="text-xl" />
                                                </motion.a>
                                            </motion.div>

                                            {/* Hover Gallery - thumbnails (hidden until hover) */}
                                            <div className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[90%] pointer-events-none`} aria-hidden={hoveredImage !== item.id}>
                                                <div className={`mx-auto transform translate-y-8 group-hover:translate-y-0 transition-transform duration-350 pointer-events-auto`}>
                                                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 shadow-xl flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                                                        {screenshots.map((shot, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => openLightbox(screenshots, i)}
                                                                className="flex-shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 border-transparent hover:border-sky-500 transition-all"
                                                                title={`Open screenshot ${i + 1}`}
                                                            >
                                                                <img src={shot} alt={`${item.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <motion.div
                                            className="mt-4 text-center"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: hoveredImage === item.id ? 1 : 0.7 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sky-600 font-semibold text-sm mt-1">
                                                {item.category}
                                            </p>
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Main Project */}
                    <div className="lg:mt-32">
                        <motion.div
                            variants={variants.fadeIn}
                            className="relative group"
                            onMouseEnter={() => setHoveredImage('main')}
                            onMouseLeave={() => setHoveredImage(null)}
                        >
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3">
                                <motion.img
                                    variants={variants.fadeIn}
                                    src={mainProject.image}
                                    alt={mainProject.title}
                                    width={445}
                                    height={565}
                                    className="w-full h-auto rounded-3xl transition-transform duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

                                {/* Hover Actions (main project) */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: hoveredImage === 'main' ? 1 : 0.9 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <motion.button
                                        onClick={() => openLightbox(getScreenshots(mainProject), 0)}
                                        className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={`Open gallery for ${mainProject.title}`}
                                    >
                                        <RiEyeLine className="text-xl" />
                                    </motion.button>
                                    <motion.a
                                        href={mainProject.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={`Open live project ${mainProject.title}`}
                                    >
                                        <RiExternalLinkLine className="text-xl" />
                                    </motion.a>
                                </motion.div>

                                {/* MAIN PROJECT thumbnails:
                                    - Default: first 3 thumbnails visible (no scrollbar)
                                    - Hover: expand to full strip with all screenshots (no scrollbar)
                                */}
                                {(() => {
                                    const all = getScreenshots(mainProject);
                                    const firstThree = all.slice(0, 3);

                                    return (
                                        <>
                                            {/* Default 3 thumbnails */}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[92%] pointer-events-auto">
                                                <div className="mx-auto transform transition-transform duration-300">
                                                    <div className="bg-white/6 backdrop-blur-md rounded-xl p-2 shadow-xl flex items-center justify-center gap-2 overflow-hidden">
                                                        {firstThree.map((shot, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => openLightbox(all, i)}
                                                                className="flex-shrink-0 w-24 h-14 rounded-md overflow-hidden border-2 border-transparent hover:border-sky-500 transition-all"
                                                                title={`Open screenshot ${i + 1}`}
                                                            >
                                                                <img src={shot} alt={`${mainProject.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                                                            </button>
                                                        ))}

                                                        {all.length > 3 && (
                                                            <div className="flex items-center justify-center ml-2 px-3 py-1 rounded-md bg-white/8 text-sm text-gray-100 font-medium">
                                                                +{all.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded full strip on hover */}
                                            {hoveredImage === 'main' && (
                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[96%] pointer-events-auto">
                                                    <div className="mx-auto transform translate-y-0 transition-transform duration-200">
                                                        <div className="bg-white/6 backdrop-blur-md rounded-xl p-2 shadow-xl flex items-center gap-2 overflow-x-auto no-scrollbar">
                                                            {all.map((shot, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => openLightbox(all, i)}
                                                                    className="flex-shrink-0 w-24 h-14 rounded-md overflow-hidden border-2 transition-all border-transparent hover:border-sky-500"
                                                                    title={`Open screenshot ${i + 1}`}
                                                                >
                                                                    <img src={shot} alt={`${mainProject.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>

                            {/* Project Details */}
                            <motion.div className="mt-8 space-y-4" variants={variants.fadeInUp}>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {mainProject.category}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                                    {mainProject.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {mainProject.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {mainProject.technologies.map((tech, index) => (
                                        <span key={index} className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <motion.a href={mainProject.liveUrl} className="flex items-center gap-2 bg-sky-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <span>View Live</span>
                                        <RiExternalLinkLine className="text-lg" />
                                    </motion.a>
                                    <motion.a href={mainProject.githubUrl} className="flex items-center gap-2 bg-sky-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <span>View Code</span>
                                        <RiArrowRightLongLine className="text-lg" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" role="dialog" aria-modal="true" aria-label="Image gallery lightbox" onClick={closeLightbox}>
                    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeLightbox} className="absolute top-3 right-3 z-60 bg-white/90 rounded-full p-2 shadow-lg" aria-label="Close gallery">✕</button>

                        <div className="w-full bg-gray-900 rounded-xl overflow-hidden">
                            <img src={lightboxImages[lightboxIndex]} alt={`Gallery image ${lightboxIndex + 1}`} className="w-full h-[60vh] object-contain bg-black" />
                        </div>

                        <div className="flex items-center justify-between mt-3 gap-3">
                            <div className="flex items-center gap-2">
                                <button onClick={prevLightbox} className="bg-white/90 px-4 py-2 rounded-md shadow" aria-label="Previous image">Prev</button>
                                <button onClick={nextLightbox} className="bg-white/90 px-4 py-2 rounded-md shadow" aria-label="Next image">Next</button>
                            </div>

                            <div className="text-sm text-gray-200">
                                {lightboxIndex + 1} / {lightboxImages.length}
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                            {lightboxImages.map((img, idx) => (
                                <button key={idx} onClick={() => setLightboxIndex(idx)} className={`flex-shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 ${idx === lightboxIndex ? 'border-sky-500' : 'border-transparent'}`}>
                                    <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default OurWorks;
