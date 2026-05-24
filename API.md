# Fashion Store API Documentation

**Base URL (local):** `http://localhost:5000/api`  
**Base URL (production):** `https://YOUR-BACKEND-URL/api`

All protected routes require header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth

### Register
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `{ success, token, user }`

### Login
- **POST** `/auth/login`
- **Body:** `{ "email", "password" }`

### Current User
- **GET** `/auth/me` (protected)

---

## Products

### List Products
- **GET** `/products`
- **Query:** `?category=Footwear` (optional: Men, Women, Footwear, Accessories)

### Single Product
- **GET** `/products/:id`

### Create Product (Admin)
- **POST** `/products` (protected + admin)

### Update Product (Admin)
- **PUT** `/products/:id` (protected + admin)

### Delete Product (Admin)
- **DELETE** `/products/:id` (protected + admin)

### Low Stock (Admin)
- **GET** `/products/admin/low-stock` (protected + admin)

---

## Recommendations

### Personalized Recommendations
- **GET** `/recommendations` (protected)
- Uses user's viewed categories, tags, and purchase history

### Track Product View
- **PATCH** `/users/track-view` (protected)
- **Body:**
```json
{
  "category": "Footwear",
  "tags": ["sneakers", "casual"]
}
```

---

## Users / Profile

### Get Profile
- **GET** `/users/profile` (protected)

### Update Profile
- **PUT** `/users/profile` (protected)
- **Body:** `{ "name", "email" }`

### Add Address
- **POST** `/users/addresses` (protected)
- **Body:**
```json
{
  "label": "Home",
  "streetAddress": "123 Main St",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "postalCode": "600001",
  "country": "India"
}
```

### Delete Address
- **DELETE** `/users/addresses/:index` (protected, index = 0, 1, 2...)

---

## Orders

### Create Order (Mock Payment)
- **POST** `/orders` (protected)
- **Body:**
```json
{
  "items": [
    {
      "product": "PRODUCT_OBJECT_ID",
      "title": "Classic Sneakers",
      "quantity": 1,
      "size": "M",
      "color": "White",
      "price": 2499
    }
  ],
  "shippingAddress": {
    "streetAddress": "123 Main St",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postalCode": "600001"
  },
  "couponCode": "FASHION10"
}
```

### List My Orders
- **GET** `/orders` (protected)

### Get Order
- **GET** `/orders/:id` (protected)

### Download Invoice PDF
- **GET** `/orders/:id/invoice` (protected)
- Returns PDF file download

---

## Mail (Testing)

### Send Order Email Manually
- **POST** `/mail/send-order-email`
- **Body:** `{ "email", "orderDetails" }`

---

## Coupon Codes
| Code | Discount |
|------|----------|
| FASHION10 | 10% |
| WELCOME20 | 20% |

---

## Demo Accounts (after seed)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fashion.com | admin123 |
| Customer | customer@fashion.com | customer123 |

---

## Postman Import Tip
Create a Postman environment variable `baseUrl` = your API URL and `token` = JWT from login response.
