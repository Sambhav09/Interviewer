🤖 AI Interviewer Platform

An AI-powered mock interview platform that simulates real-life interviews using voice-based interaction. This project helps users practice interviews in a realistic environment and receive intelligent feedback.

🚀 Features

1. 🔐 User Authentication  
   Users must log in before accessing the platform.  
2. 🎯 AI-Based Interview Creation  
   Users can create a custom interview by speaking naturally.  
   AI collects details like:  
   Topic / Domain (e.g., Web Development, DSA)  
3. Number of questions  
   Difficulty level (Easy / Medium / Hard)  
   Other preferences  
4. 🧠 Smart Question Generation   
   Interview questions are generated using AI (Google Gemini).  
   Questions are tailored based on user input.  
5.🎙️ Realistic Voice Interview (VAPI AI)  
   The interview is conducted via voice using VAPI AI.  
   Feels like interacting with a real interviewer.   
   Real-time question asking and answering.   
6. 📊 AI Feedback System   
   After completing the interview:  
   Detailed feedback is generated  
   Performance analysis is provided   
   Feedback is powered by Google Gemini.  
7.🛠️ Tech Stack  
   Frontend   
      Next.js  
      React  
      Tailwind CSS   
   ⦿ Backend  
      Node.js / Express (if used)   
      MongoDB (for storing users/interviews)    
8. AI & Integrations   
   Google Gemini API → Question & Feedback generation  
   VAPI AI → Voice-based interview experience  
   Speech Input → Collect interview details naturally  
9. 📌 How It Works  
   User Login  
   User logs into the platform.  
   Create Interview  
   User speaks to the AI to define:  
   Topic  
   Difficulty  
   Number of questions  
   AI processes and creates the interview.  
   Question Generation   
   Gemini generates relevant interview questions.  
   Take Interview  
   VAPI AI conducts the interview via voice.  
   User answers in real-time.  
   Get Feedback   
   Gemini analyzes responses.   
   Generates structured feedback and suggestions.   
9.📷 Flow Overview   
   Login → Create Interview (Voice Input) → Generate Questions →    
   Voice Interview (VAPI AI) → AI Feedback (Gemini)  
10. 💡 Use Cases   
    Students preparing for placements  
    Developers practicing technical interviews  
    Improving communication & confidence  
Mock interviews before real job interviews  
🔧 Installation
# Clone the repo
git clone https://github.com/your-username/ai-interviewer.git

# Navigate to project
cd ai-interviewer

# Install dependencies
npm install

# Run the project
npm run dev
🔐 Environment Variables

Create a .env file and add:

GEMINI_API_KEY=your_key
VAPI_API_KEY=your_key
MONGODB_URI=your_db_uri
JWT_SECRET=your_secret
📈 Future Improvements
Video-based interviews
Resume-based question generation
Multi-language support
Interview history tracking
Leaderboard / scoring system
