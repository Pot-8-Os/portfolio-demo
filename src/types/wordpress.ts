/**
 * WordPress/CMS Types
 * Type definitions for data fetched from WordPress GraphQL API
 */

/**
 * Node with name and slug - used for taxonomies (creators, formats, tools)
 */
export interface TaxonomyNode {
    name: string;
    slug: string;
    description?: string;
    count?: number;
    works?: {
        nodes: Work[];
    };
}

/**
 * Featured image structure from WordPress
 */
export interface FeaturedImage {
    node: {
        sourceUrl: string;
        altText: string;
    };
}

/**
 * Custom fields from SUAC (Site7 User-Assigned Content) plugin
 */
export interface SuacFields {
    productiondate: string;
    duration: string;
    client: string;
    concept: string;
    url?: string;
    gallery?: string;
}

/**
 * Work (portfolio item) from WordPress
 */
export interface Work {
    id: string;
    title: string;
    slug: string;
    date: string;
    featuredImage?: FeaturedImage;
    suac?: SuacFields;
    exhibitions?: {
        nodes: TaxonomyNode[];
    };
    creators?: {
        nodes: TaxonomyNode[];
    };
    formats?: {
        nodes: TaxonomyNode[];
    };
    tools?: {
        nodes: TaxonomyNode[];
    };
    restrictions?: {
        nodes: TaxonomyNode[];
    };
    content?: string;
}
