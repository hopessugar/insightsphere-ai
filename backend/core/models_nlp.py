"""
NLP Analysis Engine for InsightSphere AI

This module provides lightweight, rule-based natural language processing
for emotion detection, stress assessment, and cognitive distortion identification.
"""

from typing import Dict, List, Any, Tuple
import re
from datetime import datetime


class TextAnalyzer:
    """Main text analysis engine for emotional and cognitive pattern detection."""
    
    def __init__(self):
        """Initialize the TextAnalyzer with keyword dictionaries."""
        # Emotion keyword dictionaries
        self.emotion_keywords = {
            'joy': [
                'happy', 'excited', 'grateful', 'wonderful', 'amazing', 'love', 'joyful',
                'delighted', 'pleased', 'cheerful', 'content', 'satisfied', 'glad',
                'thrilled', 'ecstatic', 'blessed', 'fortunate', 'optimistic', 'hopeful'
            ],
            'sadness': [
                'sad', 'depressed', 'hopeless', 'lonely', 'empty', 'crying', 'tears',
                'miserable', 'unhappy', 'down', 'blue', 'gloomy', 'dejected', 'despair',
                'heartbroken', 'grief', 'sorrow', 'melancholy', 'disappointed'
            ],
            'anxiety': [
                'anxious', 'worried', 'nervous', 'scared', 'panic', 'fear', 'stress',
                'stressed', 'overwhelmed', 'tense', 'uneasy', 'apprehensive', 'concerned',
                'frightened', 'terrified', 'dread', 'restless', 'on edge'
            ],
            'anger': [
                'angry', 'furious', 'irritated', 'frustrated', 'mad', 'rage', 'annoyed',
                'upset', 'outraged', 'hostile', 'resentful', 'bitter', 'aggravated',
                'infuriated', 'livid', 'enraged', 'irate'
            ],
            'calm': [
                'calm', 'peaceful', 'relaxed', 'serene', 'content', 'balanced', 'tranquil',
                'composed', 'centered', 'stable', 'grounded', 'at ease', 'comfortable'
            ]
        }
        
        # Intensity markers that amplify emotions
        self.intensity_markers = [
            'very', 'extremely', 'so', 'really', 'incredibly', 'absolutely',
            'completely', 'totally', 'utterly', 'deeply', 'intensely'
        ]
        
        # Absolute words that indicate stress
        self.absolute_words = [
            'always', 'never', 'everyone', 'no one', 'everything', 'nothing',
            'all the time', 'every time', 'constantly', 'forever'
        ]
        
        # Cognitive distortion patterns
        self.distortion_patterns = {
            'overgeneralization': [
                'always', 'never', 'everyone', 'no one', 'every time', 'all the time',
                'constantly', 'nobody', 'everybody', 'everything', 'nothing'
            ],
            'catastrophizing': [
                'worst', 'terrible', 'disaster', 'ruined', 'nothing will', 'everything is',
                'catastrophe', 'horrible', 'awful', 'doomed', 'hopeless', 'end of the world'
            ],
            'black-and-white thinking': [
                'perfect', 'completely', 'total failure', 'absolutely', 'either', 'or',
                'all or nothing', 'entirely', 'wholly', 'utterly'
            ],
            'self-blame': [
                'my fault', "i'm responsible", 'i should have', "i'm to blame",
                'i caused', 'because of me', "it's all on me"
            ],
            'mind reading': [
                'they think', 'everyone knows', 'people must think', 'they probably',
                'i know what', 'they believe'
            ],
            'fortune telling': [
                'will never', 'going to fail', "won't work", 'destined to',
                'bound to', 'inevitable', 'certain to fail'
            ]
        }
    
    def _clean_text(self, text: str) -> str:
        """
        Normalize text for analysis.
        
        Args:
            text: Raw input text
            
        Returns:
            Cleaned and normalized text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def _tokenize(self, text: str) -> List[str]:
        """
        Split text into words.
        
        Args:
            text: Cleaned text
            
        Returns:
            List of words
        """
        # Simple word tokenization
        words = re.findall(r'\b\w+\b', text)
        return words
    
    def _detect_negation(self, text: str, keyword: str) -> bool:
        """
        Check if a keyword is negated in the text.
        
        Args:
            text: Text to check
            keyword: Keyword to look for
            
        Returns:
            True if keyword is negated, False otherwise
        """
        negation_words = ['not', "n't", 'no', 'never']
        
        # Find keyword position
        pattern = r'\b' + re.escape(keyword) + r'\b'
        match = re.search(pattern, text)
        
        if not match:
            return False
        
        # Check 3 words before keyword for negation
        start = max(0, match.start() - 20)
        context = text[start:match.start()]
        
        for neg in negation_words:
            if neg in context.split():
                return True
        
        return False
    
    def _calculate_emotions(self, text: str) -> Dict[str, float]:
        """
        Calculate emotion scores using keyword matching.
        
        Args:
            text: Cleaned text
            
        Returns:
            Dictionary of emotion scores (0.0-1.0)
        """
        words = self._tokenize(text)
        word_count = len(words)
        
        if word_count == 0:
            return {emotion: 0.0 for emotion in self.emotion_keywords.keys()}
        
        emotion_scores = {}
        
        for emotion, keywords in self.emotion_keywords.items():
            score = 0.0
            
            for keyword in keywords:
                # Count occurrences
                pattern = r'\b' + re.escape(keyword) + r'\b'
                matches = re.findall(pattern, text)
                count = len(matches)
                
                if count > 0:
                    # Check for negation
                    if self._detect_negation(text, keyword):
                        # Reduce score for negated keywords
                        score += count * 0.3
                    else:
                        score += count
                    
                    # Check for intensity markers near keyword
                    for marker in self.intensity_markers:
                        marker_pattern = r'\b' + re.escape(marker) + r'\s+\w*\s*' + re.escape(keyword) + r'\b'
                        if re.search(marker_pattern, text):
                            score += 0.5  # Bonus for intensity
            
            # Normalize by word count and cap at 1.0
            normalized_score = min(1.0, score / max(1, word_count / 10))
            emotion_scores[emotion] = round(normalized_score, 2)
        
        return emotion_scores
    
    def _get_primary_emotion(self, emotions: Dict[str, float]) -> str:
        """
        Determine the primary emotion from scores.
        
        Args:
            emotions: Dictionary of emotion scores
            
        Returns:
            Name of primary emotion
        """
        if not emotions or all(score == 0 for score in emotions.values()):
            return 'calm'
        
        # Find max score
        max_score = max(emotions.values())
        
        # Get all emotions with max score
        top_emotions = [emotion for emotion, score in emotions.items() if score == max_score]
        
        # If tie, use alphabetical order
        return sorted(top_emotions)[0]
    
    def _calculate_stress_score(self, text: str, emotions: Dict[str, float]) -> float:
        """
        Calculate stress score (0-100).
        
        Args:
            text: Cleaned text
            emotions: Emotion scores
            
        Returns:
            Stress score between 0 and 100
        """
        words = self._tokenize(text)
        word_count = len(words)
        
        if word_count == 0:
            return 0.0
        
        # Base stress from negative emotions
        negative_emotions = emotions.get('sadness', 0) + emotions.get('anxiety', 0) + emotions.get('anger', 0)
        base_stress = negative_emotions / 3 * 60  # Scale to 0-60
        
        # Intensity factor
        intensity_count = sum(1 for marker in self.intensity_markers if marker in text)
        intensity_factor = min(30, (intensity_count / word_count) * 100 * 30)
        
        # Absolute words factor
        absolute_count = sum(1 for word in self.absolute_words if word in text)
        absolute_factor = min(10, absolute_count * 2)
        
        # Length factor (longer stressed text = higher stress)
        length_factor = min(10, len(text) / 100)
        
        # Calculate total stress
        stress_score = base_stress + intensity_factor + absolute_factor + length_factor
        
        # Cap at 100
        return round(min(100.0, stress_score), 1)
    
    def _detect_cognitive_distortions(self, text: str) -> List[str]:
        """
        Identify cognitive distortion patterns.
        
        Args:
            text: Cleaned text
            
        Returns:
            List of detected distortion types (unique)
        """
        detected = set()
        
        for distortion_type, patterns in self.distortion_patterns.items():
            for pattern in patterns:
                if pattern in text:
                    detected.add(distortion_type)
                    break  # Found one pattern for this type, move to next type
        
        return sorted(list(detected))  # Return sorted for consistency
    
    def _generate_summary(self, text: str, primary_emotion: str, stress_score: float) -> str:
        """
        Create human-readable summary.
        
        Args:
            text: Original text
            primary_emotion: Detected primary emotion
            stress_score: Calculated stress score
            
        Returns:
            1-2 sentence summary
        """
        # Determine stress level
        if stress_score < 34:
            stress_level = "low stress"
        elif stress_score < 67:
            stress_level = "moderate stress"
        else:
            stress_level = "high stress"
        
        # Create empathetic summary based on primary emotion
        summaries = {
            'joy': f"You're expressing feelings of {primary_emotion} with {stress_level}. It's wonderful to see positive emotions coming through.",
            'sadness': f"You're experiencing {primary_emotion} with {stress_level}. These feelings are valid, and it's okay to feel this way.",
            'anxiety': f"You're feeling {primary_emotion} with {stress_level}. Remember that these feelings are temporary and manageable.",
            'anger': f"You're expressing {primary_emotion} with {stress_level}. It's important to acknowledge these feelings.",
            'calm': f"You're in a state of {primary_emotion} with {stress_level}. This balanced state is valuable."
        }
        
        return summaries.get(primary_emotion, f"You're experiencing {primary_emotion} with {stress_level}.")
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Main analysis orchestrator.
        
        Args:
            text: Raw input text from user
            
        Returns:
            Complete analysis results dictionary
        """
        # Clean text
        cleaned_text = self._clean_text(text)
        
        # Calculate emotions
        emotions = self._calculate_emotions(cleaned_text)
        
        # Get primary emotion
        primary_emotion = self._get_primary_emotion(emotions)
        
        # Calculate stress score
        stress_score = self._calculate_stress_score(cleaned_text, emotions)
        
        # Detect cognitive distortions
        cognitive_distortions = self._detect_cognitive_distortions(cleaned_text)
        
        # Generate summary
        summary = self._generate_summary(text, primary_emotion, stress_score)
        
        # Generate timestamp
        timestamp = datetime.utcnow().isoformat() + 'Z'
        
        return {
            'emotions': emotions,
            'primary_emotion': primary_emotion,
            'stress_score': stress_score,
            'cognitive_distortions': cognitive_distortions,
            'summary': summary,
            'timestamp': timestamp
        }
