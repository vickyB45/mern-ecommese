import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"


const BreadCrumb = ({ breadCrumbData }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadCrumbData.map((data, index) => {
          const isLast = index === breadCrumbData.length - 1
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{data.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={data.href || "#"}>{data.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumb