const rawModules = import.meta.glob('../../../docs/bao-cao-do-an/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function contentForFile(fileName: string): string {
  const path = Object.keys(rawModules).find((p) => p.endsWith(`/${fileName}`) || p.endsWith(fileName));
  return path ? rawModules[path] : `# Thiếu nội dung\n\nKhông đọc được file \`${fileName}\`.`;
}

export const ABOUT_SECTIONS = [
  { slug: 'readme', file: 'README.md', title: 'Hướng dẫn bộ báo cáo' },
  { slug: 'tom-tat', file: 'tom-tat-tieng-viet.md', title: 'Tóm tắt (tiếng Việt)' },
  { slug: 'abstract-en', file: 'abstract-keywords-en.md', title: 'Abstract & Keywords (EN)' },
  { slug: 'chuong-1', file: '01-chuong-1-tong-quan.md', title: 'Chương 1 — Tổng quan' },
  { slug: 'chuong-2', file: '02-chuong-2-co-so-ly-thuyet.md', title: 'Chương 2 — Cơ sở lý thuyết' },
  { slug: 'chuong-3', file: '03-chuong-3-phan-tich-thiet-ke.md', title: 'Chương 3 — Phân tích & thiết kế' },
  { slug: 'chuong-4', file: '04-chuong-4-trien-khai-thuc-nghiem.md', title: 'Chương 4 — Triển khai' },
  { slug: 'chuong-5', file: '05-chuong-5-ket-qua-danh-gia.md', title: 'Chương 5 — Kết quả & đánh giá' },
  { slug: 'chuong-6', file: '06-chuong-6-ket-luan-huong-phat-trien.md', title: 'Chương 6 — Kết luận' },
  { slug: 'tai-lieu', file: 'tai-lieu-tham-khao.md', title: 'Tài liệu tham khảo' },
  { slug: 'tu-viet-tat', file: 'tu-viet-tat.md', title: 'Từ viết tắt' },
  { slug: 'danh-muc', file: 'danh-muc-hinh-bang.md', title: 'Danh mục hình & bảng' },
  { slug: 'phu-luc', file: 'phu-luc.md', title: 'Phụ lục' },
] as const;

export type AboutSlug = (typeof ABOUT_SECTIONS)[number]['slug'];

export const DEFAULT_ABOUT_SLUG: AboutSlug = 'readme';

export function getSectionBySlug(slug: string | null): (typeof ABOUT_SECTIONS)[number] & { content: string } {
  const row = ABOUT_SECTIONS.find((s) => s.slug === slug) ?? ABOUT_SECTIONS[0];
  return { ...row, content: contentForFile(row.file) };
}

export function isValidAboutSlug(slug: string | null): slug is AboutSlug {
  return ABOUT_SECTIONS.some((s) => s.slug === slug);
}
