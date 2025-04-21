# Nestro Health Calculator Formulas

This document contains all the mathematical formulas used in the various health calculators in the Nestro Health application.

## BMI Calculator

### Basic BMI Formula
```
BMI = weight(kg) / height(m)²
```
or for imperial units:
```
BMI = (weight(lbs) × 703) / height(inches)²
```

**Variables:**
- BMI = Body Mass Index
- weight = Weight in kilograms or pounds
- height = Height in meters or inches

**Classification:**
- Underweight: BMI < 18.5
- Normal weight: BMI 18.5-24.9
- Overweight: BMI 25-29.9
- Obesity Class I: BMI 30-34.9
- Obesity Class II: BMI 35-39.9
- Obesity Class III: BMI ≥ 40

**Notes:** 
- For elderly (65+), the normal range is sometimes adjusted to 22-27
- For children and teens, BMI is interpreted according to age and sex-specific percentile charts

## Calorie Calculator

### Basal Metabolic Rate (BMR)

#### Mifflin-St Jeor Equation (most accurate)
For men:
```
BMR = (10 × weight(kg)) + (6.25 × height(cm)) - (5 × age) + 5
```

For women:
```
BMR = (10 × weight(kg)) + (6.25 × height(cm)) - (5 × age) - 161
```

#### Harris-Benedict Equation (revised 1984)
For men:
```
BMR = 88.362 + (13.397 × weight(kg)) + (4.799 × height(cm)) - (5.677 × age)
```

For women:
```
BMR = 447.593 + (9.247 × weight(kg)) + (3.098 × height(cm)) - (4.330 × age)
```

### Total Daily Energy Expenditure (TDEE)
```
TDEE = BMR × Activity Multiplier
```

**Activity Multipliers:**
- Sedentary (little or no exercise): 1.2
- Lightly active (light exercise/sports 1-3 days/week): 1.375
- Moderately active (moderate exercise/sports 3-5 days/week): 1.55
- Very active (hard exercise/sports 6-7 days/week): 1.725
- Extra active (very hard exercise, physical job, or training twice a day): 1.9

### Goal-Based Adjustments
- Weight loss: TDEE - 500 to 1000 calories
- Weight maintenance: TDEE
- Weight gain: TDEE + 500 calories

**Variables:**
- BMR = Basal Metabolic Rate (calories/day)
- TDEE = Total Daily Energy Expenditure (calories/day)
- weight = Weight in kilograms
- height = Height in centimeters
- age = Age in years

## Ideal Weight Calculator

### Devine Formula (1974)
For men:
```
Ideal weight(kg) = 50 + 2.3 × (height(inches) - 60)
```

For women:
```
Ideal weight(kg) = 45.5 + 2.3 × (height(inches) - 60)
```

### Hamwi Formula (1964)
For men:
```
Ideal weight(kg) = 48 + 2.7 × (height(inches) - 60)
```

For women:
```
Ideal weight(kg) = 45.5 + 2.2 × (height(inches) - 60)
```

### Robinson Formula (1983)
For men:
```
Ideal weight(kg) = 52 + 1.9 × (height(inches) - 60)
```

For women:
```
Ideal weight(kg) = 49 + 1.7 × (height(inches) - 60)
```

### Miller Formula (1983)
For men:
```
Ideal weight(kg) = 56.2 + 1.41 × (height(inches) - 60)
```

For women:
```
Ideal weight(kg) = 53.1 + 1.36 × (height(inches) - 60)
```

### Body Mass Index Method
```
Ideal weight(kg) = 22 × height(m)²
```

**Variables:**
- height = Height in inches or meters
- All formulas calculate ideal weight in kilograms

## Body Fat Calculator

### U.S. Navy Method

For men:
```
Body Fat % = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
```

For women:
```
Body Fat % = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
```

**Variables:**
- waist, neck, hip = Circumference measurements in centimeters
- height = Height in centimeters
- log10 = Base-10 logarithm

### Jackson-Pollock 3-Site Method
For men (chest, abdomen, thigh):
```
Body density = 1.10938 - (0.0008267 × sum) + (0.0000016 × sum²) - (0.0002574 × age)
```

