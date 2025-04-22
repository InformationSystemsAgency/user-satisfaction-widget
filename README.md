# User Satisfaction Score Widget Integration Guide

**Integration Guide** \
April 2025 v2.0

## Table of Contents

1. [Overview](#overview)
   - [Rating Scale Definition](#rating-scale-definition)
   - [Satisfaction Calculation](#satisfaction-calculation)
2. [Step-by-Step Integration Guide](#step-by-step-integration-guide)
   - [Step 1: Choose Your Implementation Type](#step-1-choose-your-implementation-type)
   - [Step 2: Prepare Your Parameters](#step-2-prepare-your-parameters)
   - [Step 3: Implementation](#step-3-implementation)
     - [Option A: Henaket Integration](#option-a-henaket-integration)
     - [Option B: Standard Integration (Non-Henaket)](#option-b-standard-integration-non-henaket)
   - [Step 4: Add URL Parameters](#step-4-add-url-parameters)
   - [Step 5: Place the Widget](#step-5-place-the-widget)
   - [Step 6: Collect Transaction ID for Customer Contact or Linking Multiple Service Sessions](#step-6-collect-transaction-id-for-customer-contact-or-linking-multiple-service-sessions)
3. [Size Requirements](#size-requirements)
   - [Henaket Integration](#henaket-integration)
   - [Standard Integration](#standard-integration)
4. [Implementation Examples](#implementation-examples)
   - [Henaket Integration](#henaket-integration-1)
   - [Standard Integration (Non-Henaket)](#standard-integration-non-henaket-1)
5. [Responsive Behavior](#responsive-behavior)
   - [Understanding Width-Based Height Adjustment (Henaket Only)](#understanding-width-based-height-adjustment-henaket-only)
6. [Visual Examples](#visual-examples)
   - [Henaket Integration](#henaket-integration-2)
   - [Standard Integration (Non-Henaket)](#standard-integration-non-henaket-2)
7. [Troubleshooting](#troubleshooting)
   - [Common Issues and Solutions](#common-issues-and-solutions)
8. [Support](#support)

## Overview

The User Satisfaction Score Widget is a standardized component for measuring user satisfaction across public services in Armenia. It is designed to help service teams implement Measure 2 from the "4 Foundation Measures" for user satisfaction — as detailed in [Armenia's digital service design principles](https://standards.hightech.gov.am/որակի-գնահատման-ցուցանիշներ/).

Separate packages will be released for Measures 3 and 4.

The widget uses a 5-point rating system (based on CSAT/NPS) to help service providers gather objective feedback and improve their public services. It can be integrated into multiple channels, including online digital services, app-based channels, or physical feedback locations.

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

Select an implementation type based on your needs:

- **Henaket Integration**: Use this version if your service is built using the [Henaket design system](https://www.figma.com/community/file/1257654638425705295), optimized for visual compatibility.
- **Standard Integration**: Use this version if integrating into existing (legacy) services not built with Henaket.

### Step 2: Prepare Your Parameters

Collect the following required information:

1. Your service ID (contact ISAA at service.admin@isaa.am)
2. Channel type (optional, defaults to "online")
3. Institution ID (optional)

ISAA provides this information during integration.

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

Include necessary parameters:

```curl
https://nps.services.catalog.isaa.cloud?serviceId=YOUR_SERVICE_ID&channel=CHANNEL&institutionId=INSTITUTION_ID&transactionId=TRANSACTION_ID
```

Required parameters:

| Parameter     | Required | Description                                                   | Values                                                             |
| ------------- | -------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| serviceId     | Yes      | Unique identifier from national service catalog               | `UUID` (e.g., `d6d9b838-cf95-4312-91fd-3655c2f6ac12`)              |
| channel\*     | No       | Service provision channel (defaults to "online")              | `yesem`, `online`, `app`, `email`, `offline_book_visit`, `offline` |
| transactionId | No       | Service transaction ID for linking multiple service sessions. | `string` \| `number`                                               |
| institutionId | No       | Institution's unique identifier from national service catalog | `UUID` (e.g., `d6d9b838-cf95-4312-91fd-3655c2f6ac12`)              |

#### \*Service provision channels

| Channel              | Description                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yesem`              | This is for a web-based service that uses YesEm login.                                                                                                            |
| `online`             | This is for a web-based legacy service that uses an alternative login (e.g., username and password).                                                              |
| **Note**             | If your service offers both YesEm and an alternative login method, use YesEm as the default.                                                                      |
| `app`                | This is for a service provided by a mobile app.                                                                                                                   |
| `email`              | This is for a service applied for by email (for example, by attaching an application form). The link to the NPS survey can be included in the confirmation reply. |
| `offline_book_visit` | This is for a service applied for in person where the user books an appointment (for example, renewing a passport).                                               |
| `offline`            | This is for a service provided entirely in person with no appointment booking (for example, when a user walks in without an appointment).                         |

### Step 5: Place the Widget

Follow placement guidelines:

1. Position on service confirmation page
2. Ensure visibility without scrolling
3. Test on mobile and desktopm ,
4. Avoid interference with page elements

### Step 6: Collect Transaction ID for Customer Contact or Linking Multiple Service Sessions

There may be instances where a user interacts with an online system multiple times, possibly on different days, but still within the context of the same service provision. Examples include applying for permits that may be approved or denied, or maintaining an internal case ID history to enable follow-up contact based on user feedback.

To maintain traceability across these interactions, you should use the `transactionId` parameter. Including this parameter allows the NPS widget to group multiple user sessions into a single transaction. The `transactionId` can be any unique identifier assigned to the user, such as a case number or internal case ID.

Place the widget at each significant touchpoint within the service journey. For example:

- A user submits an application for a building permit. At the conclusion of the application form, the NPS widget is displayed. The user provides a satisfaction rating of 5, and this rating, along with the transaction ID and other relevant parameters, is sent to the NPS system.

- If the user’s application experiences a delay, they might receive an email notification eight days later, prompting them to view the final decision online. The NPS widget is displayed again at the end of this subsequent interaction to reassess user satisfaction at the conclusion of the service provision. By using the same `transactionId`, the NPS system can track and present the progression of satisfaction scores associated with this transaction.

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

## Visual Examples

### Henaket Integration

<div style="width: 100%; display: flex; gap: 20px;">
    <img src="./media/henaket-child-birth.jpg" width="70%">
    <img src="./media/henaket-child-birth-mobile.jpg" width="20%">
</div>

### Standard Integration (Non-Henaket)

<div style="display: flex; gap: 20px;">
    <img src="./media/non-henaket-e-gov.jpg" width="49%">
    <img src="./media/non-henaket-e-request.jpg" width="49%">
</div>

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
