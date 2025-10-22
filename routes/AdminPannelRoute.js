export const ADMIN_DASHBOARD="/admin/dashboard"

// # Media Routes
export const ADMIN_MEDIA_SHOW="/admin/media"
export const ADMIN_MEDIA_EDIT=(id)=> id ? `/admin/media/edit/${id}`:""

// # Category Routes
export const ADMIN_CATEGORY_ADD="/admin/category/add"
export const ADMIN_CATEGORY_SHOW="/admin/category"
export const ADMIN_CATEGORY_EDIT=(id)=> id ? `/admin/category/edit/${id}`:""

//trash route
export const ADMIN_TRASH="/admin/trash"


// # Product Routes
export const ADMIN_PRODUCT_ADD="/admin/product/add"
export const ADMIN_PRODUCT_SHOW="/admin/product"
export const ADMIN_PRODUCT_EDIT=(id)=> id ? `/admin/product/edit/${id}`:""


// # Product Veriant Routes
export const ADMIN_PRODUCT_VARIANT_ADD="/admin/product-variant/add"
export const ADMIN_PRODUCT_VARIANT_SHOW="/admin/product-variant"
export const ADMIN_PRODUCT_VARIANT_EDIT=(id)=> id ? `/admin/product-variant/edit/${id}`:""



// # Coupon  Routes
export const ADMIN_COUPON_ADD="/admin/coupon/add"
export const ADMIN_COUPON_SHOW="/admin/coupon"
export const ADMIN_COUPON_EDIT=(id)=> id ? `/admin/coupon/edit/${id}`:""


// # order routes
export const ADMIN_ORDER_SHOW="/admin/orders"
export const ADMIN_ORDER_DETAILS=(orderId)=> orderId ? `/admin/orders/details/${orderId}`:""


// # Costomer  Routes
export const ADMIN_COSTOMERS_SHOW="/admin/costomers"


// # Review  Routes
export const ADMIN_REVIEW_SHOW="/admin/review"