For women (triceps, suprailiac, thigh):
```
Body density = 1.0994921 - (0.0009929 × sum) + (0.0000023 × sum²) - (0.0001392 × age)
```

Then:
```
Body Fat % = (495 / Body density) - 450
```

**Variables:**
- sum = Sum of skinfold measurements in millimeters
- age = Age in years

## Blood Pressure Calculator

### Mean Arterial Pressure (MAP)
```
MAP = ((2 × Diastolic) + Systolic) / 3
```

**Variables:**
- MAP = Mean Arterial Pressure in mmHg
- Diastolic = Diastolic blood pressure in mmHg
- Systolic = Systolic blood pressure in mmHg

### Pulse Pressure
```
PP = Systolic - Diastolic
```

**Variables:**
- PP = Pulse Pressure in mmHg

## Water Intake Calculator

### Basic Water Needs (Weight-Based)
```
Water(oz) = weight(lbs) / 2
```
or
```
Water(ml) = weight(kg) × 35
```

### Activity Adjusted
```
Water Intake = Base Water Needs × Activity Factor
```

**Activity Factors:**
- Sedentary: 1.0
- Light activity: 1.1
- Moderate activity: 1.2
- High activity: 1.3-1.5

**Variables:**
- weight = Weight in pounds or kilograms

## Heart Rate Zone Calculator

### Maximum Heart Rate (MHR)

#### Tanaka Formula
```
MHR = 208 - (0.7 × Age)
```

#### Gulati Formula (for women)
```
MHR = 206 - (0.88 × Age)
```

#### Traditional Formula
```
MHR = 220 - Age
```

### Heart Rate Zones

#### Percentage of MHR Method
```
THR = MHR × Z%
```

#### Karvonen Method (Heart Rate Reserve)
```
THR = ((MHR - RHR) × Z%) + RHR
```

**Variables:**
- MHR = Maximum Heart Rate in beats per minute
- RHR = Resting Heart Rate in beats per minute
- THR = Target Heart Rate in beats per minute
- Z% = Zone percentage (e.g., 0.6 for 60%)
- Age = Age in years

**Typical Heart Rate Zones:**
- Zone 1 (Very Light): 50-60% of MHR
- Zone 2 (Light): 60-70% of MHR
- Zone 3 (Moderate): 70-80% of MHR
- Zone 4 (Hard): 80-90% of MHR
- Zone 5 (Maximum): 90-100% of MHR

## Macronutrient Calculator

### Macronutrient Distribution

First calculate TDEE as in the Calorie Calculator, then:

```
Protein(g) = (TDEE × protein percentage) / 4
Carbs(g) = (TDEE × carbs percentage) / 4
Fat(g) = (TDEE × fat percentage) / 9
```

**Common Macronutrient Ratios:**
- Weight loss: 40% protein, 30% carbs, 30% fat
- Maintenance: 30% protein, 40% carbs, 30% fat
- Muscle gain: 30% protein, 50% carbs, 20% fat

**Variables:**
- TDEE = Total Daily Energy Expenditure in calories
- 4 = Calories per gram of protein and carbs
- 9 = Calories per gram of fat

## Bone Mass Calculator

### Bone Mass Estimation

For men:
```
Bone Mass(kg) = 2.738 + (0.0731 × weight(kg))
```

For women:
```
Bone Mass(kg) = 2.295 + (0.0633 × weight(kg))
```

**Variables:**
- weight = Weight in kilograms

### Percentage of Body Weight
```
Bone Mass % = (Bone Mass(kg) / weight(kg)) × 100
```

**Notes:**
- Healthy bone mass typically constitutes about 3-5% of total body weight
- These are estimation formulas and may not be as accurate as DEXA scans

## References

- Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990.
- Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism. Proc Natl Acad Sci U S A. 1918.
- Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974.
- Hamwi GJ. Therapy: changing dietary concepts. Diabetes Mellitus: Diagnosis and Treatment. 1964.
- Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited. J Am Coll Cardiol. 2001.
- Jackson AS, Pollock ML. Generalized equations for predicting body density of men. Br J Nutr. 1978.
- Gulati M, Shaw LJ, Thisted RA, et al. Heart rate response to exercise stress testing in asymptomatic women. Circulation. 2010. 