"""
AI Therapist Module for InsightSphere AI

This module provides conversational AI therapy using advanced language models.
It acts as a supportive, empathetic mental health companion.
"""

from typing import List, Dict, Optional
import os
from datetime import datetime
import json


class AITherapist:
    """
    AI-powered therapist that provides conversational support and guidance.
    
    This uses therapeutic techniques like:
    - Active listening and reflection
    - Cognitive Behavioral Therapy (CBT) principles
    - Empathetic validation
    - Solution-focused questioning
    - Crisis assessment
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the AI therapist.
        
        Args:
            api_key: Gemini API key (optional, will use env var if not provided)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.model = "gemini-1.5-flash"  # Google's Gemini 1.5 Flash model (latest)
        
        # System prompt that defines the therapist's behavior
        self.system_prompt = """You are a compassionate, professional AI mental health companion for InsightSphere AI. Your role is to:

1. **Listen actively** - Reflect back what the user shares to show understanding
2. **Validate emotions** - Acknowledge that their feelings are valid and understandable
3. **Ask thoughtful questions** - Help users explore their thoughts and feelings deeper
4. **Provide evidence-based guidance** - Use CBT, mindfulness, and other therapeutic techniques
5. **Encourage professional help** - When appropriate, suggest seeing a licensed therapist
6. **Maintain boundaries** - You're a supportive companion, not a replacement for professional care

**Important Guidelines:**
- Be warm, empathetic, and non-judgmental
- Use simple, accessible language
- Ask open-ended questions to encourage reflection
- Provide practical coping strategies when appropriate
- Never diagnose or prescribe medication
- If someone expresses suicidal thoughts, provide crisis resources immediately
- Keep responses concise (2-4 paragraphs) unless more detail is requested
- Use "I" statements to show empathy: "I hear that you're feeling..."

**Therapeutic Techniques to Use:**
- **Socratic questioning**: Help users examine their thoughts
- **Cognitive reframing**: Gently challenge unhelpful thought patterns
- **Behavioral activation**: Suggest small, manageable actions
- **Mindfulness**: Encourage present-moment awareness
- **Validation**: Acknowledge emotions before problem-solving

