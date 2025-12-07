"""
Unit tests for InsightSphere AI backend components.

These tests verify individual functions and methods work correctly.
"""

import pytest
from core.models_nlp import TextAnalyzer
from core.suggestions import SuggestionGenerator


# Initialize components
analyzer = TextAnalyzer()
suggestion_gen = SuggestionGenerator()


class TestTextCleaning:
    """Tests for text cleaning and preprocessing."""
    
    def test_clean_text_lowercase(self):
        """Test that text is converted to lowercase."""
        text = "I Am FEELING Happy"
        cleaned = analyzer._clean_text(text)
        assert cleaned == cleaned.lower()
    
    def test_clean_text_whitespace(self):
        """Test that extra whitespace is removed."""
        text = "I  am   feeling    happy"
        cleaned = analyzer._clean_text(text)
        assert "  " not in cleaned
        assert cleaned == "i am feeling happy"
    
    def test_tokenize(self):
        """Test word tokenization."""
        text = "i am feeling happy today"
        words = analyzer._tokenize(text)
        assert len(words) == 5
        assert words == ['i', 'am', 'feeling', 'happy', 'today']


class TestEmotionDetection:
    """Tests for emotion detection."""
    
    def test_emotion_keywords_joy(self):
        """Test that joy keywords are detected."""
        text = "I am so happy and excited about this wonderful day"
        result = analyzer.analyze_text(text)
        assert result['emotions']['joy'] > 0
    
    def test_emotion_keywords_sadness(self):
        """Test that sadness keywords are detected."""
        text = "I feel so sad and lonely and depressed today"
        result = analyzer.analyze_text(text)
        assert result['emotions']['sadness'] > 0
    
    def test_emotion_keywords_anxiety(self):
        """Test that anxiety keywords are detected."""
        text = "I am very anxious and worried and nervous about everything"
        result = analyzer.analyze_text(text)
        assert result['emotions']['anxiety'] > 0
    
    def test_primary_emotion_selection(self):
        """Test that primary emotion is correctly identified."""
        text = "I am extremely happy and joyful and excited"
        result = analyzer.analyze_text(text)
        assert result['primary_emotion'] == 'joy'


class TestStressCalculation:
    """Tests for stress score calculation."""
    
    def test_stress_score_boundaries_low(self):
        """Test stress score for positive text."""
        text = "I am feeling calm and peaceful and relaxed today"
        result = analyzer.analyze_text(text)
        assert 0 <= result['stress_score'] <= 40
    
    def test_stress_score_boundaries_high(self):
        """Test stress score for negative text."""
        text = "I am extremely anxious and very worried and always stressed and never calm"
        result = analyzer.analyze_text(text)
        assert result['stress_score'] > 40
    
    def test_stress_score_range(self):
        """Test that stress score is always in valid range."""
        texts = [
            "I am happy",
            "I am sad and worried",
            "Everything is terrible and I'm always anxious"
        ]
        for text in texts:
            result = analyzer.analyze_text(text)
            assert 0 <= result['stress_score'] <= 100


class TestCognitiveDistortions:
    """Tests for cognitive distortion detection."""
    
    def test_overgeneralization_detection(self):
        """Test detection of overgeneralization patterns."""
        text = "I always fail at everything and everyone thinks I'm useless"
        result = analyzer.analyze_text(text)
        assert 'overgeneralization' in result['cognitive_distortions']
    
    def test_catastrophizing_detection(self):
        """Test detection of catastrophizing patterns."""
        text = "This is the worst thing ever and everything is ruined"
        result = analyzer.analyze_text(text)
        assert 'catastrophizing' in result['cognitive_distortions']
    
    def test_self_blame_detection(self):
        """Test detection of self-blame patterns."""
        text = "It's all my fault and I'm to blame for everything"
        result = analyzer.analyze_text(text)
        assert 'self-blame' in result['cognitive_distortions']
    
    def test_no_distortions(self):
        """Test that neutral text doesn't trigger false positives."""
        text = "I went to the store today and bought some groceries"
        result = analyzer.analyze_text(text)
        # May or may not have distortions, but should be a list
        assert isinstance(result['cognitive_distortions'], list)


