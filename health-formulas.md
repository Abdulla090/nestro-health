# Health Formulas and Equations Used in Nestro Health App

This document provides a comprehensive overview of all health and fitness formulas used throughout the Nestro Health application.

## Body Mass Index (BMI)

BMI is a measure of body fat based on height and weight that applies to adult men and women.

### Formula:
```
BMI = weight(kg) / (height(m))²
```

### Categories:
- Underweight: BMI < 18.5
- Normal weight: 18.5 ≤ BMI < 25
- Overweight: 25 ≤ BMI < 30
- Obesity: BMI ≥ 30

## Body Fat Percentage

### Navy Method Formula:
For men:
```
Body Fat % = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
```

For women:
```
Body Fat % = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
```

Where:
- waist, neck, hip and height measurements are in centimeters

### Categories:
- Essential fat (men): 2-5%
- Essential fat (women): 10-13%
- Athletes (men): 6-13%
- Athletes (women): 14-20%
- Fitness (men): 14-17%
- Fitness (women): 21-24%
- Average (men): 18-24%
- Average (women): 25-31%
- Obese (men): 25%+
- Obese (women): 32%+

## Basal Metabolic Rate (BMR)

### Mifflin-St Jeor Formula:
For men:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

For women:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

## Daily Calorie Needs

Calorie needs are calculated by multiplying BMR by an activity factor:

```
Daily Calories = BMR × Activity Factor
```

### Activity Factors:
- Sedentary (little or no exercise): 1.2
- Lightly active (light exercise/sports 1-3 days/week): 1.375
- Moderately active (moderate exercise/sports 3-5 days/week): 1.55
- Very active (hard exercise/sports 6-7 days/week): 1.725
- Extra active (very hard exercise, physical job, training twice a day): 1.9

## Water Intake Calculation

### Basic Formula:
```
Daily Water Needs (ml) = Weight (kg) × 30
```

### Adjusted for Activity Level:
```
Daily Water Needs (ml) = Weight (kg) × 30 × Activity Factor
```

Activity factors:
- Sedentary: 1.0
- Light activity: 1.1
- Moderate activity: 1.2
- High activity: 1.3

### Adjusted for Climate:
Hot or humid climate adds 500-1000ml to the daily requirement.

## Ideal Weight Calculation

### Devine Formula:
For men:
```
Ideal Weight (kg) = 50 + 2.3 × (Height(in) - 60)
```

For women:
```
Ideal Weight (kg) = 45.5 + 2.3 × (Height(in) - 60)
```

### BMI-based Method:
```
Ideal Weight (kg) = 22 × Height(m)²
```
Where 22 is the middle of the healthy BMI range.

## Blood Pressure Classification

| Category | Systolic (mmHg) | Diastolic (mmHg) |
|----------|----------------|-----------------|
| Normal | < 120 | and < 80 |
| Elevated | 120-129 | and < 80 |
| Stage 1 Hypertension | 130-139 | or 80-89 |
| Stage 2 Hypertension | ≥ 140 | or ≥ 90 |
| Hypertensive Crisis | > 180 | and/or > 120 |

## Blood Volume Calculation

### Nadler's Equation:
For males:
```
Blood Volume (L) = 0.3669 × Height(m)³ + 0.03219 × Weight(kg) + 0.6041
```

For females:
```
Blood Volume (L) = 0.3561 × Height(m)³ + 0.03308 × Weight(kg) + 0.1833
```

## Heart Rate Zones

Maximum Heart Rate (MHR):
```
MHR = 220 - Age
```

Heart Rate Zones:
1. Zone 1 (50-60% of MHR): Recovery
2. Zone 2 (60-70% of MHR): Endurance
3. Zone 3 (70-80% of MHR): Aerobic
4. Zone 4 (80-90% of MHR): Anaerobic
5. Zone 5 (90-100% of MHR): Maximum

## References

1. National Institutes of Health (NIH)
2. American Council on Exercise (ACE)
3. World Health Organization (WHO)
4. American Heart Association (AHA)
5. Journal of the International Society of Sports Nutrition
6. U.S. Navy Body Composition Assessment Program 