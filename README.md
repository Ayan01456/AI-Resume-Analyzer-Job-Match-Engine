AI Resume Analyzer & Job Match Engine

Tech Stack: Node.js, Express, React, LLM APIs

##Overview

This project is a web application that analyzes resumes in PDF format and matches them with job descriptions using LLM APIs. It extracts relevant skills and experience from resumes and provides a job match score along with improvement suggestions.

##Features

Upload and parse PDF resumes

Extract skills, experience summary, and role relevance

Match resumes with job descriptions

Generate resume match score and missing skill analysis

REST API–based backend design

##Architecture

Frontend: React for resume upload and job description input

Backend: Node.js and Express for REST APIs and resume processing

AI Layer: LLM APIs used for structured resume analysis and job matching

##API Endpoints

POST /analyze-resume – Parses resume PDF and extracts structured information

POST /match-job – Matches resume data with job description and returns analysis

##Setup

git clone https://github.com/Ayan01456/AI-Resume-Analyzer-Job-Match-Engine

cd ai-resume-analyzer

npm install

Create a .env file:

LLM_API_KEY=your_api_key_here

Run the server:

npm start
