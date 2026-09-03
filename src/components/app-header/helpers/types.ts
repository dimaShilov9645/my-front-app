export interface CatalogItem {
  id: string
  label: string
}

export interface CatalogGroup {
  id: string
  title: string
  items: CatalogItem[]
}

export interface CatalogCategory {
  id: string
  title: string
  groups: CatalogGroup[]
}

export interface CatalogSelection {
  categoryId: string
  groupId: string
  itemId: string | null
  label: string
}

export type HeaderIconName = 'catalog' | 'close' | 'search' | 'heart' | 'profile' | 'chevron'
