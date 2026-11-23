import { FractionConceptId, MisconceptionId } from '../types/domain';

/**
 * Deterministic thresholds governing the Vidyaarthi Setu Adaptive Engine.
 * All rules are transparent, auditable, and strictly deterministic (no black-box AI claims).
 */
export const ADAPTIVE_THRESHOLDS = {
  /**
   * Minimum number of DISTINCT questions exhibiting the same misconception
   * before flagging a possible conceptual learning gap.
   * Prevents a single careless mistake from triggering a false diagnosis.
   */
  MIN_DISTINCT_QUESTIONS_FOR_MISCONCEPTION: 2,

  /**
   * Concept accuracy below this percentage is classified as 'weak'
   * and triggers a simpler visual explanation + foundational exercises.
   */
  WEAK_ACCURACY_UPPER_BOUND: 50,

  /**
   * Concept accuracy >= 50% and < 80% is classified as 'developing'
   * and triggers guided step-by-step practice.
   * Concept accuracy >= 80% is classified as 'strong' and unlocks challenge exercises.
   */
  DEVELOPING_ACCURACY_UPPER_BOUND: 80,

  /**
   * Minimum diagnostic questions attempted to unlock full post-diagnostic diagnosis.
   */
  MIN_DIAGNOSTIC_QUESTIONS: 4,

  /**
   * When a student completes reassessment on a concept (>= 2 questions),
   * reassessment evidence carries 80% weight over the earlier baseline (20%)
   * so verified post-remediation mastery updates the student's profile.
   */
  REASSESSMENT_WEIGHT: 0.8,
  MIN_REASSESSMENT_QUESTIONS_TO_RESOLVE: 2,
  REASSESSMENT_PASS_ACCURACY: 66,
} as const;

export const CONCEPT_METADATA: Record<
  FractionConceptId,
  {
    order: number;
    titleEn: string;
    titleKn: string;
    shortEn: string;
    shortKn: string;
  }
> = {
  numerator_denominator: {
    order: 1,
    titleEn: 'Numerator & Denominator',
    titleKn: 'ಅಂಶ ಮತ್ತು ಛೇದ',
    shortEn: 'Parts & Wholes',
    shortKn: 'ಭಾಗ ಮತ್ತು ಪೂರ್ಣ',
  },
  fraction_representation: {
    order: 2,
    titleEn: 'Fraction Representation',
    titleKn: 'ಭಿನ್ನರಾಶಿ ನಿರೂಪಣೆ',
    shortEn: 'Visual Models',
    shortKn: 'ದೃಶ್ಯ ಮಾದರಿಗಳು',
  },
  equivalent_fractions: {
    order: 3,
    titleEn: 'Equivalent Fractions',
    titleKn: 'ಸಮಾನ ಭಿನ್ನರಾಶಿಗಳು',
    shortEn: 'Same Value Forms',
    shortKn: 'ಸಮಾನ ಮೌಲ್ಯಗಳು',
  },
  comparing_fractions: {
    order: 4,
    titleEn: 'Comparing Fractions',
    titleKn: 'ಭಿನ್ನರಾಶಿಗಳ ಹೋಲಿಕೆ',
    shortEn: 'Greater & Smaller',
    shortKn: 'ದೊಡ್ಡದು ಮತ್ತು ಚಿಕ್ಕದು',
  },
};

export const MISCONCEPTION_METADATA: Record<
  MisconceptionId,
  {
    conceptId: FractionConceptId;
    labelEn: string;
    labelKn: string;
    diagnosisEn: string;
    diagnosisKn: string;
    remediationHintEn: string;
    remediationHintKn: string;
  }
