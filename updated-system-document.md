# Fabella Coffee System — Updated System Documentation

This document reflects the current implementation of the Fabella Coffee system as found in the project codebase.

## 1. System Overview

Fabella Coffee is a multi-role food and beverage ordering system built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. It functions as a working storefront, staff operations dashboard, and admin control system rather than a static UI mockup.

The system supports:

- Customer-facing menu browsing and ordering
- Staff queue management and order status updates
- Admin product, pricing, and store configuration
- Authentication using Google, GitHub, and anonymous access
- Payment handling for cash and GCash transactions

## 2. Core User Roles

### Customer

Customers can:

- Browse products by category such as coffee, food, pastries, and beverages
- Search for specific menu items
- Add products to a cart
- Choose an order type such as dine-in, takeout, delivery, or pickup
- Checkout using cash or GCash
- View their order history
- Access FAQs and legal information

### Staff

Staff users can:

- View incoming orders in a live queue
- Change order status from pending to preparing, ready, completed, or cancelled
- Review order items, pricing, delivery fee, and payment method
- Confirm or manage GCash payment flow from the staff interface
- Access staff guidance and privacy-related documentation

### Admin

Admins can:

- Manage menu products and product availability
- Create, update, or remove menu items
- Upload product images and manage visual assets
- Set featured and promo items
- Configure store settings such as business hours, contact details, announcement banner, delivery fee, and GCash payment details
- Manage hero slides displayed on the storefront
- Review orders, transactions, and sales-related summaries
- Manage user roles for staff and admin access

## 3. Main Functional Modules

### Customer Interface

The customer experience includes:

- A hero section and promotional banner
- Menu categories for coffee, food, pastries, and beverages
- A cart drawer and checkout flow
- Search and order history features
- Legal and FAQ support sections

### Checkout and Order Management

The checkout flow supports:

- Review of selected items before submission
- Delivery and pickup method selection
- Collection of customer details where required
- Payment selection for cash or GCash
- Delivery fee calculation for delivery orders
- Order submission and history tracking

### Staff Dashboard

The staff dashboard is designed for live queue handling:

- Orders are grouped and displayed by status
- Staff can move orders through preparation and completion stages
- GCash payment confirmation is handled within the workflow
- Staff can cancel or complete orders as needed

### Admin Dashboard

The admin dashboard acts as the control center for operations:

- Product management
- Order and revenue overview
- Store configuration management
- User access and role control
- Documentation and compliance panels

## 4. Data and Storage

The application uses Supabase for:

- Authentication and role-based access
- Product and store settings persistence
- Order data storage and retrieval
- User profile and role management

## 5. Important Notes on Accuracy

The following points are reflected accurately in the current implementation:

- The system is not a simple static design; it is an operational food and beverage ordering platform.
- The app supports real customer checkout, staff operations, and admin control.
- GCash and cash payments are part of the checkout and order workflow.
- Delivery fee, business hours, and GCash details are configurable through the admin panel.
- Roles are handled through authentication and Supabase profile management.

## 6. Summary

Fabella Coffee is a comprehensive coffee shop management and ordering system with a customer-facing storefront, a staff operations dashboard, and an admin control panel. It should be documented as a functional system with real transaction workflows rather than as a simple UI mockup or design bundle.
