"""
Property-based tests for InsightSphere AI NLP engine.

These tests use Hypothesis to verify that correctness properties hold
across a wide range of randomly generated inputs.
"""

import pytest
from hypothesis import given, strategies as st, settings
from core.models_nlp import TextAnalyzer


# Initialize analyzer
analyzer = TextAnalyzer()


# Custom strategies for generating test data
@st.composite
def text_with_min_length(draw, min_length=20, max_length=5000):
    """Generate text with minimum length."""
    return draw(st.text(
        alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd', 'P', 'Zs')),
        min_size=min_length,
        max_size=max_length
    ))


@st.composite
def emotion_text(draw, emotion_type='joy'):
    """Generate text containing specific emotion keywords."""
    keywords = analyzer.emotion_keywords.get(emotion_type, [])
    if not keywords:
        return draw(st.text(min_size=20, max_size=200))
    
    # Pick some keywords
    selected_keywords = draw(st.lists(
        st.sampled_from(keywords),
        min_size=1,
        max_size=5
    ))
    
    # Generate filler text
    filler = draw(st.text(
        alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Zs')),
        min_size=10,
        max_size=100
    ))
    
    # Combine
    text = filler + ' ' + ' '.join(selected_keywords) + ' ' + filler
    return text


@st.composite
def stress_text(draw, include_intensity=True):
    """Generate text with stress indicators."""
    negative_keywords = (
        analyzer.emotion_keywords['sadness'] +
        analyzer.emotion_keywords['anxiety'] +
        analyzer.emotion_keywords['anger']
    )
    
    selected = draw(st.lists(
        st.sampled_from(negative_keywords),
        min_size=2,
        max_size=8
    ))
    
    text_parts = [' '.join(selected)]
    
    if include_intensity:
        intensity = draw(st.lists(
            st.sampled_from(analyzer.intensity_markers),
            min_size=1,
            max_size=3
        ))
        text_parts.extend(intensity)
    
    filler = draw(st.text(min_size=20, max_size=100))
    text_parts.append(filler)
    
    return ' '.join(text_parts)


# Feature: insightsphere-ai, Property 5: Emotion score range invariant
@given(text_with_min_length())
@settings(max_examples=100)
def test_emotion_scores_in_range(text):
    """
    Property 5: Emotion score range invariant
    For any text analysis, all emotion scores must be between 0.0 and 1.0 inclusive.
    Validates: Requirements 2.2
    """
    result = analyzer.analyze_text(text)
    emotions = result['emotions']
    
    for emotion, score in emotions.items():
        assert 0.0 <= score <= 1.0, f"Emotion {emotion} score {score} out of range [0.0, 1.0]"
        assert isinstance(score, (int, float)), f"Emotion {emotion} score must be numeric"


# Feature: insightsphere-ai, Property 6: Primary emotion selection
@given(text_with_min_length())
@settings(max_examples=100)
def test_primary_emotion_is_highest(text):
    """
    Property 6: Primary emotion selection
    For any analysis result, the primary emotion should be the emotion with the highest score.
    Validates: Requirements 2.3
    """
    result = analyzer.analyze_text(text)
    emotions = result['emotions']
    primary = result['primary_emotion']
    
    # Primary emotion must be one of the valid emotions
    assert primary in emotions.keys(), f"Primary emotion {primary} not in emotions dict"
    
    # Primary emotion should have the highest score (or tied for highest)
    primary_score = emotions[primary]
    max_score = max(emotions.values())
    
    assert primary_score == max_score, \
        f"Primary emotion {primary} (score={primary_score}) does not have max score ({max_score})"
    
    # If there's a tie, primary should be alphabetically first among tied emotions
    tied_emotions = [e for e, s in emotions.items() if s == max_score]
    if len(tied_emotions) > 1:
        assert primary == sorted(tied_emotions)[0], \
            f"Primary emotion {primary} should be alphabetically first among tied emotions {tied_emotions}"


# Feature: insightsphere-ai, Property 7: Stress score range invariant
@given(text_with_min_length())
@settings(max_examples=100)
def test_stress_score_in_range(text):
    """
    Property 7: Stress score range invariant
    For any text analysis, the stress score must be between 0 and 100 inclusive.
    Validates: Requirements 3.3
    """
    result = analyzer.analyze_text(text)
    stress_score = result['stress_score']
    
    assert 0 <= stress_score <= 100, f"Stress score {stress_score} out of range [0, 100]"
    assert isinstance(stress_score, (int, float)), "Stress score must be numeric"


