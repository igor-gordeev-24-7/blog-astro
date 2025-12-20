export interface ArticleData {
  title: string;
  description: string;
  date: Date;
  category: string;
  image?: string;
  author?: string;
  tags?: string[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleData;
  Content: any;
  file: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const modules = import.meta.glob('/src/content/blog/*.md', { 
      eager: true 
    });
    
    const articles = Object.entries(modules).map(([path, module]: [string, any]) => {
      const filename = path.split('/').pop() || '';
      const slug = filename.replace('.md', '');
      
      if (!module.frontmatter) {
        console.warn(`No frontmatter found in ${filename}`);
        return null;
      }
      
      const frontmatter = {
        ...module.frontmatter,
        date: new Date(module.frontmatter.date || Date.now()),
      };
      
      return {
        slug,
        frontmatter,
        Content: module.default,
        file: path,
      };
    }).filter((article): article is Article => article !== null);
    
    return articles.sort((a, b) => 
      b.frontmatter.date.getTime() - a.frontmatter.date.getTime()
    );
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

// Вспомогательная функция для нормализации категорий
function normalizeCategory(category: string): string {
  if (!category) return '';
  
  // Приводим к нижнему регистру и удаляем лишние пробелы
  return category.toLowerCase().trim();
}

// Функция для преобразования категории в slug (URL-формат)
export function categoryToSlug(category: string): string {
  if (!category) return '';
  
  // Сопоставление русских названий с английскими слэгами
  const reverseCategoryMap: Record<string, string> = {
    'Политика': 'politics',
    'В мире': 'world',
    'Экономика': 'economics',
    'Общество': 'society',
    'Происшествия': 'incidents',
    'Культура': 'culture',
    'Туризм': 'tourism',
    'Наука': 'science',
    'Спорт': 'sports',
  };
  
  // Если категория есть в маппинге, возвращаем английский слэг
  if (reverseCategoryMap[category]) {
    return reverseCategoryMap[category];
  }
  
  // Иначе используем старую логику для обратной совместимости
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-яё0-9-]/g, '');
}

// Функция для преобразования slug обратно в читаемую категорию
export function slugToCategory(slug: string): string {
  if (!slug) return '';
  
  // Сопоставление английских слэгов с русскими названиями
  const categoryMap: Record<string, string> = {
    'politics': 'Политика',
    'world': 'В мире',
    'economics': 'Экономика',
    'society': 'Общество',
    'incidents': 'Происшествия',
    'culture': 'Культура',
    'tourism': 'Туризм',
    'science': 'Наука',
    'sports': 'Спорт',
  };
  
  // Если слэг есть в маппинге, возвращаем русское название
  if (categoryMap[slug]) {
    return categoryMap[slug];
  }
  
  // Иначе используем старую логику для обратной совместимости
  let category = slug.replace(/-/g, ' ');
  category = category.replace(/\b\w/g, char => char.toUpperCase());
  
  return category;
}

export async function getArticlesByCategorySimple(categorySlug: string): Promise<Article[]> {
  if (!categorySlug) return [];
  
  const articles = await getArticles();
  
  // Преобразуем slug категории в читаемый формат
  const targetCategory = slugToCategory(categorySlug);
  const normalizedTarget = normalizeCategory(targetCategory);
  
  console.log(`Looking for category: "${targetCategory}" (from slug: "${categorySlug}")`);
  
  return articles.filter(article => {
    const articleCategory = article.frontmatter.category || '';
    const normalizedArticle = normalizeCategory(articleCategory);
    
    console.log(`Comparing: "${articleCategory}" (normalized: "${normalizedArticle}") with "${targetCategory}" (normalized: "${normalizedTarget}")`);
    
    return normalizedArticle === normalizedTarget;
  });
}

export async function getLatestArticlesSimple(limit?: number): Promise<Article[]> {
  const articles = await getArticles();
  return limit ? articles.slice(0, limit) : articles;
}

export async function getAllCategoriesSimple(): Promise<string[]> {
  const articles = await getArticles();
  const categories = articles
    .map(article => article.frontmatter.category)
    .filter(Boolean);
  
  return [...new Set(categories)];
}

export async function getArticleBySlugSimple(slug: string): Promise<Article | null> {
  if (!slug) return null;
  
  const articles = await getArticles();
  return articles.find(article => article.slug === slug) || null;
}

export function getPredefinedCategories(): string[] {
  return [
    'Политика', 'В мире', 'Экономика', 'Общество', 'Происшествия',
    'Культура', 'Туризм', 'Наука', 'Спорт',
  ];
}

export function isPredefinedCategory(categorySlug: string): boolean {
  const predefined = getPredefinedCategories();
  return predefined.some(cat => categoryToSlug(cat) === categorySlug);
}