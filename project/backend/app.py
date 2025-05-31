from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime
import logging

# Import agent modules
from agents.agent_manager import AgentManager
from agents.computer_vision_agent import ComputerVisionAgent
from agents.llm_agent import LLMAgent
from agents.motion_capture_agent import MotionCaptureAgent
from agents.feedback_combiner import FeedbackCombiner
from agents.logger import Logger

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize agents
computer_vision_agent = ComputerVisionAgent()
llm_agent = LLMAgent()
motion_capture_agent = MotionCaptureAgent()
feedback_combiner = FeedbackCombiner()
system_logger = Logger()
agent_manager = AgentManager(
    computer_vision_agent=computer_vision_agent,
    llm_agent=llm_agent,
    motion_capture_agent=motion_capture_agent,
    feedback_combiner=feedback_combiner,
    logger=system_logger
)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/upload', methods=['POST'])
def upload_video():
    """
    Upload and process an exercise video
    ---
    Expected form data:
    - video: The exercise video file
    - exerciseType: Type of exercise (e.g., 'squat', 'deadlift')
    - fitnessLevel: User's fitness level (e.g., 'beginner', 'intermediate', 'advanced')
    - userId: Optional user ID for tracking
    """
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"error": "No video file selected"}), 400
        
        # Get form data
        exercise_type = request.form.get('exerciseType', 'unknown')
        fitness_level = request.form.get('fitnessLevel', 'beginner')
        user_id = request.form.get('userId', 'anonymous')
        
        # Generate unique ID for this upload
        upload_id = str(uuid.uuid4())
        
        # Save video temporarily
        video_path = os.path.join(UPLOAD_FOLDER, f"{upload_id}_{video_file.filename}")
        video_file.save(video_path)
        
        logger.info(f"Video saved at {video_path}, starting analysis")
        
        # Process the video through agent manager
        result = agent_manager.process_exercise_video(
            video_path=video_path,
            exercise_type=exercise_type,
            fitness_level=fitness_level,
            user_id=user_id
        )
        
        # Return the combined feedback and analysis
        return jsonify({
            "id": upload_id,
            "status": "success",
            "result": result
        })
        
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/exercises/<exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    """Get details for a specific exercise analysis"""
    try:
        # In a real app, this would fetch from a database
        # For demo, we'll simulate fetching from the logger
        exercise_data = system_logger.get_exercise_data(exercise_id)
        
        if not exercise_data:
            return jsonify({"error": "Exercise not found"}), 404
            
        return jsonify(exercise_data)
        
    except Exception as e:
        logger.error(f"Error fetching exercise {exercise_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    """Get a list of exercise analyses, optionally filtered by user ID"""
    try:
        user_id = request.args.get('userId', None)
        exercise_type = request.args.get('exerciseType', None)
        
        # In a real app, this would query a database
        # For demo, we'll simulate fetching from the logger
        exercises = system_logger.get_exercises(user_id=user_id, exercise_type=exercise_type)
            
        return jsonify(exercises)
        
    except Exception as e:
        logger.error(f"Error fetching exercises: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)