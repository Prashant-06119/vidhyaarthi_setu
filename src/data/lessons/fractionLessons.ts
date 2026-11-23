import { LessonModule } from '../../types/domain';

export const FRACTION_LESSONS: LessonModule[] = [
  {
    id: 'lesson-equiv-visual',
    conceptId: 'equivalent_fractions',
    targetLevel: 'weak',
    targetMisconceptions: [
      'add_numerator_denominator_same',
      'multiply_only_numerator_or_denom',
    ],
    titleEn: 'Visual Equivalent Fractions: Splitting Without Changing Value',
    titleKn: 'ದೃಶ್ಯ ಸಮಾನ ಭಿನ್ನರಾಶಿಗಳು: ಮೌಲ್ಯ ಬದಲಾಗದೆ ಭಾಗಗಳನ್ನು ವಿಭಜಿಸುವುದು',
    summaryEn:
      'See why equivalent fractions multiply both top and bottom by the same number — never add the same number.',
    summaryKn:
      'ಸಮಾನ ಭಿನ್ನರಾಶಿಗಳಲ್ಲಿ ಅಂಶ ಮತ್ತು ಛೇದ ಎರಡನ್ನೂ ಒಂದೇ ಸಂಖ್ಯೆಯಿಂದ ಏಕೆ ಗುಣಿಸಬೇಕು (ಕೂಡಿಸಬಾರದು) ಎಂಬುದನ್ನು ದೃಶ್ಯವಾಗಿ ನೋಡಿ.',
    interactiveSandbox: 'equivalent_explorer',
    steps: [
      {
        id: 'eq-step-1',
        titleEn: '1. Start With One Whole Strip Split Into 2 Equal Parts (1/2)',
        titleKn: '1. 2 ಸಮಾನ ಭಾಗಗಳಾಗಿ ವಿಭಜಿಸಿದ ಪಟ್ಟಿಯಿಂದ ಪ್ರಾರಂಭಿಸಿ (1/2)',
        explanationEn:
          'Half of the bar is shaded. Notice the shaded length reaches exactly the center line.',
        explanationKn:
          'ಪಟ್ಟಿಯ ಅರ್ಧ ಭಾಗಕ್ಕೆ ಬಣ್ಣ ಹಚ್ಚಲಾಗಿದೆ. ಬಣ್ಣದ ಉದ್ದವು ಸರಿಯಾಗಿ ಮಧ್ಯದ ರೇಖೆಯವರೆಗೆ ಇದೆ.',
        visualType: 'equivalent_split',
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: { numerator: 1, denominator: 2 },
        multiplier: 1,
      },
      {
        id: 'eq-step-2',
        titleEn: '2. Split Each Piece in Half (Multiply Top & Bottom by 2 -> 2/4)',
        titleKn: '2. ಪ್ರತಿ ಭಾಗವನ್ನು ಅರ್ಧಕ್ಕೆ ಕತ್ತರಿಸಿ (ಮೇಲೆ ಮತ್ತು ಕೆಳಗೆ 2 ರಿಂದ ಗುಣಿಸಿ -> 2/4)',
        explanationEn:
          'When each of the 2 pieces is cut into 2 smaller pieces, we get 4 total pieces and 2 shaded pieces. The shaded length did NOT change: 1/2 = 2/4.',
        explanationKn:
          'ಪ್ರತಿ ಭಾಗವನ್ನು 2 ಸಣ್ಣ ತುಂಡುಗಳಾಗಿ ಮಾಡಿದಾಗ 4 ಒಟ್ಟು ಭಾಗಗಳು ಮತ್ತು 2 ಬಣ್ಣದ ಭಾಗಗಳು ಸಿಗುತ್ತವೆ. ಒಟ್ಟು ಉದ್ದ ಬದಲಾಗುವುದಿಲ್ಲ: 1/2 = 2/4.',
        visualType: 'equivalent_split',
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: { numerator: 2, denominator: 4 },
        multiplier: 2,
      },
      {
        id: 'eq-step-3',
        titleEn: '3. Why Adding +1 Fails (1/2 vs 2/3)',
        titleKn: '3. +1 ಕೂಡಿಸುವುದು ಏಕೆ ತಪ್ಪು (1/2 ಮತ್ತು 2/3)',
        explanationEn:
          'Adding +1 to 1/2 gives 2/3. Look at the bars: 2/3 covers much more than half! Equivalent fractions always multiply or divide both numbers by the SAME factor.',
        explanationKn:
          '1/2 ಕ್ಕೆ +1 ಕೂಡಿಸಿದರೆ 2/3 ಬರುತ್ತದೆ, ಆದರೆ 2/3 ಅರ್ಧಕ್ಕಿಂತ ದೊಡ್ಡದು! ಸಮಾನ ಭಿನ್ನರಾಶಿಗೆ ಯಾವಾಗಲೂ ಒಂದೇ ಸಂಖ್ಯೆಯಿಂದ ಗುಣಿಸಿ.',
        visualType: 'comparison_strip',
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: { numerator: 2, denominator: 3 },
      },
    ],
  },
  {
    id: 'lesson-compare-visual',
    conceptId: 'comparing_fractions',
    targetLevel: 'weak',
    targetMisconceptions: [
      'larger_denominator_means_larger_fraction',
      'compare_only_numerators',
    ],
    titleEn: 'Comparing Fractions: Why More Pieces Mean Smaller Slices',
    titleKn: 'ಭಿನ್ನರಾಶಿಗಳ ಹೋಲಿಕೆ: ಹೆಚ್ಚು ಭಾಗಗಳಿದ್ದರೆ ತುಂಡು ಚಿಕ್ಕದಾಗುತ್ತದೆ ಏಕೆ?',
    summaryEn:
      'Compare equal-length fraction bars and the 1/2 benchmark line to avoid comparing denominators like whole numbers.',
    summaryKn:
      'ಸಮಾನ ಉದ್ದದ ಪಟ್ಟಿಗಳು ಮತ್ತು 1/2 ಮಾನದಂಡ ರೇಖೆಯನ್ನು ಬಳಸಿ ಭಿನ್ನರಾಶಿಗಳನ್ನು ನಿಖರವಾಗಿ ಹೋಲಿಸಿ.',
    interactiveSandbox: 'comparison_lab',
    steps: [
      {
        id: 'cmp-step-1',
        titleEn: '1. Same Whole Shared Among 3 vs 5 Friends (1/3 vs 1/5)',
        titleKn: '1. ಒಂದೇ ರೊಟ್ಟಿಯನ್ನು 3 ಮತ್ತು 5 ಸ್ನೇಹಿತರ ನಡುವೆ ಹಂಚುವುದು (1/3 vs 1/5)',
        explanationEn:
          'A larger denominator (5) means the whole is cut into MORE slices, so each single slice (1/5) is SMALLER than 1/3.',
        explanationKn:
          'ದೊಡ್ಡ ಛೇದ (5) ಎಂದರೆ ವಸ್ತುವನ್ನು ಹೆಚ್ಚು ತುಂಡುಗಳಾಗಿ ಕತ್ತರಿಸಲಾಗಿದೆ, ಆದ್ದರಿಂದ 1/5 ಭಾಗವು 1/3 ಕ್ಕಿಂತ ಚಿಕ್ಕದಾಗಿರುತ್ತದೆ.',
        visualType: 'comparison_strip',
        fractionA: { numerator: 1, denominator: 3 },
        fractionB: { numerator: 1, denominator: 5 },
      },
      {
        id: 'cmp-step-2',
        titleEn: '2. Use the 1/2 Benchmark (2/3 vs 3/8)',
        titleKn: '2. 1/2 ಮಾನದಂಡವನ್ನು ಬಳಸಿ (2/3 ಮತ್ತು 3/8)',
        explanationEn:
          'Even though 3 is larger than 2, 3/8 is LESS than half (4/8), while 2/3 is MORE than half. So 2/3 > 3/8!',
        explanationKn:
          '3 ಅಂಶವು 2 ಕ್ಕಿಂತ ದೊಡ್ಡದಿದ್ದರೂ, 3/8 ಅರ್ಧಕ್ಕಿಂತ (4/8) ಕಡಿಮೆ ಇದೆ ಮತ್ತು 2/3 ಅರ್ಧಕ್ಕಿಂತ ಹೆಚ್ಚು ಇದೆ. ಆದ್ದರಿಂದ 2/3 > 3/8!',
        visualType: 'comparison_strip',
        fractionA: { numerator: 2, denominator: 3 },
        fractionB: { numerator: 3, denominator: 8 },
      },
    ],
  },
  {
    id: 'lesson-part-whole-visual',
    conceptId: 'numerator_denominator',
    targetLevel: 'weak',
    targetMisconceptions: ['swap_part_and_whole', 'count_unshaded_as_numerator'],
    titleEn: 'Parts & Wholes: Mastering Numerator and Denominator',
    titleKn: 'ಭಾಗ ಮತ್ತು ಪೂರ್ಣ: ಅಂಶ ಮತ್ತು ಛೇದವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
    summaryEn:
      'Build fractions by counting total equal pieces for the denominator and shaded pieces for the numerator.',
    summaryKn:
      'ಒಟ್ಟು ಸಮಾನ ಭಾಗಗಳನ್ನು ಛೇದಕ್ಕೂ ಮತ್ತು ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗಗಳನ್ನು ಅಂಶಕ್ಕೂ ಎಣಿಸಿ ಭಿನ್ನರಾಶಿ ನಿರ್ಮಿಸಿ.',
    interactiveSandbox: 'part_whole_builder',
    steps: [
      {
        id: 'pw-step-1',
        titleEn: '1. Denominator = Down = Total Equal Parts',
        titleKn: '1. ಛೇದ (ಕೆಳಗೆ) = ಒಟ್ಟು ಸಮಾನ ಭಾಗಗಳು',
        explanationEn:
          'First count ALL equal sections in the whole bar or circle — shaded and unshaded together. That total goes on the bottom.',
        explanationKn:
          'ಮೊದಲು ಪೂರ್ಣ ಪಟ್ಟಿ ಅಥವಾ ವೃತ್ತದಲ್ಲಿರುವ ಎಲ್ಲಾ ಸಮಾನ ಭಾಗಗಳನ್ನು (ಬಣ್ಣದ + ಖಾಲಿ) ಎಣಿಸಿ. ಅದನ್ನು ಕೆಳಗೆ ಬರೆಯಿರಿ.',
        visualType: 'bar',
        fractionA: { numerator: 3, denominator: 5 },
      },
      {
        id: 'pw-step-2',
        titleEn: '2. Numerator = Selected / Shaded Parts',
        titleKn: '2. ಅಂಶ (ಮೇಲೆ) = ಆಯ್ಕೆ ಮಾಡಿದ / ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗಗಳು',
        explanationEn:
          'Next count only the shaded parts we are measuring. In 3/5, 3 parts are shaded out of 5 equal parts.',
        explanationKn:
          'ನಂತರ ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗಗಳನ್ನು ಮಾತ್ರ ಎಣಿಸಿ. 3/5 ರಲ್ಲಿ 5 ಸಮಾನ ಭಾಗಗಳಲ್ಲಿ 3 ಭಾಗಗಳಿಗೆ ಬಣ್ಣ ಹಚ್ಚಲಾಗಿದೆ.',
        visualType: 'circle',
        fractionA: { numerator: 3, denominator: 5 },
      },
    ],
  },
  {
    id: 'lesson-representation-visual',
    conceptId: 'fraction_representation',
    targetLevel: 'developing',
    targetMisconceptions: ['count_unshaded_as_numerator', 'swap_part_and_whole'],
    titleEn: 'Connecting Fraction Circles, Bars & Real-Life Models',
    titleKn: 'ಭಿನ್ನರಾಶಿ ವೃತ್ತಗಳು, ಪಟ್ಟಿಗಳು ಮತ್ತು ದೈನಂದಿನ ಮಾದರಿಗಳು',
    summaryEn:
      'Translate between shaded visual models and symbolic fractions accurately.',
    summaryKn:
      'ಬಣ್ಣ ಹಚ್ಚಿದ ದೃಶ್ಯ ಮಾದರಿಗಳನ್ನು ಸರಿಯಾದ ಭಿನ್ನರಾಶಿ ಸಂಖ್ಯೆಗಳಿಗೆ ಪರಿವರ್ತಿಸಿ.',
    interactiveSandbox: 'part_whole_builder',
    steps: [
      {
        id: 'rep-step-1',
        titleEn: '1. Bars and Circles Show the Same Fraction',
        titleKn: '1. ಪಟ್ಟಿ ಮತ್ತು ವೃತ್ತ ಒಂದೇ ಭಿನ್ನರಾಶಿಯನ್ನು ತೋರಿಸುತ್ತವೆ',
        explanationEn:
          'Whether drawn as a rectangle bar or a round roti circle, 3/4 always means 3 shaded equal parts out of 4.',
        explanationKn:
          'ಆಯತ ಪಟ್ಟಿಯಾಗಲಿ ಅಥವಾ ವೃತ್ತವಾಗಲಿ, 3/4 ಎಂದರೆ 4 ಸಮಾನ ಭಾಗಗಳಲ್ಲಿ 3 ಬಣ್ಣದ ಭಾಗಗಳು.',
        visualType: 'circle',
        fractionA: { numerator: 3, denominator: 4 },
      },
    ],
  },
];
