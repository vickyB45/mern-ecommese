import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"

export const DT_CATEGORY_COLUMN = [
    {
        accessorKey:'name',
        header:"Category name",
    },
    {
        accessorKey:'slug',
        header:"Slug",
    },
]
export const DT_PRODUCT_COLUMN = [
    {
        accessorKey:'name',
        header:"Product name",
    },
    {
        accessorKey:'slug',
        header:"Slug",
    },
    {
        accessorKey:'category',
        header:"Category",
    },
    {
        accessorKey:'mrp',
        header:"MRP",
    },
    {
        accessorKey:'sellingPrice',
        header:"Selling Price",
    },
    {
        accessorKey:'discountPercentage',
        header:"Discount Percentage",
    },
   
]
export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey:'product',
        header:"Product name",
    },
    {
        accessorKey:'color',
        header:"Color",
    },
    {
        accessorKey:'size',
        header:"Size",
    },
    {
        accessorKey:'sku',
        header:"SKU",
    },
    {
        accessorKey:'mrp',
        header:"MRP",
    },
    {
        accessorKey:'sellingPrice',
        header:"Selling Price",
    },
    {
        accessorKey:'discountPercentage',
        header:"Discount Percentage",
    },
   
]
export const DT_COUPON_COLUMN = [
    {
        accessorKey:'code',
        header:"Code",
    },
    {
        accessorKey:'discountPercentage',
        header:"Discount Percentage",
    },
    {
        accessorKey:'minShoppingAmmount',
        header:"Min Shopping Amount",
    },
    {
        accessorKey:'validity',
        header:"Validity",
      Cell: ({ renderedCellValue }) => {
    const date = new Date(renderedCellValue);
    if (isNaN(date.getTime())) {
        return <Chip label={"Invalid date"} />;
    }

    // Stable YYYY-MM-DD format (UTC) to avoid locale differences during SSR
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    const formattedDate = `${y}-${m}-${d}`;

    return new Date() > date ? (
        <Chip color="error" label={formattedDate} />
    ) : (
        <Chip color="success" label={formattedDate} />
    );
}

    },
   
]
export const DT_COSTOMERS_COLUMN = [
    {
        accessorKey:'avatar',
        header:"Avatar",
        Cell:({renderCellValue}) =>(
            <Avatar>
                <AvatarImage src={renderCellValue?.url || "/assets/images/user.png"}/>
            </Avatar>
        )
    },
    {
        accessorKey:'name',
        header:"Name",
    },
    {
        accessorKey:'email',
        header:"Email",
    },
    {
        accessorKey:'phone',
        header:"Phone",
    },
    {
        accessorKey:'address',
        header:"Address",
    },
    {
        accessorKey:'isEmailVerified',
        header:"Is Verified",
          Cell:({renderCellValue}) =>(
            !renderCellValue ? <Chip color="success" label="Verified"/>:<Chip color="error" label="Not Verified"/>
        )
    },
]
export const DT_REVIEW_COLUMN = [
   {
        accessorKey:'product',
        header:"Product",
    },
   {
        accessorKey:'user',
        header:"User",
    },
   {
        accessorKey:'title',
        header:"Title",
    },
   {
        accessorKey:'rating',
        header:"Rating",
    },
   {
        accessorKey:'review',
        header:"Review",
    },
]
export const DT_ORDER_COLUMN = [
   {
        accessorKey:'orderId',
        header:"Order Id",
    },
   {
        accessorKey:'paymentId',
        header:"Payment Id",
    },
   {
        accessorKey:'name',
        header:"Name",
    },
   {
        accessorKey:'email',
        header:"Email",
    },
   {
        accessorKey:'phone',
        header:"Phone",
    },
   {
        accessorKey:'country',
        header:"Country",
    },
   {
        accessorKey:'state',
        header:"State",
    },
   {
        accessorKey:'city',
        header:"City",
    },
   {
        accessorKey:'pincode',
        header:"Pincode",
    },
   {
        accessorKey:'subTotal',
        header:"Subtotal",
    },
   {
        accessorKey:'discount',
        header:"Discount",
    },
   {
        accessorKey:'couponDiscount',
        header:"Coupon Discount",
    },
   {
        accessorKey:'status',
        header:"Status",
    },
]