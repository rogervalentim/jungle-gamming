import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import type { CustomBreadcrumbProps } from '#/types'
import { Link } from '@tanstack/react-router'
import React from 'react'

export function BreadcrumbComponent({ items }: CustomBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-bold text-base leading-4 text-[#F5F1EB]">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link to={item.href}>{item.label}</Link>}
                    className="font-bold text-base leading-4 text-[#F5F1EB]"
                  />
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator className="font-bold text-base leading-4 text-[#F5F1EB]">
                  /
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
