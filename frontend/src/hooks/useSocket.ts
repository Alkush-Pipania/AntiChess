// import { useEffect, useState } from "react"

// const WS_URL = "ws://localhost:8080";

// export const useSocket = () => {
//     const [socket, setSocket] = useState<WebSocket | null>(null);

//     useEffect(() => {
//       const ws = new WebSocket(WS_URL);
  
//       ws.onopen = () => {
//           console.log("WebSocket connection established");
//           setSocket(ws);
//       };
  
//       ws.onerror = (error) => {
//           console.error("WebSocket error:", error);
//       };
  
//       ws.onclose = (event) => {
//           console.log("WebSocket connection closed:", event);
//           setSocket(null);
//       };
  
//       return () => {
//           if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
//               ws.close();
//           }
//       };
//   }, []);
  

//     return socket;  
// }