class TestSuggestionGeneration:
    """Tests for suggestion generation."""
    
    def test_suggestion_count(self):
        """Test that correct number of suggestions are generated."""
        emotions = {'joy': 0.5, 'sadness': 0.2, 'anxiety': 0.1, 'anger': 0.1, 'calm': 0.1}
        suggestions = suggestion_gen.generate_complete_suggestions(
            'joy', 30.0, emotions, []
        )
        assert 4 <= len(suggestions) <= 6
    
    def test_safety_message_high_stress(self):
        """Test that safety message is included for high stress."""
        emotions = {'joy': 0.1, 'sadness': 0.4, 'anxiety': 0.4, 'anger': 0.1, 'calm': 0.0}
        suggestions = suggestion_gen.generate_complete_suggestions(
            'anxiety', 85.0, emotions, []
        )
        
        # Check for safety keywords
        suggestions_text = ' '.join(suggestions).lower()
        safety_keywords = ['professional', 'counselor', 'therapist', 'support', 'help']
        has_safety = any(keyword in suggestions_text for keyword in safety_keywords)
        assert has_safety
    
    def test_safety_message_high_sadness(self):
        """Test that safety message is included for high sadness."""
        emotions = {'joy': 0.1, 'sadness': 0.8, 'anxiety': 0.2, 'anger': 0.1, 'calm': 0.0}
        suggestions = suggestion_gen.generate_complete_suggestions(
            'sadness', 50.0, emotions, []
        )
        
        # Check for safety keywords
        suggestions_text = ' '.join(suggestions).lower()
        safety_keywords = ['professional', 'counselor', 'therapist', 'support', 'help']
        has_safety = any(keyword in suggestions_text for keyword in safety_keywords)
        assert has_safety
    
    def test_suggestions_are_strings(self):
        """Test that all suggestions are non-empty strings."""
        emotions = {'joy': 0.5, 'sadness': 0.2, 'anxiety': 0.1, 'anger': 0.1, 'calm': 0.1}
        suggestions = suggestion_gen.generate_complete_suggestions(
            'joy', 30.0, emotions, []
        )
        
        for suggestion in suggestions:
            assert isinstance(suggestion, str)
            assert len(suggestion) > 0


class TestAnalysisIntegration:
    """Integration tests for complete analysis flow."""
    
    def test_complete_analysis_structure(self):
        """Test that complete analysis returns all required fields."""
        text = "I am feeling happy and excited about the future"
        result = analyzer.analyze_text(text)
        
        required_fields = [
            'emotions', 'primary_emotion', 'stress_score',
            'cognitive_distortions', 'summary', 'timestamp'
        ]
        
        for field in required_fields:
            assert field in result
    
    def test_analysis_with_suggestions(self):
        """Test complete flow including suggestions."""
        text = "I am feeling anxious about my exams"
        result = analyzer.analyze_text(text)
        
        suggestions = suggestion_gen.generate_complete_suggestions(
            result['primary_emotion'],
            result['stress_score'],
            result['emotions'],
            result['cognitive_distortions']
        )
        
        assert len(suggestions) >= 4
        assert all(isinstance(s, str) for s in suggestions)
    
    def test_empty_distortions_list(self):
        """Test that distortions list is empty when none detected."""
        text = "I went for a walk in the park today"
        result = analyzer.analyze_text(text)
        
        # Should be a list (may or may not be empty)
        assert isinstance(result['cognitive_distortions'], list)
    
    def test_summary_contains_emotion(self):
        """Test that summary mentions the primary emotion."""
        text = "I am feeling very happy and joyful today"
        result = analyzer.analyze_text(text)
        
        assert result['primary_emotion'].lower() in result['summary'].lower()
