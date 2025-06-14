"use client";
import React from "react";

const Footer = () => {
  return (
    <div role="contentinfo" className="bg-white shadow px-6 py-2">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <svg
          width="120"
          height="64"
          viewBox="0 0 165 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="self-center"
        >
          <path d="M149.607 46.524 80.582 63 11.566 46.524h138.041Z" fill="#A70532" />
          <path
            d="M152.808 4.724c0 2.143 1.74 3.75 3.804 3.75 2.065 0 3.787-1.607 3.787-3.75 0-2.117-1.722-3.724-3.787-3.724-2.064 0-3.804 1.607-3.804 3.724Zm.685 0c0-1.795 1.352-3.17 3.119-3.17 1.749 0 3.102 1.375 3.102 3.17 0 1.83-1.353 3.206-3.102 3.206-1.767 0-3.119-1.376-3.119-3.206Zm1.65 2.196h.685V5.036h.73l1.199 1.884h.731l-1.254-1.928c.65-.072 1.154-.402 1.154-1.188 0-.84-.495-1.25-1.541-1.25h-1.704V6.92Zm.685-3.822h.91c.46 0 .965.09.965.67 0 .697-.55.724-1.163.724h-.712V3.098ZM120.197 36.809h6.681V11.734h-6.681v25.075ZM120.252 1h6.572v6.519h-6.572V1Zm13.217 35.809h6.347V23.048c0-6.823 2.551-7.439 4.03-7.439 1.929 0 3.796 1.295 3.796 5.965V36.81h6.347V19.503c0-6.894-4.147-8.35-7.186-8.35-2.723 0-5.265 1.563-6.987 4.35v-3.77h-6.347V36.81Zm-90.654 0h6.347V11.734h-6.347V26.02c0 4.403-1.308 6.912-4.175 6.912-2.776 0-3.985-2.054-3.985-5.188V11.734h-6.347V28.44c0 7.082 3.526 8.832 7.465 8.832 3.336 0 5.626-1.91 7.042-4.286v3.822ZM116.04 11.26c-.523-.051-.757-.051-1.1-.051-2.948 0-4.95 1.99-6.915 6.858v-6.332h-6.338V36.81h6.338V23.407c0-2.93 2.2-5.34 4.914-5.34.91 0 1.677.134 2.822.785l.279-7.592Zm-42.762 1.831c-2.245-1.51-4.904-1.938-7.122-1.938-7.267 0-12.208 5.394-12.208 13.565 0 7.688 4.806 12.662 11.775 12.662 2.551 0 4.337-.24 6.482-1.652l.667-3.295c-1.857 1.349-3.173 1.599-4.95 1.599-4.273 0-6.77-3.35-6.77-9.788 0-6.492 2.2-10.17 5.662-10.322 2.903-.126 4.264 1.268 5.41 2.321l1.054-3.152Zm9.088 8.608c.171-4.902 1.605-8.394 4.409-8.394 2.47 0 3.696 3.358 3.795 8.394h-8.204Zm14.552 2.652c.045-.99.045-1.258.045-1.884 0-7.277-3.985-11.412-10.233-11.412-6.726 0-11.333 4.974-11.333 12.93 0 8.475 4.697 13.502 12 13.502 2.768 0 4.886-.58 7.61-2.357l.477-3.402c-2.146 1.732-4.03 2.357-5.986 2.357-4.598 0-7.132-3.76-7.132-9.733H96.92ZM5.499 36.81h18.824v-3.51H12.99V19.744h9.422v-3.51H12.99V4.51h11.018V1H5.498v35.809Z"
            fill="#223341"
          />
        </svg>

        <div className="mt-6 md:mt-0">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 uppercase">Páginas</h2>
          <ul className="flex gap-6 text-gray-500 font-medium">
            <li>
              <a href="#" className="hover:text-red-800">Productos</a>
            </li>
            <li>
              <a href="#" className="hover:text-red-800">Nosotros</a>
            </li>
            <li>
              <a href="#" className="hover:text-red-800">Sustentabilidad</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="w-full flex justify-center items-center">
        <span className="text-sm text-gray-500 text-center">
          © 2025 Eucerin. All rights reserved.<br />
          🐱{" "}
          <a
            href="https://linkedin.com/in/cristiandaos"
            className="text-sky-950 hover:text-sky-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            @cristiandaos
          </a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
