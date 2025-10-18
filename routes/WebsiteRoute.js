export const WEBSITE_HOME = '/'
export const WEBSITE_LOGIN = '/auth/login'
export const WEBSITE_REGISTER = '/auth/register'
export const WEBSITE_RESETPASSWORD = '/auth/reset-password'

//user route
export const USER_DASHBOARD = '/my-account'


export const WEBSITE_MEN_COLLECTION = '/men-collection'
export const WEBSITE_WOMEN_COLLECTION = '/women-collection'
export const WEBSITE_FOOTWARES = '/footware'
export const WEBSITE_ACCESSORIES = '/accessories'

export const WEBSITE_SHOP = '/shop'

export const WEBSITE_CART = '/cart'

export const WEBSITE_CHECKOUT = '/checkout'


export const WEBSITE_PRODUCT_DETAILS =(slug)=> slug ? `/product/${slug}` : `/product` 



