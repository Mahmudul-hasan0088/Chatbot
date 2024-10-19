"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Send, Mic, Image as ImageIcon, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
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

  const sendMessage = useCallback(async () => {
    if ((!input.trim() && !imagePreview) || isLoading) return;

    const newMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
      image: imagePreview,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const { text } = JSON.parse(data);
              accumulatedResponse += text;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content =
                  accumulatedResponse;
                return newMessages;
              });
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, imagePreview, messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 dark:text-white"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-lg mb-2"
                  />
                )}
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="relative">
                          <CopyToClipboard
                            text={String(children).replace(/\n$/, "")}
                          >
                            <button className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">
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
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-transparent sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          {imagePreview && (
            <div className="mb-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 rounded-lg"
              />
              <button
                onClick={clearImagePreview}
                className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="relative flex items-center px-3 py-2 bg-white dark:bg-gray-800 shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input
              type="text"
              placeholder={
                imagePreview ? "Describe the image..." : "Enter a message"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent rounded-full focus:outline-none text-black dark:text-white placeholder-gray-400"
            />
            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
                id="fileUpload"
                accept="image/*"
              />
              <label
                htmlFor="fileUpload"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                <ImageIcon className="size-5" />
              </label>
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </footer>
    </div>
  );
}
