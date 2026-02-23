# Backend Routes Required

## 1. POST /api/auth/signup

### Customer Request
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "customer",
  "address": {
    "address_line_1": "string",
    "address_line_2": "string",
    "city": "string",
    "province": "string",
    "postal_code": "string",
    "country": "Canada",
    "place_id": "string"
  }
}
```

### Business Request
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "business",
  "address": { /* same */ },
  "kitchen": {
    "name": "string",
    "description": "string",
    "cuisine_types": ["string"],
    "neighborhood": "string",
    "dietary_options": ["string"],
    "pickup_available": "boolean",
    "delivery_available": "boolean"
  }
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "string", "name": "string", "role": "string" },
    "session": { "access_token": "string", "refresh_token": "string" }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT | INVALID_ADDRESS | ADDRESS_REQUIRED",
    "message": "string"
  }
}
```

### Backend Tasks
1. Check email/phone exists → CONFLICT
2. Geocode place_id → lat/lng (Google Geocoding API)
3. Validate city (North York only?)
4. Create profile in `profiles` table
5. Create kitchen in `kitchens` table (if business)
6. Return session tokens

---

## 2. GET /api/categories

### Response
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "string", "slug": "string", "icon": "string", "image_url": "string" }
  ]
}
```

### Backend Tasks
1. Query `categories` table
2. Filter by `is_active = true`
3. Order by `display_order`

---

## 3. GET /api/kitchens

### Query Params
```
?radius=5&cuisine=Indian&min_price=10&max_price=30&sort=distance
```

### Response
```json
{
  "success": true,
  "data": {
    "kitchens": [
      {
        "id": "uuid",
        "name": "string",
        "slug": "string",
        "cuisine_types": ["string"],
        "rating": "number",
        "distance_km": "number",
        "cover_image_url": "string"
      }
    ]
  }
}
```

### Backend Tasks
1. If authenticated + no lat/lon → use profile address
2. Calculate distance using Haversine or PostGIS
3. Filter by radius, cuisine, price
4. Return ADDRESS_REQUIRED if no coords available

---

## Critical Rules

- **Geocoding:** Backend computes lat/lng, NOT frontend
- **Validation:** Check city = "North York" (or all GTA?)
- **Transactions:** Atomic profile + kitchen creation
- **Error format:** `{ success: false, error: { code, message } }`
