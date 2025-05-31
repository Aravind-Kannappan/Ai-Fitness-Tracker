import logging
import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class Logger:
    """
    Stores analysis results, feedback, and model/image data for progress tracking.
    
    In a production system, this would use a proper database.
    For this demo, we'll use in-memory storage with file backup.
    """
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        
        # Create data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        # Initialize storage
        self.error_data = {}
        self.feedback_data = {}
        self.visual_data = {}
        self.exercise_data = {}
        
        logger.info(f"Logger initialized with data directory: {data_dir}")
    
    def store_error_data(self, user_id: Optional[str], exercise_type: str, errors: List[Dict[str, Any]]) -> None:
        """Store error data from Computer Vision Agent"""
        record_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        record = {
            "id": record_id,
            "timestamp": timestamp,
            "user_id": user_id or "anonymous",
            "exercise_type": exercise_type,
            "errors": errors
        }
        
        self.error_data[record_id] = record
        self._save_to_file("error_data", record)
        
        logger.info(f"Stored error data with ID: {record_id}")
    
    def store_feedback_data(self, user_id: Optional[str], exercise_type: str, 
                           feedback: str, form_description: str) -> None:
        """Store feedback data from LLM Agent"""
        record_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        record = {
            "id": record_id,
            "timestamp": timestamp,
            "user_id": user_id or "anonymous",
            "exercise_type": exercise_type,
            "feedback": feedback,
            "form_description": form_description
        }
        
        self.feedback_data[record_id] = record
        self._save_to_file("feedback_data", record)
        
        logger.info(f"Stored feedback data with ID: {record_id}")
    
    def store_visual_data(self, user_id: Optional[str], exercise_type: str, 
                         visual_data: Dict[str, Any]) -> None:
        """Store visual data from Motion Capture Agent"""
        record_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        record = {
            "id": record_id,
            "timestamp": timestamp,
            "user_id": user_id or "anonymous",
            "exercise_type": exercise_type,
            "visual_data": visual_data
        }
        
        self.visual_data[record_id] = record
        self._save_to_file("visual_data", record)
        
        logger.info(f"Stored visual data with ID: {record_id}")
    
    def store_exercise_data(self, user_id: Optional[str], exercise_type: str, 
                           fitness_level: str, result: Dict[str, Any]) -> str:
        """
        Store complete exercise analysis data.
        
        Returns:
            The ID of the stored exercise data
        """
        record_id = result.get("id", str(uuid.uuid4()))
        timestamp = datetime.now().isoformat()
        
        record = {
            "id": record_id,
            "timestamp": timestamp,
            "user_id": user_id or "anonymous",
            "exercise_type": exercise_type,
            "fitness_level": fitness_level,
            "result": result,
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        
        self.exercise_data[record_id] = record
        self._save_to_file("exercise_data", record)
        
        logger.info(f"Stored exercise data with ID: {record_id}")
        return record_id
    
    def get_exercise_data(self, exercise_id: str) -> Optional[Dict[str, Any]]:
        """Get exercise data by ID"""
        return self.exercise_data.get(exercise_id)
    
    def get_exercises(self, user_id: Optional[str] = None, 
                     exercise_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get a list of exercises, optionally filtered by user ID and/or exercise type.
        
        Returns:
            List of exercise data
        """
        exercises = list(self.exercise_data.values())
        
        # Filter by user ID if provided
        if user_id:
            exercises = [ex for ex in exercises if ex["user_id"] == user_id]
        
        # Filter by exercise type if provided
        if exercise_type:
            exercises = [ex for ex in exercises if ex["exercise_type"] == exercise_type]
        
        # Sort by timestamp, newest first
        exercises.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return exercises
    
    def _save_to_file(self, data_type: str, record: Dict[str, Any]) -> None:
        """Save record to a JSON file"""
        try:
            filename = os.path.join(self.data_dir, f"{data_type}_{record['id']}.json")
            
            with open(filename, 'w') as f:
                json.dump(record, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving {data_type} to file: {str(e)}")