Remember: You're here to support, not to fix. Sometimes people just need to be heard."""

    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        emotional_context: Optional[Dict] = None
    ) -> str:
        """
        Generate a therapeutic response to the user's message.
        
        Args:
            user_message: The user's current message
            conversation_history: List of previous messages [{"role": "user/assistant", "content": "..."}]
            emotional_context: Optional emotional analysis data (emotions, stress_score, etc.)
            
        Returns:
            AI-generated therapeutic response
        """
        # Use Gemini AI if API key is provided, otherwise use fallback
        try:
            # Only try Gemini if API key is provided
            if not self.api_key:
                print("No Gemini API key found. Using fallback responses.")
                return self._fallback_response(user_message, emotional_context)
            
            print(f"Using Gemini API with key: {self.api_key[:20]}...")
            
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            
            # Create the model (using gemini-2.5-flash - latest available model)
            model = genai.GenerativeModel('models/gemini-2.5-flash')
            
            # Build the prompt with system instructions and context
            full_prompt = self.system_prompt + "\n\n"
            
            # Add emotional context if available
            if emotional_context:
                context_msg = self._format_emotional_context(emotional_context)
                full_prompt += context_msg + "\n\n"
            
            # Add conversation history
            if conversation_history:
                full_prompt += "Previous conversation:\n"
                for msg in conversation_history[-6:]:  # Last 6 messages for context
                    role = "User" if msg['role'] == 'user' else "Assistant"
                    full_prompt += f"{role}: {msg['content']}\n"
                full_prompt += "\n"
            
            # Add current user message
            full_prompt += f"User: {user_message}\n\nAssistant:"
            
            # Generate response
            response = model.generate_content(
                full_prompt,
                generation_config={
                    'temperature': 0.7,
                    'top_p': 0.95,
                    'top_k': 40,
                    'max_output_tokens': 500,
                }
            )
            
            return response.text.strip()
            
        except ImportError:
            # Gemini not installed, use fallback
            print("Gemini library not installed. Using fallback responses.")
            return self._fallback_response(user_message, emotional_context)
        except Exception as e:
            # Any other error, use fallback
            print(f"Error generating Gemini response: {e}")
            return self._fallback_response(user_message, emotional_context)
    
    def _format_emotional_context(self, emotional_context: Dict) -> str:
        """Format emotional analysis data for the AI."""
        context_parts = []
        
        if 'primary_emotion' in emotional_context:
            context_parts.append(f"User's primary emotion: {emotional_context['primary_emotion']}")
        
        if 'stress_score' in emotional_context:
            stress = emotional_context['stress_score']
            level = "low" if stress < 40 else "moderate" if stress < 70 else "high"
            context_parts.append(f"Stress level: {level} ({stress:.1f}/100)")
        
        if 'cognitive_distortions' in emotional_context and emotional_context['cognitive_distortions']:
            distortions = ", ".join(emotional_context['cognitive_distortions'])
            context_parts.append(f"Detected thought patterns: {distortions}")
        
        if context_parts:
            return "Context from emotional analysis:\n" + "\n".join(context_parts)
        return ""
    
    def _fallback_response(self, user_message: str, emotional_context: Optional[Dict] = None) -> str:
        """
        Provide a rule-based response when AI is not available.
        This uses pattern matching and templates.
        """
        message_lower = user_message.lower()
        
        # Crisis keywords
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'no point living']
        if any(keyword in message_lower for keyword in crisis_keywords):
            return """I'm really concerned about what you're sharing. These feelings are serious, and you deserve immediate support.

Please reach out to a crisis helpline right away:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

You don't have to face this alone. Please talk to someone who can help right now."""
        
        # Anxiety keywords
        anxiety_keywords = ['anxious', 'worried', 'panic', 'nervous', 'scared', 'afraid']
        if any(keyword in message_lower for keyword in anxiety_keywords):
            return """I hear that you're feeling anxious, and that can be really overwhelming. Anxiety is your body's way of trying to protect you, even when it feels uncomfortable.

Let's try something together: Can you take a slow, deep breath with me? Breathe in for 4 counts, hold for 4, and out for 4.

What specifically is worrying you right now? Sometimes naming our worries can help us see them more clearly. And remember - you've gotten through anxious moments before, and you can get through this one too."""
        
        # Sadness keywords
        sadness_keywords = ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely']
        if any(keyword in message_lower for keyword in sadness_keywords):
            return """Thank you for sharing how you're feeling. Sadness can feel so heavy, and it takes courage to acknowledge it.

Your feelings are valid, and it's okay to not be okay sometimes. You don't have to push these feelings away or fix them immediately.

What would feel supportive for you right now? Sometimes it helps to talk about what's weighing on you, and sometimes it helps to just be gentle with yourself. What do you need most in this moment?"""
        
        # Anger keywords
        anger_keywords = ['angry', 'furious', 'frustrated', 'mad', 'irritated', 'rage']
        if any(keyword in message_lower for keyword in anger_keywords):
            return """I can sense the frustration and anger in what you're sharing. Those are powerful emotions, and they're telling you that something feels wrong or unfair.

Before we dive deeper, let's make sure you're in a space where you can think clearly. Have you had a chance to take a few deep breaths or step away from the situation?

What happened that triggered these feelings? And what do you think you need right now - to be heard, to problem-solve, or something else?"""
        
        # Stress keywords
        stress_keywords = ['stressed', 'overwhelmed', 'too much', 'can\'t handle', 'pressure']
        if any(keyword in message_lower for keyword in stress_keywords):
            return """It sounds like you're carrying a lot right now, and feeling overwhelmed is completely understandable when there's so much on your plate.

Let's break this down together. What's the most pressing thing you're dealing with right now? Sometimes when everything feels urgent, it helps to focus on just one thing at a time.

Also, have you been able to take care of your basic needs today - sleep, food, water? When we're stressed, these often get neglected, but they make a big difference in how we cope."""
        
        # Relationship keywords
        relationship_keywords = ['relationship', 'partner', 'friend', 'family', 'conflict', 'argument']
        if any(keyword in message_lower for keyword in relationship_keywords):
            return """Relationships can be one of the most meaningful and challenging parts of life. It sounds like you're navigating something difficult.

Can you tell me more about what's happening? What's the situation, and how is it affecting you?

Sometimes it helps to think about: What do you need from this relationship? What are you hoping will change? And what's within your control to address?"""
        
        # Work/school keywords
        work_keywords = ['work', 'job', 'school', 'exam', 'deadline', 'performance', 'boss', 'teacher']
        if any(keyword in message_lower for keyword in work_keywords):
            return """Work and academic pressures can be really intense. It sounds like you're dealing with something challenging in that area.

What specifically is weighing on you? Is it the workload, relationships with others, performance expectations, or something else?

Remember that your worth isn't defined by your productivity or achievements. You're valuable as a person, regardless of how things go at work or school. What support do you need right now?"""
        
        # Default empathetic response
        return """Thank you for sharing that with me. I'm here to listen and support you.

Can you tell me more about what's on your mind? What's been happening, and how are you feeling about it?

Sometimes it helps to talk through things, and I'm here to help you explore your thoughts and feelings without judgment."""
    
    def assess_crisis_level(self, message: str) -> Dict[str, any]:
        """
        Assess if the message indicates a mental health crisis.
        
        Args:
            message: User's message
            
        Returns:
            Dict with crisis_detected (bool) and severity (low/medium/high)
        """
        message_lower = message.lower()
        
        # High severity crisis keywords
        high_severity = ['suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live']
        
        # Medium severity keywords
        medium_severity = ['self harm', 'hurt myself', 'cutting', 'can\'t go on', 'give up']
        
        # Low severity (concerning but not immediate crisis)
        low_severity = ['hopeless', 'worthless', 'no point', 'better off without me']
        
        if any(keyword in message_lower for keyword in high_severity):
            return {
                'crisis_detected': True,
                'severity': 'high',
                'message': 'Immediate crisis support needed'
            }
        elif any(keyword in message_lower for keyword in medium_severity):
            return {
                'crisis_detected': True,
                'severity': 'medium',
                'message': 'Concerning content detected'
            }
        elif any(keyword in message_lower for keyword in low_severity):
            return {
                'crisis_detected': True,
                'severity': 'low',
                'message': 'Distress detected'
            }
        
        return {
            'crisis_detected': False,
            'severity': 'none',
            'message': 'No crisis indicators'
        }
    
    def get_crisis_resources(self) -> Dict[str, List[Dict[str, str]]]:
        """Get crisis support resources."""
        return {
            'immediate': [
                {
                    'name': 'National Suicide Prevention Lifeline',
                    'contact': '988',
                    'description': '24/7 crisis support in the US'
                },
                {
                    'name': 'Crisis Text Line',
                    'contact': 'Text HOME to 741741',
                    'description': '24/7 text-based crisis support'
                },
                {
                    'name': 'Emergency Services',
                    'contact': '911',
                    'description': 'For immediate life-threatening emergencies'
                }
            ],
            'international': [
                {
                    'name': 'International Association for Suicide Prevention',
                    'contact': 'https://www.iasp.info/resources/Crisis_Centres/',
                    'description': 'Crisis centers worldwide'
                }
            ],
            'online': [
                {
                    'name': 'BetterHelp',
                    'contact': 'https://www.betterhelp.com',
                    'description': 'Online therapy platform'
                },
                {
                    'name': 'Talkspace',
                    'contact': 'https://www.talkspace.com',
                    'description': 'Online therapy and psychiatry'
                }
            ]
        }
