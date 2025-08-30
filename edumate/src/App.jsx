import React, { useState, useRef, useEffect } from "react";
import { ShaderGradientCanvas } from "@shadergradient/react";
import { ShaderGradient } from "@shadergradient/react";
import "./App.css";

function App() {
  const [currentStep, setCurrentStep] = useState("upload"); // "upload" or "chat"
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(1);
  const fileInputRef = useRef(null);

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
            content: `Great! I've analyzed your document "${file.name}". I'm ready to help you study and answer any questions about the content. What would you like to know?`,
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
        content:
          "I understand your question about the document. Based on the content you've uploaded, here's what I can help you with...",
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

  return (
    <>
      <div className="App">
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
          {currentStep === "upload" ? (
            <div className="upload-container">
              <div className="brand-header">
                <h1 className="brand-title">EduMate</h1>
                <p className="brand-subtitle">Your AI Study Companion</p>
              </div>

              <div className="upload-card">
                <div className="upload-icon">📚</div>
                <h2>Upload Your Study Material</h2>
                <p>
                  Upload any document and I'll help you study it effectively
                </p>

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
                      Choose Document
                    </>
                  )}
                </button>

                {isLoading && (
                  <p className="processing-text">Processing your document...</p>
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
                  New Document
                </button>
              </div>

              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your document..."
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
