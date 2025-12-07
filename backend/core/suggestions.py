"""
Suggestions Engine for InsightSphere AI

This module generates personalized coping tips and journaling prompts
based on emotional analysis results.
"""

from typing import List, Dict
import random


class SuggestionGenerator:
    """Generates personalized coping suggestions and journaling prompts."""
    
    def __init__(self):
        """Initialize the suggestion generator with databases of tips and prompts."""
        
        # Coping tips organized by emotion
        self.coping_tips = {
            'joy': [
                "Take a moment to savor this positive feeling and notice what brought it about.",
                "Share your joy with someone you care about - positive emotions grow when shared.",
                "Write down what you're grateful for right now to anchor this feeling.",
                "Consider how you can create more moments like this in your life.",
                "Take a photo or make a note to remember this positive experience.",
            ],
            'sadness': [
                "Be gentle with yourself - it's okay to feel sad sometimes.",
                "Reach out to a trusted friend or family member for support.",
                "Try a small act of self-care, like taking a warm bath or listening to comforting music.",
                "Allow yourself to feel these emotions without judgment - they're valid.",
                "Consider gentle movement like a short walk, which can help shift your mood.",
                "Remember that these feelings are temporary and will pass.",
            ],
            'anxiety': [
                "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
                "Practice deep breathing: inhale for 4 counts, hold for 4, exhale for 4.",
                "Focus on what you can control right now, and let go of what you can't.",
                "Write down your worries to get them out of your head and onto paper.",
                "Try progressive muscle relaxation, tensing and releasing each muscle group.",
                "Remind yourself that anxiety is temporary and you've gotten through this before.",
            ],
            'anger': [
                "Take a few deep breaths before responding to the situation.",
                "Try physical activity to release the energy - go for a walk or do some exercise.",
                "Write down what you're feeling without filtering - you don't have to share it.",
                "Count to 10 (or 100) before taking action on your anger.",
                "Consider what's beneath the anger - sometimes it masks hurt or fear.",
                "Talk to someone you trust about what's bothering you.",
            ],
            'calm': [
                "Enjoy this peaceful moment and notice what helps you feel this way.",
                "Consider making this calm state a regular practice through meditation or mindfulness.",
                "Reflect on what's working well in your life right now.",
                "Use this clarity to plan or think about your goals.",
                "Share your sense of peace with others through kind actions.",
            ]
        }
        
        # Journaling prompts organized by emotion
        self.journaling_prompts = {
            'joy': [
                "What specific moments today brought you happiness?",
                "Who or what are you most grateful for right now?",
                "How can you create more of these positive experiences?",
                "What strengths did you use today that you're proud of?",
            ],
            'sadness': [
                "What would you say to a friend feeling the way you do right now?",
                "What small thing could bring you a bit of comfort today?",
                "What are three things that went okay today, even if small?",
                "What do you need most right now to feel supported?",
            ],
            'anxiety': [
                "What specific worries are on your mind right now?",
                "What's one thing you can control in this situation?",
                "What evidence do you have that things might work out?",
                "What would you tell a friend who was worried about this?",
            ],
            'anger': [
                "What triggered this anger? What happened just before you felt this way?",
                "What do you need that you're not getting right now?",
                "How would you like to respond to this situation?",
                "What boundaries might you need to set?",
            ],
            'calm': [
                "What helped you reach this peaceful state?",
                "What insights are coming to you in this moment of clarity?",
                "What are you learning about yourself lately?",
                "What would you like to focus on moving forward?",
            ]
        }
        
        # Distortion-specific reframing suggestions
        self.distortion_tips = {
            'overgeneralization': [
                "Notice when you use words like 'always' or 'never' - try to find exceptions to these patterns.",
                "Challenge absolute thinking by asking: 'Is this really true 100% of the time?'",
            ],
            'catastrophizing': [
                "Ask yourself: 'What's the most likely outcome?' rather than the worst-case scenario.",
                "Consider: 'Even if this happens, how might I cope?'",
            ],
            'black-and-white thinking': [
                "Look for the gray areas - most situations aren't all good or all bad.",
                "Try rating situations on a scale of 1-10 instead of seeing them as perfect or terrible.",
            ],
            'self-blame': [
                "Consider all the factors that contributed to this situation, not just your role.",
                "Ask yourself: 'Would I blame a friend this harshly in the same situation?'",
            ],
            'mind reading': [
                "Remember that you can't know what others are thinking - consider asking them directly.",
                "Challenge assumptions by looking for evidence that supports or contradicts your thoughts.",
            ],
            'fortune telling': [
                "Notice when you're predicting the future - what evidence do you have?",
                "Consider alternative outcomes that could also happen.",
            ]
        }
        
        # Safety messages for high-risk situations
        self.safety_messages = [
            "If you're feeling overwhelmed, please consider reaching out to a trusted friend, family member, or mental health professional. You don't have to face this alone.",
            "Remember that professional support is available. Consider talking to a counselor or therapist who can provide personalized guidance.",
            "These feelings can be intense, but they are temporary. If you're struggling, please reach out for support - you deserve help.",
        ]
    
    def generate_suggestions(
        self,
        primary_emotion: str,
        stress_score: float,
        cognitive_distortions: List[str]
    ) -> List[str]:
        """
        Generate personalized coping tips and journaling prompts.
        
        Args:
            primary_emotion: The detected primary emotion
            stress_score: Stress score (0-100)
            cognitive_distortions: List of detected cognitive distortions
            
        Returns:
            List of 4-6 suggestions (coping tips + journaling prompts + safety messages if needed)
        """
        suggestions = []
        
        # Get coping tips for the primary emotion (2-3 tips)
        emotion_tips = self.coping_tips.get(primary_emotion, self.coping_tips['calm'])
        selected_tips = random.sample(emotion_tips, min(3, len(emotion_tips)))
        suggestions.extend(selected_tips)
        
        # Get journaling prompts for the primary emotion (2-3 prompts)
        emotion_prompts = self.journaling_prompts.get(primary_emotion, self.journaling_prompts['calm'])
        selected_prompts = random.sample(emotion_prompts, min(2, len(emotion_prompts)))
        suggestions.extend(selected_prompts)
        
        # Add distortion-specific tips if applicable (max 1)
        if cognitive_distortions:
            # Pick one distortion to address
            distortion = random.choice(cognitive_distortions)
            distortion_tips = self.distortion_tips.get(distortion, [])
            if distortion_tips:
                suggestions.append(random.choice(distortion_tips))
        
        # Add safety message if high stress or high negative emotions
        # This will be handled by the safety message logic method
        
        return suggestions
    
    def should_include_safety_message(
        self,
        stress_score: float,
        emotions: Dict[str, float]
    ) -> bool:
        """
        Determine if a safety message should be included.
        
        Args:
            stress_score: Stress score (0-100)
            emotions: Dictionary of emotion scores
            
        Returns:
            True if safety message should be included
        """
        # High stress threshold
        if stress_score > 80:
            return True
        
        # High sadness or anxiety threshold
        if emotions.get('sadness', 0) > 0.7 or emotions.get('anxiety', 0) > 0.7:
            return True
        
        return False
    
    def get_safety_message(self) -> str:
        """
        Get a safety message encouraging professional help.
        
        Returns:
            Safety message string
        """
        return random.choice(self.safety_messages)
    
    def generate_complete_suggestions(
        self,
        primary_emotion: str,
        stress_score: float,
        emotions: Dict[str, float],
        cognitive_distortions: List[str]
    ) -> List[str]:
        """
        Generate complete suggestions including safety messages if needed.
        
        Args:
            primary_emotion: The detected primary emotion
            stress_score: Stress score (0-100)
            emotions: Dictionary of emotion scores
            cognitive_distortions: List of detected cognitive distortions
            
        Returns:
            List of suggestions (4-6 items, including safety message if needed)
        """
        # Generate base suggestions
        suggestions = self.generate_suggestions(
            primary_emotion,
            stress_score,
            cognitive_distortions
        )
        
        # Add safety message if needed
        if self.should_include_safety_message(stress_score, emotions):
            suggestions.append(self.get_safety_message())
        
        # Ensure we have 4-6 suggestions
        # If we have more than 6, trim to 6
        if len(suggestions) > 6:
            suggestions = suggestions[:6]
        
        # If we have fewer than 4, add more tips
        while len(suggestions) < 4:
            emotion_tips = self.coping_tips.get(primary_emotion, self.coping_tips['calm'])
            additional_tip = random.choice(emotion_tips)
            if additional_tip not in suggestions:
                suggestions.append(additional_tip)
        
        return suggestions
