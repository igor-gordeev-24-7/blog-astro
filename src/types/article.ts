export interface Article {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    title: string;
    description: string;
    date: Date;
    category: string;
    image?: string;
    author?: string;
    tags?: string[];
    readingTime?: number;
  };
  render: () => Promise<{
    Content: any;
    headings: any[];
    remarkPluginFrontmatter: Record<string, any>;
  }>;
}

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  author?: string;
  tags?: string[];
}