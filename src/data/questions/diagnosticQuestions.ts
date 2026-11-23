import { DiagnosticQuestion } from '../../types/domain';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'dq-1',
    conceptId: 'numerator_denominator',
    difficulty: 'foundational',
    promptEn: 'A fraction circle is cut into 5 equal slices and 2 slices are shaded. Which fraction shows the shaded part?',
    promptKn: 'ಒಂದು ವೃತ್ತವನ್ನು 5 ಸಮಾನ ಭಾಗಗಳಾಗಿ ಕತ್ತರಿಸಿ 2 ಭಾಗಗಳಿಗೆ ಬಣ್ಣ ಹಚ್ಚಲಾಗಿದೆ. ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗವನ್ನು ತೋರಿಸುವ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
    visualSpec: {
      type: 'circle',
      primary: { numerator: 2, denominator: 5 },
    },
    options: [
      { id: 'dq-1-a', labelEn: '2/5', labelKn: '2/5', isCorrect: true },
      {
        id: 'dq-1-b',
        labelEn: '5/2',
        labelKn: '5/2',
        isCorrect: false,
        misconceptionId: 'swap_part_and_whole',
      },
      {
        id: 'dq-1-c',
        labelEn: '3/5',
        labelKn: '3/5',
        isCorrect: false,
        misconceptionId: 'count_unshaded_as_numerator',
      },
      { id: 'dq-1-d', labelEn: '2/3', labelKn: '2/3', isCorrect: false },
    ],
    explanationEn:
      'There are 5 equal slices in total (denominator = 5) and 2 of them are shaded (numerator = 2), so the shaded fraction is 2/5.',
    explanationKn:
      'ಒಟ್ಟು 5 ಸಮಾನ ಭಾಗಗಳಿವೆ (ಛೇದ = 5) ಮತ್ತು ಅವುಗಳಲ್ಲಿ 2 ಭಾಗಗಳಿಗೆ ಬಣ್ಣ ಹಚ್ಚಲಾಗಿದೆ (ಅಂಶ = 2). ಆದ್ದರಿಂದ ಉತ್ತರ 2/5.',
  },
  {
    id: 'dq-2',
    conceptId: 'numerator_denominator',
    difficulty: 'foundational',
    promptEn: 'A millet roti is divided into 8 equal pieces and Meera eats 3 pieces. In the fraction 3/8, what does the number 8 represent?',
    promptKn: 'ಒಂದು ರೊಟ್ಟಿಯನ್ನು 8 ಸಮಾನ ತುಂಡುಗಳಾಗಿ ಮಾಡಿ ಮೀರಾ 3 ತುಂಡುಗಳನ್ನು ತಿಂದಳು. 3/8 ಭಿನ್ನರಾಶಿಯಲ್ಲಿ 8 ಏನನ್ನು ಸೂಚಿಸುತ್ತದೆ?',
    visualSpec: {
      type: 'circle',
      primary: { numerator: 3, denominator: 8 },
    },
    options: [
      {
        id: 'dq-2-a',
        labelEn: 'Total equal pieces in one whole roti',
        labelKn: 'ಒಂದು ಪೂರ್ಣ ರೊಟ್ಟಿಯಲ್ಲಿರುವ ಒಟ್ಟು ಸಮಾನ ತುಂಡುಗಳು',
        isCorrect: true,
      },
      {
        id: 'dq-2-b',
        labelEn: 'Pieces that Meera ate',
        labelKn: 'ಮೀರಾ ತಿಂದ ತುಂಡುಗಳು',
        isCorrect: false,
        misconceptionId: 'swap_part_and_whole',
      },
      {
        id: 'dq-2-c',
        labelEn: 'Pieces left uneaten on the plate',
        labelKn: 'ತಟ್ಟೆಯಲ್ಲಿ ಉಳಿದ ತುಂಡುಗಳು',
        isCorrect: false,
        misconceptionId: 'count_unshaded_as_numerator',
      },
      { id: 'dq-2-d', labelEn: '8 whole rotis', labelKn: '8 ಪೂರ್ಣ ರೊಟ್ಟಿಗಳು', isCorrect: false },
    ],
    explanationEn:
      'The denominator (bottom number) always tells how many equal parts make one whole — here, 8 equal pieces.',
    explanationKn:
      'ಛೇದವು (ಕೆಳಗಿನ ಸಂಖ್ಯೆ) ಒಂದು ಪೂರ್ಣ ವಸ್ತುವನ್ನು ಎಷ್ಟು ಸಮಾನ ಭಾಗಗಳಾಗಿ ಮಾಡಲಾಗಿದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ — ಇಲ್ಲಿ 8 ಸಮಾನ ತುಂಡುಗಳು.',
  },
  {
    id: 'dq-3',
    conceptId: 'fraction_representation',
    difficulty: 'foundational',
    promptEn: 'Look at the fraction bar below. Which fraction matches the shaded blocks?',
    promptKn: 'ಕೆಳಗಿನ ಭಿನ್ನರಾಶಿ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ. ಬಣ್ಣ ಹಚ್ಚಿದ ಭಾಗಗಳಿಗೆ ಹೊಂದುವ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
    visualSpec: {
      type: 'bar',
      primary: { numerator: 3, denominator: 4 },
    },
    options: [
      { id: 'dq-3-a', labelEn: '3/4', labelKn: '3/4', isCorrect: true },
      {
        id: 'dq-3-b',
        labelEn: '1/4',
        labelKn: '1/4',
        isCorrect: false,
        misconceptionId: 'count_unshaded_as_numerator',
      },
      {
        id: 'dq-3-c',
        labelEn: '4/3',
        labelKn: '4/3',
        isCorrect: false,
        misconceptionId: 'swap_part_and_whole',
      },
      { id: 'dq-3-d', labelEn: '3/1', labelKn: '3/1', isCorrect: false },
    ],
    explanationEn: '3 out of 4 equal blocks are shaded, which is represented as 3/4.',
    explanationKn: '4 ಸಮಾನ ಭಾಗಗಳಲ್ಲಿ 3 ಭಾಗಗಳಿಗೆ ಬಣ್ಣ ಹಚ್ಚಲಾಗಿದೆ, ಆದ್ದರಿಂದ ಇದನ್ನು 3/4 ಎಂದು ಬರೆಯಲಾಗುತ್ತದೆ.',
  },
  {
    id: 'dq-4',
    conceptId: 'fraction_representation',
    difficulty: 'standard',
    promptEn: 'A water tank gauge is split into 6 equal levels and 2 levels are filled. Which fraction shows the filled water?',
    promptKn: 'ಒಂದು ನೀರಿನ ಟ್ಯಾಂಕ್ ಮಾಪಕವನ್ನು 6 ಸಮಾನ ಹಂತಗಳಾಗಿ ವಿಭಜಿಸಿ 2 ಹಂತಗಳನ್ನು ತುಂಬಲಾಗಿದೆ. ತುಂಬಿದ ನೀರನ್ನು ತೋರಿಸುವ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
    visualSpec: {
      type: 'bar',
      primary: { numerator: 2, denominator: 6 },
    },
    options: [
      { id: 'dq-4-a', labelEn: '2/6', labelKn: '2/6', isCorrect: true },
      {
        id: 'dq-4-b',
        labelEn: '4/6',
        labelKn: '4/6',
        isCorrect: false,
        misconceptionId: 'count_unshaded_as_numerator',
      },
      {
        id: 'dq-4-c',
        labelEn: '6/2',
        labelKn: '6/2',
        isCorrect: false,
        misconceptionId: 'swap_part_and_whole',
      },
      { id: 'dq-4-d', labelEn: '2/4', labelKn: '2/4', isCorrect: false },
    ],
    explanationEn: '2 filled levels out of 6 total equal levels gives 2/6.',
    explanationKn: 'ಒಟ್ಟು 6 ಸಮಾನ ಹಂತಗಳಲ್ಲಿ 2 ಹಂತಗಳು ತುಂಬಿರುವುದರಿಂದ ಉತ್ತರ 2/6.',
  },
  {
    id: 'dq-5',
    conceptId: 'equivalent_fractions',
    difficulty: 'standard',
    promptEn: 'Which fraction has the exact same value as 1/2?',
    promptKn: 'ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ 1/2 ಕ್ಕೆ ಸಮನಾದ ಮೌಲ್ಯವನ್ನು ಹೊಂದಿರುವ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
    visualSpec: {
      type: 'bar',
      primary: { numerator: 1, denominator: 2 },
    },
    options: [
      { id: 'dq-5-a', labelEn: '2/4', labelKn: '2/4', isCorrect: true },
      {
        id: 'dq-5-b',
        labelEn: '2/3',
        labelKn: '2/3',
        isCorrect: false,
        misconceptionId: 'add_numerator_denominator_same',
      },
      {
        id: 'dq-5-c',
        labelEn: '2/2',
        labelKn: '2/2',
        isCorrect: false,
        misconceptionId: 'multiply_only_numerator_or_denom',
      },
      { id: 'dq-5-d', labelEn: '1/4', labelKn: '1/4', isCorrect: false },
    ],
    explanationEn:
      'Multiplying both numerator and denominator of 1/2 by 2 gives (1×2)/(2×2) = 2/4. Adding 1 to both gives 2/3, which is NOT half!',
    explanationKn:
      '1/2 ರ ಅಂಶ ಮತ್ತು ಛೇದ ಎರಡನ್ನೂ 2 ರಿಂದ ಗುಣಿಸಿದಾಗ 2/4 ಸಿಗುತ್ತದೆ. ಎರಡಕ್ಕೂ 1 ಕೂಡಿಸಿದರೆ 2/3 ಆಗುತ್ತದೆ, ಅದು ಅರ್ಧವಲ್ಲ!',
  },
  {
    id: 'dq-6',
    conceptId: 'equivalent_fractions',
    difficulty: 'standard',
    promptEn: 'Which fraction is equivalent to 2/3?',
    promptKn: '2/3 ಕ್ಕೆ ಸಮಾನವಾದ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
    visualSpec: {
      type: 'bar',
      primary: { numerator: 2, denominator: 3 },
    },
    options: [
      { id: 'dq-6-a', labelEn: '4/6', labelKn: '4/6', isCorrect: true },
      {
        id: 'dq-6-b',
        labelEn: '3/4',
        labelKn: '3/4',
        isCorrect: false,
        misconceptionId: 'add_numerator_denominator_same',
      },
      {
        id: 'dq-6-c',
        labelEn: '4/3',
        labelKn: '4/3',
        isCorrect: false,
        misconceptionId: 'multiply_only_numerator_or_denom',
      },
      {
        id: 'dq-6-d',
        labelEn: '2/6',
        labelKn: '2/6',
        isCorrect: false,
        misconceptionId: 'multiply_only_numerator_or_denom',
      },
    ],
    explanationEn:
      '2/3 = (2×2)/(3×2) = 4/6. Both the shaded parts and total parts double in the same ratio.',
    explanationKn:
      '2/3 = (2×2)/(3×2) = 4/6. ಬಣ್ಣದ ಭಾಗಗಳು ಮತ್ತು ಒಟ್ಟು ಭಾಗಗಳು ಒಂದೇ ಅನುಪಾತದಲ್ಲಿ ದ್ವಿಗುಣಗೊಳ್ಳುತ್ತವೆ.',
  },
  {
    id: 'dq-7',
    conceptId: 'equivalent_fractions',
    difficulty: 'standard',
    promptEn: 'Find the missing numerator so the two fractions are equivalent: 3/4 = ?/8',
    promptKn: 'ಎರಡು ಭಿನ್ನರಾಶಿಗಳು ಸಮಾನವಾಗುವಂತೆ ಖಾಲಿ ಇರುವ ಅಂಶವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ: 3/4 = ?/8',
    visualSpec: {
      type: 'bar',
      primary: { numerator: 3, denominator: 4 },
    },
    options: [
      { id: 'dq-7-a', labelEn: '6', labelKn: '6', isCorrect: true },
      {
        id: 'dq-7-b',
        labelEn: '7',
        labelKn: '7',
        isCorrect: false,
        misconceptionId: 'add_numerator_denominator_same',
      },
      {
        id: 'dq-7-c',
        labelEn: '3',
        labelKn: '3',
        isCorrect: false,
        misconceptionId: 'multiply_only_numerator_or_denom',
      },
      { id: 'dq-7-d', labelEn: '12', labelKn: '12', isCorrect: false },
    ],
    explanationEn:
      'Because the denominator 4 was multiplied by 2 to make 8, multiply the numerator 3 by 2 as well: 3 × 2 = 6, so 3/4 = 6/8.',
    explanationKn:
      'ಛೇದ 4 ನ್ನು 2 ರಿಂದ ಗುಣಿಸಿ 8 ಮಾಡಲಾಗಿದೆ, ಆದ್ದರಿಂದ ಅಂಶ 3 ನ್ನೂ 2 ರಿಂದ ಗುಣಿಸಬೇಕು: 3 × 2 = 6, ಅಂದರೆ 3/4 = 6/8.',
  },
  {
    id: 'dq-8',
    conceptId: 'comparing_fractions',
    difficulty: 'standard',
    promptEn: 'Which fraction is greater: 1/3 or 1/5?',
    promptKn: 'ಯಾವ ಭಿನ್ನರಾಶಿ ದೊಡ್ಡದು: 1/3 ಅಥವಾ 1/5?',
    visualSpec: {
      type: 'none',
    },
    options: [
      { id: 'dq-8-a', labelEn: '1/3 is greater', labelKn: '1/3 ದೊಡ್ಡದು', isCorrect: true },
      {
        id: 'dq-8-b',
        labelEn: '1/5 is greater',
        labelKn: '1/5 ದೊಡ್ಡದು',
        isCorrect: false,
        misconceptionId: 'larger_denominator_means_larger_fraction',
      },
      { id: 'dq-8-c', labelEn: 'Both are equal', labelKn: 'ಎರಡೂ ಸಮಾನ', isCorrect: false },
      { id: 'dq-8-d', labelEn: 'Cannot compare', labelKn: 'ಹೋಲಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ', isCorrect: false },
    ],
    explanationEn:
      'Splitting one whole into 3 pieces makes larger pieces than splitting the same whole into 5 pieces. So 1/3 > 1/5.',
    explanationKn:
      'ಒಂದು ಪೂರ್ಣ ವಸ್ತುವನ್ನು 3 ಭಾಗಗಳಾಗಿ ಮಾಡಿದಾಗ ಸಿಗುವ ತುಂಡು 5 ಭಾಗಗಳಾಗಿ ಮಾಡಿದಾಗ ಸಿಗುವ ತುಂಡಿಗಿಂತ ದೊಡ್ಡದಿರುತ್ತದೆ. ಆದ್ದರಿಂದ 1/3 > 1/5.',
  },
  {
    id: 'dq-9',
    conceptId: 'comparing_fractions',
    difficulty: 'standard',
    promptEn: 'Two identical ribbons are measured. Ribbon A covers 1/4 of the length and Ribbon B covers 1/2. Which is longer?',
    promptKn: 'ಒಂದೇ ಉದ್ದದ ಎರಡು ರಿಬ್ಬನ್‌ಗಳಿವೆ. ರಿಬ್ಬನ್ A 1/4 ಉದ್ದವನ್ನು ಮತ್ತು ರಿಬ್ಬನ್ B 1/2 ಉದ್ದವನ್ನು ಆವರಿಸುತ್ತದೆ. ಯಾವುದು ಉದ್ದವಾಗಿದೆ?',
    visualSpec: {
      type: 'none',
    },
    options: [
      { id: 'dq-9-a', labelEn: '1/2 is longer', labelKn: '1/2 ಉದ್ದವಾಗಿದೆ', isCorrect: true },
      {
        id: 'dq-9-b',
        labelEn: '1/4 is longer',
        labelKn: '1/4 ಉದ್ದವಾಗಿದೆ',
        isCorrect: false,
        misconceptionId: 'larger_denominator_means_larger_fraction',
      },
      { id: 'dq-9-c', labelEn: 'Both are equal', labelKn: 'ಎರಡೂ ಸಮಾನ', isCorrect: false },
      { id: 'dq-9-d', labelEn: '1/6 is longer', labelKn: '1/6 ಉದ್ದವಾಗಿದೆ', isCorrect: false },
    ],
    explanationEn:
      '1/2 means 1 of 2 equal parts (half the ribbon), whereas 1/4 means 1 of 4 smaller parts. Therefore 1/2 > 1/4.',
    explanationKn:
      '1/2 ಎಂದರೆ ಅರ್ಧ ಭಾಗ, ಆದರೆ 1/4 ಎಂದರೆ ಕಾಲು ಭಾಗ. ಆದ್ದರಿಂದ 1/2 > 1/4.',
  },
  {
    id: 'dq-10',
    conceptId: 'comparing_fractions',
    difficulty: 'stretch',
    promptEn: 'Which fraction is larger: 2/3 or 3/8?',
    promptKn: 'ಯಾವ ಭಿನ್ನರಾಶಿ ದೊಡ್ಡದು: 2/3 ಅಥವಾ 3/8?',
    visualSpec: {
      type: 'none',
    },
    options: [
      { id: 'dq-10-a', labelEn: '2/3 is larger', labelKn: '2/3 ದೊಡ್ಡದು', isCorrect: true },
      {
        id: 'dq-10-b',
        labelEn: '3/8 is larger',
        labelKn: '3/8 ದೊಡ್ಡದು',
        isCorrect: false,
        misconceptionId: 'compare_only_numerators',
      },
      { id: 'dq-10-c', labelEn: 'Both are equal', labelKn: 'ಎರಡೂ ಸಮಾನ', isCorrect: false },
      { id: 'dq-10-d', labelEn: '1/5 is larger', labelKn: '1/5 ದೊಡ್ಡದು', isCorrect: false },
    ],
    explanationEn:
      '2/3 is more than 1/2 (4/6 > 3/6), whereas 3/8 is less than 1/2 (3/8 < 4/8). Comparing only numerators (3 vs 2) misleads because eighths are much smaller than thirds.',
    explanationKn:
      '2/3 ಅರ್ಧಕ್ಕಿಂತ (1/2) ದೊಡ್ಡದಾಗಿದೆ, ಆದರೆ 3/8 ಅರ್ಧಕ್ಕಿಂತ ಚಿಕ್ಕದಾಗಿದೆ (4/8 ಕ್ಕಿಂತ ಕಡಿಮೆ). ಕೇವಲ ಅಂಶಗಳನ್ನು (3 vs 2) ಹೋಲಿಸಿದರೆ ತಪ್ಪಾಗುತ್ತದೆ.',
  },
];
