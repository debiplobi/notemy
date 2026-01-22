import { IconBolt } from "@tabler/icons-react";

const LoadingScreen = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "20px", fontSize: "18px", fontWeight: "500" }}>
        Decrypting Notes...
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <style>
            {`
              @keyframes dance {
                0%, 100% {
                  transform: rotate(0deg) scale(1);
                }
                25% {
                  transform: rotate(-15deg) scale(1.1);
                }
                50% {
                  transform: rotate(0deg) scale(0.95);
                }
                75% {
                  transform: rotate(15deg) scale(1.1);
                }
              }
              
              @keyframes glow {
                0%, 100% {
                  filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.3));
                }
                50% {
                  filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.5));
                }
              }
              
              .bolt-outline {
                color: #374151;
                fill: transparent;
                stroke: #374151;
                stroke-width: 2.5;
              }
              
              .bolt-fill-container {
                position: absolute;
                top: 0;
                left: 0;
              }
              
              .bolt-filled {
                color: #10b981;
                fill: #10b981;
                stroke: #10b981;
                animation: glow 2s ease-in-out infinite;
              }
            `}
          </style>
          <div
            className="bolt-container"
            style={{ animation: "dance 1s ease-in-out infinite" }}
          >
            {/* Outline bolt */}
            <IconBolt size="2.5rem" className="bolt-outline" />
            {/* Filling bolt with wave effect */}
            <div className="bolt-fill-container">
              <IconBolt size="2.5rem" className="bolt-filled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
