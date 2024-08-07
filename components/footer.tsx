"use client";

import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-transparent text-gray-800 dark:text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Company Name</h2>
            <p className="text-sm">
              © {new Date().getFullYear()} Company Name. All rights reserved.
            </p>
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#home"
                  className="hover:text-gray-400 dark:hover:text-gray-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-gray-400 dark:hover:text-gray-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-gray-400 dark:hover:text-gray-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-gray-400 dark:hover:text-gray-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200" />
              </Button>
              <Button variant="outline" size="icon" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
