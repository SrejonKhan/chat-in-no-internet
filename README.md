# Chat in No Internet

## Project Background

**I'm sorry my brothers and sisters, I couldn't come to any help during the protest. A complete waste to the nation.**

This application was developed during the Bangladesh internet blackout (Quota Protest, July 2024). Cut off from the internet, we were unable to connect with friends and family through social media. Fortunately, I discovered that the BDIX (IXP) network was still operational (or possibly another IXP), allowing us to communicate through it.

Having a public IP address, I was able to host the application. Initially, it was a simple WebSocket push message example with a list-based chat on the client side. My friends, [Shamiul Alam](https://github.com/shamiulalamupom) and [Md Alamin](https://github.com/alamincodes), joined the project later to help progress the project.

Later versions introduced features to create chat rooms by simply adding a query parameter (`?room=abc`) to the URL. Additionally, the application allowed uploading images, videos, audio, and even generic files as attachments. We also implemented some hidden commands for fun within the chat (intentionally deleted from the code).

While it may not be a fully-fledged chat application or a comprehensive WebSocket implementation, considering the limitations of being built without internet access, I'm proud of what we accomplished, but not satisfied! It pains me that this project couldn't assist our community during the protests. We will do better next time. I wish we could have provided a communication solution during the protests. I am very sorry for this, I promise to do something in the future if Almighty wishes.

Technology Used:

- NodeJs (Server Side)
- Vanilla Js (Client Side)
- WebSocket (Communication Protocol)
- Apache Server using XAMPP (for hosting Client Side and CDN)

## Development Challenges

The entire application was written based on muscle memory. Without internet access, searching for solutions to problems was impossible. The biggest challenge was accessing the NPM registry. No internet meant no package installation for the project.

## Screenshots

### First POC

![FirstPOC](.github/img/v0.1_desktop.jpeg?raw=true)

### Updated POC in Internet Blackout

![UpdatedPOC](.github/img/v0.2_desktop.jpeg?raw=true)

## FAQ

### 1. How does the attachment upload system work?

To implement the attachment upload system, I used a clever workaround. I had a backend project built with Express.js and Multer installed. I created a basic upload endpoint using Multer. While this approach might not be ideal from a security standpoint, it was a necessary compromise for our situation.

```javascript
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer().single("file");
const CDN_URL = "YOUR_CDN_URL";

app.post("/upload", upload, async (req, res, next) => {
  try {
    return res.send({
      url: new URL(`${YOUR_CDN_URL}/${req.file?.filename}`).toString(),
      mime: req.file?.mimetype,
      filename: req.file?.filename,
    });
  } catch (error) {
    next(error);
  }
});
```

### 2. How was it hosted?

The server was typically run using `npm run start:8081`. The client was hosted using an Apache server (XAMPP). The same Apache server was also used for the CDN (just a different folder). The upload server (nodejs) was also run independently. Finally, I port forwarded all the necessary ports on my router. Then, I shared my public IP as URL to my friends and family.

### 3. How did you share the source code without internet?

This was a fun, old-school approach! We used our own `/upload` endpoint to share the source code. If I had known that we might face a situation like this in 2024, I would have downloaded Gitea and hosted it on my machine. Then, I could have instructed my friends to set my Gitea server as their upstream remote URL for the Git project. Don't worry, I will self-host Gitea, I should expect the worst from now here!

### 4. Why the name "Chat in No Internet"?

The name is a bit ironic. Since the application was developed during a time with "No Internet" displayed on our screens, the name was inspired by that situation.

### 5. Can I host this and use it privately?

Absolutely! This application can be used privately. Just ensure you have the necessary port forwarding configurations set up, including source IP and port range. I'll try to add a walkthrough guide if possible.

### 6. Are you planning to improve/scale it?

Maybe! Completely depends on availability and priority. But, if you are interested, HMU!
