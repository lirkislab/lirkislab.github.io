
<img src="https://raw.githubusercontent.com/lirkislab/svr2021/main/public/dist/GCVEgithubLOGO2.jpg">



LIRKIS G-CVE project
=================

The sample of Collaborative Virtual Environment for education purposes.
Based on client-server app architecture.

The Project
------------

Frameworks and components:
- A-Frame v1.0.4 (VR Framework)
- Networked-Aframe v0.6.1 (Sharing A-Frame entities and attributes)
- aframe-extras v6.1.1 (fbx loader)
- aframe-physics-system v4.0.1 (client side physics-sub-system)
- aframe-event-set-component v4.1.1 (collisions and raycasting)
- aframe-physics-extras (physics extensions - object manipulation, collisions)
- aframe-randomizer-components v3.0.1 (color, position, and rotation randomization)
- aframe-camera-events (camera collisions)
- socket.io v1.4.5 (wbsocket communication, utilizing easyrtc)
- easyrtc (streaming and sharing standard over the network)

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)
