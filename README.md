# Noti

Online note editor for work & school

![License](https://img.shields.io/badge/License-GPL_2-blue)
![Version](https://img.shields.io/badge/Version-0.1.0-yellow)
![Stability](https://img.shields.io/badge/Stability-STABLE-green)

# Setup


1. Download/clone the repo and extract it to a folder
2. Use `npm i` or `npm install` to install the dependencies
3. Copy the `.env.example` to `.env` and add your own environment variables
4. Run the website using `npm run dev` or `npm run ibs` (custom command)
5. That’s it!

# Environment variables



- NEXT_PUBLIC_POCKETURL='your-pocketbase'
    - This is the url to your pocket base instance with the custom schema applied.
- NEXT_PUBLIC_CURRENTURL='the-current-url-for-the-enviroment-eg-lh3000'
    - The current url of the website, eg [localhost:3000](http://localhost:3000) for dev env or [https://mysite.com](https://mysite.com) (no trailing /)
- PRODUCTION='false'
    - Enables production only variables like content security policy
- UNSPLASH_APIKEY='for-unsplash-api'
    - Your UNSPLASH client_id for cover images

# Pocketbase



For this app I have created a **custom build** of pocketbase which requires you to build it locally, and use the schema. You can customise the schema to you liking but **be aware of certain requirements in the main.go for table names etc.**

Build: [https://github.com/jfmow/pocketbase](https://github.com/jfmow/pocketbase)
