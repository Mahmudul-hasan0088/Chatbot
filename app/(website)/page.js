"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaHandsHelping } from 'react-icons/fa';

const MotionDiv = motion.div;

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const Home = () => {
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="my-16">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
            Welcome to AI Innovate
          </h1>
          <h2 className="text-xl md:text-2xl font-light text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforming the Future with Cutting-Edge Artificial Intelligence
          </h2>
        </MotionDiv>
        <MotionDiv
          className="text-center mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            className="px-8 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </MotionDiv>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Advanced AI Solutions",
              description:
                "Our cutting-edge AI technologies are designed to solve complex problems and drive innovation across industries.",
              icon: <FaBrain className="text-6xl text-center mb-4" />,
            },
            {
              title: "Ethical AI Development",
              description:
                "We prioritize responsible AI practices, ensuring our solutions are transparent, fair, and beneficial to society.",
              icon: <FaHandsHelping className="text-6xl text-center mb-4" />,
            },
            {
              title: "AI Consulting",
              description:
                "Our team of experts provides guidance on integrating AI into your business processes for maximum impact.",
              icon: <FaRobot className="text-6xl text-center mb-4" />,
            },
          ].map((item, index) => (
            <MotionDiv
              key={index}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="p-6 flex flex-col h-full">
                {item.icon}
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 flex-grow">
                  {item.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;