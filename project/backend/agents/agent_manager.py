import logging
import os
import tempfile
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class AgentManager:
    """
    Orchestrates the workflow by routing data between agents and managing the overall process.
    """
    
    def __init__(self, computer_vision_agent, llm_agent, motion_capture_agent, feedback_combiner, logger):
        self.computer_vision_agent = computer_vision_agent
        self.llm_agent = llm_agent
        self.motion_capture_agent = motion_capture_agent
        self.feedback_combiner = feedback_combiner
        self.logger = logger
    
    def process_exercise_video(
        self, 
        video_path: str, 
        exercise_type: str, 
        fitness_level: str,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process an exercise video through the entire workflow.
        
        Args:
            video_path: Path to the uploaded video file
            exercise_type: Type of exercise (e.g., 'squat', 'deadlift')
            fitness_level: User's fitness level (e.g., 'beginner', 'intermediate')
            user_id: Optional user ID for tracking
            
        Returns:
            Dict containing the combined feedback, errors, and visual guidance
        """
        try:
            logger.info(f"Starting analysis for {exercise_type} video, fitness level: {fitness_level}")
            
            # 1. Analyze video with Computer Vision Agent
            errors = self.computer_vision_agent.analyze_video(
                video_path=video_path,
                exercise_type=exercise_type
            )
            
            # Log the detected errors
            self.logger.store_error_data(
                user_id=user_id,
                exercise_type=exercise_type,
                errors=errors
            )
            
            # 2. Generate feedback with LLM Agent
            user_metadata = {
                "fitness_level": fitness_level,
                "exercise_type": exercise_type
            }
            
            feedback, form_description = self.llm_agent.generate_feedback(
                errors=errors,
                user_metadata=user_metadata
            )
            
            # Log the feedback
            self.logger.store_feedback_data(
                user_id=user_id,
                exercise_type=exercise_type,
                feedback=feedback,
                form_description=form_description
            )
            
            # 3. Get visual model/image from Motion Capture Agent
            visual_guidance = self.motion_capture_agent.get_guidance(
                form_description=form_description,
                exercise_type=exercise_type
            )
            
            # Log the visual guidance
            self.logger.store_visual_data(
                user_id=user_id,
                exercise_type=exercise_type,
                visual_data=visual_guidance
            )
            
            # 4. Combine everything with Feedback Combiner
            combined_output = self.feedback_combiner.combine_feedback(
                errors=errors,
                feedback_text=feedback,
                visual_guidance=visual_guidance,
                video_path=video_path
            )
            
            # 5. Create and return the final output
            result = {
                "exercise_type": exercise_type,
                "fitness_level": fitness_level,
                "score": combined_output["score"],
                "feedback": combined_output["feedback_text"],
                "errors": combined_output["errors"],
                "visual_guidance": combined_output["visual_guidance"],
                "annotated_video_url": combined_output.get("annotated_video_url")
            }
            
            # Log the complete analysis
            exercise_id = self.logger.store_exercise_data(
                user_id=user_id,
                exercise_type=exercise_type,
                fitness_level=fitness_level,
                result=result
            )
            
            # Add the ID to the result
            result["id"] = exercise_id
            
            logger.info(f"Completed analysis for {exercise_type}, score: {result['score']}")
            return result
            
        except Exception as e:
            logger.error(f"Error in analysis workflow: {str(e)}")
            raise