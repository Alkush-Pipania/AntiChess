# Online Chess Game

A real-time, online chess game built with **Next.js** for the frontend and **WebSocket** for real-time communication. The backend is designed to manage game logic, player turns, and ensure smooth gameplay.

## Features

- Real-time multiplayer chess with WebSocket integration.
- Move validation and game state management using **chess.js**.
- Custom pawn promotion dialog.
- Timer for each player with automatic time updates.
- Handles disconnection and reconnection gracefully.
- Displays move history and game status (check, checkmate, stalemate).
- Responsive and modern UI using **Tailwind CSS**.

## Technologies Used

### Frontend:
- **Next.js** with TypeScript
- **React Chessboard** for the chess interface
- **Tailwind CSS** for styling
- **WebSocket** for real-time communication
- **chess.js** for move validation and game logic

### Backend:
- **WebSocket** server handling game state and communication
- Manages game sessions, player turns, and time updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/online-chess-game.git
   cd online-chess-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the WebSocket server:**
   ```bash
   node server.js
   ```

4. **Run the frontend:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) to start playing.

## Folder Structure

```
.
├── _components
│   ├── Chessboard.tsx          # Chessboard component with drag-and-drop support
│   ├── Timer.tsx               # Timer for each player
│   ├── PromotionDialog.tsx     # Custom pawn promotion dialog
│   ├── GameOver.tsx            # Game over screen
│   ├── Disconnect.tsx          # Disconnection notification
│   └── Chess-loading.tsx       # Loading screen before the game starts
│
├── lib
│   └── Message.ts              # WebSocket message types
│
├── pages
│   └── index.tsx               # Main game logic and UI
│
├── public                     # Static assets
│
├── styles                     # Global styles
│
├── server.js                  # WebSocket server handling game sessions
│
└── README.md                  # Project documentation
```

## Game Features in Detail

### Real-time Gameplay
- WebSocket ensures smooth real-time communication between players.
- The game starts automatically when two players connect.

### Move Validation
- All moves are validated using **chess.js**.
- Illegal moves are rejected, and feedback is provided.

### Pawn Promotion
- When a pawn reaches the opposite end, a custom dialog appears allowing players to choose between Queen, Rook, Bishop, or Knight.
- Only one promotion dialog (custom or default) is shown to avoid conflicts.

### Timer Management
- Each player starts with 10 minutes.
- Time is updated in real-time and synced between players.

### Disconnection Handling
- If a player disconnects, a notification is shown.
- The game pauses until the player reconnects or the game is forfeited.



