# Crop Health Monitoring Website for Farmers

**2nd place among 60+ teams** at **InnovateX**, the hackathon conducted by the Coding Ninjas Club at Vignan's Institute of Engineering for Women.

A website that helps farmers find out how healthy their crop is, and whether it is damaged or at risk of disease, before it is too late.

## The Problem

Farmers often don't know how much yield to expect, or whether their crop has been damaged or infected. By the time they find out, half of the crop is already lost. Most farmers also can't easily get expert guidance.

## The Idea

The farmer walks around their own field while the website records the boundary using GPS. This gives the exact dimensions of the land. The website is designed to combine that with satellite observations, weather forecasts and soil data, and produce a report on the crop's condition, so the farmer can act early.

## What Makes It Different

Many crop apps can only tell a farmer that a crop is affected **after** the farmer uploads a photo of it, and the farmer has to keep uploading photos again and again. This solution is designed to warn farmers **beforehand**, using the field's own data instead of repeated photo uploads.

## What the Prototype Does Today

**Working:**
- Field boundary mapping with real-time GPS tracking, which calculates the field's area and perimeter on a satellite map
- Crop yield estimation and recommendations
- Crop disease check from an uploaded leaf photo, using the Gemini API
- Farmer chatbot that can reply in the farmer's language
- Farmer dashboard, farm registration, market prices and government schemes pages

**Shown with sample data (not live yet):**
- Satellite monitoring, weather and soil analysis dashboards

## Next Steps

- Connect the satellite, weather and soil dashboards to live data sources
- Build the early disease-risk warning from field data, without needing photos
- Test with real farmers and check results with agriculture experts

## Built With

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Maps and charts:** Leaflet, Recharts
- **AI:** Google Gen AI SDK (Gemini API)
- **Built using:** Google AI Studio (Build with AI), AI-assisted development

## My Role

I analyzed the problem statement, researched existing platforms to find what this solution should do differently, designed the structure of the solution, and built the working prototype using AI-assisted development.

## Status

Working hackathon prototype. Placed 2nd among 60+ teams at InnovateX.
