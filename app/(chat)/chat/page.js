"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Send, Mic, Image, Copy, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: input,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInput(`[Uploaded image: ${file.name}]\n${e.target.result}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
  };

  return (
    <div className={"flex flex-col h-screen relative"}>
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <main className="flex-grow overflow-y-auto p-4 container mx-auto max-w-3xl">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mt-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-200 text-transparent bg-clip-text">
                  Hello, how can I help you today?
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <button className="flex items-center justify-center px-4 py-2 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                    <Send className="w-5 h-5 mr-2" />
                    Send a message
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                    <Image className="w-5 h-5 mr-2" />
                    Upload an image
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ul>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <div className="relative">
                              <CopyToClipboard
                                text={String(children).replace(/\n$/, "")}
                              >
                                <button
                                  className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                                  title="Copy to clipboard"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </CopyToClipboard>
                              <SyntaxHighlighter
                                style={materialDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {message.timestamp}
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 bg-transparent sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center px-3 py-2 bg-white dark:bg-gray-800 shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <input
                type="text"
                placeholder="Enter a prompt here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-transparent rounded-full focus:outline-none text-black dark:text-white placeholder-gray-400"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFileUpload}
                  disabled={isLoading}
                  className="p-2 text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label="Upload image"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className="p-2 text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Gemini may display inaccurate info, including about people, so
              double-check its responses.
              <a href="#" className="underline ml-1">
                Your privacy and Gemini Apps
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
