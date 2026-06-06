# MoveMend Recovery Guide - Next.js Implementation

This Next.js application implements the two supplied reference designs:

- `movemend_patient_landing_page` at `/`
- `movemend_nhs_digital_standard_dashboard` at `/dashboard`

The UI follows NHS and GOV.UK/GDS interaction principles:

- NHS blue, NHS yellow focus state, GOV.UK black text and grey surfaces.
- Semantic landmarks: `header`, `main`, `footer`, `nav`, `section`, `aside`.
- Skip link for keyboard users.
- Visible focus states using the GOV.UK yellow focus pattern.
- Accessible form labels, warning callout role, and clear service phase banner.
- Responsive layout that preserves the supplied desktop designs and stacks cleanly on smaller screens.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

## Build

```bash
npm run build
npm run start
```
