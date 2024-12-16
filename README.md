# User Satisfaction Score Widget Integration Guide

## Overview

The User Satisfaction Score Widget is a standardized component for measuring user satisfaction across digital services in Armenia. It implements a 5-point rating system that helps service providers gather objective feedback and improve their public services.

### Rating Scale Definition

| Rating | Meaning      | Category    |
| ------ | ------------ | ----------- |
| 5      | Excellent    | Satisfied   |
| 4      | Good         | Satisfied   |
| 3      | Satisfactory | Neutral     |
| 2      | Poor         | Unsatisfied |
| 1      | Very Poor    | Unsatisfied |

### Satisfaction Calculation

The user satisfaction percentage is calculated using the following formula:

```
Satisfaction % = (Number of 4 and 5 ratings / Total responses) × 100
```

## Step-by-Step Integration Guide

### Step 1: Choose Your Implementation Type

There are two implementation types depending on your design system:

- Henaket Integration
- Standard Integration

### Step 2: Prepare Your Parameters

Collect the following required information:

1. Your service ID from the national service catalog
2. Your channel type (optional, defaults to "online")
3. Your institution ID (optional)

The information is provided by ISAA when integrating.

### Step 3: Implementation

#### Option A: Henaket Integration

```html
<iframe
  src="https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID"
  title="Գնահատեք ծառայությունը"
  style="
    width: 100%;
    height: 126px;
    border: none;
    border-radius: 24px;
    box-shadow: 0 0 34px 0 rgba(0, 0, 0, 0.15);
  "
></iframe>
```

#### Option B: Standard Integration (Non-Henaket)

```html
<iframe
  src="https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID"
  title="Գնահատեք ծառայությունը"
  style="
    width: 100%;
    min-width: 350px;
    max-width: 700px;
    height: 126px;
    border: none;
    border-radius: 24px;
    box-shadow: 0 0 34px 0 rgba(0, 0, 0, 0.15);
  "
></iframe>
```

### Step 4: Add URL Parameters

Add the required parameters to your URL:

```
https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID&channel=CHANNEL&institutionId=INSTITUTION_ID
```

Required parameters:

| Parameter     | Required | Description                                                   | Example                                |
| ------------- | -------- | ------------------------------------------------------------- | -------------------------------------- |
| serviceId     | Yes      | Unique identifier from national service catalog               | `d6d9b838-cf95-4312-91fd-3655c2f6ac12` |
| channel       | No       | Service provision channel (defaults to "online")              | `online`, `yesem`, `etc.`              |
| institutionId | No       | Institution's unique identifier from national service catalog | `d6d9b838-cf95-4312-91fd-3655c2f6ac12` |

### Step 5: Place the Widget

Follow these placement guidelines:

1. Position the widget on the service confirmation page
2. Ensure the widget is fully visible without scrolling
3. Test visibility on both mobile and desktop views
4. Verify that the widget doesn't interfere with other page elements

## Size Requirements

### Henaket Integration

- Width: 100% of container
- Height: **Based on the iframe's own width** (not screen width):
  - When iframe width is > 768px: 80px height
  - When iframe width is ≤ 768px: 126px height

**Important Note**: The height adjustment is triggered by the width of the iframe itself, not the screen width. For example, if your iframe is in a narrow container that's 500px wide, the widget will use the 126px height even if the user's screen is 1920px wide.

### Standard Integration

- Width: Minimum 350px, Maximum 700px
- Height: Fixed 126px
- The widget should be responsive within these constraints

## Implementation Examples

### Henaket Integration

```html
<!-- Note: The height will automatically adjust based on the iframe's width -->
<!-- If this iframe is placed in a container that's 900px wide, it will be 80px tall -->
<!-- If this iframe is placed in a container that's 700px wide, it will be 126px tall -->
<iframe
  src="https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID"
  title="Գնահատեք ծառայությունը"
  style="
    width: 100%;
    height: 126px;
    border: none;
    border-radius: 24px;
    box-shadow: 0 0 34px 0 rgba(0, 0, 0, 0.15);
  "
></iframe>
```

### Standard Integration (Non-Henaket)

```html
<iframe
  src="https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID"
  title="Գնահատեք ծառայությունը"
  style="
    width: 100%;
    min-width: 350px;
    max-width: 700px;
    height: 126px;
    border: none;
    border-radius: 24px;
    box-shadow: 0 0 34px 0 rgba(0, 0, 0, 0.15);
  "
></iframe>
```

## Responsive Behavior

### Understanding Width-Based Height Adjustment (Henaket Only)

The widget's height is determined by its own width:

1. If the iframe's content area is wider than 768px → height becomes 80px
2. If the iframe's content area is 768px or narrower → height becomes 126px

For example:

- If you place the iframe in a 1000px wide container → 80px height
- If you place the iframe in a 600px wide container → 126px height
- If you place the iframe in a 50% width container on a 1920px screen:
  - If the container width calculates to 960px → 80px height
  - If the container width calculates to 700px → 126px height

## Troubleshooting

### Common Issues and Solutions

1. Widget Not Displaying

   - Check network connectivity
   - Ensure iframe dimensions meet minimum requirements

2. Sizing Issues

   - For non-Henaket: Ensure container width is between 350px and 700px
   - For Henaket: Verify responsive CSS is properly implemented
   - Check that no parent elements are constraining the iframe

3. Style Conflicts
   - Avoid applying additional styles to the iframe beyond those provided
   - Ensure parent container doesn't override iframe styles

## Support

For technical assistance or to report issues:

- Email: service.admin@isaa.am

---

**Note**: Always test the widget in a development environment before deploying to production.
