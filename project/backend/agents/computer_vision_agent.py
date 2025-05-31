import logging
import os
import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from typing import Dict, List, Any, Tuple

logger = logging.getLogger(__name__)

class ComputerVisionAgent:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Load custom TensorFlow model for exercise classification
        self.model = tf.keras.models.load_model('models/exercise_classifier.h5')
        
        self.error_detectors = {
            "squat": self._analyze_squat,
            "deadlift": self._analyze_deadlift,
            "pushup": self._analyze_pushup,
            "plank": self._analyze_plank,
            "lunge": self._analyze_lunge
        }
        
        logger.info("Computer Vision Agent initialized with MediaPipe and TensorFlow")
    
    def analyze_video(self, video_path: str, exercise_type: str) -> List[Dict[str, Any]]:
        try:
            frames, fps = self._extract_frames(video_path)
            landmarks_sequence = self._extract_pose_landmarks(frames)
            
            # Analyze pose sequence for errors
            errors = self.error_detectors[exercise_type](landmarks_sequence, fps)
            
            return errors
            
        except Exception as e:
            logger.error(f"Error analyzing video: {str(e)}")
            return []
    
    def _extract_pose_landmarks(self, frames: List[np.ndarray]) -> List[Dict]:
        landmarks_sequence = []
        
        for frame in frames:
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(frame_rgb)
            
            if results.pose_landmarks:
                # Convert landmarks to normalized coordinates
                landmarks = {
                    'nose': (results.pose_landmarks.landmark[0].x, results.pose_landmarks.landmark[0].y),
                    'shoulders': [
                        (results.pose_landmarks.landmark[11].x, results.pose_landmarks.landmark[11].y),
                        (results.pose_landmarks.landmark[12].x, results.pose_landmarks.landmark[12].y)
                    ],
                    'hips': [
                        (results.pose_landmarks.landmark[23].x, results.pose_landmarks.landmark[23].y),
                        (results.pose_landmarks.landmark[24].x, results.pose_landmarks.landmark[24].y)
                    ],
                    'knees': [
                        (results.pose_landmarks.landmark[25].x, results.pose_landmarks.landmark[25].y),
                        (results.pose_landmarks.landmark[26].x, results.pose_landmarks.landmark[26].y)
                    ],
                    'ankles': [
                        (results.pose_landmarks.landmark[27].x, results.pose_landmarks.landmark[27].y),
                        (results.pose_landmarks.landmark[28].x, results.pose_landmarks.landmark[28].y)
                    ]
                }
                landmarks_sequence.append(landmarks)
        
        return landmarks_sequence
    
    def _analyze_squat(self, landmarks_sequence: List[Dict], fps: float) -> List[Dict[str, Any]]:
        errors = []
        
        for i, landmarks in enumerate(landmarks_sequence):
            # Check knee alignment
            knee_x = (landmarks['knees'][0][0] + landmarks['knees'][1][0]) / 2
            ankle_x = (landmarks['ankles'][0][0] + landmarks['ankles'][1][0]) / 2
            
            if abs(knee_x - ankle_x) > 0.1:
                errors.append({
                    "timestamp": self._format_timestamp(i, fps),
                    "severity": "high",
                    "description": "Knees not aligned with ankles",
                    "confidence": 0.92
                })
            
            # Check back angle
            hip_y = (landmarks['hips'][0][1] + landmarks['hips'][1][1]) / 2
            shoulder_y = (landmarks['shoulders'][0][1] + landmarks['shoulders'][1][1]) / 2
            
            if abs(hip_y - shoulder_y) > 0.3:
                errors.append({
                    "timestamp": self._format_timestamp(i, fps),
                    "severity": "medium",
                    "description": "Back not straight",
                    "confidence": 0.85
                })
        
        return errors

    # Similar implementations for other exercises...
    
    def _format_timestamp(self, frame_idx: int, fps: float) -> str:
        total_seconds = frame_idx / fps
        minutes = int(total_seconds // 60)
        seconds = int(total_seconds % 60)
        return f"{minutes:02d}:{seconds:02d}"