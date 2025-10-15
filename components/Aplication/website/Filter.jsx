"use client";
import useFetch from "@/hooks/useFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { WEBSITE_MEN_COLLECTION } from "@/routes/WebsiteRoute";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // States for filters
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 20000 });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  // Fetch data
  const { data: categoryData } = useFetch({ url: "/api/category/get-category" });
  const { data: colorData } = useFetch({ url: "/api/product/colors" });
  const { data: sizeData } = useFetch({ url: "/api/product/size" });

  // Initialize filter state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setSelectedCategory(params.get("category")?.split(",") || []);
    setSelectedColor(params.get("color")?.split(",") || []);
    setSelectedSize(params.get("size")?.split(",") || []);
    setPriceFilter({
      minPrice: parseInt(params.get("minPrice") || "0"),
      maxPrice: parseInt(params.get("maxPrice") || "20000")
    });
  }, [searchParams]);

  const updateURLParams = (key, values) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) params.set(key, values.join(","));
    else params.delete(key);
    router.push(`${WEBSITE_MEN_COLLECTION}?${params.toString()}`);
  };

  // Handlers for filters
  const handleCategoryFilter = (slug) => {
    const newSelected = selectedCategory.includes(slug)
      ? selectedCategory.filter((c) => c !== slug)
      : [...selectedCategory, slug];
    setSelectedCategory(newSelected);
    updateURLParams("category", newSelected);
  };

  const handleColorFilter = (color) => {
    const newSelected = selectedColor.includes(color)
      ? selectedColor.filter((c) => c !== color)
      : [...selectedColor, color];
    setSelectedColor(newSelected);
    updateURLParams("color", newSelected);
  };

  const handleSizeFilter = (size) => {
    const newSelected = selectedSize.includes(size)
      ? selectedSize.filter((s) => s !== size)
      : [...selectedSize, size];
    setSelectedSize(newSelected);
    updateURLParams("size", newSelected);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceFilter.minPrice);
    params.set("maxPrice", priceFilter.maxPrice);
    router.push(`${WEBSITE_MEN_COLLECTION}?${params.toString()}`);
  };

  const removeAllFilters = () => {
    setSelectedCategory([]);
    setSelectedColor([]);
    setSelectedSize([]);
    setPriceFilter({ minPrice: 0, maxPrice: 20000 });
    router.push(`${WEBSITE_MEN_COLLECTION}`);
  };

  // Show Remove All Filters only if any filter is applied
  const isAnyFilterApplied = 
    selectedCategory.length > 0 ||
    selectedColor.length > 0 ||
    selectedSize.length > 0 ||
    priceFilter.minPrice > 0 ||
    priceFilter.maxPrice < 20000;

  return (
    <div className="p-2">
      {isAnyFilterApplied && (
        <div className="mb-4 text-center">
          <button
            type="button"
            className=" px-5 py-2 bg-red-500 border border-gray-300 text-white w-full cursor-pointer font-medium hover:bg-red-600 transition"
            onClick={removeAllFilters}
          >
            Remove All Filters
          </button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={['1','2','3','4']}>
        {/* Categories */}
        <AccordionItem value="1">
          <AccordionTrigger className="uppercase text-[17px] hover:no-underline">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {categoryData?.success && categoryData.data.map((category) => (
                  <li key={category._id}>
                    <label className="flex capitalize mb-3 cursor-pointer select-none items-center space-x-3">
                      <Checkbox
                        checked={selectedCategory.includes(category.slug)}
                        onCheckedChange={() => handleCategoryFilter(category.slug)}
                      />
                      <span>{category.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="2">
          <AccordionTrigger className="uppercase text-[17px] hover:no-underline">Color</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {colorData?.success && colorData.data.map((color, index) => (
                  <li key={index}>
                    <label className="flex capitalize mb-3 cursor-pointer select-none items-center space-x-3">
                      <Checkbox
                        checked={selectedColor.includes(color)}
                        onCheckedChange={() => handleColorFilter(color)}
                      />
                      <span>{color}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="3">
          <AccordionTrigger className="uppercase text-[17px] hover:no-underline">Size</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {sizeData?.success && sizeData.data.map((size, index) => (
                  <li key={index}>
                    <label className="flex capitalize mb-3 cursor-pointer select-none items-center space-x-3">
                      <Checkbox
                        checked={selectedSize.includes(size)}
                        onCheckedChange={() => handleSizeFilter(size)}
                      />
                      <span>{size}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="4">
          <AccordionTrigger className="uppercase text-[17px] hover:no-underline">Price</AccordionTrigger>
          <AccordionContent>
            <Slider
              className="mt-3"
              defaultValue={[priceFilter.minPrice, priceFilter.maxPrice]}
              max={20000}
              step={1}
              onValueChange={(value) =>
                setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
              }
            />
            <div className="flex justify-between items-center pt-2">
              <span>
                {priceFilter.minPrice.toLocaleString("en-IN", { style: 'currency', currency: "INR" })}
              </span>
              <span>
                {priceFilter.maxPrice.toLocaleString("en-IN", { style: 'currency', currency: "INR" })}
              </span>
            </div>
            <div className="mt-2 text-center">
              <button
                type="button"
                className="rounded-full px-4 py-2 bg-primary text-white cursor-pointer"
                onClick={handlePriceFilter}
              >
                Filter Price
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
