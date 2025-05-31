import logging
import json
import os
from typing import Dict, List, Any, Tuple
from openai import OpenAI

logger = logging.getLogger(__name__)

class LLMAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.conversation_history = {}
        logger.info("LLM Agent initialized with OpenAI")
    
    def generate_feedback(self, errors: List[Dict[str, Any]], user_metadata: Dict[str, str]) -> Tuple[str, str]:
        try:
            user_id = user_metadata.get('user_id', 'anonymous')
            
            # Get conversation history for this user
            history = self.conversation_history.get(user_id, [])
            
            # Prepare the message for OpenAI
            messages = [
                {"role": "system", "content": "You are an expert fitness coach providing form feedback."},
                *history,
                {"role": "user", "content": self._format_prompt(errors, user_metadata)}
            ]
            
            # Generate feedback using OpenAI
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            feedback = response.choices[0].message.content
            
            # Update conversation history
            history.extend([
                {"role": "user", "content": self._format_prompt(errors, user_metadata)},
                {"role": "assistant", "content": feedback}
            ])
            self.conversation_history[user_id] = history[-10:]  # Keep last 10 messages
            
            # Extract form description from feedback
            form_description = self._extract_form_description(feedback)
            
            return feedback, form_description
            
        except Exception as e:
            logger.error(f"Error generating feedback: {str(e)}")
            return (
                "We analyzed your exercise form and noticed some areas for improvement. Focus on maintaining proper alignment and controlled movements.",
                "Maintain proper form throughout the exercise."
            )
    
    def _format_prompt(self, errors: List[Dict[str, Any]], user_metadata: Dict[str, str]) -> str:
        exercise_type = user_metadata.get('exercise_type', 'unknown')
        fitness_level = user_metadata.get('fitness_level', 'beginner')
        
        prompt = f"""
        Please provide detailed feedback for a {fitness_level} level {exercise_type} exercise.
        
        Detected errors:
        {json.dumps(errors, indent=2)}
        
        Please include:
        1. Overall assessment
        2. Specific corrections for each error
        3. Tips for improvement
        4. Positive reinforcement
        """
        
        return prompt
    
    def _extract_form_description(self, feedback: str) -> str:
        # Extract the key form cues from the feedback
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Extract the key form cues from this feedback in a concise format."},
                    {"role": "user", "content": feedback}
                ],
                temperature=0.3,
                max_tokens=100
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error extracting form description: {str(e)}")
            return "Maintain proper form throughout the exercise."