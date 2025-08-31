import React, { useState, useRef, useEffect } from "react";
import { ShaderGradientCanvas } from "@shadergradient/react";
import { ShaderGradient } from "@shadergradient/react";
import "./App.css";
import en from "./i18n/en.json";
import ar from "./i18n/ar.json";

function App() {
  const [currentStep, setCurrentStep] = useState("upload"); // "upload" or "chat"
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(1);
  const fileInputRef = useRef(null);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" || saved === "ar" ? saved : "ar"; // default Arabic
  });
  const messagesEndRef = useRef(null);

  const strings = language === "ar" ? ar : en;

  // Simple template formatter for strings like "{file}"
  const format = (template, vars) =>
    template.replace(/\{(\w+)\}/g, (_, k) => (vars && k in vars ? vars[k] : ""));

  // Animate background scale when step changes
  useEffect(() => {
    if (currentStep === "chat") {
      // Smooth scale animation from 1 to 3
      let start = null;
      const startScale = 1;
      const endScale = 3;
      const duration = 1500;

      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentScale =
          startScale + (endScale - startScale) * easeProgress;

        setBackgroundScale(currentScale);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setBackgroundScale(1);
    }
  }, [currentStep]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDocument(file);
      // Simulate document processing
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep("chat");
        setMessages([
          {
            type: "ai",
            content: format(strings.initialAnalysis, { file: file.name }),
          },
        ]);
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = { type: "user", content: inputValue };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        content: strings.simulatedAnswer,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Persist language choice
  useEffect(() => {
    try {
      localStorage.setItem("lang", language);
    } catch (e) {
      // ignore persist errors (e.g., storage disabled)
      void e;
    }
  }, [language]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div
        className="App"
        dir={language === "ar" ? "rtl" : "ltr"}
        style={{ textAlign: language === "ar" ? "right" : "left" }}
      >
        {/* Animated Background */}
        <ShaderGradientCanvas
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            transform: `scale(${backgroundScale})`,
            transition: "transform 0.1s ease-out",
          }}
          lazyLoad={undefined}
          fov={115}
          pixelDensity={1}
          pointerEvents="none"
        >
          <ShaderGradient
            animate="on"
            type="sphere"
            wireframe={false}
            shader="defaults"
            uTime={0}
            uSpeed={0.1}
            uStrength={0.2}
            uDensity={5}
            uFrequency={5.5}
            uAmplitude={1.4}
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={7}
            rotationY={0}
            rotationZ={6}
            color1="#ffffff"
            color2="#000000"
            color3="#ffffff"
            reflection={0.1}
            // View (camera) props
            cAzimuthAngle={6}
            cPolarAngle={140}
            cDistance={7.1}
            cameraZoom={17.3}
            // Effect props
            lightType="3d"
            brightness={0.8}
            envPreset="city"
            grain="off"
            // Tool props
            toggleAxis={undefined}
            zoomOut={undefined}
            hoverState=""
            // Optional - if using transition features
            enableTransition={true}
          />
        </ShaderGradientCanvas>

        {/* Main Content */}
        <div className="main-content">
          {/* Language Switcher */}
          <div className="language-switcher">
            <label style={{ fontSize: 12 }}>{strings.language}:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="ar">{strings.arabic}</option>
              <option value="en">{strings.english}</option>
            </select>
          </div>
          {currentStep === "upload" ? (
            <div className="upload-container">
              <div className="brand-header">
                <h1 className="brand-title">{strings.brandTitle}</h1>
                <p className="brand-subtitle">{strings.brandSubtitle}</p>
              </div>

              <div className="upload-card">
                <div className="upload-icon">📚</div>
                <h2>{strings.uploadTitle}</h2>
                <p>{strings.uploadDescription}</p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.md"
                  style={{ display: "none" }}
                />

                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <span className="upload-icon-btn">⬆️</span>
                      {strings.chooseDocument}
                    </>
                  )}
                </button>

                {isLoading && (
                  <p className="processing-text">{strings.processing}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-container">
              <div className="chat-header">
                <div className="document-info">
                  <span className="doc-icon">📄</span>
                  <span className="doc-name">{uploadedDocument?.name}</span>
                </div>
                <button
                  className="new-doc-btn"
                  onClick={() => {
                    setCurrentStep("upload");
                    setUploadedDocument(null);
                    setMessages([]);
                  }}
                >
                  {strings.newDocument}
                </button>
              </div>

              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="input-container">
                <textarea
                disabled={isLoading}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={strings.inputPlaceholder}
                  className="message-input"
                  rows="1"
                />
                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
