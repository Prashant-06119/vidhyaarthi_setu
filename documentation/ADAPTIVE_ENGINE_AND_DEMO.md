# Adaptive Engine Rules, 3-Minute Demo Script & QA Documentation

## 1. Deterministic Adaptive Engine Rules (`src/engine/`)

| Parameter / Rule | Threshold / Behavior | Source Module |
| :--- | :--- | :--- |
| `MIN_DISTINCT_QUESTIONS_FOR_MISCONCEPTION` | `2` distinct questions | `src/engine/thresholds.ts` |
| `WEAK_ACCURACY_UPPER_BOUND` | `< 50%` → `weak` | `src/engine/masteryCalculator.ts` |
| `DEVELOPING_ACCURACY_UPPER_BOUND` | `50%–79%` → `developing`, `≥ 80%` → `strong` | `src/engine/masteryCalculator.ts` |
| `REASSESSMENT_WEIGHT` | `0.8` (80% reassessment + 20% baseline when `≥ 2` reassessment questions completed) | `src/engine/masteryCalculator.ts` |
| `REASSESSMENT_PASS_ACCURACY` | `≥ 66%` on `≥ 2` post-error reassessment questions resolves a confirmed misconception | `src/engine/misconceptionDetector.ts` |

### Priority Order in `recommendationEngine.ts`
1. **Diagnostic Check**: `< 4` diagnostic attempts → Recommend Diagnostic Assessment.
2. **Confirmed Misconception**: Unresolved misconception across `≥ 2` distinct questions → Assign matched visual remediation lesson + targeted exercises.
3. **Weak Concept (`< 50%`)**: Assign simpler visual explanation + foundational practice.
4. **Developing Concept (`50%–79%`)**: Assign guided practice exercises.
5. **Strong Mastery (`≥ 80%`)**: Unlock challenge problems.

---

## 2. Step-by-Step 3-Minute Hackathon Demo Script

1. **Welcome & Student A**: Open Vidyaarthi Setu and click **Start Demo** (or select **Ananya R.**).
2. **Diagnostic Assessment**: Open **Diagnostic**, complete the 10 questions (or use **Demo Quick-Fill: Equivalent Fractions Gap** to simulate repeated `add_numerator_denominator_same` errors on `dq-5`, `dq-6`, `dq-7`).
3. **Misconception Diagnosis**: Observe that equivalent fractions is flagged (`≥ 2` distinct questions) and the rule trace recommends **Visual Equivalent Fractions**.
4. **Personalized Remediation & Reassessment**: Open **Adaptive Lab**, explore the `×2 / ×3` bar splitting + `"+Same Number" Trap`, complete targeted practice, and pass the 3-question **Reassessment** — mastery updates live!
5. **Switch to Student B**: In the top utility bar, click **Karthik M.**. Notice independent progress and a completely different adaptive path (**Comparing Fractions** visual strips & `1/2` benchmark).
6. **Offline Persistence**: Click **Simulate Offline**, complete a practice exercise, and **refresh the browser**. Progress and `PENDING SYNC` events remain intact in IndexedDB.
7. **Teacher Intelligence**: Open **Teacher View** to inspect the concept mastery chart, student-wise progress, and **Common Learning Gaps**. Click **Mark Intervention Completed**.
8. **Synchronization**: Click **Restore Connectivity** and **Sync Now** (or open the Sync Queue Inspector) to process queued events without duplicates.
