# FormFit AI Backend

This directory contains the Python backend for the FormFit AI application, which provides exercise form analysis using a multi-agent architecture.

## Setup and Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create necessary directories:
```bash
mkdir -p uploads data
```

## Running the Server

```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/upload` - Upload and analyze an exercise video
- `GET /api/exercises/<exercise_id>` - Get details for a specific exercise analysis
- `GET /api/exercises` - Get a list of exercise analyses (with optional filtering)

## Architecture Overview

The backend uses a multi-agent architecture:

1. **Agent Manager**: Orchestrates the workflow between other agents
2. **Computer Vision Agent**: Analyzes videos for form errors using pose estimation
3. **LLM Agent**: Generates detailed feedback based on detected errors
4. **Motion Capture Agent**: Provides visual guidance (3D models or reference images)
5. **Feedback Combiner**: Integrates all components into cohesive output
6. **Logger**: Stores data for progress tracking

Each agent is implemented as a separate module with clear responsibilities.

## Limitations and Future Improvements

- Currently uses mock implementations for computer vision and LLM processing
- Replace with actual ML models in production
- Add authentication and user management
- Implement proper database storage
- Add real-time analysis capabilities