> = {
  add_numerator_denominator_same: {
    conceptId: 'equivalent_fractions',
    labelEn: 'Adding the same number to numerator & denominator',
    labelKn: 'ಅಂಶ ಮತ್ತು ಛೇದಕ್ಕೆ ಒಂದೇ ಸಂಖ್ಯೆಯನ್ನು ಕೂಡಿಸುವುದು',
    diagnosisEn:
      'Student appears to form equivalent fractions by adding the same constant to both numerator and denominator instead of multiplying both by the same factor.',
    diagnosisKn:
      'ಸಮಾನ ಭಿನ್ನರಾಶಿ ಪಡೆಯಲು ಗುಣಿಸುವ ಬದಲು ಅಂಶ ಮತ್ತು ಛೇದ ಎರಡಕ್ಕೂ ಒಂದೇ ಸಂಖ್ಯೆಯನ್ನು ಕೂಡಿಸುವ ಪ್ರವೃತ್ತಿ ಕಂಡುಬಂದಿದೆ.',
    remediationHintEn:
      'Use equal-length fraction bars to show how splitting each part multiplies both top and bottom numbers.',
    remediationHintKn:
      'ಪ್ರತಿ ಭಾಗವನ್ನು ಸಮಾನವಾಗಿ ವಿಭಜಿಸುವುದರಿಂದ ಅಂಶ ಮತ್ತು ಛೇದ ಹೇಗೆ ಗುಣಿಸಲ್ಪಡುತ್ತವೆ ಎಂಬುದನ್ನು ಭಿನ್ನರಾಶಿ ಪಟ್ಟಿಗಳಿಂದ ತೋರಿಸಿ.',
  },
  multiply_only_numerator_or_denom: {
    conceptId: 'equivalent_fractions',
    labelEn: 'Scaling only one part of the fraction',
    labelKn: 'ಅಂಶ ಅಥವಾ ಛೇದದಲ್ಲಿ ಒಂದನ್ನು ಮಾತ್ರ ಗುಣಿಸುವುದು',
    diagnosisEn:
      'Student multiplied either the numerator or the denominator without scaling the other part equally.',
    diagnosisKn:
      'ಅಂಶ ಅಥವಾ ಛೇದವನ್ನು ಮಾತ್ರ ಗುಣಿಸಿ ಇನ್ನೊಂದನ್ನು ಹಾಗೆಯೇ ಬಿಡಲಾಗಿದೆ.',
    remediationHintEn:
      'Reinforce that keeping value unchanged requires scaling both numerator and denominator together.',
    remediationHintKn:
      'ಮೌಲ್ಯವು ಬದಲಾಗದಿರಲು ಅಂಶ ಮತ್ತು ಛೇದ ಎರಡನ್ನೂ ಒಂದೇ ಸಂಖ್ಯೆಯಿಂದ ಗುಣಿಸಬೇಕು.',
  },
  larger_denominator_means_larger_fraction: {
    conceptId: 'comparing_fractions',
    labelEn: 'Assuming a larger denominator means a larger fraction',
    labelKn: 'ದೊಡ್ಡ ಛೇದ ಎಂದರೆ ದೊಡ್ಡ ಭಿನ್ನರಾಶಿ ಎಂದು ಭಾವಿಸುವುದು',
    diagnosisEn:
      'Student compares denominators as whole numbers (e.g. treating 1/5 > 1/3 because 5 > 3), overlooking that more equal parts make each piece smaller.',
    diagnosisKn:
      'ಛೇದದ ಸಂಖ್ಯೆ ದೊಡ್ಡದಿದ್ದರೆ ಭಿನ್ನರಾಶಿಯೂ ದೊಡ್ಡದು (5 > 3 ಆದ್ದರಿಂದ 1/5 > 1/3) ಎಂದು ಭಾವಿಸುವ ತಪ್ಪು ಕಲ್ಪನೆ ಕಂಡುಬಂದಿದೆ.',
    remediationHintEn:
      'Show side-by-side fraction strips of equal whole length so students see 1/3 is wider than 1/5.',
    remediationHintKn:
      'ಒಂದೇ ಉದ್ದದ ಪಟ್ಟಿಗಳನ್ನು ಅಕ್ಕಪಕ್ಕದಲ್ಲಿಟ್ಟು 1/3 ಭಾಗವು 1/5 ಭಾಗಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿದೆ ಎಂಬುದನ್ನು ತೋರಿಸಿ.',
  },
  compare_only_numerators: {
    conceptId: 'comparing_fractions',
    labelEn: 'Comparing only numerators across different denominators',
    labelKn: 'ಬೇರೆ ಬೇರೆ ಛೇದಗಳಿದ್ದರೂ ಅಂಶಗಳನ್ನು ಮಾತ್ರ ಹೋಲಿಸುವುದು',
    diagnosisEn:
      'Student picks the fraction with the larger numerator without considering the denominator size (e.g. 3/8 over 2/3).',
    diagnosisKn:
      'ಛೇದವನ್ನು ಗಮನಿಸದೆ ಕೇವಲ ದೊಡ್ಡ ಅಂಶವನ್ನು ನೋಡಿ ಭಿನ್ನರಾಶಿಯನ್ನು ದೊಡ್ಡದು ಎಂದು ನಿರ್ಧರಿಸಲಾಗುತ್ತಿದೆ.',
    remediationHintEn:
      'Compare both fractions against the 1/2 benchmark and aligned visual bars before comparing numerators.',
    remediationHintKn:
      '1/2 ಮಾನದಂಡದೊಂದಿಗೆ ಮತ್ತು ಸಮಾನ ಪಟ್ಟಿಗಳೊಂದಿಗೆ ಮೊದಲು ಹೋಲಿಸಿ ನೋಡಲು ಮಾರ್ಗದರ್ಶನ ನೀಡಿ.',
  },
  swap_part_and_whole: {
    conceptId: 'numerator_denominator',
    labelEn: 'Swapping numerator (part) and denominator (whole)',
    labelKn: 'ಅಂಶ (ಭಾಗ) ಮತ್ತು ಛೇದ (ಪೂರ್ಣ) ಸ್ಥಾನಗಳನ್ನು ಅದಲುಬದಲು ಮಾಡುವುದು',
    diagnosisEn:
      'Student writes the total equal parts in the numerator and shaded parts in the denominator.',
    diagnosisKn:
      'ಒಟ್ಟು ಸಮಾನ ಭಾಗಗಳನ್ನು ಮೇಲೂ (ಅಂಶ), ಬಣ್ಣ ತುಂಬಿದ ಭಾಗಗಳನ್ನು ಕೆಳಗೂ (ಛೇದ) ಬರೆಯಲಾಗುತ್ತಿದೆ.',
    remediationHintEn:
      'Practice counting total equal slices first (Down = Denominator), then shaded slices (Up = Numerator).',
    remediationHintKn:
      'ಮೊದಲು ಒಟ್ಟು ಸಮಾನ ಭಾಗಗಳನ್ನು ಎಣಿಸಿ ಕೆಳಗೆ (ಛೇದ), ನಂತರ ಬಣ್ಣದ ಭಾಗಗಳನ್ನು ಮೇಲೆ (ಅಂಶ) ಬರೆಯುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.',
  },
  count_unshaded_as_numerator: {
    conceptId: 'fraction_representation',
    labelEn: 'Counting unshaded parts instead of shaded parts',
    labelKn: 'ಬಣ್ಣ ತುಂಬಿದ ಭಾಗಗಳ ಬದಲು ಖಾಲಿ ಭಾಗಗಳನ್ನು ಎಣಿಸುವುದು',
    diagnosisEn:
      'Student counted the remaining unshaded sections rather than the highlighted fraction parts.',
    diagnosisKn:
      'ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗಗಳ ಬದಲು ಬಣ್ಣ ಹಚ್ಚದ ಉಳಿದ ಭಾಗಗಳನ್ನು ಅಂಶವಾಗಿ ಎಣಿಸಲಾಗಿದೆ.',
    remediationHintEn:
      'Use interactive tap-to-shade visual bars where each shaded block increments the numerator counter live.',
    remediationHintKn:
      'ಪ್ರತಿ ಬಣ್ಣ ತುಂಬಿದ ಭಾಗವೂ ಅಂಶವನ್ನು ಹೇಗೆ ಹೆಚ್ಚಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ದೃಶ್ಯ ಪಟ್ಟಿಯಲ್ಲಿ ಅಭ್ಯಾಸ ಮಾಡಿ.',
  },
};
