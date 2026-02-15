import { Work, TaxonomyNode } from "@/types";

// WordPress GraphQL エンドポイント（環境変数で上書き可能）
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://cms.proletari.art/graphql';

export type { Work, TaxonomyNode } from "@/types";

/** 全作品を取得（制限付きコンテンツはフィルタで除外） */
export async function getWorks(): Promise<Work[]> {
  const query = `
    query GetWorks {
      works(first: 100, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          suac {
            productiondate
            duration
            client
            concept
            url
            gallery
          }
          creators {
            nodes {
              name
              slug
            }
          }
          formats {
            nodes {
              name
              slug
            }
          }
          tools {
            nodes {
              name
              slug
            }
          }
          restrictions {
            nodes {
                slug
            }
          }
        }
      }
    }
  `;

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error('[WordPress] GraphQLエラー:', JSON.stringify(json.errors, null, 2));
  }

  let nodes: Work[] = json.data?.works?.nodes || [];

  // 制限タクソノミーが付与された作品を公開一覧から除外
  nodes = nodes.filter(work => {
    const hasRestrictions = work.restrictions?.nodes && work.restrictions.nodes.length > 0;
    return !hasRestrictions;
  });



  return nodes;
}

/** 展覧会一覧を取得 */
export async function getExhibitions(): Promise<TaxonomyNode[]> {
  const query = `
    query GetExhibitions {
      exhibitions(first: 100) {
        nodes {
          name
          slug
          description
          count
          works(first: 1, where: { status: PUBLISH }) {
            nodes {
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const nodes = json.data?.exhibitions?.nodes || [];

  return nodes;
}

/** 特定の展覧会に紐づく作品一覧を取得 */
export async function getWorksByExhibition(slug: string): Promise<{ exhibition: TaxonomyNode | null; works: Work[] }> {
  const query = `
      query GetExhibitionWorks($slug: ID!) {
        exhibition(id: $slug, idType: SLUG) {
          name
          slug
          description
          count
          works(first: 100, where: { status: PUBLISH }) {
            nodes {
              id
              title
              slug
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              suac {
                productiondate
                duration
                client
                concept
                url
                gallery
              }
              creators {
                nodes {
                  name
                  slug
                }
              }
              formats {
                nodes {
                  name
                  slug
                }
              }
              tools {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    `;

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const exhibition = json.data?.exhibition || null;
  const works = exhibition?.works?.nodes || [];

  return { exhibition, works };
}

/** スラッグ指定で作品の詳細を取得 */
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const query = `
    query GetWork($slug: ID!) {
      work(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        suac {
          productiondate
          duration
          client
          concept
          url
          gallery
        }
        creators {
          nodes {
            name
            slug
          }
        }
        formats {
          nodes {
            name
            slug
          }
        }
        tools {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json.data?.work || null;
}