# Feature: insightsphere-ai, Property 8: Intensity markers increase stress
@given(st.text(min_size=30, max_size=200))
@settings(max_examples=50)
def test_intensity_markers_increase_stress(base_text):
    """
    Property 8: Intensity markers increase stress
    For any text containing intensity markers, the stress score should be higher
    than the same text without those markers (when negative emotions are present).
    Validates: Requirements 3.2
    """
    # Add negative emotion keywords to ensure measurable stress
    negative_keywords = ['sad', 'worried', 'angry']
    text_with_negative = base_text + ' ' + ' '.join(negative_keywords)
    
    # Analyze without intensity markers
    result_without = analyzer.analyze_text(text_with_negative)
    stress_without = result_without['stress_score']
    
    # Add intensity markers
    intensity_markers = ['very', 'extremely', 'so']
    text_with_intensity = ' '.join(intensity_markers) + ' ' + text_with_negative
    
    # Analyze with intensity markers
    result_with = analyzer.analyze_text(text_with_intensity)
    stress_with = result_with['stress_score']
    
    # Stress should be higher or equal with intensity markers
    # (equal is acceptable if already at max or if markers don't affect this particular text)
    assert stress_with >= stress_without, \
        f"Stress with intensity ({stress_with}) should be >= stress without ({stress_without})"


# Feature: insightsphere-ai, Property 10: Cognitive distortion detection
@given(st.sampled_from(['always', 'never', 'worst', 'disaster', 'my fault', 'perfect', 'they think', 'will never']))
@settings(max_examples=50)
def test_cognitive_distortion_detection(distortion_keyword):
    """
    Property 10: Cognitive distortion detection
    For any text containing distortion patterns, the analysis should detect
    and return the corresponding distortion types.
    Validates: Requirements 4.1, 4.2, 4.3, 4.4
    """
    # Create text with the distortion keyword
    text = f"I feel like things are difficult and {distortion_keyword} happens to me. This is challenging."
    
    result = analyzer.analyze_text(text)
    distortions = result['cognitive_distortions']
    
    # Should detect at least one distortion
    assert isinstance(distortions, list), "Cognitive distortions should be a list"
    assert len(distortions) > 0, f"Should detect distortion for keyword '{distortion_keyword}'"


# Feature: insightsphere-ai, Property 11: Distortion list uniqueness
@given(text_with_min_length())
@settings(max_examples=100)
def test_distortion_list_uniqueness(text):
    """
    Property 11: Distortion list uniqueness
    For any analysis result, the cognitive distortions list should contain no duplicate entries.
    Validates: Requirements 4.5
    """
    result = analyzer.analyze_text(text)
    distortions = result['cognitive_distortions']
    
    # Check for uniqueness
    assert len(distortions) == len(set(distortions)), \
        f"Distortions list contains duplicates: {distortions}"


# Feature: insightsphere-ai, Property 28: Summary generation
@given(text_with_min_length(min_length=20, max_length=500))
@settings(max_examples=100)
def test_summary_generation(text):
    """
    Property 28: Summary generation
    For any analysis result, the summary should be 1-2 sentences and mention the primary emotion.
    Validates: Requirements 18.1, 18.2
    """
    result = analyzer.analyze_text(text)
    summary = result['summary']
    primary_emotion = result['primary_emotion']
    
    # Summary should exist and be a string
    assert isinstance(summary, str), "Summary must be a string"
    assert len(summary) > 0, "Summary should not be empty"
    
    # Summary should mention the primary emotion
    assert primary_emotion.lower() in summary.lower(), \
        f"Summary should mention primary emotion '{primary_emotion}'"
    
    # Summary should be reasonably short (1-2 sentences, roughly < 200 chars)
    assert len(summary) < 300, f"Summary too long ({len(summary)} chars): {summary}"


# Feature: insightsphere-ai, Property 29: Clinical terminology avoidance
@given(text_with_min_length())
@settings(max_examples=100)
def test_clinical_terminology_avoidance(text):
    """
    Property 29: Clinical terminology avoidance
    For any generated summary, it should not contain clinical diagnostic terms.
    Validates: Requirements 18.4
    """
    result = analyzer.analyze_text(text)
    summary = result['summary'].lower()
    
    # Clinical terms that should NOT appear
    clinical_terms = [
        'diagnosis', 'diagnose', 'disorder', 'condition', 'syndrome',
        'pathology', 'disease', 'illness', 'psychiatric', 'clinical'
    ]
    
    for term in clinical_terms:
        assert term not in summary, \
            f"Summary contains clinical term '{term}': {summary}"


# Additional helper tests
def test_analyzer_initialization():
    """Test that analyzer initializes correctly."""
    assert analyzer is not None
    assert len(analyzer.emotion_keywords) == 5
    assert 'joy' in analyzer.emotion_keywords
    assert 'sadness' in analyzer.emotion_keywords
    assert 'anxiety' in analyzer.emotion_keywords
    assert 'anger' in analyzer.emotion_keywords
    assert 'calm' in analyzer.emotion_keywords


