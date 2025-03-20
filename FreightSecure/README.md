# FreightSecure: Cyber Awareness Training

An interactive 3D web-based training application designed to educate freight industry professionals about cybersecurity threats and fraud prevention.

## Overview

FreightSecure is a gamified training tool that simulates real-world cyber threats faced by freight carriers and brokers. Players navigate through an immersive 3D office environment where they must identify and respond to various security scenarios, including:

- Phishing email detection
- Fraudulent rate confirmation documents
- Partner verification (carrier safety scores and broker credit ratings)

The application uses advanced Three.js techniques to create a realistic and engaging learning environment.

## Features

- **Role-based Scenarios**: Choose between carrier and broker roles for targeted, relevant training
- **Realistic Office Environment**: Immersive 3D office with desks, computers, filing cabinets, and interactive objects
- **Advanced Visuals**: Physically Based Rendering (PBR), shadow mapping, and post-processing effects
- **Educational Feedback**: Detailed explanations after each decision to reinforce learning
- **Industry-Specific Content**: Based on real freight industry fraud cases and best practices

## Technical Specifications

- **Frontend**: HTML5, CSS3, JavaScript
- **3D Rendering**: Three.js
- **Visual Effects**: PBR materials, shadow mapping, bloom effects, ambient occlusion
- **Audio**: Positional audio for immersion
- **Performance Optimization**: Level of Detail (LOD), frustum culling, texture compression

## Installation and Usage

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/freightsecure.git
   ```

2. Navigate to the project directory:
   ```
   cd freightsecure
   ```

3. Open index.html in a modern web browser that supports WebGL.

Alternatively, you can use a simple HTTP server:

```
# Using Python
python -m http.server

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## System Requirements

- **Browser**: Latest version of Chrome, Firefox, Edge, or Safari
- **Graphics**: WebGL support (most modern computers)
- **Input**: Keyboard and mouse

## Controls

- **WASD or Arrow Keys**: Move around
- **Mouse**: Look around
- **E or Click**: Interact with objects
- **F**: Toggle fullscreen

## Educational Content

The application includes educational content about:

- **Freight Fraud Statistics**: The average freight company loses approximately $400,000 annually to fraud
- **Broker Verification**: Ansonia credit scores, payment terms, and red flags
- **Carrier Verification**: FMCSA safety scores, insurance requirements, and warning signs
- **Email Security**: Identifying phishing attempts and security best practices
- **Documentation Verification**: Spotting suspicious rate confirmations and altered documents

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Educational content based on industry best practices and research
- Inspired by real-world fraud scenarios in the freight industry "# FreightSecure" 
