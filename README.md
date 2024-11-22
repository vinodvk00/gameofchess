# Game of Chess

A basic multiplayer chess game built using **Socket.io**, **Chess.js**, and **EJS** for templating. The game offers real-time updates and an interactive drag-and-drop interface.

## Features

- **Player Roles**:  
  - **White**: Assigned to the first player to join.  
  - **Black**: Assigned to the second player.  
  - **Spectators**: Additional users join as spectators to observe the game.  

- **Interactive Gameplay**:  
  - Drag and drop pieces to make moves.  
  - Only valid chess moves are allowed.  

- **Real-Time Updates**:  
  - Synchronizes the game state across all connected clients.  
  - Updates visible to players and spectators simultaneously.  

- **Server-Side Rendering**:  
  - The application uses **EJS** templates for rendering dynamic content.  

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gameofchess.git
    ```
2. Navigate into the project directory:
    ```bash
    cd gameofchess
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm start
    ```

The game should now be running at `http://localhost:3000`.

## Screenshots

### Login as Player or Spectator
![Login Example](https://github.com/user-attachments/assets/adcb7efa-07b7-4e83-873b-9f70fae6a40e)

### Gameplay as Black
![Gameplay Example 1](https://github.com/user-attachments/assets/7d8e41ac-4624-4b14-9f5b-074a9be0c470)

### Game in Progress for spectator
![Gameplay Example 2](https://github.com/user-attachments/assets/6b6ee99e-9269-4ea6-8316-5c285c6474f2)

## Technologies Used

- **Node.js**  
- **Socket.io**  
- **Chess.js**  
- **EJS**  
- **HTML/CSS**  
- **JavaScript**
