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

  // Format to dd/mm/yy
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

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