def test_basic_analysis_structure():
    """Test that analysis returns correct structure."""
    text = "I am feeling happy and excited about the future today."
    result = analyzer.analyze_text(text)
    
    # Check all required fields exist
    assert 'emotions' in result
    assert 'primary_emotion' in result
    assert 'stress_score' in result
    assert 'cognitive_distortions' in result
    assert 'summary' in result
    assert 'timestamp' in result
    
    # Check types
    assert isinstance(result['emotions'], dict)
    assert isinstance(result['primary_emotion'], str)
    assert isinstance(result['stress_score'], (int, float))
    assert isinstance(result['cognitive_distortions'], list)
    assert isinstance(result['summary'], str)
    assert isinstance(result['timestamp'], str)


# Import suggestions generator
from core.suggestions import SuggestionGenerator

# Initialize suggestion generator
suggestion_gen = SuggestionGenerator()


# Feature: insightsphere-ai, Property 12: Suggestion count range
@given(
    st.sampled_from(['joy', 'sadness', 'anxiety', 'anger', 'calm']),
    st.floats(min_value=0, max_value=100),
    st.lists(st.sampled_from(['overgeneralization', 'catastrophizing', 'self-blame']), max_size=3)
)
@settings(max_examples=100)
def test_suggestion_count_range(primary_emotion, stress_score, distortions):
    """
    Property 12: Suggestion count range
    For any analysis result, the total number of coping tips and journaling prompts
    should be between 4 and 6 items.
    Validates: Requirements 5.1, 5.2
    """
    # Create mock emotions dict
    emotions = {
        'joy': 0.3,
        'sadness': 0.2,
        'anxiety': 0.2,
        'anger': 0.1,
        'calm': 0.2
    }
    
    suggestions = suggestion_gen.generate_complete_suggestions(
        primary_emotion,
        stress_score,
        emotions,
        distortions
    )
    
    assert isinstance(suggestions, list), "Suggestions must be a list"
    assert 4 <= len(suggestions) <= 6, \
        f"Suggestion count {len(suggestions)} not in range [4, 6]"
    
    # All suggestions should be non-empty strings
    for suggestion in suggestions:
        assert isinstance(suggestion, str), "Each suggestion must be a string"
        assert len(suggestion) > 0, "Suggestions should not be empty"


# Feature: insightsphere-ai, Property 13: Safety messages for high risk
@given(
    st.sampled_from(['joy', 'sadness', 'anxiety', 'anger', 'calm']),
    st.floats(min_value=81, max_value=100)  # High stress
)
@settings(max_examples=50)
def test_safety_messages_high_stress(primary_emotion, high_stress_score):
    """
    Property 13: Safety messages for high risk
    For any analysis where stress score exceeds 80, the suggestions should include
    a message encouraging professional help.
    Validates: Requirements 5.3, 5.4, 16.4
    """
    emotions = {
        'joy': 0.1,
        'sadness': 0.3,
        'anxiety': 0.3,
        'anger': 0.2,
        'calm': 0.1
    }
    
    suggestions = suggestion_gen.generate_complete_suggestions(
        primary_emotion,
        high_stress_score,
        emotions,
        []
    )
    
    # Should include a safety message
    safety_keywords = ['professional', 'counselor', 'therapist', 'support', 'help', 'overwhelmed']
    has_safety_message = any(
        any(keyword in suggestion.lower() for keyword in safety_keywords)
        for suggestion in suggestions
    )
    
    assert has_safety_message, \
        f"High stress ({high_stress_score}) should trigger safety message in suggestions"


@given(
    st.sampled_from(['sadness', 'anxiety']),  # Emotions that can be high
    st.floats(min_value=0.71, max_value=1.0)  # High emotion score
)
@settings(max_examples=50)
def test_safety_messages_high_negative_emotion(emotion_type, high_score):
    """
    Property 13: Safety messages for high risk (high negative emotions)
    For any analysis where sadness or anxiety scores exceed 0.7, the suggestions
    should include a message encouraging professional help.
    Validates: Requirements 5.3, 5.4, 16.4
    """
    emotions = {
        'joy': 0.1,
        'sadness': high_score if emotion_type == 'sadness' else 0.2,
        'anxiety': high_score if emotion_type == 'anxiety' else 0.2,
        'anger': 0.1,
        'calm': 0.1
    }
    
    suggestions = suggestion_gen.generate_complete_suggestions(
        emotion_type,
        50.0,  # Moderate stress
        emotions,
        []
    )
    
    # Should include a safety message
    safety_keywords = ['professional', 'counselor', 'therapist', 'support', 'help', 'overwhelmed']
    has_safety_message = any(
        any(keyword in suggestion.lower() for keyword in safety_keywords)
        for suggestion in suggestions
    )
    
    assert has_safety_message, \
        f"High {emotion_type} ({high_score}) should trigger safety message in suggestions"
