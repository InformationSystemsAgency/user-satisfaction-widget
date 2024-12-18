# User Satisfaction Score Widget Integration Guide

## Overview

The User Satisfaction Score Widget is a standardized component for measuring user satisfaction across public services in Armenia. It is designed to help service teams implement measure 2 from the "4 foundation measures" for user satisfaction - as shown in [Armenia's digital service design principles](https://standards.hightech.gov.am/որակի-գնահատման-ցուցանիշներ/).

Separate packages will be released for measure 3, and 4.

The system implements a 5-point rating system, (Based on CSAT / NPS) that helps service providers gather objective feedback and improve their public services. The system can be integrated with multiple channels (for example online digital services, app channels, or by feedback after entering physical locations.

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

There are two implementation types depending on your needs:

- **Henaket Integration**: Use this version if your service is being built with [Henaket design system](https://www.figma.com/community/file/1257654638425705295), the visual design is optimised for compatibility
- **Standard Integration**: Use this version if you are integrating into an existing (legacy) service that is not using Henaket

### Step 2: Prepare Your Parameters

Collect the following required information:

1. Your service ID by contacting ISAA via service.admin@isaa.am
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
    width: 320px;
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

- Width: Fixed 320px
- Height: Fixed 126px
- The widget should be responsive within these constraints

## Implementation Examples

### Henaket Integration

```html
<!-- Note: The height will automatically adjust based on the iframe's width to achieve this you can use CSS media queries-->
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
    width: 320px;
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

1. If the iframe's width is more than 768px → height becomes 80px
2. If the iframe's width is 768px or less → height becomes 126px

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

   - For non-Henaket: Ensure container width is 320px
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
